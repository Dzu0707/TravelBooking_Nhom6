import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  MapPin, 
  Calendar, 
  Star, 
  ArrowRight, 
  Map, 
  ShieldCheck, 
  CreditCard 
} from 'lucide-react';

// 1. Định nghĩa kiểu dữ liệu cho Tour
interface Tour {
  id: number;
  title: string;
  image: string;
  price: string;
  duration: string;
  location: string;
  rating: number;
}

const Home = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // 2. Kiểm tra trạng thái đăng nhập
  const isLoggedIn = !!localStorage.getItem('token');

  // 3. Dữ liệu Banner
  const banners = [
    { id: 1, url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80", title: "KHÁM PHÁ THẾ GIỚI", subtitle: "Trải nghiệm những chuyến đi đẳng cấp nhất." },
    { id: 2, url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1920&q=80", title: "HÀNH TRÌNH MƠ ƯỚC", subtitle: "Dịch vụ tận tâm, kỷ niệm khó quên." }
  ];

  // 4. Dữ liệu Tour nổi bật
  const featuredTours: Tour[] = [
    { id: 1, title: "Vịnh Hạ Long - Kỳ quan", image: "https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=800&q=80", price: "2.500.000", duration: "3N2Đ", location: "Quảng Ninh", rating: 4.9 },
    { id: 2, title: "Đà Lạt Mộng Mơ", image: "https://images.unsplash.com/photo-1589148491244-9388147d10fc?auto=format&fit=crop&w=800&q=80", price: "1.800.000", duration: "2N1Đ", location: "Lâm Đồng", rating: 4.8 },
    { id: 3, title: "Phú Quốc Xanh", image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=800&q=80", price: "3.200.000", duration: "4N3Đ", location: "Kiên Giang", rating: 5.0 }
  ];

  // 5. Hàm xử lý xem chi tiết (Yêu cầu đăng nhập)
  const handleViewDetail = (tourId: number) => {
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để xem chi tiết tour!");
      navigate('/login');
    } else {
      navigate(`/tours/${tourId}`);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentIndex(prev => (prev === banners.length - 1 ? 0 : prev + 1)), 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="w-full animate-fadeIn">
      {/* 1. HERO BANNER */}
      <section className="relative h-screen w-full overflow-hidden">
        {banners.map((b, i) => (
          <div key={b.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
            {/* SỬA LỖI: duration-[7000ms] thành duration-7000 */}
            <img src={b.url} className={`w-full h-full object-cover transition-transform duration-7000 ${i === currentIndex ? "scale-110" : "scale-100"}`} alt="Banner" />
            <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-center px-4 text-white">
              <h2 className="text-5xl md:text-8xl font-black mb-6 italic">{b.title}</h2>
              <p className="text-lg md:text-2xl mb-10 max-w-2xl">{b.subtitle}</p>
              <Link to="/tours" className="bg-blue-600 px-10 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all">Bắt đầu ngay</Link>
            </div>
          </div>
        ))}
      </section>

      {/* 2. TOUR NỔI BẬT */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <h3 className="text-4xl font-black text-gray-800 uppercase italic">Tour Nổi Bật <span className="text-blue-600">TravelGo</span></h3>
            <Link to="/tours" className="text-blue-600 font-bold flex items-center gap-2 hover:text-blue-700 transition-colors">XEM TẤT CẢ <ArrowRight size={20} /></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredTours.map((tour: Tour) => (
              <div 
                key={tour.id} 
                onClick={() => handleViewDetail(tour.id)} 
                className="cursor-pointer group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={tour.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={tour.title} />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                    <Star size={14} className="text-orange-500 fill-orange-500" />
                    <span className="font-bold text-sm text-gray-800">{tour.rating}</span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase mb-2 tracking-wider">
                    <MapPin size={12} /> {tour.location}
                  </div>
                  <h4 className="text-xl font-black text-gray-800 mb-4 line-clamp-1">{tour.title}</h4>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4 font-bold">
                    <Calendar size={14} /> {tour.duration}
                  </div>
                  <div className="flex justify-between items-center mt-6">
                    <p className="text-2xl font-black text-orange-500">{tour.price} <span className="text-xs font-bold text-gray-400">VNĐ</span></p>
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm"><ArrowRight size={20} /></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TẠI SAO CHỌN */}
      <section className="bg-[#F8F9FA] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
              Tại sao chọn Travel<span className="text-blue-600">Go</span>?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature icon={<Map />} title="Đa dạng tour" color="blue" />
            <Feature icon={<ShieldCheck />} title="An toàn" color="green" />
            <Feature icon={<CreditCard />} title="Giá tốt" color="orange" />
          </div>
        </div>
      </section>
    </div>
  );
};

const Feature = ({ icon, title, color }: { icon: any, title: string, color: string }) => {
  const colorClasses: Record<string, string> = {
    blue: "bg-[#F4F7FE] text-[#4379EE]", 
    green: "bg-[#F0FDF4] text-[#22C55E]", 
    orange: "bg-[#FFF7ED] text-[#F97316]"  
  };
  
  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300 border border-gray-50 flex flex-col items-center text-center group">
      {/* SỬA LỖI: w-[72px] h-[72px] thành w-18 h-18 */}
      <div className={`w-18 h-18 rounded-3xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${colorClasses[color]}`}>
        {React.cloneElement(icon, { strokeWidth: 1.5, size: 30 })}
      </div>
      <h4 className="text-[17px] font-black text-gray-900 mb-3 uppercase tracking-wide">{title}</h4>
      <p className="text-gray-500 text-[14px] leading-relaxed px-2">Cam kết mang lại dịch vụ tốt nhất cho hành trình của bạn.</p>
    </div>
  );
};

export default Home;