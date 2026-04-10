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
  CreditCard,
  Users
} from 'lucide-react';

// 1. Định nghĩa kiểu dữ liệu cho Tour
interface Tour {
  id: number;
  title: string;
  description?: string;
  images: string[];
  price: string;
  duration: string;
  location: string;
  rating: number;
  status: string;
  departure: string;
}

const Home = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const isLoggedIn = !!localStorage.getItem('token');

  const banners = [
    { id: 1, url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80", title: "KHÁM PHÁ THẾ GIỚI", subtitle: "Trải nghiệm những chuyến đi đẳng cấp nhất." },
    { id: 2, url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1920&q=80", title: "HÀNH TRÌNH MƠ ƯỚC", subtitle: "Dịch vụ tận tâm, kỷ niệm khó quên." }
  ];

  const featuredTours: Tour[] = [
    { 
      id: 1, 
      title: "CẦN THƠ SÔNG NƯỚC", 
      description: "Chợ nổi Cái Răng",
      images: [
        "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=400",
        "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400"
      ], 
      price: "2.500.000", 
      duration: "3N2Đ", 
      location: "TP.HCM", 
      rating: 4.9,
      status: "CÒN CHỖ",
      departure: "Hàng ngày"
    },
    { 
      id: 2, 
      title: "VŨNG TÀU CUỐI TUẦN", 
      description: "Biển xanh thành phố",
      images: [
        "https://images.unsplash.com/photo-1589148491244-9388147d10fc?w=400",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400"
      ], 
      price: "1.200.000", 
      duration: "2N1Đ", 
      location: "TP.HCM", 
      rating: 4.8,
      status: "CÒN CHỖ",
      departure: "Thứ 7 hàng tuần"
    },
    { 
      id: 3, 
      title: "NINH BÌNH TRÀNG AN", 
      description: "Tuyệt tác thiên nhiên",
      images: [
        "https://images.unsplash.com/photo-1590333746438-d81fd037a112?w=400",
        "https://images.unsplash.com/photo-1528127269322-539801943592?w=400"
      ], 
      price: "3.200.000", 
      duration: "4N3Đ", 
      location: "Hà Nội", 
      rating: 5.0,
      status: "CÒN CHỖ",
      departure: "Hàng ngày"
    }
  ];

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
    <div className="w-full animate-fadeIn bg-white">
      {/* 1. HERO BANNER - FULL SCREEN WIDTH & HEIGHT */}
      <section className="relative h-[100vh] w-full overflow-hidden">
        {banners.map((b, i) => (
          <div key={b.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
            <img src={b.url} className={`w-full h-full object-cover transition-transform duration-[7000ms] ${i === currentIndex ? "scale-110" : "scale-100"}`} alt="Banner" />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4 text-white">
              {/* SỬA LỖI: Giảm kích thước chữ tiêu đề từ text-9xl xuống text-6xl */}
              <h2 className="text-4xl md:text-6xl font-black mb-4 italic tracking-tighter uppercase leading-none drop-shadow-lg">
                {b.title}
              </h2>
              {/* SỬA LỖI: Giảm kích thước chữ phụ đề từ text-3xl xuống text-xl */}
              <p className="text-lg md:text-xl mb-10 max-w-3xl font-medium drop-shadow-md opacity-90 leading-relaxed">
                {b.subtitle}
              </p>
              <Link to="/tours" className="bg-blue-600 px-10 py-4 rounded-full font-black uppercase tracking-[0.2em] hover:bg-white hover:text-blue-600 transition-all shadow-lg flex items-center gap-3 text-base group">
                Khám phá ngay 
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* 2. TOUR NỔI BẬT - TRÀN VIỀN CÓ PADDING */}
      <section className="py-24 px-6 md:px-16 lg:px-24 bg-slate-50">
        <div className="w-full flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="flex-1">
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 uppercase italic leading-[0.8] tracking-tighter">
              KHÁM PHÁ <br />
              <span className="text-blue-600 font-normal opacity-80">HÀNH TRÌNH</span>
            </h3>
            <div className="h-1.5 w-24 bg-blue-600 mt-6 rounded-full"></div>
          </div>
          <p className="text-gray-400 font-black text-xs uppercase tracking-[0.3em] border-l-4 border-blue-600 pl-6 py-2">
            Top 10 chuyến đi <br /> đặc sắc nhất
          </p>
        </div>

        {/* Grid Container - Chiếm tối đa không gian */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {featuredTours.map((tour) => (
            <div 
              key={tour.id} 
              onClick={() => handleViewDetail(tour.id)} 
              className="bg-white rounded-[2.5rem] p-7 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer group border border-gray-100 flex flex-col justify-between"
            >
              <div className="flex justify-between gap-5 mb-7">
                <div className="flex-1">
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-600 w-fit px-2.5 py-1 rounded-full mb-3 shadow-sm border border-amber-100">
                    <Star size={12} className="fill-amber-600" />
                    <span className="text-[11px] font-black">{tour.rating}</span>
                  </div>
                  <h4 className="text-xl font-black text-gray-900 uppercase leading-tight mb-2.5 group-hover:text-blue-600 transition-colors">
                    {tour.title}
                  </h4>
                  <p className="text-xs text-gray-400 font-medium italic leading-relaxed line-clamp-2">
                    {tour.description}
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  <img src={tour.images[0]} className="w-20 h-20 object-cover rounded-2xl shadow-md border-2 border-white group-hover:rotate-3 transition-transform" alt="thumb" />
                  <img src={tour.images[1]} className="w-20 h-20 object-cover rounded-2xl shadow-md border-2 border-white group-hover:-rotate-3 transition-transform" alt="thumb" />
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 mb-8">
                <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 uppercase tracking-widest border border-blue-100">
                  <MapPin size={11} /> {tour.location}
                </span>
                <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-3.5 py-1.5 rounded-xl uppercase tracking-widest border border-orange-100 italic">
                  🔥 Best Seller
                </span>
              </div>

              <div className="pt-7 border-t border-dashed border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2.5 rounded-xl text-slate-400 shadow-inner">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Khởi hành</p>
                    <p className="text-[11px] font-black text-gray-700">{tour.departure}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div className="bg-green-50 p-2.5 rounded-xl text-green-500 shadow-inner">
                    <Users size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Trạng thái</p>
                    <p className="text-[11px] font-black text-green-600 uppercase tracking-tighter">{tour.status}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TẠI SAO CHỌN - FULL WIDTH */}
      <section className="bg-white py-24 px-6">
        <div className="w-full text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter italic">
            Tại sao chọn Travel<span className="text-blue-600 font-normal">Go</span>?
          </h2>
          <p className="text-gray-400 font-bold uppercase tracking-[0.4em] mt-3 text-xs">Chất lượng tạo nên thương hiệu</p>
        </div>
        
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <Feature icon={<Map />} title="Đa dạng tour" color="blue" />
          <Feature icon={<ShieldCheck />} title="An toàn tuyệt đối" color="green" />
          <Feature icon={<CreditCard />} title="Giá tốt nhất" color="orange" />
        </div>
      </section>
    </div>
  );
};

const Feature = ({ icon, title, color }: { icon: any, title: string, color: string }) => {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 shadow-[0_10px_30px_rgba(37,99,235,0.1)]", 
    green: "bg-green-50 text-green-600 shadow-[0_10px_30px_rgba(34,197,94,0.1)]", 
    orange: "bg-orange-50 text-orange-600 shadow-[0_10px_30px_rgba(249,115,22,0.1)]"   
  };
  
  return (
    <div className="flex flex-col items-center group text-center p-10 rounded-[3rem] hover:bg-slate-50 transition-all duration-300">
      <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-8 transition-all duration-300 group-hover:rotate-12 group-hover:scale-105 ${colorClasses[color]}`}>
        {React.cloneElement(icon, { strokeWidth: 1.2, size: 40 })}
      </div>
      <h4 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-wider">{title}</h4>
      <p className="text-gray-400 text-sm leading-relaxed max-w-xs font-medium px-2">
        Cam kết mang lại những trải nghiệm dịch vụ đẳng cấp nhất cho hành trình của bạn.
      </p>
    </div>
  );
};

export default Home;