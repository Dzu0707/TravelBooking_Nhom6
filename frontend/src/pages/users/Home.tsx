import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  MapPin,
  Loader2,
  ShieldCheck,
  Headphones,
  CreditCard,
  ThumbsUp,
  Newspaper
} from 'lucide-react';

interface Tour {
  id: number;
  name: string;
  code: string;
  imageUrl: string;
  departureLocation: string;
  rating?: number;
  minPrice?: number;
}

interface News {
  id: number;
  title: string;
  summary: string;
  thumbnailUrl: string;
  slug: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchKey, setSearchKey] = useState("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  // Đã xóa category vì bạn không dùng đến biến này để filter trong UI hiện tại

  const bannerUrl = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070";
  const API_BASE = "http://localhost:5091";

  const getFullImageUrl = (path: string) => {
    if (!path) return "https://via.placeholder.com/400x300?text=No+Image";
    if (path.startsWith('http')) return path;
    return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKey.trim()) params.append("search", searchKey.trim());
    if (maxPrice) params.append("maxPrice", maxPrice);
    navigate(`/tours?${params.toString()}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [tourRes, newsRes] = await Promise.all([
          axios.get(`${API_BASE}/api/tours`),
          axios.get(`${API_BASE}/api/news?isFeatured=true`)
        ]);
        setTours(tourRes.data.slice(0, 3));
        setNews(newsRes.data.slice(0, 3));
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* 1. HERO */}
      <section className="relative h-[80vh] w-full flex items-center justify-center bg-slate-900 pb-20">
        <div className="absolute inset-0">
          <img src={bannerUrl} className="w-full h-full object-cover" alt="Banner" />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <h1 className="relative z-10 text-4xl md:text-6xl font-extrabold text-white text-center drop-shadow-lg">
          Khám Phá Hành Trình <br /> Tiếp Theo Của Bạn
        </h1>
      </section>

      {/* 2. SEARCH BAR */}
      <section className="relative -mt-16 z-40 px-6">
        <form onSubmit={handleSearch} className="max-w-5xl mx-auto bg-white p-2 rounded-2xl shadow-xl flex flex-col lg:flex-row items-center gap-2 border border-gray-100">
          <div className="flex-[1.5] flex items-center gap-4 px-6 py-3 w-full lg:border-r border-gray-100">
            <MapPin className="text-blue-500" size={20} />
            <input type="text" placeholder="Bạn muốn đi đâu?" className="w-full bg-transparent outline-none text-gray-800" value={searchKey} onChange={(e) => setSearchKey(e.target.value)} />
          </div>
          <div className="flex-1 flex items-center gap-4 px-6 py-3 w-full lg:border-r border-gray-100">
            <CreditCard className="text-blue-500" size={20} />
            <select className="w-full bg-transparent outline-none text-gray-800 cursor-pointer" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
                <option value="">Ngân sách</option>
                <option value="5000000">Dưới 5 Triệu</option>
                <option value="10000000">Dưới 10 Triệu</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Tìm kiếm</button>
        </form>
      </section>

      {/* 3. TOUR LIST */}
      <section className="py-24 px-6 md:px-20 max-w-[1440px] mx-auto">
        <h2 className="text-4xl font-black mb-16">Tour Mới Nhất</h2>
        {isLoading ? <Loader2 className="animate-spin mx-auto" size={48} /> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {tours.map((t) => (
              <div key={t.id} onClick={() => navigate(`/tours/${t.id}`)} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl cursor-pointer">
                 <img src={getFullImageUrl(t.imageUrl)} className="w-full h-64 object-cover" alt={t.name} />
                 <div className="p-8">
                    <h3 className="text-xl font-bold mb-2">{t.name}</h3>
                    <p className="text-blue-600 font-bold">{t.minPrice?.toLocaleString()}đ</p>
                 </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. NEWS */}
      {news.length > 0 && (
        <section className="py-20 px-6 md:px-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <Newspaper className="text-blue-600" size={32} />
              <h2 className="text-3xl font-black text-gray-900 uppercase">Tin tức</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {news.map((n) => (
                <Link key={n.id} to={`/news/${n.slug}`} className="bg-gray-50 rounded-3xl p-6 hover:shadow-lg transition">
                  <h3 className="font-bold text-lg mb-2">{n.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{n.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. TRUST */}
      <section className="bg-slate-900 py-20 px-6 md:px-20 rounded-t-[3rem] text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
            <FeatureItem icon={<ShieldCheck className="text-blue-400" />} title="Bảo hiểm" desc="An tâm 1 tỷ." />
            <FeatureItem icon={<ThumbsUp className="text-green-400" />} title="Chất lượng" desc="Đối tác 5 sao." />
            <FeatureItem icon={<CreditCard className="text-purple-400" />} title="Minh bạch" desc="Không chi phí ẩn." />
            <FeatureItem icon={<Headphones className="text-orange-400" />} title="Hỗ trợ" desc="Tận tâm 24/7." />
        </div>
      </section>
    </div>
  );
};

const FeatureItem = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="flex flex-col items-center space-y-4">
    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">{icon}</div>
    <h4 className="text-lg font-bold text-white">{title}</h4>
    <p className="text-slate-400 text-sm">{desc}</p>
  </div>
);

export default Home;