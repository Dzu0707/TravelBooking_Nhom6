import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, Users, MapPin, ArrowLeft, Star, Clock, 
  ArrowRight, Trash2, X, MessageSquare, Tag, Info 
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TourDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [tour, setTour] = useState<any>(null); 
  const [loading, setLoading] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);

  const API_BASE_URL = "http://localhost:5091"; 
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // HÀM QUAN TRỌNG: Hỗ trợ lấy dữ liệu linh hoạt (Bất kể Id hay id từ SQL)
  const getValue = (obj: any, key: string) => {
    if (!obj) return null;
    const capKey = key.charAt(0).toUpperCase() + key.slice(1);
    return obj[key] !== undefined ? obj[key] : obj[capKey];
  };

  // Hàm xử lý URL ảnh chuẩn hóa
  const getImgUrl = (path: any) => {
    if (!path) return "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800";
    const finalPath = typeof path === 'string' ? path : (getValue(path, 'imageUrl') || getValue(path, 'thumbnail'));
    
    if (!finalPath) return "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800";
    if (finalPath.startsWith('http')) return finalPath;
    
    const cleanPath = finalPath.startsWith('/') ? finalPath : `/${finalPath}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  const fetchTourDetail = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Tours/${id}`);
      const data = response.data;
      setTour(data);
      
      const schedules = data.tourSchedules || data.TourSchedules || [];
      if (schedules.length > 0) {
        setSelectedScheduleId(getValue(schedules[0], 'id'));
      }
      setLoading(false);
    } catch (error) {
      console.error("Lỗi lấy chi tiết tour:", error);
      toast.error("Không thể tải thông tin tour");
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) fetchTourDetail();
  }, [id]);

  const handleBooking = () => {
    if (!selectedScheduleId) return toast.error("Vui lòng chọn ngày khởi hành!");
    navigate(`/checkout/${id}?scheduleId=${selectedScheduleId}`);
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm("Xóa đánh giá này?")) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_BASE_URL}/api/Reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Đã xóa đánh giá!");
      fetchTourDetail();
    } catch (error) { 
      toast.error("Lỗi khi xóa đánh giá!"); 
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!tour) return <div className="p-20 text-center text-red-500 font-black uppercase italic tracking-widest">Hành trình không tồn tại!</div>;

  const schedules = tour.tourSchedules || tour.TourSchedules || [];
  const activeSchedule = schedules.find((s: any) => getValue(s, 'id') === selectedScheduleId);
  const images = tour.tourImages || tour.TourImages || [];
  const reviews = tour.reviews || tour.Reviews || [];
  const displayReviews = reviews.slice(0, 3);

  return (
    <div className="bg-[#f8faff] min-h-screen pb-24 font-sans text-slate-900 px-4">
      <div className="max-w-7xl mx-auto pt-8">
        <Link to="/tours" className="inline-flex items-center text-slate-400 mb-8 hover:text-indigo-600 transition-all font-black uppercase text-[10px] tracking-[0.4em]">
          <ArrowLeft size={16} className="mr-2"/> TRỞ LẠI DANH SÁCH
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="relative group overflow-hidden rounded-[3.5rem] shadow-2xl border-8 border-white h-125">
              <img 
                src={getImgUrl(tour)} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                alt={getValue(tour, 'name')}
              />
              <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-6 py-2.5 rounded-full flex items-center shadow-xl border border-white">
                <Tag size={14} className="text-indigo-600 mr-2" />
                <span className="text-[10px] font-black uppercase tracking-widest">{getValue(tour.category, 'name') || "Khám phá"}</span>
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {images.slice(0, 4).map((img: any, idx: number) => (
                  <div key={idx} className="h-28 rounded-4xl overflow-hidden border-4 border-white shadow-lg hover:border-indigo-300 transition-all cursor-pointer">
                    <img src={getImgUrl(img)} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 bg-white p-10 rounded-[3.5rem] shadow-2xl border border-indigo-50 flex flex-col justify-between h-full relative overflow-hidden">
             <div className="absolute -top-10 -right-10 opacity-5 rotate-12 text-indigo-900"><MapPin size={180}/></div>
             <h1 className="text-3xl font-black text-slate-900 mb-6 uppercase italic tracking-tighter leading-tight relative z-10">{getValue(tour, 'name')}</h1>
             
             <div className="mb-8 relative z-10">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest flex items-center gap-2">
                   <Calendar size={14} /> Lịch khởi hành
                </p>
                <div className="space-y-3 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
                  {schedules.map((s: any) => {
                    const sId = getValue(s, 'id');
                    const sDate = getValue(s, 'startDate') || getValue(s, 'departureDate');
                    return (
                      <div key={sId} onClick={() => setSelectedScheduleId(sId)} className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex justify-between items-center ${selectedScheduleId === sId ? 'border-indigo-600 bg-indigo-50 shadow-lg' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}>
                        <div>
                          <p className={`text-xs font-black uppercase italic ${selectedScheduleId === sId ? 'text-indigo-600' : 'text-slate-600'}`}>{new Date(sDate).toLocaleDateString('vi-VN')}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 flex items-center">
                             <Users size={10} className="mr-1"/> Còn {getValue(s, 'availableSeats')} chỗ
                          </p>
                        </div>
                        <p className={`font-black text-sm ${selectedScheduleId === sId ? 'text-indigo-600' : 'text-slate-900'}`}>{getValue(s, 'adultPrice')?.toLocaleString()}đ</p>
                      </div>
                    );
                  })}
                </div>
             </div>
             <div className="mt-auto pt-6 border-t border-slate-50 relative z-10">
                <p className="text-[9px] font-black text-slate-400 uppercase italic">Giá khởi điểm</p>
                <div className="text-4xl font-black text-indigo-600 mb-6 tracking-tighter">{getValue(activeSchedule, 'adultPrice')?.toLocaleString() || '---'}đ</div>
                <button 
                  onClick={handleBooking} 
                  className="w-full bg-slate-950 hover:bg-indigo-600 text-white py-6 rounded-[2.5rem] font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl group"
                >
                  ĐẶT TOUR NGAY <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12"><Info size={250}/></div>
             <h3 className="text-xl font-black uppercase italic tracking-widest text-indigo-600 mb-10 flex items-center gap-3"><Info size={24} /> Thông tin hành trình</h3>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12 relative z-10">
                <DetailItem icon={<MapPin size={18}/>} label="Khởi hành" value={getValue(tour, 'departureLocation')} />
                <DetailItem icon={<Calendar size={18}/>} label="Mã tour" value={getValue(tour, 'code')} />
                <DetailItem icon={<Clock size={18}/>} label="Thời gian" value={`${getValue(tour, 'duration') || '---'} ngày`} />
             </div>
             <div className="text-slate-500 leading-relaxed text-sm italic whitespace-pre-line font-medium bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100 shadow-inner relative z-10">
                {getValue(tour, 'description') || "Khám phá những trải nghiệm đẳng cấp cùng chúng tôi."}
             </div>
          </div>

          <div className="lg:col-span-4 bg-indigo-900 p-10 rounded-[4rem] text-white shadow-2xl relative h-fit overflow-hidden">
               <div className="absolute -top-5 -right-5 opacity-10 rotate-12"><MessageSquare size={130} /></div>
               <h3 className="text-lg font-black uppercase italic mb-10 flex items-center gap-3 relative z-10">
                  <Star size={20} className="text-amber-400" fill="currentColor" /> Đánh giá ({reviews.length})
               </h3>
               
               <div className="space-y-6 relative z-10">
                  {displayReviews.length > 0 ? displayReviews.map((r: any) => (
                    <div key={r.id} className="bg-white/10 p-6 rounded-[2.5rem] border border-white/5 group hover:bg-white/20 transition-all">
                        <div className="flex justify-between items-start mb-3">
                            <p className="font-black text-[10px] uppercase tracking-tighter text-indigo-200">{r.user?.fullName || r.userName || "Khách ẩn danh"}</p>
                            {(currentUser.id === r.userId || currentUser.role === 'Admin') && (
                              <button onClick={() => handleDeleteReview(r.id)} className="text-rose-400 hover:text-rose-300 p-1 transition-all"><Trash2 size={16} /></button>
                            )}
                        </div>
                        <p className="text-[11px] italic leading-relaxed opacity-70">"{r.comment}"</p>
                    </div>
                  )) : <p className="opacity-30 italic text-sm text-center py-10 uppercase tracking-widest text-[10px]">Chưa có cảm nhận</p>}

                  {reviews.length > 3 && (
                    <button onClick={() => setShowAllReviews(true)} className="w-full py-5 bg-white/5 border border-white/10 rounded-4xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                       Xem tất cả {reviews.length} đánh giá
                    </button>
                  )}
               </div>
          </div>
        </div>
      </div>

      {showAllReviews && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4">
          <div className="bg-white rounded-[4rem] w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
               <div className="flex items-center gap-4 text-indigo-900">
                  <MessageSquare size={24} />
                  <h4 className="text-2xl font-black uppercase italic tracking-tighter">Tất cả cảm nhận</h4>
               </div>
               <button onClick={() => setShowAllReviews(false)} className="p-3 hover:bg-white rounded-full text-slate-400 transition-all border border-slate-100 shadow-sm"><X size={24}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-12 space-y-8 bg-[#fcfdff]">
               {reviews.map((r: any) => (
                 <div key={r.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative">
                    <div className="flex justify-between items-center mb-5">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs uppercase">{(r.user?.fullName || r.userName || "K").charAt(0)}</div>
                           <p className="font-black text-xs uppercase text-slate-800 tracking-widest">{r.user?.fullName || r.userName}</p>
                        </div>
                        <div className="flex text-amber-400"><Star size={14} fill="currentColor"/> <span className="ml-1 font-black text-slate-900 italic text-sm">{r.rating}</span></div>
                    </div>
                    <p className="text-sm italic text-slate-500 leading-relaxed border-l-4 border-indigo-50 pl-6">"{r.comment}"</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-50 hover:shadow-md transition-all min-w-0">
    <div className="text-indigo-600 bg-indigo-50 p-4 rounded-2xl shrink-0">{icon}</div>
    <div className="overflow-hidden">
      <p className="text-[9px] font-black uppercase text-slate-400 italic tracking-widest mb-1">{label}</p>
      <p className="text-xs font-black text-slate-800 uppercase italic truncate tracking-tighter">{value || "---"}</p>
    </div>
  </div>
);

export default TourDetail;