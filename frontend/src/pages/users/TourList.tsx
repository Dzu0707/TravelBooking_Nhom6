import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, ArrowRight, Star, MessageSquare, X, 
  Calendar, Users, Search, ChevronLeft, ChevronRight, Send 
} from 'lucide-react';
import toast from 'react-hot-toast';

const TourList = () => {
  const [tours, setTours] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // State Tìm kiếm & Phân trang
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 12;

  const [activeReviewId, setActiveReviewId] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const API_BASE_URL = "http://localhost:5091";

  const fetchData = async () => {
    setLoading(true);
    try {
      const [toursRes, catsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/Tours`),
        axios.get(`${API_BASE_URL}/api/Categories`)
      ]);
      setTours(toursRes.data);
      setCategories(catsRes.data);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getImgUrl = (url: any) => {
    if (!url) return "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=500";
    return url.startsWith('http') ? url : `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
  };

  // Logic Lọc & Phân trang
  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryId ? tour.categoryId === selectedCategoryId : true;
    return matchesSearch && matchesCategory;
  });

  const indexOfLastTour = currentPage * toursPerPage;
  const indexOfFirstTour = indexOfLastTour - toursPerPage;
  const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour);
  const totalPages = Math.ceil(filteredTours.length / toursPerPage);

  const handleSendReview = async (tourId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return toast.error("Vui lòng đăng nhập!");
    if (!comment.trim()) return toast.error("Vui lòng nhập nội dung!");

    const loadId = toast.loading("Đang gửi...");
    try {
      await axios.post(`${API_BASE_URL}/api/Reviews`, 
        { tourId, rating, comment }, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      toast.success("Đã gửi đánh giá!", { id: loadId });
      setComment('');
      setActiveReviewId(null);
      fetchData(); 
    } catch (e) { 
      toast.error("Lỗi khi gửi!", { id: loadId }); 
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#f8faff]">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="px-6 md:px-12 lg:px-24 py-8 bg-[#f8faff] min-h-screen font-sans text-slate-900">
      
      {/* HEADER & FILTERS */}
      <div className="max-w-full mx-auto space-y-6 mb-12">
        <div className="border-l-4 border-indigo-600 pl-5">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">
            Khám Phá <span className="text-indigo-600 font-normal">Hành Trình</span>
          </h1>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative max-w-2xl group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm tour..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-indigo-400 transition-all shadow-sm"
            />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"><X size={16} /></button>}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button 
              onClick={() => { setSelectedCategoryId(null); setCurrentPage(1); }}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap border ${!selectedCategoryId ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-500 border-slate-200'}`}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => { setSelectedCategoryId(cat.id); setCurrentPage(1); }}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap border ${selectedCategoryId === cat.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-500 border-slate-200'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GRID TOUR */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-full mx-auto">
        {currentTours.map((tour) => {
          const imgs = tour.tourImages || [];
          const mainImg = tour.imageUrl || tour.thumbnail || (imgs[0]?.imageUrl);
          const reviewCount = tour.reviews?.length || 0;

          return (
            <div key={tour.id} className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full border border-slate-100 relative overflow-hidden">
              
              {/* IMAGE GALLERY SECTION */}
              <div className="relative h-64 p-3 grid grid-cols-3 gap-3 bg-slate-50/50">
                <div className="col-span-2 overflow-hidden rounded-4xl relative cursor-pointer" onClick={() => navigate(`/tours/${tour.id}`)}>
                  <img src={getImgUrl(mainImg)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={tour.name} />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full flex items-center shadow-sm">
                    <Star size={10} className="text-amber-400 mr-1" fill="currentColor"/>
                    <span className="text-[10px] font-black italic text-slate-700">4.9</span>
                  </div>
                </div>
                
                <div className="col-span-1 grid grid-rows-2 gap-2">
                   <div className="rounded-2xl overflow-hidden bg-white shadow-inner">
                      <img src={getImgUrl(imgs[0]?.imageUrl || imgs[0]?.ImageUrl)} className="w-full h-full object-cover" alt="" />
                   </div>
                   <div className="rounded-2xl overflow-hidden bg-white shadow-inner relative">
                      <img src={getImgUrl(imgs[1]?.imageUrl || imgs[1]?.ImageUrl)} className="w-full h-full object-cover" alt="" />
                      {imgs.length > 2 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[10px] font-black">+{imgs.length - 2}</div>
                      )}
                   </div>
                </div>
              </div>

              {/* CONTENT SECTION */}
              <div className="p-7 flex flex-col grow">
                <div className="flex justify-between items-center mb-4">
                    <span className="flex items-center text-indigo-600 font-black text-[8px] uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                        <MapPin size={10} className="mr-1 text-rose-500" /> {tour.departureLocation}
                    </span>
                    <button 
                        onClick={() => { setActiveReviewId(tour.id); setRating(5); }}
                        className="flex items-center gap-1.5 text-slate-300 hover:text-indigo-600 font-black text-[9px] uppercase tracking-widest transition-colors"
                    >
                        <MessageSquare size={14} /> Review {reviewCount > 0 && `(${reviewCount})`}
                    </button>
                </div>

                <h3 className="text-lg font-black text-slate-800 mb-3 uppercase italic tracking-tighter line-clamp-1 group-hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => navigate(`/tours/${tour.id}`)}>
                  {tour.name}
                </h3>

                <div className="border-l-2 border-indigo-100 pl-4 mb-6">
                  <p className="text-slate-500 text-[12px] italic leading-relaxed line-clamp-2 h-9">
                    {tour.description || "Hành trình khám phá vẻ đẹp bất tận cùng hệ thống dịch vụ nghỉ dưỡng cao cấp chuẩn TravelGo..."}
                  </p>
                </div>
                
                <div className="flex justify-between items-center py-4 border-t border-slate-50 mb-6 mt-auto">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-indigo-500"/>
                        <span className="text-[8px] font-black uppercase text-slate-400">Hàng ngày</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Users size={12} className="text-emerald-500"/>
                        <span className="text-[8px] font-black uppercase text-slate-400">Còn chỗ</span>
                    </div>
                </div>

                <div className="flex justify-end">
                   <button 
                    onClick={() => navigate(`/tours/${tour.id}`)}
                    className="w-full bg-slate-950 text-white px-8 py-3.5 rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
                   >
                     Xem chi tiết <ArrowRight size={14} />
                   </button>
                </div>

                {/* REVIEW OVERLAY */}
                {activeReviewId === tour.id && (
                  <div className="absolute inset-0 bg-white/98 backdrop-blur-md z-50 p-8 flex flex-col rounded-[2.5rem] animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-sm font-black uppercase italic text-indigo-900">Đánh giá tour</h4>
                        <button onClick={() => setActiveReviewId(null)} className="text-slate-300 hover:text-rose-500"><X size={20} /></button>
                    </div>
                    <div className="flex justify-center gap-2 mb-8">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} onClick={() => setRating(s)} size={28} className={`cursor-pointer ${s <= rating ? "text-amber-400" : "text-slate-100"}`} fill={s <= rating ? "currentColor" : "none"} />
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
                      className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all"
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
        <div className="mt-16 flex justify-center items-center gap-4">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 disabled:opacity-30 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-12 h-12 rounded-2xl font-black text-xs transition-all shadow-sm ${currentPage === i + 1 ? 'bg-indigo-600 text-white border-indigo-600 scale-110' : 'bg-white text-slate-400 border border-slate-200 hover:text-indigo-600'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 disabled:opacity-30 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TourList;