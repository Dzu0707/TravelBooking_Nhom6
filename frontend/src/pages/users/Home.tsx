import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  MapPin,
  Star,
  ArrowRight,
  Map,
  ShieldCheck,
  CreditCard,
  Loader2,
  Search,
  Calendar
} from 'lucide-react';

interface Tour {
  id: number;
  name: string;
  code: string;
  imageUrl: string;
  departureLocation: string;
  description?: string;
  categoryId: number;
  rating?: number;
  minPrice?: number;
}

const Home = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  
  const isLoggedIn = !!localStorage.getItem('token');
  const API_BASE = "http://localhost:5091";

  const banner = {
    url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070",
    title: "Khám Phá Hành Trình Tiếp Theo",
    subtitle: "Hơn 500+ tour du lịch giá tốt đang chờ đón bạn"
  };

  useEffect(() => {
    const fetchFeaturedTours = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/tours`);
        setTours(response.data.slice(0, 6));
      } catch (error) {
        toast.error("Không thể tải danh sách tour");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeaturedTours();
  }, []);

  const handleTourClick = (tourId: number) => {
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để xem chi tiết tour!");
      navigate('/login');
    } else {
      navigate(`/tours/${tourId}`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchKey.trim()) {
      toast.error("Vui lòng nhập từ khóa tìm kiếm");
      return;
    }
    navigate(`/tours?search=${encodeURIComponent(searchKey.trim())}`);
  };

  const getFullImageUrl = (path: string) => {
    if (!path) return "https://via.placeholder.com/400x300?text=No+Image";
    if (path.startsWith('http')) return path;
    return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  return (
    /* QUAN TRỌNG: pt-[80px] phải khớp với chiều cao Navbar trong App.tsx 
       Nếu Navbar của bạn cao 64px, hãy đổi thành pt-[64px].
    */
    <div className="bg-white pt-[80px]">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[75vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={banner.url} 
            className="w-full h-full object-cover" 
            alt="Du lịch cùng TravelGo"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center">
          <div className="text-center text-white mb-10 animate-fadeInUp">
            <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-2xl uppercase tracking-tight">
              {banner.title}
            </h1>
            <p className="text-lg md:text-xl opacity-90 font-medium">
              {banner.subtitle}
            </p>
          </div>

          {/* KHỐI TÌM KIẾM */}
          <form 
            onSubmit={handleSearch}
            className="w-full bg-white p-2 md:p-3 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2 border border-gray-100 transform transition-all hover:scale-[1.01]"
          >
            <div className="flex-[1.5] flex items-center gap-3 px-6 w-full">
              <Search className="text-blue-600" size={24} />
              <input 
                type="text" 
                placeholder="Bạn muốn đi đâu?" 
                className="w-full py-3 outline-none text-gray-700 font-medium bg-transparent"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
            </div>
            <div className="hidden md:block w-px h-10 bg-gray-200 mx-2"></div>
            <div className="flex-1 hidden md:flex items-center gap-3 px-6">
              <Calendar className="text-blue-600" size={24} />
              <span className="text-gray-400 font-medium italic">Khởi hành: Hàng ngày</span>
            </div>
            <button 
              type="submit"
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-xl md:rounded-full font-bold transition-all shadow-lg active:scale-95"
            >
              Tìm kiếm
            </button>
          </form>
        </div>
      </section>

      {/* 2. FEATURED TOURS SECTION */}
      <section className="py-24 px-6 md:px-20 bg-gray-50">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <h3 className="text-4xl font-black text-gray-900 tracking-tight">Tour nổi bật</h3>
            <p className="text-gray-500 mt-2 text-lg font-medium">Những hành trình được yêu thích nhất tại TravelGo</p>
          </div>
          <Link to="/tours" className="text-blue-600 font-bold hover:text-blue-800 transition-colors py-2 flex items-center gap-2">
            Xem tất cả tour <ArrowRight size={18} />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={48} />
            <p className="text-gray-400 font-medium tracking-wide">Đang tải dữ liệu tour...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {tours.map(tour => (
              <div
                key={tour.id}
                onClick={() => handleTourClick(tour.id)}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 flex flex-col h-full"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={getFullImageUrl(tour.imageUrl)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={tour.name}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-lg text-[10px] font-black uppercase shadow-lg">
                      {tour.code}
                    </span>
                  </div>
                </div>

                <div className="p-7 flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500 flex items-center gap-1.5 font-semibold">
                      <MapPin size={16} className="text-blue-500" /> {tour.departureLocation}
                    </span>
                    <span className="flex items-center gap-1 text-yellow-500 text-sm font-black bg-yellow-50 px-2 py-1 rounded-lg">
                      <Star size={14} fill="currentColor" /> {tour.rating || "5.0"}
                    </span>
                  </div>

                  <h4 className="font-bold text-gray-900 text-xl line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
                    {tour.name}
                  </h4>

                  <p className="text-gray-500 text-sm line-clamp-2 mb-6 italic flex-1">
                    {tour.description || "Hành trình khám phá vẻ đẹp bất tận cùng TravelGo..."}
                  </p>

                  <div className="flex justify-between items-center pt-5 border-t border-gray-100 mt-auto">
                    <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 tracking-wider">Giá chỉ từ</p>
                        <span className="text-blue-600 font-black text-2xl">
                          {tour.minPrice?.toLocaleString()}đ
                        </span>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                        <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className="py-24 px-6 md:px-20 bg-white">
        <div className="grid md:grid-cols-3 gap-12">
          <Feature 
            icon={<Map />} 
            title="Đa dạng lựa chọn" 
            desc="Hơn 1000 tour du lịch trong và ngoài nước, cập nhật liên tục hàng tuần." 
          />
          <Feature 
            icon={<ShieldCheck />} 
            title="An toàn tuyệt đối" 
            desc="Mọi chuyến đi đều có bảo hiểm du lịch và đội ngũ hỗ trợ chuyên nghiệp 24/7." 
          />
          <Feature 
            icon={<CreditCard />} 
            title="Giá luôn tốt nhất" 
            desc="Cam kết giá cạnh tranh nhất thị trường, thanh toán linh hoạt và an toàn." 
          />
        </div>
      </section>
    </div>
  );
};

// Component con cho phần tính năng
const Feature = ({ icon, title, desc }: { icon: any; title: string; desc: string }) => (
  <div className="flex flex-col items-center text-center p-8 rounded-3xl hover:bg-gray-50 transition-all duration-300 group">
    <div className="w-16 h-16 mb-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <h4 className="font-black text-gray-900 text-xl mb-3">{title}</h4>
    <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{desc}</p>
  </div>
);

export default Home;