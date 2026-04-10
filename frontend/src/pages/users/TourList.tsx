import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, ArrowRight, Star, MessageSquare, X, 
  Calendar, Users, Search, ChevronLeft, ChevronRight, Zap, Send 
} from 'lucide-react';
import toast from 'react-hot-toast';

const TourList = () => {
  const [tours, setTours] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // State tìm kiếm & lọc
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 6;

  // State Review
  const [activeReviewId, setActiveReviewId] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const API_BASE_URL = "http://localhost:5091";

  const fetchData = async () => {
    try {
      const [toursRes, catsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/Tours`),
        axios.get(`${API_BASE_URL}/api/Categories`)
      ]);
      setTours(toursRes.data);
      setCategories(catsRes.data);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
      toast.error("Không thể tải danh sách tour");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Hàm xử lý URL ảnh chuẩn hóa
  const getImgUrl = (data: any) => {
    if (!data) return "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=500";
    const path = typeof data === 'string' ? data : (data.imageUrl || data.ImageUrl || data.imagePath || data.thumbnail);
    if (!path) return "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=500";
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  };

  // Logic Lọc & Phân trang
  const filteredTours = tours.filter(tour => {
    const name = (tour.name || tour.Name || "").toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase());
    const catId = tour.categoryId || tour.CategoryId;
    const matchesCategory = selectedCategoryId ? catId === selectedCategoryId : true;
    return matchesSearch && matchesCategory;
  });

  const indexOfLastTour = currentPage * toursPerPage;
  const indexOfFirstTour = indexOfLastTour - toursPerPage;
  const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour);
  const totalPages = Math.ceil(filteredTours.length / toursPerPage);

  const handleSendReview = async (tourId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return toast.error("Vui lòng đăng nhập để đánh giá!");
    if (!comment.trim()) return toast.error("Vui lòng nhập nội dung đánh giá!");

    const loadId = toast.loading("Đang gửi...");
    try {
      await axios.post(`${API_BASE_URL}/api/Reviews`, 
        { tourId, rating, comment }, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      toast.success("Đã gửi đánh giá thành công!", { id: loadId });
      setComment(''); 
      setActiveReviewId(null);
      fetchData();
    } catch (e) { 
      toast.error("Lỗi khi gửi đánh giá!", { id: loadId }); 
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#f8faff]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Đang tải hành trình...</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-10 bg-[#f8faff] min-h-screen font-sans text-slate-900">
      
      {/* HEADER & FILTERS */}
      <div className="max-w-7xl mx-auto space-y-8 mb-12">
        <div className="border-l-4 border-indigo-600 pl-6">
          <p className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Explore the world</p>
          <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
            Hành Trình <span className="text-indigo-600 font-normal">Du Lịch</span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
          <div className="relative w-full lg:max-w-md group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm hành trình..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
            />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500"><X size={16} /></button>}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full pb-2">
            <button 
              onClick={() => { setSelectedCategoryId(null); setCurrentPage(1); }}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap border ${!selectedCategoryId ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'}`}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => { setSelectedCategoryId(cat.id); setCurrentPage(1); }}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap border ${selectedCategoryId === cat.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GRID TOUR */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {currentTours.map((tour) => {
          const imgs = tour.tourImages || tour.TourImages || [];
          const mainImg = tour.imageUrl || tour.ImageUrl || tour.thumbnail || tour.Thumbnail || (imgs[0]?.imageUrl);
          const reviewCount = (tour.reviews?.length || 0) + (tour.Reviews?.length || 0);

          return (
            <div key={tour.id} className="group bg-white rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(79,70,229,0.15)] transition-all duration-500 flex flex-col h-full border border-slate-100 relative overflow-hidden">
              
              {/* IMAGE GALLERY SECTION */}
              <div className="relative h-64 p-3 grid grid-cols-3 gap-3">
                <div className="col-span-2 overflow-hidden rounded-4xl relative cursor-pointer" onClick={() => navigate(`/tours/${tour.id}`)}>
                  <img src={getImgUrl(mainImg)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={tour.name} />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center shadow-lg border border-white">
                    <Star size={12} className="text-amber-400 mr-1" fill="currentColor"/>
                    <span className="text-[11px] font-black italic text-slate-800">4.9</span>
                  </div>
                </div>
                
                <div className="col-span-1 grid grid-rows-2 gap-3">
                  <div className="rounded-[1.2rem] overflow-hidden bg-slate-100 shadow-inner">
                    <img src={getImgUrl(imgs[0]?.imageUrl || imgs[0])} className="w-full h-full object-cover hover:opacity-80 transition-opacity" alt="" />
                  </div>
                  <div className="rounded-[1.2rem] overflow-hidden bg-slate-100 shadow-inner relative">
                    <img src={getImgUrl(imgs[1]?.imageUrl || imgs[1])} className="w-full h-full object-cover hover:opacity-80 transition-opacity" alt="" />
                    {imgs.length > 2 && (
                      <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                        <span className="text-white font-black text-xs">+{imgs.length - 2}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CONTENT SECTION */}
              <div className="p-7 flex flex-col grow">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2">
                        <span className="flex items-center text-indigo-700 font-black text-[9px] uppercase bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                            <MapPin size={10} className="mr-1 text-rose-500" /> {tour.departureLocation || tour.DepartureLocation}
                        </span>
                        <span className="flex items-center text-amber-700 font-black text-[9px] uppercase bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                            <Zap size={10} className="mr-1" fill="currentColor" /> HOT
                        </span>
                    </div>
                    
                    <button 
                        onClick={() => { setActiveReviewId(tour.id); setRating(5); }}
                        className="flex items-center gap-1.5 text-slate-300 hover:text-indigo-600 transition-colors"
                    >
                        <MessageSquare size={16} /> 
                        {reviewCount > 0 && <span className="text-[10px] font-black">({reviewCount})</span>}
                    </button>
                </div>

                <h3 className="text-xl font-black text-slate-800 mb-3 uppercase italic tracking-tighter line-clamp-1 group-hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => navigate(`/tours/${tour.id}`)}>
                  {tour.name || tour.Name}
                </h3>

                <div className="border-l-2 border-indigo-100 pl-4 mb-6">
                  <p className="text-slate-500 text-[12px] italic leading-relaxed line-clamp-2 h-9">
                    {tour.description || tour.Description || "Hành trình khám phá vẻ đẹp bất tận cùng TravelGo..."}
                  </p>
                </div>
                
                <div className="flex justify-between items-center py-4 border-t border-slate-50 mt-auto">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <Calendar size={14} className="text-indigo-500"/>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold uppercase text-slate-400">Khởi hành</span>
                          <span className="text-[10px] font-black text-slate-700">Hàng ngày</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                        <div className="p-2 bg-slate-50 rounded-lg">
                          <Users size={14} className="text-emerald-500"/>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold uppercase text-slate-400">Trạng thái</span>
                          <span className="text-[10px] font-black text-emerald-600 tracking-tighter uppercase">Còn chỗ</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center gap-4 mt-4">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Giá ưu đãi</span>
                       <span className="text-xl font-black text-indigo-600 tracking-tighter">
                          {tour.minPrice ? `${tour.minPrice.toLocaleString()}đ` : (tour.adultPrice ? `${tour.adultPrice.toLocaleString()}đ` : "Liên hệ")}
                       </span>
                    </div>
                    <button 
                      onClick={() => navigate(`/tours/${tour.id}`)}
                      className="bg-slate-900 text-white px-7 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
                    >
                      Chi tiết <ArrowRight size={14} />
                    </button>
                </div>

                {/* MODAL REVIEW TẠI CHỖ */}
                {activeReviewId === tour.id && (
                  <div className="absolute inset-0 bg-white/98 backdrop-blur-xl z-50 p-8 flex flex-col rounded-[2.5rem] animate-in fade-in zoom-in duration-300">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="text-sm font-black uppercase italic text-indigo-900">Chia sẻ cảm nhận</h4>
                        <button onClick={() => setActiveReviewId(null)} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-rose-500 transition-colors"><X size={20} /></button>
                    </div>
                    
                    <div className="flex justify-center gap-2 mb-8">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          onClick={() => setRating(s)} 
                          size={32} 
                          className={`cursor-pointer transition-all ${s <= rating ? "text-amber-400 scale-110" : "text-slate-200"}`} 
                          fill={s <= rating ? "currentColor" : "none"} 
                        />
                      ))}
                    </div>

                    <textarea 
                      value={comment} 
                      onChange={(e) => setComment(e.target.value)} 
                      placeholder="Tour này như thế nào?..." 
                      className="w-full grow bg-slate-50 border border-slate-100 rounded-3xl p-6 text-sm italic outline-none focus:border-indigo-300 focus:bg-white transition-all mb-6 resize-none shadow-inner" 
                    />
                    
                    <button 
                      onClick={() => handleSendReview(tour.id)} 
                      className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl hover:bg-indigo-700 transition-all"
                    >
                      Gửi đánh giá <Send size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="max-w-7xl mx-auto mt-16 flex justify-center items-center gap-4">
          <button 
            disabled={currentPage === 1}
            onClick={() => { setCurrentPage(p => p - 1); window.scrollTo(0, 400); }}
            className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-400 disabled:opacity-30 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => { setCurrentPage(i + 1); window.scrollTo(0, 400); }}
                className={`w-12 h-12 rounded-2xl font-black text-xs transition-all shadow-sm ${currentPage === i + 1 ? 'bg-indigo-600 text-white border-indigo-600 scale-110 shadow-indigo-100' : 'bg-white text-slate-400 border border-slate-200 hover:border-indigo-400 hover:text-indigo-600'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => { setCurrentPage(p => p + 1); window.scrollTo(0, 400); }}
            className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-400 disabled:opacity-30 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TourList;