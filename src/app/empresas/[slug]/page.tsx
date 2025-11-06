import { notFound } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { Award, Clock, Globe, Instagram, MapPin, Phone, MessageSquare, Star } from 'lucide-react';
import { BusinessMapAndReviews } from '@/components/BusinessMapAndReviews';

interface Business {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_main: string;
  category_sub: string | null;
  logo_url: string | null;
  banner_url: string | null;
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
  latitude: number | null;
  longitude: number | null;
  opening_hours: Record<string, string> | null;
  delivery: boolean;
  rating: number | null;
  total_reviews: number | null;
  plan_type: 'basic' | 'premium';
  google_place_id: string | null;
}

interface Coupon {
  id: string;
  title: string;
  description: string;
  discount_text: string | null;
  image_url: string;
  expires_at: string;
  status: string;
}

type BusinessData = {
  business: Business;
  coupons: Coupon[];
};

function getValidImageUrl(url: string | null): string | null {
  if (!url?.trim()) return null;
  try {
    new URL(url);
    return url;
  } catch {
    return url.startsWith('/') ? url : null;
  }
}

async function getBusinessData(slug: string): Promise<BusinessData | null> {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore } as any);
  
  const { data: business, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'approved')
    .single();
  
  if (error || !business) return null;
  
  const { data: coupons } = await supabase
    .from('coupons')
    .select('*')
    .eq('business_id', business.id)
    .eq('status', 'active')
    .gte('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });
  
  return { business, coupons: coupons || [] };
}

const BusinessHeader = ({ business }: { business: Business }) => {
  const logoUrl = getValidImageUrl(business.logo_url);
  const bannerUrl = getValidImageUrl(business.banner_url);
  const rating = business.rating ?? 0;
  
  return (
    <header className="relative h-[300px] md:h-[400px]">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300">
        {bannerUrl && <Image src={bannerUrl} alt={`Banner de ${business.name}`} fill className="object-contain md:object-cover" priority />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="absolute inset-0 flex items-end p-4 md:p-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-5xl md:text-6xl flex-shrink-0 relative overflow-hidden">
              {logoUrl ? <Image src={logoUrl} alt={`Logo de ${business.name}`} fill className="object-contain p-3" /> : '🏪'}
            </div>
            
            <div className="flex-1 pb-2">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                {business.name}
              </h1>
              <p className="text-lg md:text-xl text-white/95 mb-3">
                {business.category_sub || business.category_main}
              </p>
              
              <div className="flex flex-wrap items-center gap-3">
                {rating > 0 && (
                  <div className="bg-white/25 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 border border-white/40">
                    <Star className="w-5 h-5 text-yellow-300" fill="currentColor" />
                    <span className="text-white font-bold">{rating.toFixed(1)}</span>
                    <span className="text-sm text-white/80">({business.total_reviews || 0})</span>
                  </div>
                )}
                {business.plan_type === 'premium' && (
                  <div className="bg-gradient-to-r from-[#C2227A] to-[#A01860] text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    Premium
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const CouponCard = ({ coupon }: { coupon: Coupon }) => (
  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
    <div className="aspect-video bg-slate-50 relative">
      <Image src={coupon.image_url} alt={coupon.title} fill className="object-cover" />
    </div>
    <div className="p-5">
      <h3 className="font-bold text-lg text-slate-800 mb-2">{coupon.title}</h3>
      {coupon.discount_text && (
        <p className="text-[#C2227A] font-black text-2xl mb-3">{coupon.discount_text}</p>
      )}
      <p className="text-xs text-slate-500">
        Válido até {new Date(coupon.expires_at).toLocaleDateString('pt-BR')}
      </p>
    </div>
  </div>
);

export default async function EmpresaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getBusinessData(slug);
  if (!data) notFound();
  const { business, coupons } = data;

  const fullAddress = `${business.address}${business.address_number ? `, ${business.address_number}` : ''}${business.neighborhood ? ` - ${business.neighborhood}` : ''}, ${business.city} - ${business.state}`;

  const dayNames: Record<string, string> = {
    'segunda': 'Segunda-feira',
    'terca': 'Terça-feira',
    'quarta': 'Quarta-feira',
    'quinta': 'Quinta-feira',
    'sexta': 'Sexta-feira',
    'sabado': 'Sábado',
    'domingo': 'Domingo'
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      <BusinessHeader business={business} />
      
      <main className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-12">
            {/* Sobre */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Sobre</h2>
              <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-line">
                {business.description || 'Sem descrição disponível.'}
              </p>
            </section>
            
            {/* Cupons */}
            {coupons.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Cupons</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {coupons.map(coupon => <CouponCard key={coupon.id} coupon={coupon} />)}
                </div>
              </section>
            )}
            
            {/* Horários */}
            {business.opening_hours && (
              <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Horários</h2>
                <div className="space-y-3">
                  {Object.entries(business.opening_hours).map(([day, hours]: [string, any]) => {
                    const schedule = hours as { open: string; close: string; closed: boolean }
                    return (
                      <div key={day} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                        <span className="text-slate-600 font-medium capitalize">{dayNames[day] || day}</span>
                        <span className="text-slate-900 font-semibold">
                          {schedule.closed ? 'Fechado' : `${schedule.open} - ${schedule.close}`}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}
            
            {/* Mapa e Avaliações do Google */}
            <BusinessMapAndReviews
              businessName={business.name}
              address={fullAddress}
              lat={business.latitude}
              lng={business.longitude}
              googlePlaceId={business.google_place_id}
            />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="font-bold text-lg text-slate-800 mb-4">Contato</h3>
              
              <div className="space-y-3 mb-6">
                {business.whatsapp && <a href={`https://wa.me/55${business.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl hover:bg-[#20BA5A] transition-colors font-bold shadow-md"><MessageSquare size={20} />WhatsApp</a>}
                {business.phone && <a href={`tel:${business.phone.replace(/\D/g, '')}`} className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-bold"><Phone size={18} />{business.phone}</a>}
              </div>
              
              {(business.instagram || business.website) && (
                <div className="pt-6 border-t border-slate-200 space-y-3">
                  {business.instagram && <a href={`https://instagram.com/${business.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-700 hover:text-[#C2227A] transition-colors"><Instagram size={20} /><span className="font-medium">@{business.instagram.replace('@', '')}</span></a>}
                  {business.website && <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-700 hover:text-[#C2227A] transition-colors"><Globe size={20} /><span className="font-medium truncate">{business.website.replace(/^https?:\/\//, '')}</span></a>}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}