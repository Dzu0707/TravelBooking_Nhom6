import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { 
  Trash2, Calendar, Users, Loader2, 
  Eye, X, User, MessageSquare, ClipboardList, Info, Ticket
} from 'lucide-react';

interface BookingAttendee {
  fullName: string;
  type: string; 
  dateOfBirth: string;
}

interface MyBooking {
  id: number;
  tourName: string;
  totalPrice: number;
  totalPassengers: number;
  status: string;
  createdAt: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialRequest: string;
  adultCount: number;
  childCount: number;
  attendees?: BookingAttendee[];
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState<MyBooking | null>(null);

  const API_BASE_URL = "http://localhost:5091";

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/Bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch (error) {
      toast.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    const orderCode = `PAYTOUR${id.toString().padStart(3, '0')}NHOM6`;
    if (!window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng ${orderCode}?`)) return;
    const loadId = toast.loading("Đang xử lý hủy...");
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/Bookings/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Đã hủy đơn hàng thành công", { id: loadId });
      fetchMyBookings();
    } catch (error: any) {
      toast.error("Không thể hủy đơn này", { id: loadId });
    }
  };

  const filteredBookings = filter === 'All' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
      <p className="text-slate-500 font-medium">Đang tải lịch sử đặt chỗ...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 pt-10 pb-10 px-4 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
             <Ticket className="text-indigo-600" size={32} />
             <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">
                Lịch sử <span className="text-indigo-600 font-normal">Đặt vé</span>
             </h1>
          </div>
          <div className="flex gap-2 mt-8 overflow-x-auto no-scrollbar">
            {['All', 'Pending', 'Confirmed', 'Cancelled'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === t ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                }`}
              >
                {t === 'All' ? 'Tất cả' : t === 'Pending' ? 'Chờ duyệt' : t === 'Confirmed' ? 'Thành công' : 'Đã hủy'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="max-w-5xl mx-auto px-4 mt-10 space-y-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((b, index) => {
            // TỰ ĐỘNG TẠO MÃ ĐƠN HÀNG TỪ ID
            const displayCode = `PAYTOUR${b.id.toString().padStart(3, '0')}NHOM6`;
            
            return (
              <div key={b.id} className="relative bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row gap-6 shadow-sm hover:shadow-xl transition-all duration-300">
                
                {/* STT Badge */}
                <div className="absolute -left-3 top-8 w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-black shadow-lg z-10">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="flex-1 md:ml-4">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {/* Hiển thị mã đã được xử lý */}
                    <span className="text-[11px] font-black text-white bg-indigo-600 px-3 py-1.5 rounded-lg shadow-sm tracking-widest uppercase">
                      {displayCode}
                    </span>
                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg border tracking-widest ${
                      b.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      b.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {b.status === 'Confirmed' ? 'CONFIRMED' : b.status === 'Cancelled' ? 'CANCELLED' : 'PENDING'}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-800 uppercase italic mb-5 leading-tight">{b.tourName}</h3>
                  
                  <div className="flex flex-wrap gap-6 text-slate-500">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-slate-50 rounded-xl text-indigo-500"><Calendar size={16} /></div>
                      <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Ngày đặt</span>
                          <span className="text-xs font-bold text-slate-700">{format(new Date(b.createdAt), 'dd/MM/yyyy')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-slate-50 rounded-xl text-emerald-500"><Users size={16} /></div>
                      <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Hành khách</span>
                          <span className="text-xs font-bold text-slate-700">{b.totalPassengers} người đi</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-50 pt-6 md:pt-0 md:pl-10 gap-5">
                  <div className="flex flex-col md:items-end">
                      <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Tổng cộng</span>
                      <div className="text-2xl font-black text-slate-900 tracking-tighter">{b.totalPrice.toLocaleString()}₫</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedBooking(b)}
                      className="px-5 py-3 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-200"
                    >
                      <Eye size={14} /> Chi tiết
                    </button>
                    {b.status === 'Pending' && (
                      <button 
                        onClick={() => handleCancel(b.id)}
                        className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-slate-50 text-slate-300 font-black uppercase text-sm tracking-[0.3em]">
            Trống trải
          </div>
        )}
      </div>

      {/* MODAL CHI TIẾT */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-indigo-600 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-black uppercase italic leading-none mb-2">Thông tin hóa đơn</h2>
                <p className="text-indigo-100 text-[11px] font-black tracking-[0.2em] uppercase">Mã số: PAYTOUR{selectedBooking.id.toString().padStart(3, '0')}NHOM6</p>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="relative z-10 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 transition-all">
                <X size={24} />
              </button>
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto space-y-10 no-scrollbar">
              {/* Thông tin liên hệ */}
              <section>
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-5 flex items-center gap-2">
                  <User size={14} /> Thông tin liên hệ
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-[2rem]">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Người đại diện</p>
                    <p className="font-bold text-slate-800 text-sm uppercase">{selectedBooking.contactName}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Hotline liên lạc</p>
                    <p className="font-bold text-slate-800 text-sm">{selectedBooking.contactPhone}</p>
                  </div>
                  <div className="col-span-full border-t border-slate-200 pt-4 mt-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Địa chỉ Email</p>
                    <p className="font-bold text-slate-800 text-sm lowercase">{selectedBooking.contactEmail}</p>
                  </div>
                </div>
              </section>

              {/* Chi tiết khách & Ghi chú */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <section>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-5 flex items-center gap-2">
                    <ClipboardList size={14} /> Phân loại khách
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-slate-50 px-5 py-3 rounded-2xl">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Người lớn</span>
                        <span className="font-black text-slate-800">{selectedBooking.adultCount}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 px-5 py-3 rounded-2xl">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Trẻ em</span>
                        <span className="font-black text-slate-800">{selectedBooking.childCount}</span>
                    </div>
                  </div>
                </section>
                <section>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-5 flex items-center gap-2">
                    <MessageSquare size={14} /> Lời nhắn từ khách
                  </h4>
                  <div className="text-xs italic text-slate-600 bg-amber-50/50 p-5 rounded-[2rem] border border-amber-100 leading-relaxed min-h-[80px]">
                    {selectedBooking.specialRequest || "Không có yêu cầu đặc biệt nào được ghi chú cho hành trình này."}
                  </div>
                </section>
              </div>

              {/* Danh sách hành khách */}
              {selectedBooking.attendees && selectedBooking.attendees.length > 0 && (
                <section>
                   <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-5 flex items-center gap-2">
                    <Info size={14} /> Danh sách hành khách đi cùng
                   </h4>
                   <div className="border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-400 font-black uppercase text-[9px]">
                          <tr>
                            <th className="p-5">Hành khách</th>
                            <th className="p-5">Loại</th>
                            <th className="p-5 text-right">Ngày sinh</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
                          {selectedBooking.attendees.map((at, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-5 uppercase tracking-tighter">{at.fullName}</td>
                              <td className="p-5">
                                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase">
                                    {at.type === 'Adult' ? 'NGƯỜI LỚN' : 'TRẺ EM'}
                                </span>
                              </td>
                              <td className="p-5 text-right text-slate-400">{format(new Date(at.dateOfBirth), 'dd/MM/yyyy')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
                </section>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1 leading-none">Thành tiền</p>
                    <p className="text-3xl font-black text-indigo-600 tracking-tighter leading-none">{selectedBooking.totalPrice.toLocaleString()}₫</p>
                </div>
                <button onClick={() => setSelectedBooking(null)} className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
                  ĐÓNG
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;