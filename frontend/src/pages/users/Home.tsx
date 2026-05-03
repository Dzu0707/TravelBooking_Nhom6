import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MapPin, Star, Loader2, ShieldCheck, Headphones,
  CreditCard, ThumbsUp, ArrowRight,
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

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5091";

const getImgUrl = (url?: string) => {
  if (!url) return "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800";
  if (url.startsWith("http")) return url;
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
};

const CAT_GRADIENTS = [
  'from-blue-500 to-cyan-400',
  'from-rose-500 to-pink-400',
  'from-emerald-500 to-teal-400',
  'from-amber-500 to-orange-400',
  'from-violet-500 to-purple-400',
  'from-indigo-500 to-blue-400',
];

export const TourCard = ({ tour }: { tour: Tour }) => {
  const navigate = useNavigate();
  const imgs = tour.tourImages || [];
  const mainImg = imgs.find(i => i.isPrimary)?.imageUrl || imgs[0]?.imageUrl || tour.imageUrl;
  const secondImg = imgs.filter(i => !i.isPrimary)[0]?.imageUrl || mainImg;

  return (
    <div
      className="group relative bg-white rounded-[2rem] overflow-hidden cursor-pointer flex flex-col"
      style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.06)', transition: 'all .35s ease' }}
      onClick={() => navigate(`/tours/${tour.id}`)}
    >
      <div className="relative h-52 grid grid-cols-3 gap-1.5 p-1.5">
        <div className="col-span-2 relative overflow-hidden rounded-[1.25rem]">
          <img src={getImgUrl(mainImg)} alt={tour.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <span className="absolute top-3 left-3 bg-white/90 text-[9px] font-black uppercase px-2.5 py-1 rounded-lg">{tour.code}</span>
          <span className="absolute bottom-3 left-3 flex items-center gap-1 bg-amber-400 text-white text-[9px] font-black px-2 py-1 rounded-lg">
            <Star size={9} fill="white" /> {tour.rating || '4.9'}
          </span>
        </div>
        <div className="col-span-1 grid grid-rows-2 gap-1.5">
          <div className="rounded-[0.85rem] overflow-hidden bg-slate-100">
            <img src={getImgUrl(secondImg)} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="rounded-[0.85rem] overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-black">
            {tour.code}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-2 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-2">
          <MapPin size={11} className="text-rose-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{tour.departureLocation}</span>
        </div>
        <h3 className="text-base font-black text-slate-900 line-clamp-1 mb-2 group-hover:text-indigo-600">{tour.name}</h3>
        <p className="text-[11px] text-slate-400 line-clamp-2 mb-4 flex-1">{tour.description || 'Khám phá hành trình đáng nhớ cùng TravelGo.'}</p>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[9px] font-black uppercase text-slate-400">Giá từ</div>
            <div className="text-xl font-black text-indigo-600">{(tour.minPrice || 0).toLocaleString('vi-VN')}đ</div>
          </div>
          <button
            className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-indigo-600"
            onClick={(e) => { e.stopPropagation(); navigate(`/tours/${tour.id}`); }}
          >
            <ArrowRight size={16}/>
          </button>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [news, setNews] = useState<NewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [featuredIdx] = useState(0);

  // Banner dùng ảnh thật từ tour có sẵn
  const bannerImages = tours
    .slice(0, 4)
    .map(t => t.tourImages?.find(i => i.isPrimary)?.imageUrl || t.imageUrl)
    .filter(Boolean)
    .map(getImgUrl);

  const banners = bannerImages.length > 0 ? [
    { url: bannerImages[0], tag: "TRAVELGO 2026", title: "Khám Phá Hành Trình Tiếp Theo", subtitle: "Dữ liệu tour thực tế, giá minh bạch, lịch trình rõ ràng." },
    { url: bannerImages[1] || bannerImages[0], tag: "ƯU ĐÃI MỚI", title: "Đi Nhiều Hơn - Tiết Kiệm Hơn", subtitle: "Săn deal theo lịch khởi hành thật từ hệ thống." }
  ] : [
    { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070", tag: "TRAVELGO 2026", title: "Khám Phá Hành Trình Tiếp Theo", subtitle: "Trải nghiệm du lịch đẳng cấp." },
    { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070", tag: "ƯU ĐÃI MỚI", title: "Kỳ Nghỉ Trong Mơ", subtitle: "Giá tốt - Lịch rõ ràng." }
  ];

  useEffect(() => {
    const t = setInterval(() => setCurrentBanner(p => (p + 1) % banners.length), 6000);
    return () => clearInterval(t);
  }, [banners.length]);

  useEffect(() => {
    Promise.all([
      axios.get(`${API_BASE}/api/tours`),
      axios.get(`${API_BASE}/api/categories`),
      axios.get(`${API_BASE}/api/newsposts`).catch(() => ({ data: [] })),
    ])
      .then(([toursRes, catsRes, newsRes]) => {
        setTours(toursRes.data || []);
        setCategories(catsRes.data || []);
        setNews((newsRes.data || []).slice(0, 3));
      })
      .finally(() => setIsLoading(false));
  }, []);

  const featuredTours = tours.slice(0, 6);
  const VISIBLE = 3;

  const getCatImg = (catId: number) => {
    const tour = tours.find(t => t.categoryId === catId);
    const main = tour?.tourImages?.find(i => i.isPrimary)?.imageUrl || tour?.tourImages?.[0]?.imageUrl || tour?.imageUrl;
    return getImgUrl(main);
  };

  return (
    <div className="bg-[#f8fafc] font-sans">
      {/* Banner */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden bg-slate-900">
        {banners.map((bn, index) => (
          <div key={index} className={`absolute inset-0 transition-all duration-[1200ms] ${index === currentBanner ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}>
            <img src={bn.url} className="w-full h-full object-cover" alt="Banner"/>
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/40"/>
          </div>
        ))}
        <div className="relative z-10 text-center text-white px-6">
          <div className="inline-block bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] mb-6 uppercase">{banners[currentBanner].tag}</div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4">{banners[currentBanner].title}</h1>
          <p className="text-lg text-gray-100 max-w-2xl mx-auto">{banners[currentBanner].subtitle}</p>
        </div>
      </section>

      {/* Bỏ SEARCH theo yêu cầu */}

      {/* Categories */}
      <section className="py-14 px-6 md:px-12 max-w-[1440px] mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8">Loại Hình Du Lịch</h2>
        {isLoading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-600" /></div> : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <div key={cat.id} onClick={() => navigate(`/tours?category=${cat.id}`)} className="relative rounded-[1.5rem] overflow-hidden cursor-pointer group aspect-[3/4]">
                <img src={getCatImg(cat.id)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={cat.name}/>
                <div className={`absolute inset-0 bg-gradient-to-br ${CAT_GRADIENTS[i % CAT_GRADIENTS.length]} opacity-45`} />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="font-black text-sm">{cat.name}</div>
                  <div className="text-[10px] opacity-80">{tours.filter(t => t.categoryId === cat.id).length} tour</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured tours */}
      <section className="py-10 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">Tour Nổi Bật</h2>
          <button onClick={() => navigate('/tours')} className="text-indigo-600 font-bold">Xem tất cả</button>
        </div>
        {isLoading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={36}/></div> : (
          <div className="overflow-hidden">
            <div
              className="grid gap-6 transition-transform duration-500"
              style={{
                gridTemplateColumns: `repeat(${featuredTours.length}, calc((100% - ${(VISIBLE - 1) * 24}px) / ${VISIBLE}))`,
                transform: `translateX(calc(-${featuredIdx} * (100% / ${featuredTours.length}) * ${VISIBLE} - ${featuredIdx * 24}px))`
              }}
            >
              {featuredTours.map(t => <TourCard key={t.id} tour={t} />)}
            </div>
          </div>
        )}
      </section>

      {/* NEWS */}
      {news.length > 0 && (
        <section className="py-10 px-6 md:px-12 max-w-[1440px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8">Kinh Nghiệm Du Lịch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((post) => (
              <div key={post.id} onClick={() => navigate(`/news/${post.slug}`)} className="bg-white rounded-[1.5rem] overflow-hidden cursor-pointer hover:-translate-y-1 transition-all shadow-sm hover:shadow-xl">
                <div className="h-48 overflow-hidden">
                  <img src={getImgUrl(post.thumbnailUrl)} className="w-full h-full object-cover" alt={post.title}/>
                </div>
                <div className="p-5">
                  <h4 className="font-black text-slate-800 line-clamp-2 mb-2">{post.title}</h4>
                  <p className="text-sm text-slate-500 line-clamp-2">{post.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CAM KẾT - bản sáng, thu hút */}
      <section className="py-20 px-6 md:px-16 bg-gradient-to-b from-indigo-50 via-white to-cyan-50 mt-12 rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">Cam Kết Từ TravelGo</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Dịch vụ minh bạch, dữ liệu thật, hỗ trợ nhanh và trải nghiệm an toàn cho mọi hành trình.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <ShieldCheck size={26} className="text-blue-600"/>, title: 'An toàn & bảo hiểm', desc: 'Hỗ trợ bảo hiểm du lịch và quy trình xử lý rõ ràng.' },
              { icon: <ThumbsUp size={26} className="text-emerald-600"/>, title: 'Dịch vụ chất lượng', desc: 'Đối tác khách sạn/xe/điểm tham quan đã được chọn lọc.' },
              { icon: <CreditCard size={26} className="text-purple-600"/>, title: 'Giá minh bạch', desc: 'Không phí ẩn, thông tin giá và lịch hiển thị rõ trên hệ thống.' },
              { icon: <Headphones size={26} className="text-amber-600"/>, title: 'Hỗ trợ nhanh', desc: 'Đội ngũ CSKH phản hồi sớm trong giờ làm việc.' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4">{item.icon}</div>
                <h4 className="text-lg font-black text-slate-900 mb-2">{item.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;