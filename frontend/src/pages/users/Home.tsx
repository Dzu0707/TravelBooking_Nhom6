import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MapPin,
  Star,
  Loader2,
  Search,
  ShieldCheck,
  Headphones,
  CreditCard,
  ThumbsUp,
  ArrowRight,
  Compass, // Đã thêm Compass vào import
  type LucideProps
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
    const fetchFeaturedTours = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/tours`);
        setTours(response.data.slice(0, 4));
      } catch (error) {
        console.error("Lỗi tải tour:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeaturedTours();
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

        <div className="absolute bottom-5 z-20 flex justify-center gap-3">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setCurrentBanner(i)} className={`h-1 transition-all duration-500 rounded-full ${i === currentBanner ? "w-10 bg-white" : "w-4 bg-white/40"}`} />
          ))}
        </div>
      </section>

      {/* 2. THANH TÌM KIẾM & LỌC TOUR (Nâng cấp lọc thật) */}
      <section className="relative">
        <div className="max-w-6xl mx-auto">
          <form 
            onSubmit={handleSearch}
            className="bg-white p-3 rounded-2xl lg:rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col lg:flex-row items-center gap-2 border border-gray-100"
          >
            {/* Lọc theo Địa điểm */}
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

            {/* Lọc theo Giá tiền */}
            <div className="flex-1 flex items-center gap-4 px-6 py-2 w-full lg:border-r border-gray-100">
              <CreditCard className="text-blue-500 shrink-0" size={24} />
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ngân sách tối đa</p>
                <select 
                  className="w-full bg-transparent outline-none text-gray-800 text-base font-semibold cursor-pointer"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                >
                  <option value="">Tất cả mức giá</option>
                  <option value="2000000">Dưới 2 Triệu</option>
                  <option value="5000000">Dưới 5 Triệu</option>
                  <option value="10000000">Dưới 10 Triệu</option>
                  <option value="20000000">Dưới 20 Triệu</option>
                </select>
              </div>
            </div>

            {/* Lọc theo Loại hình */}
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
                  <option value="3">Nghỉ dưỡng</option>
                  <option value="4">Văn hóa lịch sử</option>
                </select>
              </div>
            </div>
            
            <button type="submit" className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl lg:rounded-full font-bold transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-200 active:scale-95 shrink-0">
              <Search size={20} />
              <span className="text-lg">Tìm kiếm</span>
            </button>
          </form>
        </div>
      </section>

      {/* 3. TOUR LIST - HIỂN THỊ 3 TOUR KHUNG HÌNH GẦN VUÔNG */}
      <section className="py-24 px-6 md:px-20 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs tracking-[0.2em] uppercase mb-3">
               <span className="w-10 h-[2px] bg-blue-600"></span> 
               Hành trình mới nhất
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none">
              Tour <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Mới Nhất</span>
            </h2>
          </div>
          <button 
            onClick={() => navigate('/tours')} 
            className="group flex items-center gap-3 bg-white border-2 border-gray-100 hover:border-blue-600 px-8 py-4 rounded-2xl font-bold text-sm text-gray-600 hover:text-blue-600 transition-all duration-300 shadow-sm hover:shadow-xl"
          >
            Xem tất cả <ArrowRight size={18} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        ) : (
          /* Grid 3 cột cho 3 tour */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {tours.slice(0, 3).map((tour) => (
              <div 
                key={tour.id} 
                onClick={() => navigate(`/tours/${tour.id}`)}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 transition-all duration-500 flex flex-col cursor-pointer hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]"
              >
                {/* Image Container - Thiết lập Aspect Ratio gần vuông */}
                <div className="relative aspect-[1/1] overflow-hidden">
                  <img 
                    src={getFullImageUrl(tour.imageUrl)} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={tour.name} 
                  />
                  
                  {/* Badge & Rating */}
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur-md text-gray-900 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm">
                      {tour.code}
                    </span>
                  </div>
                  <div className="absolute top-6 right-6 bg-blue-600 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                    <Star size={12} className="fill-white" />
                    <span className="text-[11px] font-black">{tour.rating || "5.0"}</span>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-blue-500 mb-4">
                    <MapPin size={14} className="shrink-0" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                      {tour.departureLocation}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-6 line-clamp-2 leading-tight">
                    {tour.name}
                  </h3>

                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mb-1">Giá từ</p>
                      <p className="text-2xl font-black text-gray-900 tracking-tight">
                        {tour.minPrice?.toLocaleString()}<span className="text-blue-600 text-sm ml-0.5 font-bold">đ</span>
                      </p>
                    </div>
                    
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-300">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. TRUST SECTION */}
      <section className="bg-slate-900 py-20 px-6 md:px-20 rounded-t-[3rem] md:rounded-t-[5rem]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Tại sao nên chọn TravelGo?</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Chúng tôi cam kết mang lại trải nghiệm du lịch tuyệt vời nhất cho hành trình của bạn.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <FeatureItem icon={<ShieldCheck className="text-blue-400" />} title="Bảo hiểm du lịch" desc="An tâm với gói bảo hiểm lên đến 1 tỷ đồng." />
            <FeatureItem icon={<ThumbsUp className="text-green-400" />} title="Chất lượng dịch vụ" desc="Hệ thống đối tác khách sạn 4-5 sao toàn cầu." />
            <FeatureItem icon={<CreditCard className="text-purple-400" />} title="Giá cả minh bạch" desc="Không chi phí ẩn, nhiều ưu đãi hấp dẫn." />
            <FeatureItem icon={<Headphones className="text-orange-400" />} title="Hỗ trợ tận tâm" desc="Đội ngũ CSKH sẵn sàng giúp đỡ 24/7." />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureItem = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="flex flex-col items-center text-center space-y-4 group">
    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center transition-all group-hover:bg-blue-600/20 group-hover:border-blue-600/40">
      {React.isValidElement<LucideProps>(icon) ? React.cloneElement(icon, { size: 32 }) : icon}
    </div>
    <h4 className="text-lg font-bold text-white">{title}</h4>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default Home;