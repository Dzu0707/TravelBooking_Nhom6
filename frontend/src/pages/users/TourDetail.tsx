import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, Users, MapPin, ArrowLeft, Star, Clock, 
  ArrowRight, Trash2, X, MessageSquare, Tag, Info, Send
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TourDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [tour, setTour] = useState<any>(null); 
  const [reviews, setReviews] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);

  // States cho phần gửi đánh giá mới
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = "http://localhost:5091"; 
  
  const userRaw = localStorage.getItem('user') || '{}';
  const currentUser = JSON.parse(userRaw);
  
  const myId = String(currentUser?.id || currentUser?.Id || "").trim();
  const myName = String(currentUser?.fullName || currentUser?.FullName || currentUser?.userName || "").toLowerCase().trim();
  const myRole = String(currentUser?.role || currentUser?.Role || "").toLowerCase().trim();
  const isAdmin = myRole === 'admin';

  const getImgUrl = (path: any) => {
    if (!path) return "https://placehold.co/800x500?text=No+Image";
    const finalPath = typeof path === 'string' ? path : (path.imageUrl || path.imagePath);
    if (!finalPath) return "https://placehold.co/800x500?text=No+Image";
    if (finalPath.startsWith('http')) return finalPath;
    const cleanPath = finalPath.startsWith('/') ? finalPath : `/${finalPath}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  const fetchTourDetail = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Tours/${id}`);
      setTour(response.data);
      if (response.data.tourSchedules?.length > 0) {
        setSelectedScheduleId(response.data.tourSchedules[0].id);
      }
    } catch (error) {
      toast.error("Không thể tải thông tin tour");
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Reviews/tour/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Lỗi lấy đánh giá:", error);
    }
  };

  const handleSendReview = async () => {
    const token = localStorage.getItem('token');
    if (!token) return toast.error("Vui lòng đăng nhập để đánh giá!");
    if (!comment.trim()) return toast.error("Vui lòng nhập nội dung!");

    setIsSubmitting(true);
    const loadId = toast.loading("Đang gửi...");
    try {
      await axios.post(`${API_BASE_URL}/api/Reviews`, 
        { tourId: Number(id), rating, comment }, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      toast.success("Cảm ơn bạn đã đánh giá!", { id: loadId });
      setComment('');
      setRating(5);
      fetchReviews(); 
    } catch (e) { 
      toast.error("Lỗi khi gửi đánh giá!", { id: loadId }); 
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadData = async () => {
      setLoading(true);
      if (id) {
        await Promise.all([fetchTourDetail(), fetchReviews()]);
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm("Bạn xác nhận muốn xóa đánh giá này?")) return;
    const token = localStorage.getItem('token');
    const loadId = toast.loading("Đang xóa...");
    try {
      await axios.delete(`${API_BASE_URL}/api/Reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Đã xóa đánh giá!", { id: loadId });
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (error: any) {
      toast.error("Lỗi xóa đánh giá!", { id: loadId });
    }
  };

  const handleNavigateToCheckout = () => {
    if (!selectedScheduleId) {
      toast.error("Vui lòng chọn một lịch khởi hành!");
      return;
    }
    navigate(`/checkout/${id}?scheduleId=${selectedScheduleId}&adult=1&child=0`);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!tour) return <div className="p-20 text-center font-black uppercase italic text-rose-500">Hành trình không tồn tại!</div>;

  const activeSchedule = tour.tourSchedules?.find((s: any) => s.id === selectedScheduleId);
  const images = tour.tourImages || tour.TourImages || [];
  const displayReviews = reviews.slice(0, 2); // Chỉ hiện 2 cái đầu cho gọn
  const reviewCount = reviews.length;

  return (
    <div className="bg-[#f8faff] min-h-screen pb-24 font-sans text-slate-900 px-4">
      <div className="max-w-7xl mx-auto pt-8">
        <Link to="/tours" className="inline-flex items-center text-slate-400 mb-8 font-black uppercase text-[10px] tracking-[0.4em] hover:text-indigo-600 transition-colors">
          <ArrowLeft size={16} className="mr-2"/> TRỞ LẠI DANH SÁCH
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="relative group overflow-hidden rounded-[3.5rem] shadow-2xl border-8 border-white h-[500px]">
              <img src={getImgUrl(tour.imageUrl || tour.thumbnail)} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={tour.name} />
              <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-6 py-2.5 rounded-full flex items-center shadow-xl">
                <Tag size={14} className="text-indigo-600 mr-2" />
                <span className="text-[10px] font-black uppercase tracking-widest">{tour.category?.name || "Premium"}</span>
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img: any, idx: number) => (
                  <div key={idx} className="h-28 rounded-3xl overflow-hidden border-4 border-white shadow-lg hover:border-indigo-300 transition-all cursor-pointer">
                    <img src={getImgUrl(img)} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 bg-white p-10 rounded-[3.5rem] shadow-2xl border border-indigo-50 flex flex-col justify-between h-full">
              <h1 className="text-3xl font-black mb-6 uppercase italic leading-tight">{tour.name}</h1>
              <div className="mb-8">
                 <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest flex items-center gap-2">
                    <Calendar size={14} /> Lịch khởi hành
                 </p>
                 <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                   {tour.tourSchedules?.map((s: any) => (
                     <div key={s.id} onClick={() => setSelectedScheduleId(s.id)} className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex justify-between items-center ${selectedScheduleId === s.id ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-50 hover:border-slate-200'}`}>
                       <div>
                         <p className={`text-xs font-black uppercase ${selectedScheduleId === s.id ? 'text-indigo-600' : 'text-slate-600'}`}>{new Date(s.departureDate || s.startDate).toLocaleDateString('vi-VN')}</p>
                         <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-bold">
                            <Users size={12} /> Còn {s.availableSeats} chỗ
                         </p>
                       </div>
                       <p className="font-black text-sm">{s.adultPrice?.toLocaleString()}đ</p>
                     </div>
                   ))}
                 </div>
              </div>
              <div className="mt-auto">
                 <div className="text-4xl font-black text-indigo-600 mb-6 tracking-tighter">{activeSchedule ? activeSchedule.adultPrice?.toLocaleString() : '---'}đ</div>
                 <button 
                   onClick={handleNavigateToCheckout} 
                   className="w-full bg-slate-950 text-white py-6 rounded-[2.5rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 group"
                 >
                   ĐẶT TOUR NGAY <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100">
              <h3 className="text-xl font-black uppercase italic tracking-widest text-indigo-600 mb-10 flex items-center gap-3"><Info size={24} /> Thông tin hành trình</h3>
              <div className="grid grid-cols-3 gap-8 mb-12">
                 <DetailItem icon={<MapPin size={18}/>} label="Điểm khởi hành" value={tour.departureLocation} />
                 <DetailItem icon={<Calendar size={18}/>} label="Mã hành trình" value={tour.code} />
                 <DetailItem icon={<Clock size={18}/>} label="Trạng thái" value={activeSchedule?.status || "Đang mở"} />
              </div>
              <div className="text-slate-500 italic whitespace-pre-line bg-slate-50/50 p-10 rounded-[3rem] shadow-inner font-medium leading-relaxed">{tour.description}</div>
          </div>

          <div className="lg:col-span-4 bg-indigo-900 p-8 rounded-[3.5rem] text-white shadow-2xl relative h-fit flex flex-col gap-6">
               <h3 className="text-lg font-black uppercase italic flex items-center justify-between relative z-10">
                  <span className="flex items-center gap-2">
                    <Star size={20} className="text-amber-400" fill="currentColor" /> Đánh giá
                  </span>
                  {reviewCount > 0 && <span className="text-[10px] bg-white/10 px-3 py-1 rounded-full">({reviewCount})</span>}
               </h3>

               {/* FORM GỬI ĐÁNH GIÁ (GIỐNG TRANG LIST) */}
               <div className="bg-white/10 p-6 rounded-[2.5rem] border border-white/5 relative z-10">
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} onClick={() => setRating(s)} size={18} className={`cursor-pointer transition-all ${s <= rating ? "text-amber-400" : "text-white/20"}`} fill={s <= rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <textarea 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)} 
                    placeholder="Chia sẻ cảm nhận của bạn..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[11px] outline-none mb-4 resize-none h-24 placeholder:text-white/30" 
                  />
                  <button 
                    onClick={handleSendReview}
                    disabled={isSubmitting}
                    className="w-full bg-white text-indigo-900 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all shadow-lg"
                  >
                      Gửi đánh giá <Send size={14} />
                  </button>
               </div>

               <div className="space-y-4 relative z-10">
                  {displayReviews.map((r: any) => {
                    const reviewOwnerId = String(r.userId || "").trim();
                    const reviewOwnerName = String(r.userName || "").toLowerCase().trim();
                    const canDelete = isAdmin || (myId !== "" && myId === reviewOwnerId) || (myName !== "" && myName === reviewOwnerName);

                    return (
                      <div key={r.id} className="bg-white/5 p-5 rounded-[2rem] border border-white/5 transition-all hover:bg-white/10 relative">
                          <div className="flex justify-between items-start mb-2">
                              <div className="flex flex-col">
                                <p className="font-black text-[9px] uppercase text-indigo-200">{r.userName || "Khách ẩn danh"}</p>
                                <div className="flex gap-0.5 mt-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={8} className={i < (r.rating || 5) ? "text-amber-400" : "text-white/20"} fill="currentColor" />
                                  ))}
                                </div>
                              </div>
                              {canDelete && (
                               <button 
                                 onClick={() => handleDeleteReview(r.id)} 
                                 className="text-white/40 hover:text-rose-500 transition-all"
                               >
                                 <Trash2 size={14} />
                               </button>
                             )}
                          </div>
                          <p className="text-[11px] italic opacity-70 leading-relaxed line-clamp-2">"{r.comment}"</p>
                      </div>
                    );
                  })}
                  
                  {reviews.length === 0 && <p className="opacity-20 italic text-center py-6 text-[10px] uppercase tracking-widest">Chưa có bình luận</p>}
                  
                  {reviews.length > 2 && (
                    <button onClick={() => setShowAllReviews(true)} className="w-full py-4 bg-white/5 border border-white/10 rounded-[2rem] text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                      Xem tất cả ({reviewCount})
                    </button>
                  )}
               </div>
          </div>
        </div>
      </div>

      {/* MODAL XEM TẤT CẢ - GIỮ NGUYÊN HOẶC TINH CHỈNH GỌN HƠN */}
      {showAllReviews && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4">
          <div className="bg-white rounded-[3.5rem] w-full max-w-xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3 text-indigo-900">
                  <MessageSquare size={20} /> 
                  <h4 className="text-xl font-black uppercase italic tracking-tighter">Tất cả đánh giá</h4>
                </div>
                <button onClick={() => setShowAllReviews(false)} className="p-2 hover:bg-white rounded-full text-slate-400 shadow-sm transition-all"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
               {reviews.map((r: any) => {
                 const rOwnerId = String(r.userId || "").trim();
                 const rOwnerName = String(r.userName || "").toLowerCase().trim();
                 const canDelInModal = isAdmin || (myId !== "" && myId === rOwnerId) || (myName !== "" && myName === rOwnerName);
                 
                 return (
                   <div key={r.id} className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                          <div>
                            <p className="font-black text-[10px] uppercase text-slate-800 tracking-widest">{r.userName}</p>
                            <div className="flex gap-0.5 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={10} className={i < (r.rating || 5) ? "text-amber-400" : "text-slate-200"} fill="currentColor" />
                              ))}
                            </div>
                          </div>
                          {canDelInModal && (
                            <button onClick={() => handleDeleteReview(r.id)} className="text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all">
                              <Trash2 size={16} />
                            </button>
                          )}
                      </div>
                      <p className="text-[12px] italic text-slate-500 leading-relaxed">"{r.comment}"</p>
                   </div>
                 );
               })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-50 hover:shadow-md transition-all">
    <div className="text-indigo-600 bg-indigo-50 p-4 rounded-2xl">{icon}</div>
    <div>
      <p className="text-[9px] font-black uppercase text-slate-400 italic tracking-widest mb-1">{label}</p>
      <p className="text-xs font-black text-slate-800 uppercase italic truncate tracking-tighter">{value || "---"}</p>
    </div>
  </div>
);
 
export default TourDetail;