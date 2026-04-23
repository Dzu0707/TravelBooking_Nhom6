import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  MapPin, 
  Calendar, 
  Star, 
  ArrowRight, 
  Map, 
  ShieldCheck, 
  CreditCard,
  Users,
  MessageSquare,
  Zap
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // State lưu dữ liệu thật từ API
  const [featuredTours, setFeaturedTours] = useState<any[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://localhost:5091";

  const banners = [
    { id: 1, url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80", title: "KHÁM PHÁ THẾ GIỚI", subtitle: "Trải nghiệm những chuyến đi đẳng cấp và dịch vụ nghỉ dưỡng 5 sao." },
    { id: 2, url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1920&q=80", title: "HÀNH TRÌNH MƠ ƯỚC", subtitle: "Dịch vụ tận tâm, mang lại những kỷ niệm khó quên cho gia đình bạn." }
  ];

  // Hàm chuẩn hóa link ảnh từ Backend
  const getImgUrl = (path: any) => {
    if (!path) return "https://placehold.co/600x400?text=No+Image";
    const finalPath = typeof path === 'string' ? path : (path.imageUrl || path.imagePath);
    if (!finalPath) return "https://placehold.co/600x400?text=No+Image";
    if (finalPath.startsWith('http')) return finalPath;
    const cleanPath = finalPath.startsWith('/') ? finalPath : `/${finalPath}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  // Lấy dữ liệu từ API khi load trang
  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        // Lấy danh sách Tour (Lấy 3 tour mới nhất)
        const toursRes = await axios.get(`${API_BASE_URL}/api/Tours`);
        setFeaturedTours(toursRes.data.slice(0, 3));

        // Lấy danh sách Tin tức (Lấy 3 bài mới nhất đã duyệt)
        const newsRes = await axios.get(`${API_BASE_URL}/api/News`);
        setNewsList(newsRes.data.slice(0, 3));
        
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", error);
        setLoading(false);
      }
    };

    fetchHomepageData();
  }, []);

  // Xử lý chuyển banner tự động
  useEffect(() => {
    const timer = setInterval(() => setCurrentIndex(prev => (prev === banners.length - 1 ? 0 : prev + 1)), 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleViewDetail = (tourId: number) => {
    navigate(`/tours/${tourId}`);
  };

  return (
    <div className="w-full animate-fadeIn bg-white">
      {/* 1. HERO BANNER */}
      <section className="relative h-[90vh] md:h-screen w-full overflow-hidden">
        {banners.map((b, i) => (
          <div key={b.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
            <img src={b.url} className={`w-full h-full object-cover transition-transform duration-[7000ms] ${i === currentIndex ? "scale-110" : "scale-100"}`} alt="Banner" />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4 text-white">
              <h2 className="text-4xl md:text-6xl font-black mb-4 italic tracking-tighter uppercase leading-none drop-shadow-lg">{b.title}</h2>
              <p className="text-lg md:text-xl mb-10 max-w-2xl font-medium drop-shadow-md opacity-90 leading-relaxed">{b.subtitle}</p>
              <Link to="/tours" className="bg-blue-600 px-10 py-4 rounded-full font-black uppercase tracking-[0.2em] hover:bg-white hover:text-blue-600 transition-all shadow-lg flex items-center gap-3 group text-sm">
                Khám phá ngay <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* 2. TOUR NỔI BẬT */}
      <section className="py-24 px-6 md:px-16 lg:px-24 bg-slate-50">
        <div className="w-full flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="flex-1">
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 uppercase italic leading-[0.8] tracking-tighter">
              TOUR <br /><span className="text-blue-600 font-normal opacity-80">NỔI BẬT</span>
            </h3>
            <div className="h-1.5 w-24 bg-blue-600 mt-6 rounded-full"></div>
          </div>
          <p className="text-gray-400 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] border-l-4 border-blue-600 pl-6 py-2">Hành trình trải nghiệm <br /> chất lượng hàng đầu</p>
        </div>

        {loading ? (
            <div className="flex justify-center items-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {featuredTours.map((tour) => {
                // Xử lý logic 3 Hình ảnh (1 chính, 2 phụ)
                const img1 = getImgUrl(tour.imageUrl);
                const img2 = tour.tourImages && tour.tourImages.length > 0 ? getImgUrl(tour.tourImages[0].imageUrl) : img1;
                const img3 = tour.tourImages && tour.tourImages.length > 1 ? getImgUrl(tour.tourImages[1].imageUrl) : img2;
                
                // Trạng thái và Ngày khởi hành
                const firstSchedule = tour.tourSchedules && tour.tourSchedules.length > 0 ? tour.tourSchedules[0] : null;
                const hasSeats = firstSchedule ? firstSchedule.availableSeats > 0 : false;
                const statusText = hasSeats ? "CÒN CHỖ" : "HẾT CHỖ";
                const departureDate = firstSchedule ? new Date(firstSchedule.departureDate || firstSchedule.startDate).toLocaleDateString('vi-VN') : "Hàng ngày";

                // Tính sao trung bình
                const avgRating = tour.reviews?.length > 0 
                    ? (tour.reviews.reduce((acc: number, cur: any) => acc + cur.rating, 0) / tour.reviews.length).toFixed(1)
                    : "4.9";

                return (
                  <div key={tour.id} onClick={() => handleViewDetail(tour.id)} className="bg-white rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer group border border-gray-100 flex flex-col justify-between">
                    <div>
                      
                      {/* BỐ CỤC 3 HÌNH ẢNH MỚI */}
                      <div className="flex gap-2.5 h-56 mb-6">
                        {/* Ảnh Lớn Bên Trái */}
                        <div className="w-[65%] h-full overflow-hidden rounded-[1.5rem] relative">
                          <img 
                            src={img1} 
                            onError={(e: any) => { e.target.src = 'https://placehold.co/400x400?text=Hình+ảnh' }} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 bg-slate-100" 
                            alt={tour.name} 
                          />
                          {/* Rating Badge nổi */}
                          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                            <Star size={12} className="fill-amber-500 text-amber-500" />
                            <span className="text-[11px] font-black text-slate-800">{avgRating}</span>
                          </div>
                        </div>
                        {/* 2 Ảnh Nhỏ Bên Phải */}
                        <div className="w-[35%] flex flex-col gap-2.5 h-full">
                          <div className="h-1/2 w-full overflow-hidden rounded-[1.2rem]">
                            <img 
                              src={img2} 
                              onError={(e: any) => { e.target.src = 'https://placehold.co/200x200?text=+' }} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 bg-slate-100" 
                              alt="sub 1" 
                            />
                          </div>
                          <div className="h-1/2 w-full overflow-hidden rounded-[1.2rem]">
                            <img 
                              src={img3} 
                              onError={(e: any) => { e.target.src = 'https://placehold.co/200x200?text=+' }} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 bg-slate-100" 
                              alt="sub 2" 
                            />
                          </div>
                        </div>
                      </div>

                      {/* Các TAGS (Hà Nội, Bán chạy, Đánh giá) */}
                      <div className="flex flex-wrap gap-2.5 mb-5 items-center">
                        <span className="bg-indigo-50 text-indigo-600 text-[9px] font-black px-3.5 py-1.5 rounded-[0.8rem] flex items-center gap-1.5 uppercase tracking-widest border border-indigo-100/50">
                          <MapPin size={10} /> {tour.departureLocation || "Hà Nội"}
                        </span>
                        <span className="bg-amber-50 text-amber-600 text-[9px] font-black px-3.5 py-1.5 rounded-[0.8rem] uppercase tracking-widest flex items-center gap-1.5 border border-amber-100/50">
                          <Zap size={10} className="fill-amber-500"/> Bán chạy
                        </span>
                        <span className="ml-auto text-slate-400 text-[9px] uppercase tracking-widest font-bold flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                          <MessageSquare size={12} /> Đánh giá
                        </span>
                      </div>

                      {/* Tiêu đề & Mô tả */}
                      <h4 className="text-2xl font-black text-gray-900 uppercase leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {tour.name}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium italic line-clamp-2 mb-8">
                        {tour.description || "Khám phá hành trình tuyệt vời cùng TravelGo..."}
                      </p>
                    </div>

                    {/* Phần Footer: Khởi hành & Trạng thái */}
                    <div className="pt-5 border-t border-dashed border-gray-200 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-100/80 p-2.5 rounded-[1rem] text-slate-400"><Calendar size={16} /></div>
                        <div>
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Khởi hành</p>
                          <p className="text-[11px] font-black text-gray-800">{departureDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        <div>
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Trạng thái</p>
                          <p className={`text-[12px] font-black uppercase tracking-tighter ${!hasSeats ? 'text-rose-500' : 'text-emerald-500'}`}>{statusText}</p>
                        </div>
                        <div className={`p-2.5 rounded-[1rem] ${hasSeats ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                          <Users size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
        )}
      </section>

      {/* 3. TIN TỨC & CẨM NANG */}
      <section className="py-24 px-6 md:px-16 lg:px-24 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none text-blue-600">
              TRAVEL <span className="text-gray-900 font-normal">INSIGHTS</span>
            </h3>
            <p className="text-gray-400 font-medium text-sm mt-4">Kinh nghiệm du lịch, mẹo tiết kiệm và những câu chuyện hành trình đầy cảm hứng.</p>
          </div>
          <Link to="/news" className="text-blue-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 group hover:gap-4 transition-all pb-2 border-b-2 border-blue-600">
            Xem tất cả bài viết <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
             <div className="flex justify-center items-center py-10"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {newsList.map(news => (
                <Link to={`/news/${news.id}`} key={news.id} className="group cursor-pointer block">
                  <div className="relative overflow-hidden rounded-[2.5rem] h-64 mb-6 shadow-md border border-gray-100">
                    <img 
                        src={getImgUrl(news.imageUrl)} 
                        alt={news.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 bg-slate-100" 
                        onError={(e: any) => { e.target.src = 'https://placehold.co/600x400?text=No+Image' }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-blue-600 tracking-widest uppercase shadow-sm border border-white">
                        {news.category || "Tin tức"}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Calendar size={12} /> {new Date(news.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                  <h4 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2 uppercase">
                    {news.title}
                  </h4>
                </Link>
              ))}
            </div>
        )}
      </section>

      {/* 4. TẠI SAO CHỌN CHÚNG TÔI */}
      <section className="bg-slate-50 py-24 px-6 border-t border-gray-100">
        <div className="w-full text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter italic">
            Tại sao chọn Travel<span className="text-blue-600 font-normal">Go</span>?
          </h2>
          <p className="text-gray-400 font-bold uppercase tracking-[0.4em] mt-3 text-xs">Giá trị bền vững trong từng bước chân</p>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
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
    <div className="flex flex-col items-center group text-center p-10 rounded-[3rem] hover:bg-white transition-all duration-300 hover:shadow-xl border border-transparent hover:border-gray-100">
      <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 ${colorClasses[color]}`}>
        {React.cloneElement(icon, { strokeWidth: 1.5, size: 32 })}
      </div>
      <h4 className="text-lg font-black text-gray-900 mb-4 uppercase tracking-wider">{title}</h4>
      <p className="text-gray-400 text-sm leading-relaxed max-w-xs font-medium px-2">
        Chúng tôi cam kết mang lại những trải nghiệm dịch vụ đẳng cấp nhất, đảm bảo sự hài lòng tối đa cho khách hàng.
      </p>
    </div>
  );
};

export default Home;