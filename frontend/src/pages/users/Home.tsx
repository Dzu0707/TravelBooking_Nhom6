import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  MapPin,
  Loader2,
  Search,
  ShieldCheck,
  Headphones,
  CreditCard,
  ThumbsUp,
  ArrowRight,
  Compass,
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

const Home = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State cho bộ lọc
  const [searchKey, setSearchKey] = useState("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  
  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = [
    {
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070",
      tag: "XU HƯỚNG 2026",
      title: "Khám Phá Hành Trình \n Tiếp Theo Của Bạn",
      subtitle: "Trải nghiệm những vùng đất mới với mức giá ưu đãi nhất thị trường."
    },
    {
      url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070",
      tag: "ƯU ĐÃI ĐẶC BIỆT",
      title: "Tận Hưởng Kỳ Nghỉ \n Trong Mơ Tại Bali",
      subtitle: "Combo nghỉ dưỡng 5 sao cùng hướng dẫn viên bản địa chuyên nghiệp."
    }
  ];

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
    if (category) params.append("category", category);
    navigate(`/tours?${params.toString()}`);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Gọi song song API Tour và API News nổi bật
        const [tourRes, newsRes] = await Promise.all([
            axios.get(`${API_BASE}/api/tours`),
            axios.get(`${API_BASE}/api/news?isFeatured=true`)
        ]);
        setTours(tourRes.data.slice(0, 4));
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
    <div className="bg-[#f8fafc]">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] w-full flex flex-col items-center justify-center overflow-hidden bg-slate-900">
        {banners.map((bn, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-all duration-[1500ms] ease-out ${
              index === currentBanner ? "opacity-100 scale-100" : "opacity-0 scale-110"
            }`}
          >
            <img src={bn.url} className="w-full h-full object-cover" alt="Banner" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/20"></div>
          </div>
        ))}

        <div className="relative z-10 w-full max-w-6xl px-6 text-center text-white pb-20">
          <div className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] mb-6 uppercase">
            {banners[currentBanner].tag}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 drop-shadow-2xl whitespace-pre-line">
            {banners[currentBanner].title}
          </h1>
          <p className="text-lg md:text-xl text-gray-100 font-medium max-w-2xl mx-auto opacity-90">
            {banners[currentBanner].subtitle}
          </p>
        </div>
      </section>

      {/* 2. THANH TÌM KIẾM */}
      <section className="relative -mt-20 z-30 px-6">
        <form 
          onSubmit={handleSearch}
          className="max-w-6xl mx-auto bg-white p-3 rounded-2xl lg:rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col lg:flex-row items-center gap-2 border border-gray-100"
        >
          <div className="flex-[1.5] flex items-center gap-4 px-6 py-2 w-full lg:border-r border-gray-100">
            <MapPin className="text-blue-500 shrink-0" size={24} />
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Điểm đến</p>
              <input 
                type="text" 
                placeholder="Bạn muốn đi đâu?" 
                className="w-full bg-transparent outline-none text-gray-800 text-base font-semibold placeholder:text-gray-300" 
                value={searchKey} 
                onChange={(e) => setSearchKey(e.target.value)} 
              />
            </div>
          </div>

          <div className="flex-1 flex items-center gap-4 px-6 py-2 w-full lg:border-r border-gray-100">
            <CreditCard className="text-blue-500 shrink-0" size={24} />
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ngân sách</p>
              <select 
                className="w-full bg-transparent outline-none text-gray-800 text-base font-semibold cursor-pointer"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              >
                <option value="">Tất cả mức giá</option>
                <option value="2000000">Dưới 2 Triệu</option>
                <option value="5000000">Dưới 5 Triệu</option>
                <option value="10000000">Dưới 10 Triệu</option>
              </select>
            </div>
          </div>

          <div className="flex-1 flex items-center gap-4 px-6 py-2 w-full lg:border-r border-gray-100">
            <Compass className="text-blue-500 shrink-0" size={24} />
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Loại hình</p>
              <select 
                className="w-full bg-transparent outline-none text-gray-800 text-base font-semibold cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Tất cả thể loại</option>
                <option value="1">Du lịch biển</option>
                <option value="2">Khám phá núi</option>
              </select>
            </div>
          </div>
          
          <button type="submit" className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl lg:rounded-full font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-200 active:scale-95 shrink-0">
            <Search size={20} />
            <span className="text-lg">Tìm kiếm</span>
          </button>
        </form>
      </section>

      {/* 3. TOUR LIST */}
      <section className="py-24 px-6 md:px-20 max-w-[1440px] mx-auto">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Tour Mới Nhất</h2>
          <Link to="/tours" className="text-blue-600 font-bold hover:underline flex items-center gap-2">Xem tất cả <ArrowRight size={18}/></Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={48} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {tours.map((tour) => (
              <div key={tour.id} onClick={() => navigate(`/tours/${tour.id}`)} className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 transition-all hover:-translate-y-2 cursor-pointer shadow-sm hover:shadow-xl">
                 <div className="aspect-[1/1] overflow-hidden">
                    <img src={getFullImageUrl(tour.imageUrl)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={tour.name} />
                 </div>
                 <div className="p-8">
                    <h3 className="text-xl font-bold mb-2">{tour.name}</h3>
                    <p className="text-blue-600 font-bold">{tour.minPrice?.toLocaleString()}đ</p>
                 </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. FEATURED NEWS SECTION */}
      {news.length > 0 && (
        <section className="py-24 px-6 md:px-20 max-w-[1440px] mx-auto bg-white rounded-[3rem] my-10">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-black text-gray-900">Tin tức nổi bật</h2>
              <p className="text-gray-500 mt-2">Cập nhật những xu hướng du lịch mới nhất.</p>
            </div>
            <Link to="/news" className="text-blue-600 font-bold hover:underline flex items-center gap-2">Xem tất cả <ArrowRight size={18}/></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {news.map((item) => (
              <Link key={item.id} to={`/news/${item.slug}`} className="group block">
                <div className="overflow-hidden rounded-2xl mb-4 h-60">
                  <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5. TRUST SECTION */}
      <section className="bg-slate-900 py-20 px-6 md:px-20 rounded-t-[3rem] md:rounded-t-[5rem]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
            <FeatureItem icon={<ShieldCheck className="text-blue-400" />} title="Bảo hiểm du lịch" desc="An tâm với gói bảo hiểm lên đến 1 tỷ đồng." />
            <FeatureItem icon={<ThumbsUp className="text-green-400" />} title="Chất lượng dịch vụ" desc="Hệ thống đối tác khách sạn 4-5 sao toàn cầu." />
            <FeatureItem icon={<CreditCard className="text-purple-400" />} title="Giá cả minh bạch" desc="Không chi phí ẩn, nhiều ưu đãi hấp dẫn." />
            <FeatureItem icon={<Headphones className="text-orange-400" />} title="Hỗ trợ tận tâm" desc="Đội ngũ CSKH sẵn sàng giúp đỡ 24/7." />
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
