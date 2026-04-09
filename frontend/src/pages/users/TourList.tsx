import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Star, Zap, MessageSquare, X, Send, Calendar, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const TourList = () => {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const [activeReviewId, setActiveReviewId] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const API_BASE_URL = "http://localhost:5091";

  const fetchTours = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Tours`);
      setTours(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchTours(); }, []);

  const handleSendReview = async (tourId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return toast.error("Vui lòng đăng nhập!");
    const loadId = toast.loading("Đang gửi...");
    try {
      await axios.post(`${API_BASE_URL}/api/Reviews`, { tourId, rating, comment }, { headers: { 'Authorization': `Bearer ${token}` } });
      
      setTours(prev => prev.map(t => {
        if (t.id === tourId) {
          const old = t.reviews || t.Reviews || [];
          return { ...t, reviews: [...old, { id: Date.now() }] };
        }
        return t;
      }));

      toast.success("Đã gửi đánh giá!", { id: loadId });
      setComment(''); setActiveReviewId(null);
      setTimeout(() => fetchTours(), 1000);
    } catch (e) { toast.error("Lỗi!", { id: loadId }); }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#f8faff]">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-4 md:p-10 bg-[#f8faff] min-h-screen font-sans text-slate-900">
      
      <div className="max-w-7xl mx-auto mb-10 border-l-4 border-indigo-600 pl-4">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">
          Khám Phá <span className="text-indigo-600 font-normal">Hành Trình</span>
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {tours.map((tour) => {
          const images = tour.tourImages || tour.TourImages || [];
          const mainImg = tour.thumbnail || tour.Thumbnail || (images[0]?.imageUrl);
          
          // ĐÃ SỬ DỤNG BIẾN reviewCount Ở ĐÂY ĐỂ HẾT LỖI
          const reviewCount = (tour.reviews?.length || 0) + (tour.Reviews?.length || 0);

          const getImgUrl = (url: string) => {
            if (!url) return "https://via.placeholder.com/400x300?text=No+Image";
            return url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
          };

          return (
            <div key={tour.id} className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full border border-slate-100 relative overflow-hidden">
              
              <div className="relative h-56 p-2 grid grid-cols-3 gap-2 bg-slate-50">
                <div className="col-span-2 overflow-hidden rounded-[1.8rem] relative cursor-pointer" onClick={() => navigate(`/tours/${tour.id}`)}>
                  <img src={getImgUrl(mainImg)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={tour.name} />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full flex items-center shadow-sm">
                    <Star size={10} className="text-amber-400 mr-1" fill="currentColor"/>
                    <span className="text-[10px] font-black italic text-slate-700">4.9</span>
                  </div>
                </div>
                
                <div className="col-span-1 grid grid-rows-2 gap-2">
                  <div className="rounded-2xl overflow-hidden bg-white shadow-inner flex items-center justify-center">
                    {images[0] ? ( <img src={getImgUrl(images[0].imageUrl || images[0].ImageUrl)} className="w-full h-full object-cover" alt="" /> ) : <div className="bg-indigo-50 w-full h-full flex items-center justify-center text-indigo-200 font-black text-[8px]">PHOTO 1</div>}
                  </div>
                  <div className="rounded-2xl overflow-hidden bg-white shadow-inner flex items-center justify-center relative">
                    {images[1] ? ( <img src={getImgUrl(images[1].imageUrl || images[1].ImageUrl)} className="w-full h-full object-cover" alt="" /> ) : <div className="bg-indigo-50 w-full h-full flex items-center justify-center text-indigo-200 font-black text-[8px]">PHOTO 2</div>}
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-1.5">
                        <span className="flex items-center text-indigo-600 font-black text-[8px] uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                            <MapPin size={10} className="mr-1 text-rose-500" /> {tour.departureLocation}
                        </span>
                        <span className="flex items-center text-amber-600 font-black text-[8px] uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                            <Zap size={10} className="mr-0.5" fill="currentColor" /> HOT
                        </span>
                    </div>
                    {/* SỬ DỤNG BIẾN reviewCount TẠI ĐÂY */}
                    <button 
                        onClick={() => setActiveReviewId(tour.id)}
                        className="flex items-center gap-1.5 text-slate-300 hover:text-indigo-600 font-black text-[9px] uppercase tracking-widest transition-colors"
                    >
                        <MessageSquare size={14} /> Review {reviewCount > 0 && `(${reviewCount})`}
                    </button>
                </div>

                <h3 className="text-lg font-black text-slate-800 mb-3 uppercase italic tracking-tighter line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {tour.name}
                </h3>

                <div className="border-l-2 border-indigo-100 pl-3 mb-5">
                  <p className="text-slate-500 text-[11px] italic leading-relaxed line-clamp-2 h-[32px]">
                    {tour.description || "Khám phá hành trình đầy hứa hẹn với TravelGo..."}
                  </p>
                </div>
                
                <div className="flex justify-between items-center py-4 border-t border-slate-50 mb-6 mt-auto">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-indigo-500"/>
                        <span className="text-[8px] font-black uppercase text-slate-400">Khởi hành: Hàng ngày</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Users size={12} className="text-emerald-500"/>
                        <span className="text-[8px] font-black uppercase text-slate-400">Còn chỗ</span>
                    </div>
                </div>

                <div className="flex justify-end">
                   <button 
                    onClick={() => navigate(`/tours/${tour.id}`)}
                    className="w-full md:w-auto bg-slate-950 text-white px-8 py-3.5 rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
                   >
                     Xem chi tiết <ArrowRight size={14} />
                   </button>
                </div>

                {activeReviewId === tour.id && (
                  <div className="absolute inset-0 bg-white/98 backdrop-blur-md z-50 p-8 flex flex-col rounded-[2.5rem] animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-sm font-black uppercase italic text-indigo-900">Đánh giá</h4>
                        <button onClick={() => setActiveReviewId(null)} className="text-slate-300 hover:text-rose-500"><X size={20} /></button>
                    </div>
                    <div className="flex justify-center gap-2 mb-8">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} onClick={() => setRating(s)} size={28} className={`cursor-pointer ${s <= rating ? "text-amber-400" : "text-slate-100"}`} fill={s <= rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Viết cảm nhận..." className="w-full flex-grow bg-slate-50 rounded-2xl p-5 text-xs italic outline-none mb-6 resize-none" />
                    <button onClick={() => handleSendReview(tour.id)} className="w-full bg-indigo-600 text-white py-4 rounded-full font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2">
                        Gửi Ngay <Send size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TourList;