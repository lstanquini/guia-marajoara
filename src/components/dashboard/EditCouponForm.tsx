'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { Loader2, Upload, X } from 'lucide-react';

interface Coupon {
  id: string;
  title: string;
  description: string;
  discount_text: string | null;
  image_url: string;
  expires_at: string;
  status: string;
}

export default function EditCouponForm({ 
  coupon, 
  businessId 
}: { 
  coupon: Coupon; 
  businessId: string 
}) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(coupon.image_url);
  
  const [formData, setFormData] = useState({
    title: coupon.title,
    description: coupon.description,
    discount_text: coupon.discount_text || '',
    expires_at: coupon.expires_at.split('T')[0],
    status: coupon.status
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = coupon.image_url;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${businessId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('coupons')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('coupons')
          .getPublicUrl(fileName);
        
        finalImageUrl = publicUrl;
      }

      const { error } = await supabase
        .from('coupons')
        .update({
          title: formData.title,
          description: formData.description,
          discount_text: formData.discount_text || null,
          image_url: finalImageUrl,
          expires_at: new Date(formData.expires_at).toISOString(),
          status: formData.status
        })
        .eq('id', coupon.id);

      if (error) throw error;

      router.push('/dashboard/empresa/cupons');
      router.refresh();
    } catch (error) {
      console.error('Erro ao atualizar cupom:', error);
      alert('Erro ao atualizar cupom');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Título do Cupom</label>
          <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C2227A] focus:border-transparent" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Descrição</label>
          <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C2227A] focus:border-transparent" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Desconto (ex: 20% OFF)</label>
          <input type="text" value={formData.discount_text} onChange={(e) => setFormData({ ...formData, discount_text: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C2227A] focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Imagem do Cupom</label>
          {imagePreview && (
            <div className="mb-4 relative w-full aspect-video rounded-xl overflow-hidden">
              <Image src={imagePreview} alt="Preview" fill className="object-cover" />
              <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); }} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"><X size={16} /></button>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C2227A] focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Data de Expiração</label>
          <input type="date" value={formData.expires_at} onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C2227A] focus:border-transparent" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
          <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#C2227A] focus:border-transparent">
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="flex-1 bg-[#C2227A] text-white px-6 py-3 rounded-xl hover:bg-[#A01860] transition-colors font-semibold disabled:opacity-50">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin inline mr-2" />Salvando...</> : 'Salvar Alterações'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-semibold">Cancelar</button>
        </div>
      </div>
    </form>
  );
}