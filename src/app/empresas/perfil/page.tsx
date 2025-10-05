'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2, Instagram, Globe, Phone, MapPin, Clock } from 'lucide-react';

interface Business {
  id: string;
  name: string;
  description: string;
  phone: string | null;
  whatsapp: string | null;
  website: string | null;
  instagram: string | null;
  address: string;
  address_number: string | null;
  neighborhood: string | null;
  city: string;
  state: string;
  zip_code: string | null;
  opening_hours: Record<string, string> | null;
}

export default function EditProfileForm({ business }: { business: Business }) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: business.name,
    description: business.description || '',
    phone: business.phone || '',
    whatsapp: business.whatsapp || '',
    website: business.website || '',
    instagram: business.instagram || '',
    address: business.address,
    address_number: business.address_number || '',
    neighborhood: business.neighborhood || '',
    city: business.city,
    state: business.state,
    zip_code: business.zip_code || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          name: formData.name,
          description: formData.description,
          phone: formData.phone || null,
          whatsapp: formData.whatsapp || null,
          website: formData.website || null,
          instagram: formData.instagram || null,
          address: formData.address,
          address_number: formData.address_number || null,
          neighborhood: formData.neighborhood || null,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code || null
        })
        .eq('id', business.id);

      if (error) throw error;

      alert('Perfil atualizado com sucesso!');
      router.refresh();
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Informações Básicas */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Informações Básicas</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nome da Empresa *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C2227A] focus:border-transparent" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Descrição</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={6} placeholder="Conte sobre sua empresa, produtos e serviços..." className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C2227A] focus:border-transparent" />
            <p className="text-sm text-slate-500 mt-2">Esta descrição aparecerá na página pública da sua empresa</p>
          </div>
        </div>
      </div>

      {/* Contato */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Phone className="w-5 h-5" />Contato</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Telefone</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="(11) 98765-4321" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C2227A] focus:border-transparent" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">WhatsApp</label>
            <input type="tel" value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} placeholder="(11) 98765-4321" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C2227A] focus:border-transparent" />
          </div>
        </div>
      </div>

      {/* Redes Sociais */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Redes Sociais</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2"><Instagram className="w-4 h-4" />Instagram</label>
            <input type="text" value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} placeholder="@suaempresa" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C2227A] focus:border-transparent" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2"><Globe className="w-4 h-4" />Website</label>
            <input type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="https://seusite.com.br" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C2227A] focus:border-transparent" />
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><MapPin className="w-5 h-5" />Endereço</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Rua/Avenida *</label>
              <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C2227A] focus:border-transparent" required />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Número</label>
              <input type="text" value={formData.address_number} onChange={(e) => setFormData({ ...formData, address_number: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C2227A] focus:border-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Bairro</label>
              <input type="text" value={formData.neighborhood} onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C2227A] focus:border-transparent" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">CEP</label>
              <input type="text" value={formData.zip_code} onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })} placeholder="00000-000" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C2227A] focus:border-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Cidade *</label>
              <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C2227A] focus:border-transparent" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Estado *</label>
              <select value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C2227A] focus:border-transparent" required>
                <option value="">Selecione</option>
                <option value="SP">São Paulo</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="MG">Minas Gerais</option>
                <option value="ES">Espírito Santo</option>
                <option value="PR">Paraná</option>
                <option value="SC">Santa Catarina</option>
                <option value="RS">Rio Grande do Sul</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="flex-1 bg-[#C2227A] text-white px-6 py-4 rounded-xl hover:bg-[#A01860] transition-colors font-bold text-lg disabled:opacity-50">
          {loading ? <><Loader2 className="w-5 h-5 animate-spin inline mr-2" />Salvando...</> : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  );
}