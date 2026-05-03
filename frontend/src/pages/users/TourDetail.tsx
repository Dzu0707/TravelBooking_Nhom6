import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar, MapPin, ArrowLeft, Star, Clock,
  ArrowRight, Trash2, X, MessageSquare, Tag, Info, Send
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5091';

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tour, setTour] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userRaw = localStorage.getItem('user') || '{}';
  const currentUser = JSON.parse(userRaw);

  const myId = String(currentUser?.id || currentUser?.Id || '').trim();
  const myName = String(currentUser?.fullName || currentUser?.FullName || currentUser?.userName || '')
    .toLowerCase()
    .trim();
  const myRole = String(currentUser?.role || currentUser?.Role || '').toLowerCase().trim();
  const isAdmin = myRole === 'admin';

  const getImgUrl = (path: any) => {
    if (!path) return 'https://placehold.co/900x600?text=No+Image';
    const finalPath = typeof path === 'string' ? path : (path.imageUrl || path.imagePath);
    if (!finalPath) return 'https://placehold.co/900x600?text=No+Image';
    if (finalPath.startsWith('http')) return finalPath;
    const cleanPath = finalPath.startsWith('/') ? finalPath : `/${finalPath}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  const fetchTourDetail = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Tours/${id}`);
      setTour(response.data);

      if (response.data.tourSchedules?.length > 0) {
        const firstAvailable = response.data.tourSchedules.find(
          (s: any) => s.availableSeats > 0 && s.status !== 'Inactive' && s.status !== 'Full'
        );
        setSelectedScheduleId(firstAvailable ? firstAvailable.id : response.data.tourSchedules[0].id);
      }
    } catch {
      toast.error('Không thể tải thông tin tour');
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/Reviews/tour/${id}`);
      setReviews(response.data || []);
    } catch (error) {
      console.error('Lỗi lấy đánh giá:', error);
    }
  };

  const handleSendReview = async () => {
    const token = localStorage.getItem('token');
    if (!token) return toast.error('Vui lòng đăng nhập để đánh giá!');
    if (!comment.trim()) return toast.error('Vui lòng nhập nội dung!');

    setIsSubmitting(true);
    const loadId = toast.loading('Đang gửi...');
    try {
      await axios.post(
        `${API_BASE_URL}/api/Reviews`,
        { tourId: Number(id), rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Cảm ơn bạn đã đánh giá!', { id: loadId });
      setComment('');
      setRating(5);
      fetchReviews();
    } catch {
      toast.error('Lỗi khi gửi đánh giá!', { id: loadId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!reviewId) return;
    if (!window.confirm('Bạn xác nhận muốn xóa đánh giá này?')) return;

    const token = localStorage.getItem('token');
    const loadId = toast.loading('Đang xóa...');
    try {
      await axios.delete(`${API_BASE_URL}/api/Reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Đã xóa đánh giá!', { id: loadId });
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch {
      toast.error('Lỗi xóa đánh giá!', { id: loadId });
    }
  };

  const handleNavigateToCheckout = () => {
    const activeSchedule = tour.tourSchedules?.find((s: any) => s.id === selectedScheduleId);

    if (!selectedScheduleId) {
      toast.error('Vui lòng chọn một lịch khởi hành!');
      return;
    }

    if (!activeSchedule || activeSchedule.availableSeats <= 0 || activeSchedule.status === 'Inactive' || activeSchedule.status === 'Full') {
      toast.error('Lịch trình này hiện đã hết chỗ!');
      return;
    }

    navigate(`/checkout/${id}?scheduleId=${selectedScheduleId}&adult=1&child=0`);
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

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="p-12 text-center font-black uppercase text-rose-500">
        Hành trình không tồn tại!
      </div>
    );
  }

  const activeSchedule = tour.tourSchedules?.find((s: any) => s.id === selectedScheduleId);
  const images = tour.tourImages || tour.TourImages || [];
  const displayReviews = reviews.slice(0, 2);
  const reviewCount = reviews.length;

  const isBookable =
    activeSchedule &&
    activeSchedule.availableSeats > 0 &&
    activeSchedule.status !== 'Inactive' &&
    activeSchedule.status !== 'Full';

  return (
    <div className="bg-[#f8fbff] min-h-screen pb-16 font-sans text-slate-900 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto pt-6 sm:pt-8">
        <Link
          to="/tours"
          className="inline-flex items-center text-slate-400 mb-6 sm:mb-8 font-black uppercase text-[10px] tracking-[0.25em] hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" /> Trở lại danh sách
        </Link>

        {/* Top layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8 mb-10 sm:mb-14">
          {/* Left media */}
          <div className="xl:col-span-8 flex flex-col gap-4 sm:gap-6">
            <div className="relative group overflow-hidden rounded-2xl sm:rounded-[2.5rem] shadow-lg border-4 sm:border-8 border-white h-[260px] sm:h-[420px] lg:h-[500px]">
              <img
                src={getImgUrl(tour.imageUrl || tour.thumbnail)}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt={tour.name}
              />
              <div className="absolute top-3 sm:top-6 left-3 sm:left-6 bg-white/90 backdrop-blur-md px-3 sm:px-5 py-2 rounded-full flex items-center shadow">
                <Tag size={13} className="text-blue-600 mr-2" />
                <span className="text-[10px] font-black uppercase tracking-wide">
                  {tour.category?.name || 'Premium'}
                </span>
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
                {images.slice(0, 8).map((img: any, idx: number) => (
                  <div
                    key={idx}
                    className="h-20 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-4 border-white shadow hover:border-blue-300 transition-all cursor-pointer"
                  >
                    <img src={getImgUrl(img)} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right booking card */}
          <div className="xl:col-span-4 bg-white p-5 sm:p-7 rounded-2xl sm:rounded-[2.5rem] shadow-lg border border-blue-100 flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-black mb-5 sm:mb-6 uppercase italic leading-tight">
              {tour.name}
            </h1>

            <div className="mb-6 sm:mb-8">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest flex items-center gap-2">
                <Calendar size={14} /> Lịch khởi hành
              </p>

              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {tour.tourSchedules?.map((s: any) => {
                  const disable = s.availableSeats <= 0 || s.status === 'Inactive' || s.status === 'Full';
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedScheduleId(s.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex justify-between items-center
                        ${selectedScheduleId === s.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}
                        ${disable ? 'opacity-60 grayscale' : ''}`}
                    >
                      <div>
                        <p className={`text-xs font-black uppercase ${selectedScheduleId === s.id ? 'text-blue-600' : 'text-slate-700'}`}>
                          {new Date(s.departureDate || s.startDate).toLocaleDateString('vi-VN')}
                        </p>
                        <p className={`text-[11px] mt-1 font-semibold ${disable ? 'text-rose-500' : 'text-slate-500'}`}>
                          {disable ? 'Hết chỗ' : `Còn ${s.availableSeats} chỗ`}
                        </p>
                      </div>
                      <p className="font-black text-sm">{s.adultPrice?.toLocaleString('vi-VN')}đ</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-auto">
              <div className="text-3xl sm:text-4xl font-black text-blue-600 mb-4 sm:mb-6 tracking-tight">
                {activeSchedule ? activeSchedule.adultPrice?.toLocaleString('vi-VN') : '---'}đ
              </div>
              <button
                onClick={handleNavigateToCheckout}
                disabled={!isBookable}
                className={`w-full py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all flex items-center justify-center gap-2
                  ${!isBookable ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-blue-600'}`}
              >
                {!isBookable ? (
                  'HẾT CHỖ / NGỪNG NHẬN KHÁCH'
                ) : (
                  <>
                    ĐẶT TOUR NGAY <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-10">
          {/* Info */}
          <div className="xl:col-span-8 bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-wide text-blue-600 mb-6 flex items-center gap-2.5">
              <Info size={20} /> Thông tin hành trình
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
              <DetailItem icon={<MapPin size={18} />} label="Điểm khởi hành" value={tour.departureLocation} />
              <DetailItem icon={<Calendar size={18} />} label="Mã hành trình" value={tour.code} />
              <DetailItem
                icon={<Clock size={18} />}
                label="Trạng thái"
                value={activeSchedule?.status === 'Inactive' || activeSchedule?.availableSeats <= 0 ? 'Hết chỗ' : 'Đang mở'}
              />
            </div>

            <div className="text-slate-600 whitespace-pre-line bg-slate-50 p-5 sm:p-8 rounded-2xl leading-relaxed text-sm sm:text-base">
              {tour.description}
            </div>
          </div>

          {/* Reviews */}
          <div className="xl:col-span-4 bg-blue-900 p-5 sm:p-6 rounded-2xl sm:rounded-[2.5rem] text-white shadow-lg h-fit flex flex-col gap-5">
            <h3 className="text-base sm:text-lg font-black uppercase flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Star size={18} className="text-amber-400" fill="currentColor" /> Đánh giá
              </span>
              {reviewCount > 0 && <span className="text-[10px] bg-white/10 px-2.5 py-1 rounded-full">({reviewCount})</span>}
            </h3>

            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
              <div className="flex justify-center gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    onClick={() => setRating(s)}
                    size={18}
                    className={`cursor-pointer ${s <= rating ? 'text-amber-400' : 'text-white/20'}`}
                    fill={s <= rating ? 'currentColor' : 'none'}
                  />
                ))}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ cảm nhận của bạn..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[12px] outline-none mb-3 resize-none h-24 placeholder:text-white/40"
              />

              <button
                onClick={handleSendReview}
                disabled={isSubmitting}
                className="w-full bg-white text-blue-900 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-50 transition-all"
              >
                Gửi đánh giá <Send size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {displayReviews.map((r: any) => {
                const reviewOwnerId = String(r.userId || '').trim();
                const reviewOwnerName = String(r.userName || '').toLowerCase().trim();
                const canDelete =
                  isAdmin ||
                  (myId !== '' && myId === reviewOwnerId) ||
                  (myName !== '' && myName === reviewOwnerName);

                return (
                  <div key={r.id} className="bg-white/10 p-4 rounded-xl border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-black text-[10px] uppercase text-blue-100">
                          {r.userName || 'Khách ẩn danh'}
                        </p>
                        <div className="flex gap-0.5 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={9}
                              className={i < (r.rating || 5) ? 'text-amber-400' : 'text-white/25'}
                              fill="currentColor"
                            />
                          ))}
                        </div>
                      </div>
                      {canDelete && (
                        <button onClick={() => handleDeleteReview(r.id)} className="text-white/50 hover:text-rose-400">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <p className="text-[12px] text-white/80 leading-relaxed line-clamp-2">"{r.comment}"</p>
                  </div>
                );
              })}

              {reviews.length === 0 && (
                <p className="opacity-40 italic text-center py-4 text-[11px] uppercase tracking-wide">Chưa có bình luận</p>
              )}

              {reviews.length > 2 && (
                <button
                  onClick={() => setShowAllReviews(true)}
                  className="w-full py-3 bg-white/10 border border-white/15 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/15 transition-all"
                >
                  Xem tất cả ({reviewCount})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal all reviews */}
      {showAllReviews && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2 text-blue-900">
                <MessageSquare size={19} />
                <h4 className="text-lg sm:text-xl font-black uppercase">Tất cả đánh giá</h4>
              </div>
              <button onClick={() => setShowAllReviews(false)} className="p-2 hover:bg-white rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {reviews.map((r: any) => {
                const rOwnerId = String(r.userId || '').trim();
                const rOwnerName = String(r.userName || '').toLowerCase().trim();
                const canDelInModal =
                  isAdmin ||
                  (myId !== '' && myId === rOwnerId) ||
                  (myName !== '' && myName === rOwnerName);

                return (
                  <div key={r.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-black text-[10px] uppercase text-slate-800">{r.userName || 'Khách ẩn danh'}</p>
                        <div className="flex gap-0.5 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={10}
                              className={i < (r.rating || 5) ? 'text-amber-400' : 'text-slate-200'}
                              fill="currentColor"
                            />
                          ))}
                        </div>
                      </div>
                      {canDelInModal && (
                        <button onClick={() => handleDeleteReview(r.id)} className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed">"{r.comment}"</p>
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
  <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
    <div className="text-blue-600 bg-blue-50 p-3 rounded-xl">{icon}</div>
    <div className="min-w-0">
      <p className="text-[10px] font-black uppercase text-slate-400 tracking-wide mb-0.5">{label}</p>
      <p className="text-sm font-bold text-slate-800 truncate">{value || '---'}</p>
    </div>
  </div>
);

export default TourDetail;