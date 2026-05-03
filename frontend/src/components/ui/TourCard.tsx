import { MapPin, ArrowRight, Calendar, Users, MessageSquare, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5091';

const toFullUrl = (url?: string) => {
  if (!url) return 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=500';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const TourCard = ({ tour }: any) => {
  const images = tour.tourImages || tour.TourImages || [];

  const primaryImage =
    images.find((i: any) => i.isPrimary || i.IsPrimary)?.imageUrl ||
    images[0]?.imageUrl ||
    tour.imageUrl ||
    tour.thumbnail;

  const imageUrl = toFullUrl(primaryImage);

  const getMinPrice = (tourData: any) => {
    const schedules = tourData.tourSchedules || tourData.TourSchedules || [];
    if (schedules.length > 0) {
      const prices = schedules
        .map((s: any) => s.adultPrice ?? s.AdultPrice ?? 0)
        .filter((p: number) => p > 0);
      if (prices.length > 0) return Math.min(...prices);
    }
    return tourData.minPrice || tourData.adultPrice || tourData.AdultPrice || 0;
  };

  const price = getMinPrice(tour);

  return (
    <div
      className="
        bg-white rounded-2xl sm:rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden
        flex flex-col group hover:shadow-lg transition-all duration-300
        min-h-[420px] sm:min-h-[450px] lg:h-[470px]
      "
    >
      {/* Ảnh */}
      <div className="relative h-44 sm:h-48 lg:h-52 p-2 grid grid-cols-3 gap-2 bg-slate-50/50">
        <div className="col-span-2 overflow-hidden rounded-xl sm:rounded-2xl relative">
          <img
            src={imageUrl}
            className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
            alt={tour.name}
          />

          {/* Badge rating */}
          <div className="absolute top-2 left-2 bg-white/95 px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5">
            <Star size={10} className="text-amber-400" fill="currentColor" />
            <span className="text-[10px] font-black text-slate-900">4.9</span>
          </div>
        </div>

        <div className="col-span-1 grid grid-rows-2 gap-2">
          <div className="overflow-hidden rounded-lg sm:rounded-xl bg-slate-100 shadow-inner">
            <img
              src={toFullUrl(images[0]?.imageUrl || imageUrl)}
              className="w-full h-full object-cover"
              alt=""
            />
          </div>

          <div className="overflow-hidden rounded-lg sm:rounded-xl bg-slate-100 relative shadow-inner">
            <img
              src={toFullUrl(images[1]?.imageUrl || imageUrl)}
              className="w-full h-full object-cover"
              alt=""
            />
            {images.length > 2 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[9px] font-black">
                +{images.length - 2}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nội dung - FIX CHÍNH: tăng top padding + line-height để tiêu đề không bị che */}
      <div className="px-4 sm:px-5 pt-5 pb-4 flex flex-col grow">
        <div className="flex justify-between items-center mb-2 gap-2">
          <span className="min-w-0 text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <MapPin size={10} className="text-rose-500 shrink-0" />
            <span className="truncate">{tour.departureLocation || 'Việt Nam'}</span>
          </span>

          <div className="shrink-0 flex items-center gap-1 text-slate-400 font-bold text-[9px] uppercase tracking-wider">
            <MessageSquare size={12} /> REVIEW
          </div>
        </div>

        {/* FIX: bỏ nguy cơ “dính” vào ảnh bằng leading rõ ràng + mb lớn hơn */}
        <h3 className="text-[15px] sm:text-[17px] font-black text-slate-800 uppercase italic leading-[1.25] line-clamp-2 mb-2.5 group-hover:text-blue-600 transition-colors">
          {tour.name}
        </h3>

        <p className="text-slate-500 text-[12px] leading-5 line-clamp-2 mb-3 min-h-[40px]">
          {tour.description || 'Hành trình khám phá tuyệt vời cùng TravelGo...'}
        </p>

        <div className="mt-auto space-y-3">
          <div className="flex justify-around items-center py-2.5 border-y border-slate-100 bg-slate-50/40 rounded-lg">
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase text-slate-400">Hàng ngày</span>
            </div>

            <div className="w-px h-4 bg-slate-200" />

            <div className="flex items-center gap-1.5">
              <Users size={12} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase text-slate-400">Còn chỗ</span>
            </div>
          </div>

          <div className="flex items-end justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-slate-400">Giá từ</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-[30px] font-black text-blue-600 italic leading-none">
                  {price > 0 ? price.toLocaleString('vi-VN') : '---'}
                </span>
                <span className="text-sm font-bold text-blue-600 uppercase">đ</span>
              </div>
            </div>

            <Link to={`/tours/${tour.id}`} className="shrink-0">
              <button className="bg-slate-900 text-white px-4 sm:px-5 py-3 rounded-xl sm:rounded-2xl font-black text-[10px] uppercase tracking-[0.12em] hover:bg-blue-600 transition-all flex items-center gap-1.5">
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;