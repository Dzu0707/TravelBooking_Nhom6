import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  CheckCircle, XCircle, User, MapPin, 
  Search, MoreHorizontal, TrendingUp,
  ShieldCheck, Calendar, Loader2, AlertCircle // Đã xóa Filter
} from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:5091/api/Bookings', config);
      setBookings(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      setActionLoading(id);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:5091/api/Bookings/${id}/status`, { status: newStatus }, config);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (err) {
      alert("Không thể cập nhật trạng thái đơn hàng!");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBookings = bookings.filter((b: any) => {
    const matchesStatus = filterStatus === "All" ? true : b.status === filterStatus;
    const tourName = b.tourName || "";
    const customerName = b.customerName || b.user?.fullName || "Khách ẩn danh";
    
    const matchesSearch = tourName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Cancelled': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-[13px] pb-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-slate-900/40 p-6 rounded-3xl border border-slate-800/60 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
            Hệ thống đơn hàng <ShieldCheck size={22} className="text-blue-500 animate-pulse"/>
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
              <TrendingUp size={12} className="text-emerald-500"/>
              {bookings.length} Tổng đơn hàng
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group flex-1 min-w-60"> {/* ĐÃ FIX: min-w-[240px] -> min-w-60 */}
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={15}/>
            <input 
              type="text" 
              placeholder="Tìm tên khách, tên tour..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-[12px] text-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600 shadow-inner"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
            {["All", "Pending", "Confirmed", "Cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-tighter ${
                  filterStatus === s 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                {s === "All" ? "Tất cả" : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#0F172A] rounded-3xl border border-slate-800/60 overflow-hidden shadow-2xl relative">
        {loading && (
           <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <Loader2 className="text-blue-500 animate-spin" size={40} />
           </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-200"> {/* ĐÃ FIX: min-w-[800px] -> min-w-200 */}
            <thead>
              <tr className="bg-slate-800/30 border-b border-slate-800/60">
                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Thông tin tour & Khách</th>
                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Giá trị giao dịch</th>
                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Trạng thái</th>
                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Quản trị viên xử lý</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filteredBookings.map((b: any) => (
                <tr key={b.id} className="hover:bg-blue-600/2 transition-all group"> {/* ĐÃ FIX: opacity [0.02] -> /2 */}
                  <td className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-blue-500 shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <MapPin size={20}/>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-100 text-[14px] leading-tight group-hover:text-blue-400 transition-colors truncate mb-1">
                          {b.tourName}
                        </p>
                        <div className="flex items-center gap-3 text-[11px]">
                          <span className="flex items-center gap-1.5 font-bold text-slate-400 bg-slate-800/40 px-2 py-0.5 rounded-lg border border-slate-700/30">
                            <User size={12} className="text-blue-400"/> {b.customerName || b.user?.fullName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col">
                      <p className="font-black text-emerald-400 text-[15px] tracking-tight">
                        {b.totalPrice?.toLocaleString()} <span className="text-[10px] text-slate-500">VND</span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5 mt-1.5">
                        <Calendar size={11} className="text-slate-700"/> 
                        {new Date(b.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase border tracking-wider shadow-sm ${getStatusStyle(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end items-center gap-2">
                      {actionLoading === b.id ? (
                        <Loader2 size={16} className="animate-spin text-blue-500 mr-2" />
                      ) : (
                        <>
                          <button 
                            onClick={() => handleStatusChange(b.id, 'Confirmed')}
                            disabled={b.status === 'Confirmed'}
                            className="w-9 h-9 flex items-center justify-center hover:bg-emerald-500/10 text-emerald-500/40 hover:text-emerald-400 rounded-xl border border-transparent hover:border-emerald-500/20 transition-all disabled:opacity-0 disabled:pointer-events-none"
                            title="Xác nhận đơn"
                          >
                            <CheckCircle size={18}/>
                          </button>
                          <button 
                            onClick={() => handleStatusChange(b.id, 'Cancelled')}
                            disabled={b.status === 'Cancelled'}
                            className="w-9 h-9 flex items-center justify-center hover:bg-rose-500/10 text-rose-500/40 hover:text-rose-400 rounded-xl border border-transparent hover:border-rose-500/20 transition-all disabled:opacity-0 disabled:pointer-events-none"
                            title="Hủy đơn hàng"
                          >
                            <XCircle size={18}/>
                          </button>
                          <button className="w-9 h-9 flex items-center justify-center bg-slate-800/50 hover:bg-slate-800 text-slate-500 hover:text-white rounded-xl border border-slate-700/50 transition-all" title="Xem chi tiết">
                            <MoreHorizontal size={18}/>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!loading && filteredBookings.length === 0 && (
            <div className="py-24 text-center">
              <div className="inline-flex w-20 h-20 bg-slate-900/50 rounded-[2.5rem] items-center justify-center mb-4 text-slate-700 border-2 border-dashed border-slate-800">
                  <AlertCircle size={32}/>
              </div>
              <p className="text-slate-500 font-black text-[13px] uppercase tracking-[0.3em]">Dữ liệu trống</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;