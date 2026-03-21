import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email/providers'
import { getApprovalEmail } from '@/lib/email/templates/approval'

// Força Node.js runtime para usar Nodemailer (não funciona no Edge Runtime)
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ Sem token')
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const accessToken = authHeader.replace('Bearer ', '')

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken)

    if (userError || !user) {
      console.error('❌ Token inválido')
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const { data: admin } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!admin) {
      console.error('❌ Não é admin')
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    const { businessId } = await request.json()

    if (!businessId) {
      return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 })
    }

    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single()

    if (businessError || !business) {
      console.error('❌ Empresa não encontrada')
      return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 })
    }

    if (!business.responsible_email) {
      return NextResponse.json({ 
        error: 'Sem email do responsável' 
      }, { status: 400 })
    }

    // Gerar senha
    const tempPassword = generatePassword()

    // Buscar usuário existente
    const { data: listData } = await supabase.auth.admin.listUsers()
    let targetUser = listData?.users?.find(u => u.email === business.responsible_email)
    let isNewUser = false

    if (!targetUser) {
      // Criar NOVO usuário
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: business.responsible_email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          name: business.responsible_name || business.name,
          business_name: business.name,
          business_id: business.id
        }
      })

      if (createError) {
        // Se der erro de usuário duplicado, buscar o usuário existente
        if (createError.message?.includes('already') || createError.message?.includes('exists')) {
          const { data: retryList } = await supabase.auth.admin.listUsers()
          targetUser = retryList?.users?.find(u => u.email === business.responsible_email)

          if (!targetUser) {
            console.error('❌ Não conseguiu encontrar usuário existente')
            return NextResponse.json({ error: 'Erro ao buscar usuário existente' }, { status: 500 })
          }
        } else {
          console.error('❌ Erro criar usuário:', createError)
          return NextResponse.json({
            error: `Erro criar usuário: ${createError.message}`
          }, { status: 400 })
        }
      } else {
        targetUser = newUser.user
        isNewUser = true

        // Aguardar
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    // UPSERT profile (cria ou atualiza)
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: targetUser!.id,
        name: business.responsible_name || business.name,
        role: 'partner'
      }, {
        onConflict: 'id'
      })

    if (profileError) {
      console.error('❌ Erro upsert profile:', profileError)
      if (isNewUser) {
        await supabase.auth.admin.deleteUser(targetUser!.id)
      }
      return NextResponse.json({ error: 'Erro garantir profile' }, { status: 500 })
    }

    // UPSERT partner (cria ou atualiza)
    const { error: partnerError } = await supabase
      .from('partners')
      .upsert({
        user_id: targetUser!.id,
        business_id: businessId,
        status: 'active',
        approved_by: user.id
      }, {
        onConflict: 'user_id,business_id'
      })

    if (partnerError) {
      console.error('❌ Erro upsert partner:', partnerError)
      if (isNewUser) {
        await supabase.from('profiles').delete().eq('id', targetUser!.id)
        await supabase.auth.admin.deleteUser(targetUser!.id)
      }
      return NextResponse.json({ error: 'Erro garantir partner' }, { status: 500 })
    }

    // Aprovar empresa
    const { error: updateError } = await supabase
      .from('businesses')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: user.id
      })
      .eq('id', businessId)

    if (updateError) {
      console.error('❌ Erro aprovar:', updateError)
      return NextResponse.json({ error: 'Erro aprovar empresa' }, { status: 500 })
    }

    // ✅ NOVO: Enviar email de boas-vindas
    try {
      const emailData = getApprovalEmail({
        businessName: business.name,
        responsibleName: business.responsible_name || business.name,
        email: business.responsible_email,
        password: tempPassword,
        planType: business.plan_type as 'basic' | 'premium',
        loginUrl: `${process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin}/login`,
        
        // ✅ NOVO: Limites dinâmicos do banco
        maxCoupons: business.max_coupons || 3,
        maxPhotos: business.max_photos || 3,
        isFeatured: business.featured_until ? new Date(business.featured_until) > new Date() : false
      })

      await sendEmail(
        business.responsible_email,
        emailData.subject,
        emailData.html
      )
    } catch (emailError) {
      console.error('⚠️ Erro ao enviar email:', emailError)
      // Não falha a aprovação se o email der erro
    }

    return NextResponse.json({
      success: true,
      credentials: {
        email: business.responsible_email,
        password: tempPassword,
        loginUrl: `${process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin}/login`
      }
    })

  } catch (error) {
    console.error('❌ ERRO GERAL:', error)
    return NextResponse.json({ 
      error: 'Erro interno' 
    }, { status: 500 })
  }
}

function generatePassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}
