import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email/providers'
import { getApprovalEmail } from '@/lib/email/templates/approval'

// Força Node.js runtime para usar Nodemailer (não funciona no Edge Runtime)
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 ===== INÍCIO =====')
    
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ Sem token')
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const accessToken = authHeader.replace('Bearer ', '')
    console.log('✅ Token recebido')

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

    console.log('✅ Usuário:', user.email)

    const { data: admin } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!admin) {
      console.error('❌ Não é admin')
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 })
    }

    console.log('✅ É admin!')

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

    console.log('✅ Empresa:', business.name)

    // Gerar senha
    const tempPassword = generatePassword()

    console.log('🔄 Verificando se usuário já existe...')
    
    // Buscar usuário existente
    const { data: listData } = await supabase.auth.admin.listUsers()
    let targetUser = listData?.users?.find(u => u.email === business.responsible_email)
    
    if (targetUser) {
      console.log('⚠️ Usuário JÁ EXISTE:', targetUser.id)
      
      // Verificar se tem profile
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUser.id)
        .maybeSingle()
      
      if (!existingProfile) {
        console.log('🔄 Criando profile faltante...')
        const { error: profileError } = await supabase.from('profiles').insert({
          id: targetUser.id,
          name: business.responsible_name || business.name,
          role: 'partner'
        })
        
        if (profileError) {
          console.error('❌ Erro criar profile:', profileError)
          return NextResponse.json({ error: 'Erro criar profile' }, { status: 500 })
        }
        console.log('✅ Profile criado!')
      } else {
        console.log('✅ Profile já existe')
      }
      
      // Verificar se tem partner
      const { data: existingPartner } = await supabase
        .from('partners')
        .select('*')
        .eq('user_id', targetUser.id)
        .eq('business_id', businessId)
        .maybeSingle()
      
      if (!existingPartner) {
        console.log('🔄 Criando partner faltante...')
        const { error: partnerError } = await supabase.from('partners').insert({
          user_id: targetUser.id,
          business_id: businessId,
          status: 'active',
          approved_by: user.id
        })
        
        if (partnerError) {
          console.error('❌ Erro criar partner:', partnerError)
          return NextResponse.json({ error: 'Erro criar partner' }, { status: 500 })
        }
        console.log('✅ Partner criado!')
      } else {
        console.log('✅ Partner já existe')
      }
      
    } else {
      // Criar NOVO usuário
      console.log('🔄 Criando NOVO usuário...')
      
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
        console.error('❌ Erro criar usuário:', createError)
        return NextResponse.json({ 
          error: `Erro criar usuário: ${createError.message}` 
        }, { status: 400 })
      }

      console.log('✅ Usuário criado:', newUser.user.id)
      targetUser = newUser.user

      // Aguardar
      await new Promise(resolve => setTimeout(resolve, 500))

      // Criar profile
      console.log('🔄 Criando profile...')
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: newUser.user.id,
          name: business.responsible_name || business.name,
          role: 'partner'
        })

      if (profileError) {
        console.error('❌ Erro profile:', profileError)
        await supabase.auth.admin.deleteUser(newUser.user.id)
        return NextResponse.json({ error: `Erro criar profile: ${profileError.message}` }, { status: 500 })
      }

      console.log('✅ Profile criado!')

      // Criar partner
      console.log('🔄 Criando partner...')
      const { error: partnerError } = await supabase
        .from('partners')
        .insert({
          user_id: newUser.user.id,
          business_id: businessId,
          status: 'active',
          approved_by: user.id
        })

      if (partnerError) {
        console.error('❌ Erro partner:', partnerError)
        await supabase.from('profiles').delete().eq('id', newUser.user.id)
        await supabase.auth.admin.deleteUser(newUser.user.id)
        return NextResponse.json({ error: `Erro criar partner: ${partnerError.message}` }, { status: 500 })
      }

      console.log('✅ Partner criado!')
    }

    // Aprovar empresa
    // Aprovar empresa
    console.log('🔄 Aprovando empresa...')
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

    console.log('✅ APROVADO!')

    // ✅ NOVO: Enviar email de boas-vindas
        // ✅ NOVO: Enviar email de boas-vindas
    try {
      console.log('📧 Enviando email de aprovação...')
      
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

      console.log('✅ Email enviado com sucesso!')
    } catch (emailError) {
      console.error('⚠️ Erro ao enviar email:', emailError)
      // Não falha a aprovação se o email der erro
    }

    console.log('🎉 SUCESSO TOTAL!')

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