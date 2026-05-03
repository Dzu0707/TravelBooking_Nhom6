import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, ArrowRight, Star, MessageSquare, X,
  Calendar, Users, Search, ChevronLeft, ChevronRight, Send,
  DollarSign, Filter, ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';

const PRICE_RANGES = [
  { label: 'Tất cả giá', min: 0, max: 100000000 },
  { label: 'Dưới 1 Triệu', min: 0, max: 1000000 },
  { label: '1Tr - 2 Triệu', min: 1000000, max: 2000000 },
  { label: '2Tr - 5 Triệu', min: 2000000, max: 5000000 },
  { label: '5Tr - 10 Triệu', min: 5000000, max: 10000000 },
  { label: 'Trên 10 Triệu', min: 10000000, max: 100000000 },
];

const TourList = () => {
  const [tours, setTours] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const toursPerPage = 8;

  const [activeReviewId, setActiveReviewId] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5091';

  const getImgUrl = (url: any) => {
    if (!url || typeof url !== 'string') {
      return 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=500';
    }
    if (url.includes(`${API_BASE_URL}/${API_BASE_URL}`)) {
      return url.replace(`${API_BASE_URL}/${API_BASE_URL}`, API_BASE_URL);
    }
    if (url.startsWith('http')) return url;
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [toursRes, catsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/Tours`),
        axios.get(`${API_BASE_URL}/api/Categories`)
      ]);
      setTours(toursRes.data || []);
      setCategories(catsRes.data || []);
    } catch (error) {
      console.error('Lỗi lấy dữ liệu:', error);
      toast.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getDisplayPrice = (tour: any) => {
    return tour.minPrice > 0 ? tour.minPrice : (tour.adultPrice || 0);
  };

  const filteredTours = tours.filter((tour) => {
    const matchesSearch = tour.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryId ? tour.categoryId === selectedCategoryId : true;
    const currentPrice = getDisplayPrice(tour);
    const matchesPrice = currentPrice >= selectedPriceRange.min && currentPrice <= selectedPriceRange.max;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const indexOfLastTour = currentPage * toursPerPage;
  const indexOfFirstTour = indexOfLastTour - toursPerPage;
  const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour);
  const totalPages = Math.ceil(filteredTours.length / toursPerPage);

  const handleSendReview = async (tourId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return toast.error('Vui lòng đăng nhập!');
    if (!comment.trim()) return toast.error('Vui lòng nhập nội dung!');

    const loadId = toast.loading('Đang gửi...');
    try {
      await axios.post(
        `${API_BASE_URL}/api/Reviews`,
        { tourId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Đã gửi đánh giá!', { id: loadId });
      setComment('');
      setActiveReviewId(null);
      fetchData();
    } catch (e) {
      toast.error('Lỗi khi gửi!', { id: loadId });
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#f8fbff]">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="w-full py-10 bg-[#f8fbff] min-h-screen font-sans text-slate-900">
      <div className="max-w-[1600px] mx-auto px-6 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="border-l-4 border-blue-600 pl-6">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">
              Khám Phá <span className="text-blue-600 font-normal">Hành Trình</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Travel with TravelGo</p>
          </div>

          {/* Category chips - wrap, không cuộn */}
          <div className="flex flex-wrap items-center gap-2 pb-2">
            <button
              onClick={() => { setSelectedCategoryId(null); setCurrentPage(1); }}
              className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                !selectedCategoryId ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white text-slate-500 border border-slate-200'
              }`}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategoryId(cat.id); setCurrentPage(1); }}
                className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  selectedCategoryId === cat.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white text-slate-500 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search bar (bỏ ngày đi) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-3 rounded-2xl shadow-sm border border-blue-100">
          <div className="relative md:col-span-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Tên tour..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-xs outline-none focus:ring-2 ring-blue-200"
            />
          </div>

          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={16} />
            <select
              value={selectedPriceRange.label}
              onChange={(e) => {
                const range = PRICE_RANGES.find(r => r.label === e.target.value);
                if (range) setSelectedPriceRange(range);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-10 py-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 outline-none appearance-none cursor-pointer focus:ring-2 ring-blue-200"
            >
              {PRICE_RANGES.map((range) => (
                <option key={range.label} value={range.label}>{range.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          </div>

          <button
            onClick={() => setCurrentPage(1)}
            className="bg-blue-600 text-white rounded-xl font-bold text-[11px] uppercase tracking-wide hover:bg-blue-700 transition-all"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Tour Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[1600px] mx-auto px-6">
        {currentTours.length > 0 ? currentTours.map((tour) => {
          const imgs = tour.tourImages || [];
          const mainImg = imgs.length > 0 ? imgs[0].imageUrl : (tour.imageUrl || tour.thumbnail);
          const reviewCount = tour.reviews?.length || 0;
          const displayPrice = getDisplayPrice(tour);

          return (
            <div key={tour.id} className="group bg-white rounded-[2.2rem] shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-[460px] border border-slate-100 relative overflow-hidden">
              <div className="relative h-48 p-2 grid grid-cols-3 gap-2">
                <div className="col-span-2 overflow-hidden rounded-[1.4rem] relative cursor-pointer" onClick={() => navigate(`/tours/${tour.id}`)}>
                  <img
                    src={getImgUrl(mainImg)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={tour.name}
                    onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=500'; }}
                  />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-lg flex items-center shadow-sm">
                    <Star size={10} className="text-amber-400 mr-1" fill="currentColor" />
                    <span className="text-[10px] font-black">4.9</span>
                  </div>
                </div>
                <div className="col-span-1 grid grid-rows-2 gap-2">
                  <div className="rounded-xl overflow-hidden bg-slate-50">
                    <img src={getImgUrl(imgs[1]?.imageUrl || mainImg)} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="rounded-xl overflow-hidden relative bg-slate-50">
                    <img src={getImgUrl(imgs[2]?.imageUrl || mainImg)} className="w-full h-full object-cover" alt="" />
                    {imgs.length > 3 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[9px] font-black">
                        +{imgs.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5 flex flex-col grow">
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center text-blue-600 font-black text-[8px] uppercase tracking-wider">
                    <MapPin size={10} className="mr-1 text-rose-500" /> {tour.departureLocation || 'Việt Nam'}
                  </span>
                  <button
                    onClick={() => { setActiveReviewId(tour.id); setRating(5); }}
                    className="flex items-center gap-1 text-slate-300 hover:text-blue-600 transition-colors"
                  >
                    <MessageSquare size={14} />
                    {reviewCount > 0 && <span className="text-[9px] font-bold">({reviewCount})</span>}
                  </button>
                </div>

                <h3 className="text-lg font-black text-slate-800 mb-2 uppercase italic line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => navigate(`/tours/${tour.id}`)}>
                  {tour.name}
                </h3>

                <p className="text-slate-400 text-[10px] leading-relaxed line-clamp-2 mb-4 h-8">
                  {tour.description || 'Khám phá vẻ đẹp thiên nhiên cùng hành trình tuyệt vời tại TravelGo...'}
                </p>

                <div className="flex justify-around items-center py-3 border-t border-slate-100 mb-4 mt-auto bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-blue-500" />
                    <span className="text-[8px] font-black uppercase text-slate-400">Hàng ngày</span>
                  </div>
                  <div className="w-[1px] h-3 bg-slate-200"></div>
                  <div className="flex items-center gap-1.5">
                    <Users size={12} className="text-emerald-500" />
                    <span className="text-[8px] font-black uppercase text-slate-400">Còn chỗ</span>
                  </div>
                </div>

                <div className="mt-auto flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-slate-400 mb-0.5">Giá từ</span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xl font-black text-blue-600 italic">{displayPrice.toLocaleString('vi-VN')}</span>
                      <span className="text-[10px] font-bold text-blue-600 uppercase">đ</span>
                    </div>
                  </div>
                  <button onClick={() => navigate(`/tours/${tour.id}`)} className="bg-slate-900 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg">
                    <ArrowRight size={18} />
                  </button>
                </div>

                {/* Review Overlay */}
                {activeReviewId === tour.id && (
                  <div className="absolute inset-0 bg-white/98 backdrop-blur-xl z-50 p-6 flex flex-col animate-in fade-in zoom-in duration-300">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-black uppercase italic text-blue-900">Đánh giá</h4>
                      <button onClick={() => setActiveReviewId(null)} className="text-slate-400 hover:text-rose-500">
                        <X size={18} />
                      </button>
                    </div>
                    <div className="flex justify-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          onClick={() => setRating(s)}
                          size={20}
                          className={`cursor-pointer ${s <= rating ? 'text-amber-400' : 'text-slate-200'}`}
                          fill={s <= rating ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Trải nghiệm của bạn..."
                      className="w-full grow bg-slate-50 border border-slate-100 rounded-xl p-4 text-[11px] outline-none mb-4 resize-none shadow-inner"
                    />
                    <button
                      onClick={() => handleSendReview(tour.id)}
                      className="w-full bg-blue-600 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
                    >
                      Gửi ngay <Send size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
            <Filter size={48} className="text-slate-200 mb-4" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Không tìm thấy tour phù hợp</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-16 flex justify-center items-center gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400 disabled:opacity-20 hover:bg-blue-600 hover:text-white transition-all"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex gap-2 flex-wrap justify-center">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-black text-[10px] transition-all ${
                  currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 border border-slate-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-3 rounded-xl bg-white border border-slate-200 text-slate-400 disabled:opacity-20 hover:bg-blue-600 hover:text-white transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TourList;