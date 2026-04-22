import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Calendar, Users, Ticket, MapPin,      
  Tag, ArrowLeft, PlaneTakeoff 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5091/api/Bookings/my-bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data);
      } catch (error) {
        console.error("Lỗi khi tải lịch sử đặt tour", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, []);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#f8faff]">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-black text-indigo-600 uppercase italic text-[10px] tracking-[0.3em]">Đang tải hành trình...</p>
    </div>
  );

  return (
    <div className="bg-[#f8faff] min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* NÚT QUAY LẠI */}
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center text-slate-400 mb-8 font-black uppercase text-[10px] tracking-[0.4em] hover:text-indigo-600 transition-all outline-none"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform"/> QUAY LẠI
        </button>

        {/* HEADER */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-5xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">Chuyến đi<br/>của tôi</h2>
            <div className="h-2 w-20 bg-indigo-600 mt-4 rounded-full"></div>
          </div>
          <div className="text-right hidden sm:block">
             <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Lịch sử đặt chỗ</p>
             <p className="text-slate-800 font-black text-lg italic">{bookings.length} Tours</p>
          </div>
        </div>

        <div className="space-y-8">
          {bookings.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-20 text-center shadow-2xl border border-white">
              <Ticket size={64} className="mx-auto text-slate-100 mb-6 rotate-12" />
              <p className="text-slate-400 font-black italic uppercase text-lg mb-8">Bạn chưa có chuyến đi nào</p>
              <button 
                onClick={() => navigate('/tours')}
                className="px-10 py-4 bg-indigo-600 text-white rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-700 transition-all"
              >
                Khám phá ngay
              </button>
            </div>
          ) : (
            bookings.map((booking) => (
              <div key={booking.id} className="group bg-white rounded-[3.5rem] overflow-hidden shadow-2xl shadow-indigo-100/50 border border-white grid grid-cols-1 lg:grid-cols-4 transition-all hover:shadow-indigo-200/60">
                
                {/* THÔNG TIN TOUR */}
                <div className="lg:col-span-3 p-8 md:p-10 space-y-8">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className={`px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                      booking.status === 'Confirmed' ? 'bg-emerald-500 text-white' : 
                      booking.status === 'Cancelled' ? 'bg-rose-500 text-white' : 'bg-amber-400 text-white'
                    }`}>
                      {booking.status === 'Confirmed' ? 'Đã duyệt' : booking.status === 'Cancelled' ? 'Đã hủy' : 'Chờ xác nhận'}
                    </span>
                    <span className="text-[10px] font-black text-slate-300 uppercase font-mono">#{booking.id}</span>
                  </div>

                  <div>
                    <h3 className="text-3xl font-black text-slate-800 uppercase italic leading-tight group-hover:text-indigo-600 transition-colors mb-2">
                      {booking.tourName || "Tên Tour Đang Cập Nhật"}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      <MapPin size={12} className="text-indigo-500"/> {booking.departureLocation || 'Khởi hành: Theo lịch trình'}
                    </div>
                  </div>

                  {/* CÁC THÔNG SỐ NGÀY GIỜ */}
                  <div className="flex flex-wrap gap-8 py-6 border-t border-slate-100">
                    {/* NGÀY KHỞI HÀNH (QUAN TRỌNG NHẤT) */}
                    <div className="space-y-1 pr-8 border-r border-slate-200">
                       <span className="text-[9px] font-black text-indigo-500 uppercase flex items-center gap-1.5">
                         <PlaneTakeoff size={14}/> Ngày khởi hành
                       </span>
                       <p className="text-base font-black text-indigo-600 italic">
                         {booking.startDate 
                           ? new Date(booking.startDate).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'}) 
                           : "Chưa cập nhật"}
                       </p>
                    </div>

                    <div className="space-y-1">
                       <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1.5"><Calendar size={12}/> Ngày đặt đơn</span>
                       <p className="text-sm font-black text-slate-700">{new Date(booking.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>

                    <div className="space-y-1">
                       <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1.5"><Users size={12}/> Số khách</span>
                       <p className="text-sm font-black text-slate-700">{booking.adultCount}L, {booking.childCount}T</p>
                    </div>

                    {booking.voucherCode && (
                       <div className="space-y-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1.5"><Tag size={12}/> Ưu đãi</span>
                          <p className="text-sm font-black text-emerald-600">{booking.voucherCode}</p>
                       </div>
                    )}
                  </div>
                </div>

                {/* GIÁ TIỀN */}
                <div className="lg:col-span-1 bg-[#0f172a] p-8 text-white flex flex-col justify-center items-center lg:items-end text-center lg:text-right border-l border-white/5">
                  <span className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] mb-2 italic">Tổng thanh toán</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-[#fbbf24] italic tracking-tighter">
                      {booking.totalPrice?.toLocaleString()}
                    </span>
                    <span className="text-[#fbbf24] font-black text-[10px] uppercase">VND</span>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;