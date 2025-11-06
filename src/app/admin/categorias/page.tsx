'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  Plus, Edit2, Trash2, Save, X, AlertCircle, ChevronUp, ChevronDown,
  Upload, Image as ImageIcon
} from 'lucide-react'
import { getIconBySlug } from '@/lib/iconMapping'
import { AdminLayout } from '@/components/admin/AdminLayout'

interface Category {
  id: string
  name: string
  slug: string
  icon: string
  image_url?: string | null
  order_index: number
  created_at: string
  updated_at: string
  business_count?: number
}

interface CategoryForm {
  name: string
  slug: string
  icon: string
  image_url?: string | null
  order_index: number
}

export default function AdminCategoriasPage() {
  const supabase = createClientComponentClient()

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [saving, setSaving] = useState(false)
  const [reordering, setReordering] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<CategoryForm>({
    name: '',
    slug: '',
    icon: '🏪',
    image_url: null,
    order_index: 1
  })

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    setLoading(true)
    try {
      const { data: categoriesData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('order_index')
      if (catError) throw catError

      const { data: businesses, error: bizError } = await supabase
        .from('businesses')
        .select('category_main')
        .eq('status', 'approved')
      if (bizError) throw bizError

      const counts: Record<string, number> = {}
      businesses?.forEach(b => {
        counts[b.category_main] = (counts[b.category_main] || 0) + 1
      })

      const categoriesWithCount = categoriesData?.map(cat => ({
        ...cat,
        business_count: counts[cat.slug] || 0
      })) || []

      setCategories(categoriesWithCount)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleImageUpload(file: File) {
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert('Imagem muito grande! Máximo 2MB.')
      return
    }
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas imagens.')
      return
    }
    setUploadingImage(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `category-${Date.now()}.${fileExt}`
      const { data, error } = await supabase.storage
        .from('category-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage
        .from('category-images')
        .getPublicUrl(data.path)
      setFormData({ ...formData, image_url: publicUrl })
      setImagePreview(publicUrl)
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload da imagem')
    } finally {
      setUploadingImage(false)
    }
  }

  async function removeOldImage(imageUrl: string) {
    if (!imageUrl || !imageUrl.includes('category-images')) return
    try {
      const urlParts = imageUrl.split('/category-images/')
      if (urlParts[1]) {
        await supabase.storage.from('category-images').remove([urlParts[1]])
      }
    } catch (error) {
      console.error('Erro ao remover imagem antiga:', error)
    }
  }
  
  function generateSlug(name: string) {
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  function openAddModal() {
    const nextOrderIndex = categories.length > 0
      ? Math.max(...categories.map(c => c.order_index)) + 1
      : 1
    
    setFormData({
      name: '',
      slug: '',
      icon: '🏪',
      image_url: null,
      order_index: nextOrderIndex
    })
    setImagePreview(null)
    setShowAddModal(true)
  }

  function openEditModal(category: Category) {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      image_url: category.image_url,
      order_index: category.order_index
    })
    setImagePreview(category.image_url || null)
    setShowEditModal(true)
  }
  
  async function handleAdd() {
    if (!formData.name || !formData.slug || !formData.icon) {
      alert('Preencha todos os campos obrigatórios')
      return
    }
    setSaving(true)
    try {
      const { error } = await supabase
        .from('categories')
        .insert({
          name: formData.name,
          slug: formData.slug,
          icon: formData.icon,
          image_url: formData.image_url,
          order_index: formData.order_index
        })
      if (error) throw error
      await loadCategories()
      setShowAddModal(false)
      alert('Categoria adicionada com sucesso!')
    } catch (error: any) {
      console.error('Erro ao adicionar categoria:', error)
      if (error.code === '23505') alert('Já existe uma categoria com esse slug')
      else alert('Erro ao adicionar categoria')
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit() {
    if (!editingCategory || !formData.name || !formData.icon) {
      alert('Preencha todos os campos obrigatórios')
      return
    }
    setSaving(true)
    try {
      if (editingCategory.image_url && editingCategory.image_url !== formData.image_url) {
        await removeOldImage(editingCategory.image_url)
      }
      const { error } = await supabase
        .from('categories')
        .update({
          name: formData.name,
          icon: formData.icon,
          image_url: formData.image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingCategory.id)
      if (error) throw error
      await loadCategories()
      setShowEditModal(false)
      alert('Categoria atualizada com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error)
      alert('Erro ao atualizar categoria')
    } finally {
      setSaving(false)
    }
  }
  
  async function handleDelete(category: Category) {
    if (category.business_count && category.business_count > 0) {
      alert(`Não é possível excluir esta categoria pois existem ${category.business_count} empresa(s) vinculada(s) a ela.`)
      return
    }
    const confirmed = confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)
    if (!confirmed) return
    try {
      if (category.image_url) await removeOldImage(category.image_url)
      const { error } = await supabase.from('categories').delete().eq('id', category.id)
      if (error) throw error
      await loadCategories()
      alert('Categoria excluída com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir categoria:', error)
      alert('Erro ao excluir categoria')
    }
  }
  
  async function moveUp(index: number) {
    if (index === 0) return
    setReordering(true)
    const newCategories = [...categories]
    const current = newCategories[index]; const previous = newCategories[index - 1]
    const tempOrder = current.order_index; current.order_index = previous.order_index; previous.order_index = tempOrder
    newCategories[index] = previous; newCategories[index - 1] = current
    setCategories(newCategories)
    try {
      await Promise.all([
        supabase.from('categories').update({ order_index: current.order_index }).eq('id', current.id),
        supabase.from('categories').update({ order_index: previous.order_index }).eq('id', previous.id)
      ])
    } catch (error) {
      console.error('Erro ao reordenar:', error); await loadCategories()
    } finally { setReordering(false) }
  }

  async function moveDown(index: number) {
    if (index === categories.length - 1) return
    setReordering(true)
    const newCategories = [...categories]
    const current = newCategories[index]; const next = newCategories[index + 1]
    const tempOrder = current.order_index; current.order_index = next.order_index; next.order_index = tempOrder
    newCategories[index] = next; newCategories[index + 1] = current
    setCategories(newCategories)
    try {
      await Promise.all([
        supabase.from('categories').update({ order_index: current.order_index }).eq('id', current.id),
        supabase.from('categories').update({ order_index: next.order_index }).eq('id', next.id)
      ])
    } catch (error) {
      console.error('Erro ao reordenar:', error); await loadCategories()
    } finally { setReordering(false) }
  }
  
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          
          {/* Header com Botão Adicionar */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Categorias</h1>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-[#C2227A] text-white rounded-lg hover:bg-[#A01860] transition-colors font-semibold text-sm md:text-base"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Nova Categoria</span>
              <span className="sm:hidden">Nova</span>
            </button>
          </div>

          {/* Dica sobre Ícones */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6 flex items-start gap-2 md:gap-3">
            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs md:text-sm text-blue-800">
              <p className="font-semibold mb-1">Dica sobre Ícones:</p>
              <p>O ícone profissional (SVG) é definido automaticamente com base no "slug". Cadastre slugs como "restaurante", "beleza", "petshop" para ver a mágica acontecer!</p>
            </div>
          </div>

          {/* Lista de Categorias */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Carregando categorias...</div>
            ) : categories.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>Nenhuma categoria cadastrada</p>
                <button onClick={openAddModal} className="mt-4 text-[#C2227A] hover:underline text-sm">
                  Adicionar primeira categoria
                </button>
              </div>
            ) : (
              <div className="divide-y">
                {categories.map((category, index) => {
                  const LucideIcon = getIconBySlug(category.slug)

                  return (
                    <div key={category.id} className="p-3 md:p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between gap-2 md:gap-4">
                        
                        {/* Botões de Reordenação */}
                        <div className="flex flex-col gap-0.5 md:gap-1">
                          <button 
                            onClick={() => moveUp(index)} 
                            disabled={index === 0 || reordering} 
                            className="p-1.5 md:p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ChevronUp size={18} className="md:w-4 md:h-4" />
                          </button>
                          <button 
                            onClick={() => moveDown(index)} 
                            disabled={index === categories.length - 1 || reordering} 
                            className="p-1.5 md:p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ChevronDown size={18} className="md:w-4 md:h-4" />
                          </button>
                        </div>

                        {/* Ícone/Imagem */}
                        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                          {category.image_url ? (
                            <img 
                              src={category.image_url} 
                              alt={category.name}
                              className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover"
                            />
                          ) : LucideIcon ? (
                            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-gray-100 rounded-lg">
                              <LucideIcon className="w-6 h-6 md:w-7 md:h-7 text-gray-600" />
                            </div>
                          ) : (
                            <span className="text-2xl md:text-3xl">{category.icon}</span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">{category.name}</h3>
                          
                          {/* Desktop - Todas as infos */}
                          <div className="hidden md:flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1">
                            <span>Slug: <code className="bg-gray-100 px-1 rounded">{category.slug}</code></span>
                            <span>Ordem: {category.order_index}</span>
                            <span>
                              {category.business_count || 0} empresa{(category.business_count || 0) !== 1 ? 's' : ''}
                            </span>
                            {category.image_url && <span className="text-green-600">✓ Com imagem</span>}
                            {LucideIcon && <span className="text-purple-600">✓ Ícone SVG</span>}
                          </div>

                          {/* Mobile - Info resumida */}
                          <div className="md:hidden text-xs text-gray-500 mt-1">
                            <div className="flex items-center gap-2">
                              <span>{category.business_count || 0} empresa{(category.business_count || 0) !== 1 ? 's' : ''}</span>
                              {category.image_url && <span className="text-green-600">✓ Img</span>}
                              {LucideIcon && <span className="text-purple-600">✓ SVG</span>}
                            </div>
                          </div>
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex items-center gap-1 md:gap-2">
                          <button 
                            onClick={() => openEditModal(category)} 
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" 
                            title="Editar"
                          >
                            <Edit2 size={16} className="md:w-[18px] md:h-[18px]" />
                          </button>
                          <button 
                            onClick={() => handleDelete(category)} 
                            disabled={!!category.business_count && category.business_count > 0} 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed" 
                            title={category.business_count && category.business_count > 0 ? 'Categoria com empresas não pode ser excluída' : 'Excluir'}
                          >
                            <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg md:text-xl font-bold mb-4">
              {showAddModal ? 'Nova Categoria' : 'Editar Categoria'}
            </h2>

            <div className="space-y-3 md:space-y-4">
              
              {/* Nome */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Nome da Categoria</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => { 
                    setFormData({ 
                      ...formData, 
                      name: e.target.value, 
                      ...(showAddModal ? { slug: generateSlug(e.target.value) } : {}) 
                    }) 
                  }} 
                  placeholder="Ex: Restaurantes" 
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent text-sm md:text-base"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Slug (identificador único)</label>
                <input 
                  type="text" 
                  value={formData.slug} 
                  onChange={(e) => showAddModal && setFormData({ ...formData, slug: e.target.value.toLowerCase() })} 
                  disabled={showEditModal} 
                  placeholder="Ex: restaurantes" 
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent font-mono text-xs md:text-sm disabled:bg-gray-50"
                />
                {showAddModal && <p className="text-xs text-gray-500 mt-1">Gerado automaticamente. Use slugs como "beleza", "petshop", "academia".</p>}
              </div>
              
              {/* Preview do Ícone */}
              {formData.slug && (
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Preview do Ícone</label>
                  <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-center gap-3">
                    {(() => {
                      const LucideIcon = getIconBySlug(formData.slug);
                      if (LucideIcon) {
                        return (
                          <>
                            <LucideIcon className="w-7 h-7 md:w-8 md:h-8 text-gray-700" />
                            <span className="text-xs md:text-sm text-green-600 font-medium">Ícone "{formData.slug}" encontrado!</span>
                          </>
                        );
                      }
                      return (
                        <p className="text-xs md:text-sm text-gray-500">Nenhum ícone SVG para "{formData.slug}". Usará o emoji.</p>
                      );
                    })()}
                  </div>
                </div>
              )}
              
              {/* Emoji */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Ícone Emoji (alternativa)
                </label>
                <input 
                  type="text" 
                  value={formData.icon} 
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })} 
                  placeholder="Ex: 🍕" 
                  maxLength={2} 
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2227A] focus:border-transparent text-xl md:text-2xl text-center"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Usado como alternativa se o slug não corresponder a nenhum ícone SVG.
                </p>
              </div>

              {/* Upload de Imagem */}
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Imagem da Categoria (opcional)</label>
                {imagePreview && (
                  <div className="mb-3 relative">
                    <img src={imagePreview} alt="Preview" className="w-full h-28 md:h-32 object-cover rounded-lg"/>
                    <button 
                      type="button" 
                      onClick={() => { 
                        setImagePreview(null); 
                        setFormData({ ...formData, image_url: null })
                      }} 
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={14} className="md:w-4 md:h-4" />
                    </button>
                  </div>
                )}
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => { 
                      const file = e.target.files?.[0]; 
                      if (file) handleImageUpload(file) 
                    }} 
                    className="hidden" 
                    id="image-upload" 
                    disabled={uploadingImage}
                  />
                  <label 
                    htmlFor="image-upload" 
                    className={`flex items-center justify-center gap-2 w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#C2227A] transition-colors ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {uploadingImage ? (
                      <>
                        <span className="animate-spin h-4 w-4 md:h-5 md:w-5 border-2 border-[#C2227A] border-t-transparent rounded-full"></span>
                        <span className="text-xs md:text-sm text-gray-600">Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={18} className="text-gray-400 md:w-5 md:h-5" />
                        <span className="text-xs md:text-sm text-gray-600">{imagePreview ? 'Trocar imagem' : 'Escolher imagem'}</span>
                      </>
                    )}
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">Imagem quadrada, JPG ou PNG, máximo 2MB</p>
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mt-4 md:mt-6">
              <button 
                onClick={() => { 
                  showAddModal ? setShowAddModal(false) : setShowEditModal(false); 
                  setImagePreview(null) 
                }} 
                disabled={saving || uploadingImage} 
                className="flex-1 px-4 py-2 md:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm md:text-base"
              >
                Cancelar
              </button>
              <button 
                onClick={showAddModal ? handleAdd : handleEdit} 
                disabled={saving || uploadingImage} 
                className="flex-1 px-4 py-2 md:py-2.5 bg-[#C2227A] text-white rounded-lg hover:bg-[#A01860] disabled:opacity-50 text-sm md:text-base font-semibold"
              >
                {saving ? 'Salvando...' : showAddModal ? 'Adicionar' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}