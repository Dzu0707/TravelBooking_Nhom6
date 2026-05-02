import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MapPin, Star, Loader2, Search, ShieldCheck, Headphones,
  CreditCard, ThumbsUp, ArrowRight, Compass, Clock,
  Users, Award, ChevronRight, Play
} from 'lucide-react';
interface Tour {
  id: number;
  name: string;
  code: string;
  imageUrl?: string;
  tourImages?: { imageUrl: string; isPrimary: boolean }[];
  departureLocation: string;
  description?: string;
  rating?: number;
  minPrice?: number;
  categoryId?: number;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface NewsPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  thumbnailUrl?: string;
  publishedAt?: string;
  category?: { name: string };
}

const API_BASE = "http://localhost:5091";

const getImgUrl = (url?: string) => {
  if (!url) return "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800";
  if (url.startsWith('http')) return url;
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
};

const CAT_GRADIENTS = [
  'from-blue-500 to-cyan-400',
  'from-rose-500 to-pink-400',
  'from-emerald-500 to-teal-400',
  'from-amber-500 to-orange-400',
  'from-violet-500 to-purple-400',
  'from-indigo-500 to-blue-400',
];

// ─── TOUR CARD (dùng chung với TourList) ────────────────────────────────────
export const TourCard = ({ tour }: { tour: Tour; index?: number }) => {
  const navigate = useNavigate();
  const imgs = tour.tourImages || [];
  const mainImg = imgs.find(i => i.isPrimary)?.imageUrl || imgs[0]?.imageUrl || tour.imageUrl;
  const secondImg = imgs.filter(i => !i.isPrimary)[0]?.imageUrl || tour.imageUrl;

  return (
    <div
      className="group relative bg-white rounded-[2rem] overflow-hidden cursor-pointer flex flex-col"
      style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.06)', transition: 'transform 0.4s cubic-bezier(.22,1,.36,1), box-shadow 0.4s ease' }}
      onClick={() => navigate(`/tours/${tour.id}`)}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 24px 48px rgba(0,0,0,0.13)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 20px rgba(0,0,0,0.06)'; }}
    >
      <div className="relative h-52 grid grid-cols-3 gap-1.5 p-1.5">
        <div className="col-span-2 relative overflow-hidden rounded-[1.25rem]">
          <img src={getImgUrl(mainImg)} alt={tour.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e: any) => { e.target.src = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800"; }}
          />
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[9px] font-black uppercase tracking-widest text-slate-700 px-2.5 py-1 rounded-lg shadow-sm">{tour.code}</span>
          <span className="absolute bottom-3 left-3 flex items-center gap-1 bg-amber-400 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow">
            <Star size={9} fill="white" /> {tour.rating || '4.9'}
          </span>
        </div>
        <div className="col-span-1 grid grid-rows-2 gap-1.5">
          <div className="rounded-[0.85rem] overflow-hidden bg-slate-100">
            <img src={getImgUrl(secondImg)} className="w-full h-full object-cover" alt=""
              onError={(e: any) => { e.target.src = "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400"; }} />
          </div>
          <div className="rounded-[0.85rem] overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <div className="text-center text-white px-1">
              <div className="text-[8px] font-black uppercase tracking-widest opacity-80">Mã tour</div>
              <div className="text-[10px] font-black">{tour.code}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-2 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-2">
          <MapPin size={11} className="text-rose-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{tour.departureLocation}</span>
        </div>
        <h3 className="text-base font-black text-slate-900 uppercase italic leading-tight line-clamp-1 mb-2 group-hover:text-indigo-600 transition-colors">{tour.name}</h3>
        <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 mb-4 flex-1">
          {tour.description || 'Khám phá vẻ đẹp thiên nhiên và văn hoá đặc sắc trên hành trình đáng nhớ cùng TravelGo.'}
        </p>
        <div className="flex items-center gap-3 py-2.5 px-3 bg-slate-50 rounded-xl mb-4">
          <div className="flex items-center gap-1.5"><Clock size={11} className="text-indigo-500"/><span className="text-[9px] font-black uppercase text-slate-400">Hàng ngày</span></div>
          <div className="w-px h-3 bg-slate-200"/>
          <div className="flex items-center gap-1.5"><Users size={11} className="text-emerald-500"/><span className="text-[9px] font-black uppercase text-slate-400">Còn chỗ</span></div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[9px] font-black uppercase text-slate-400 mb-0.5">Giá từ</div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-black text-indigo-600 italic">{(tour.minPrice || 0).toLocaleString('vi-VN')}</span>
              <span className="text-[10px] font-bold text-indigo-500">đ</span>
            </div>
          </div>
          <button className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-indigo-600 transition-all shadow-md"
            onClick={e => { e.stopPropagation(); navigate(`/tours/${tour.id}`); }}>
            <ArrowRight size={16}/>
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) => (
  <div className="flex flex-col items-center text-center gap-2">
    <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 mb-1">{icon}</div>
    <div className="text-3xl font-black text-slate-900 tracking-tight">{value}</div>
    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</div>
  </div>
);

// ─── HOME ────────────────────────────────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [news, setNews] = useState<NewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKey, setSearchKey] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [featuredIdx, setFeaturedIdx] = useState(0);

  const banners = [
    { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070", tag: "XU HƯỚNG 2026",    title: "Khám Phá Hành Trình \n Tiếp Theo Của Bạn",   subtitle: "Trải nghiệm những vùng đất mới với mức giá ưu đãi nhất thị trường." },
    { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070", tag: "ƯU ĐÃI ĐẶC BIỆT", title: "Tận Hưởng Kỳ Nghỉ \n Trong Mơ Tại Bali",      subtitle: "Combo nghỉ dưỡng 5 sao cùng hướng dẫn viên bản địa chuyên nghiệp." },
  ];

  useEffect(() => {
    const t = setInterval(() => setCurrentBanner(p => (p + 1) % banners.length), 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    Promise.all([
      axios.get(`${API_BASE}/api/tours`),
      axios.get(`${API_BASE}/api/categories`),
      axios.get(`${API_BASE}/api/newsposts`).catch(() => ({ data: [] })),
    ]).then(([toursRes, catsRes, newsRes]) => {
      setTours(toursRes.data);
      setCategories(catsRes.data);
      setNews((newsRes.data || []).slice(0, 3));
    }).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKey.trim()) params.append('search', searchKey.trim());
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (categoryFilter) params.append('category', categoryFilter);
    navigate(`/tours?${params.toString()}`);
  };

  const featuredTours = tours.slice(0, 6);
  const VISIBLE = 3;
  const maxIdx = Math.max(0, featuredTours.length - VISIBLE);

  const getCatImg = (catId: number) => {
    const tour = tours.find(t => t.categoryId === catId);
    const imgs = tour?.tourImages || [];
    const main = imgs.find(i => i.isPrimary)?.imageUrl || imgs[0]?.imageUrl || tour?.imageUrl;
    return getImgUrl(main);
  };

  return (
    <div className="bg-[#f8fafc] font-sans">

      {/* ── 1. BANNER (giữ nguyên) ─────────────────────────────────────── */}
      <section className="relative h-[90vh] w-full flex flex-col items-center justify-center overflow-hidden bg-slate-900">
        {banners.map((bn, index) => (
          <div key={index} className={`absolute inset-0 transition-all duration-[1500ms] ease-out ${index === currentBanner ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}>
            <img src={bn.url} className="w-full h-full object-cover" alt="Banner"/>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/20"/>
          </div>
        ))}
        <div className="relative z-10 w-full max-w-6xl px-6 text-center text-white pb-20">
          <div className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] mb-6 uppercase">
            {banners[currentBanner].tag}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 drop-shadow-2xl whitespace-pre-line">{banners[currentBanner].title}</h1>
          <p className="text-lg md:text-xl text-gray-100 font-medium max-w-2xl mx-auto opacity-90">{banners[currentBanner].subtitle}</p>
        </div>
        <div className="absolute bottom-5 z-20 flex justify-center gap-3">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setCurrentBanner(i)} className={`h-1 transition-all duration-500 rounded-full ${i === currentBanner ? "w-10 bg-white" : "w-4 bg-white/40"}`}/>
          ))}
        </div>
      </section>

      {/* ── 2. SEARCH BAR ──────────────────────────────────────────────── */}
      <section className="relative z-30 -mt-8 px-6">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSearch} className="bg-white p-3 rounded-2xl lg:rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col lg:flex-row items-center gap-2 border border-gray-100">
            <div className="flex-[1.5] flex items-center gap-4 px-6 py-2 w-full lg:border-r border-gray-100">
              <MapPin className="text-indigo-500 shrink-0" size={22}/>
              <div className="flex-1">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Điểm đến</p>
                <input type="text" placeholder="Bạn muốn đi đâu?" className="w-full bg-transparent outline-none text-gray-800 text-sm font-semibold placeholder:text-gray-300" value={searchKey} onChange={e => setSearchKey(e.target.value)}/>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-4 px-6 py-2 w-full lg:border-r border-gray-100">
              <CreditCard className="text-indigo-500 shrink-0" size={22}/>
              <div className="flex-1">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Ngân sách</p>
                <select className="w-full bg-transparent outline-none text-gray-800 text-sm font-semibold cursor-pointer" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}>
                  <option value="">Tất cả mức giá</option>
                  <option value="2000000">Dưới 2 Triệu</option>
                  <option value="5000000">Dưới 5 Triệu</option>
                  <option value="10000000">Dưới 10 Triệu</option>
                  <option value="20000000">Dưới 20 Triệu</option>
                </select>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-4 px-6 py-2 w-full lg:border-r border-gray-100">
              <Compass className="text-indigo-500 shrink-0" size={22}/>
              <div className="flex-1">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Loại hình</p>
                <select className="w-full bg-transparent outline-none text-gray-800 text-sm font-semibold cursor-pointer" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                  <option value="">Tất cả thể loại</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-xl lg:rounded-full font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 active:scale-95 shrink-0">
              <Search size={16}/> Tìm kiếm
            </button>
          </form>
        </div>
      </section>

      {/* ── 3. STATS (động theo số lượng thật) ────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard value={`${tours.length}+`}      label="Tour đặc sắc"   icon={<Compass size={22}/>}/>
          <StatCard value={`${categories.length}`}  label="Loại hình"      icon={<Award size={22}/>}/>
          <StatCard value="10K+"                    label="Khách hài lòng" icon={<Users size={22}/>}/>
          <StatCard value="4.9★"                    label="Đánh giá TB"    icon={<Star size={22}/>}/>
        </div>
      </section>

      {/* ── 4. DANH MỤC (từ /api/categories, ảnh từ tour thật) ────────── */}
      <section className="py-10 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-black text-[9px] tracking-[0.25em] uppercase mb-3">
              <span className="w-8 h-0.5 bg-indigo-600"/> Danh mục
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tight leading-none">
              Loại Hình <span className="text-indigo-600">Du Lịch</span>
            </h2>
          </div>
          <button onClick={() => navigate('/tours')} className="hidden md:flex items-center gap-2 text-xs font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">
            Tất cả <ChevronRight size={16}/>
          </button>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-indigo-600" size={32}/></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => {
              const tourCount = tours.filter(t => t.categoryId === cat.id).length;
              return (
                <div key={cat.id} onClick={() => navigate(`/tours?category=${cat.id}`)}
                  className="relative rounded-[1.5rem] overflow-hidden cursor-pointer group aspect-[3/4]">
                  <img src={getCatImg(cat.id)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={cat.name}
                    onError={(e: any) => { e.target.style.display='none'; }}/>
                  <div className={`absolute inset-0 bg-gradient-to-br ${CAT_GRADIENTS[i % CAT_GRADIENTS.length]} opacity-50 group-hover:opacity-30 transition-opacity`}/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"/>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-white font-black text-sm uppercase italic leading-tight">{cat.name}</div>
                    <div className="text-white/60 text-[9px] font-bold uppercase tracking-widest mt-1">{tourCount} tour</div>
                  </div>
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <ArrowRight size={12} className="text-white"/>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── 5. TOUR NỔI BẬT carousel (từ /api/tours) ──────────────────── */}
      <section className="py-10 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-black text-[9px] tracking-[0.25em] uppercase mb-3">
              <span className="w-8 h-0.5 bg-indigo-600"/> Được yêu thích
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tight leading-none">
              Tour <span className="text-indigo-600">Nổi Bật</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setFeaturedIdx(p => Math.max(0, p - 1))} disabled={featuredIdx === 0}
              className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-30 transition-all">
              <ArrowRight size={16} className="rotate-180"/>
            </button>
            <button onClick={() => setFeaturedIdx(p => Math.min(maxIdx, p + 1))} disabled={featuredIdx >= maxIdx}
              className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-30 transition-all">
              <ArrowRight size={16}/>
            </button>
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center py-24"><Loader2 className="animate-spin text-indigo-600" size={40}/></div>
        ) : (
          <div className="overflow-hidden">
            <div className="grid gap-6" style={{
              gridTemplateColumns: `repeat(${featuredTours.length}, calc((100% - ${(VISIBLE-1)*24}px) / ${VISIBLE}))`,
              transform: `translateX(calc(-${featuredIdx} * (100% / ${featuredTours.length}) * ${VISIBLE} - ${featuredIdx * 24}px))`,
              transition: 'transform 0.5s cubic-bezier(.22,1,.36,1)',
            }}>
              {featuredTours.map((tour, i) => <TourCard key={tour.id} tour={tour} index={i}/>)}
            </div>
          </div>
        )}
        <div className="mt-10 flex justify-center">
          <button onClick={() => navigate('/tours')} className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg">
            Xem tất cả tour <ArrowRight size={16}/>
          </button>
        </div>
      </section>

      {/* ── 6. BANNER CTA ──────────────────────────────────────────────── */}
      <section className="mx-6 md:mx-12 my-10 rounded-[2.5rem] overflow-hidden relative h-64 md:h-80">
        <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600" className="w-full h-full object-cover" alt="CTA"/>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-indigo-800/70 to-transparent"/>
        <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-16">
          <div className="text-indigo-300 text-[9px] font-black uppercase tracking-[0.25em] mb-3">Ưu đãi đặc biệt</div>
          <h3 className="text-white text-2xl md:text-4xl font-black uppercase italic leading-tight mb-4 max-w-md">
            Giảm 20% cho<br/>đặt tour sớm hè 2026
          </h3>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/tours')} className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all">Đặt ngay</button>
            <button className="flex items-center gap-2 text-white/80 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
              <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center"><Play size={12} fill="white"/></div>
              Xem video
            </button>
          </div>
        </div>
      </section>

      {/* ── 7. TIN TỨC (từ /api/newsposts, ẩn nếu không có data) ─────── */}
      {news.length > 0 && (
        <section className="py-10 px-6 md:px-12 max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 font-black text-[9px] tracking-[0.25em] uppercase mb-3">
                <span className="w-8 h-0.5 bg-indigo-600"/> Cẩm nang du lịch
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tight leading-none">
                Kinh Nghiệm <span className="text-indigo-600">Du Lịch</span>
              </h2>
            </div>
            <button onClick={() => navigate('/news')} className="hidden md:flex items-center gap-2 text-xs font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">
              Tất cả <ChevronRight size={16}/>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((post, i) => (
              <div key={post.id} onClick={() => navigate(`/news/${post.slug}`)}
                className="group bg-white rounded-[1.5rem] overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  {post.thumbnailUrl ? (
                    <img src={getImgUrl(post.thumbnailUrl)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title}
                      onError={(e: any) => { e.target.src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600"; }}/>
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${CAT_GRADIENTS[i % CAT_GRADIENTS.length]}`}/>
                  )}
                  <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">
                    {post.category?.name || 'Du lịch'}
                  </span>
                </div>
                <div className="p-5">
                  {post.publishedAt && (
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-3">
                      {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
                    </div>
                  )}
                  <h4 className="text-sm font-black text-slate-800 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors mb-2">{post.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-4">{post.summary}</p>
                  <div className="flex items-center gap-1 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                    Đọc tiếp <ChevronRight size={12}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 8. TRUST SECTION ───────────────────────────────────────────── */}
      <section className="bg-slate-900 py-20 px-6 md:px-20 mt-10 rounded-t-[3rem] md:rounded-t-[5rem]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 text-indigo-400 font-black text-[9px] tracking-[0.25em] uppercase mb-4">
              <span className="w-8 h-0.5 bg-indigo-400"/> Tại sao chọn chúng tôi <span className="w-8 h-0.5 bg-indigo-400"/>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic mb-4">Cam Kết Của TravelGo</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">Chúng tôi cam kết mang lại trải nghiệm du lịch tuyệt vời nhất — từ chất lượng dịch vụ đến sự an tâm tuyệt đối.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { icon: <ShieldCheck size={28} className="text-blue-400"/>,  title: 'Bảo hiểm du lịch',   desc: 'An tâm với gói bảo hiểm lên đến 1 tỷ đồng cho mỗi hành trình.' },
              { icon: <ThumbsUp size={28} className="text-emerald-400"/>,  title: 'Chất lượng dịch vụ', desc: 'Hệ thống đối tác khách sạn và resort 4–5 sao toàn cầu.' },
              { icon: <CreditCard size={28} className="text-purple-400"/>, title: 'Giá cả minh bạch',   desc: 'Không chi phí ẩn, thanh toán linh hoạt, nhiều ưu đãi hấp dẫn.' },
              { icon: <Headphones size={28} className="text-amber-400"/>,  title: 'Hỗ trợ tận tâm',    desc: 'Đội ngũ chăm sóc khách hàng sẵn sàng hỗ trợ bạn 24/7.' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-4 group">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600/20 group-hover:border-indigo-500/40 transition-all duration-300">
                  {item.icon}
                </div>
                <h4 className="text-base font-black text-white uppercase italic">{item.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
