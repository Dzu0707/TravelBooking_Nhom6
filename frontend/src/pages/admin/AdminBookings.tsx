import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  CheckCircle, XCircle, User, MapPin, 
  Search, Filter, MoreHorizontal, TrendingUp,
  ShieldCheck, Calendar // Đảm bảo dùng các icon này
} from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

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
  }

  useEffect(() => { fetchBookings(); }, []);

  const filteredBookings = bookings.filter((b: any) => {
    const matchesStatus = filterStatus === "All" ? true : b.status === filterStatus;
    const matchesSearch = b.tourName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
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
    <div className="space-y-5 animate-in fade-in duration-500 text-[13px]">
      {/* Header gọn gàng */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-2">
            Hệ thống đơn hàng <ShieldCheck size={18} className="text-blue-500"/>
          </h1>
          <p className="text-[11px] text-slate-500 font-bold tracking-widest uppercase mt-1 flex items-center gap-2">
            <TrendingUp size={14} className="text-emerald-500"/>
            {bookings.length} Giao dịch đang quản lý
          </p>
        </div>

        {/* Search & Filter Mini */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={14}/>
            <input 
              type="text" 
              placeholder="Tìm khách, tour..."
              className="pl-9 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl w-56 text-[12px] text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex bg-slate-800/40 p-1 rounded-xl border border-slate-800">
            {["All", "Pending", "Confirmed", "Cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all uppercase tracking-tighter ${
                  filterStatus === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {s === "All" ? "Tất cả" : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Content - Glassmorphism style */}
      <div className="bg-[#1E293B]/20 rounded-2xl border border-slate-800/50 overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/40 border-b border-slate-800">
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Chi tiết đặt tour</th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Giá trị & Thời gian</th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Trạng thái</th>
                <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-slate-500 font-bold text-[11px] uppercase tracking-widest">Đang kết nối server...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredBookings.map((b: any) => (
                <tr key={b.id} className="hover:bg-blue-600/5 transition-all group">
                  <td className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
                        <MapPin size={18}/>
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-200 text-[13px] mb-0.5 group-hover:text-blue-400 transition-colors truncate">
                          {b.tourName}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1 font-bold text-slate-400">
                             <User size={12} className="text-slate-600"/> {b.customerName}
                          </span>
                          <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                          <span className="italic font-medium">{b.totalPassengers} khách</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <p className="font-black text-white text-[14px] tracking-tight">
                        {b.totalPrice?.toLocaleString()} <span className="text-[10px] text-blue-500">đ</span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1 mt-0.5">
                        <Calendar size={10}/> {new Date(b.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase border ${getStatusStyle(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-all">
                      <button className="w-8 h-8 flex items-center justify-center hover:bg-emerald-500/20 text-emerald-400 rounded-lg border border-transparent hover:border-emerald-500/30 transition-all shadow-sm" title="Duyệt đơn">
                        <CheckCircle size={16}/>
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center hover:bg-rose-500/20 text-rose-400 rounded-lg border border-transparent hover:border-rose-500/30 transition-all shadow-sm" title="Hủy đơn">
                        <XCircle size={16}/>
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-700 text-slate-400 rounded-lg border border-slate-700 transition-all" title="Chi tiết">
                        <MoreHorizontal size={16}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {!loading && filteredBookings.length === 0 && (
            <div className="p-20 text-center">
              <div className="inline-flex w-16 h-16 bg-slate-800/50 rounded-full items-center justify-center mb-3 text-slate-600 border border-slate-800">
                  <Filter size={24}/>
              </div>
              <p className="text-slate-500 font-black text-[12px] uppercase tracking-widest">Không tìm thấy dữ liệu phù hợp</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer info nhỏ gọn */}
      <footer className="pt-2 flex justify-between items-center text-slate-600 text-[10px] font-black uppercase tracking-tighter italic">
          <p>© 2026 Admin Control Panel • Secure Mode</p>
          <div className="flex gap-4">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> System Live</span>
          </div>
      </footer>
    </div>
  );
};

export default AdminBookings;