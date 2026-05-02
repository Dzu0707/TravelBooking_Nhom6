import { MapPin, ArrowRight, Calendar, Users, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const TourCard = ({ tour }: any) => {
  const API_BASE_URL = "http://localhost:5091"; 
  const imageUrl = tour.imageUrl ? (tour.imageUrl.startsWith('http') ? tour.imageUrl : `${API_BASE_URL}${tour.imageUrl}`) : 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=500';
  
  // Logic lấy giá thấp nhất
  const getMinPrice = (tour: any) => {
    const schedules = tour.tourSchedules || tour.TourSchedules || [];
    if (schedules.length > 0) {
      const prices = schedules.map((s: any) => s.adultPrice || s.AdultPrice).filter((p: number) => p > 0);
      if (prices.length > 0) return Math.min(...prices);
    }
    return tour.adultPrice || tour.AdultPrice || 0;
  };

  const price = getMinPrice(tour);

  return (
    // FIX 1: Ép chiều cao cố định h-[480px] để card không bị kéo dài theo nội dung
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden h-[480px] flex flex-col group hover:shadow-xl transition-all duration-500 relative">
      
      {/* FIX 2: Nén phần ảnh ghép (Sử dụng aspect-video để ảnh dẹt lại, tạo không gian vuông cho card) */}
      <div className="relative aspect-video p-2 grid grid-cols-3 gap-2 bg-slate-50/50">
        <div className="col-span-2 overflow-hidden rounded-2xl relative">
          <img src={imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={tour.name} />
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-indigo-700 font-bold text-[8px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <MapPin size={10} /> {tour.departureLocation}
          </div>
        </div>
        <div className="col-span-1 grid grid-rows-2 gap-2">
            <div className="overflow-hidden rounded-xl bg-slate-100 shadow-inner">
                <img src={tour.tourImages?.[0]?.imageUrl || imageUrl} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="overflow-hidden rounded-xl bg-slate-100 relative shadow-inner">
                <img src={tour.tourImages?.[1]?.imageUrl || imageUrl} className="w-full h-full object-cover" alt="" />
                {tour.tourImages?.length > 2 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[9px] font-black">
                        +{tour.tourImages.length - 2}
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* FIX 3: Nén Padding phần nội dung (p-4 thay vì p-8) */}
      <div className="p-5 pt-3 flex flex-col grow">
        
        <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <MapPin size={10} className="text-rose-500"/> {tour.departureLocation}
            </span>
            <div className="flex items-center gap-1 text-slate-400 font-bold text-[9px] uppercase tracking-widest">
                <MessageSquare size={12}/> REVIEW
            </div>
        </div>

        {/* FIX 4: Ép tiêu đề 1 dòng (line-clamp-1) để card không bị đẩy xuống */}
        <h3 className="text-lg font-black text-slate-800 uppercase italic line-clamp-1 tracking-tighter mb-2 group-hover:text-indigo-600 transition-colors">
          {tour.name}
        </h3>

        <p className="text-slate-500 text-[11px] italic leading-snug line-clamp-2 mb-4 h-8">
            {tour.description || "Hành trình khám phá tuyệt vời cùng TravelGo..."}
        </p>

        {/* FIX 5: Nén khối Info sát lại nhau */}
        <div className="mt-auto space-y-4">
            <div className="flex justify-around items-center py-2 border-y border-slate-50 bg-slate-50/30 rounded-lg">
                <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-indigo-500"/>
                    <span className="text-[8px] font-black uppercase text-slate-400">Hàng ngày</span>
                </div>
                <div className="w-[1px] h-3 bg-slate-200"></div>
                <div className="flex items-center gap-1.5">
                    <Users size={12} className="text-emerald-500"/>
                    <span className="text-[8px] font-black uppercase text-slate-400">Còn chỗ</span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-slate-400">Giá từ</span>
                    <div className="flex items-baseline gap-0.5">
                        <span className="text-xl font-black text-indigo-600 italic">
                          {price > 0 ? price.toLocaleString() : '---'}
                        </span>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase">đ</span>
                    </div>
                </div>

                <Link to={`/tours/${tour.id}`}>
                    <button className="bg-slate-950 text-white px-7 py-4 rounded-2xl font-black text-[9px] uppercase tracking-[0.15em] shadow-lg shadow-slate-200 hover:bg-indigo-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group/btn">
                        Chi tiết <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;