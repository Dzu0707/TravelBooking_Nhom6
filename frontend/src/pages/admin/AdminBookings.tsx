import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  CheckCircle, XCircle, User, MapPin, 
  Search, MoreHorizontal, 
  ShieldCheck, Loader2, Clock, 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  Card, Table, TableHead, TableRow, TableHeaderCell, 
  TableBody, TableCell, Text, Title, Flex 
} from '@tremor/react';

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
      toast.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    if (!window.confirm(`Xác nhận chuyển đơn hàng sang trạng thái ${newStatus}?`)) return;
    try {
      setActionLoading(id);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:5091/api/Bookings/${id}/status`, { status: newStatus }, config);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      toast.success("Cập nhật thành công");
    } catch (err) {
      toast.error("Lỗi cập nhật");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBookings = bookings.filter((b: any) => {
    const matchesStatus = filterStatus === "All" || b.status === filterStatus;
    const searchStr = searchTerm.toLowerCase();
    return matchesStatus && (
      (b.tourName?.toLowerCase().includes(searchStr)) || 
      (b.customerName?.toLowerCase().includes(searchStr)) ||
      (b.user?.fullName?.toLowerCase().includes(searchStr))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 px-4">
      
      {/* TOOLBAR GIỐNG ADMIN TOUR */}
      <Card className="bg-slate-900 border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <Title className="text-slate-100 font-bold uppercase tracking-tight flex items-center gap-2 text-lg">
              Quản lý Đơn hàng <ShieldCheck size={20} className="text-blue-500" />
            </Title>
            <Text className="text-[11px] text-slate-400 font-medium">
              Theo dõi doanh thu và trạng thái đặt chỗ trực tuyến
            </Text>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 md:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text"
                placeholder="Tìm khách hàng, tên tour..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-xs text-slate-200 outline-none focus:border-blue-500/50 transition-all shadow-inner"
              />
            </div>

            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 shadow-inner">
              {["All", "Pending", "Confirmed", "Cancelled"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all uppercase ${
                    filterStatus === s ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {s === "All" ? "Tất cả" : s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* TABLE THEO STYLE TREMOR */}
      <Card className="bg-slate-900 border-slate-800 rounded-xl p-0 overflow-hidden shadow-2xl">
        <Table>
          <TableHead className="bg-slate-950/60">
            <TableRow>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500 p-5">Tour & Khách hàng</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500">Giao dịch</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500 text-center">Trạng thái</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500 text-right">Thao tác</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" size={32}/></TableCell></TableRow>
            ) : filteredBookings.length > 0 ? filteredBookings.map((b: any) => (
              <TableRow key={b.id} className="hover:bg-slate-800/40 transition-colors border-b border-slate-800/50">
                <TableCell className="p-4">
                  <Flex justifyContent="start" className="gap-4">
                    <div className="size-10 rounded-lg bg-slate-800 flex items-center justify-center text-blue-500 shrink-0 border border-slate-700">
                      <MapPin size={18} />
                    </div>
                    <div className="min-w-0">
                      <Text className="font-bold text-slate-200 uppercase text-[11px] leading-tight mb-1 truncate max-w-xs">{b.tourName}</Text>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] text-slate-400 flex items-center gap-1"><User size={10}/> {b.customerName || b.user?.fullName}</span>
                         <span className="text-[9px] text-slate-600 font-mono">#{b.id}</span>
                      </div>
                    </div>
                  </Flex>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Text className="font-black text-emerald-400 text-[13px]">{b.totalPrice?.toLocaleString()} VND</Text>
                    <Text className="text-[9px] text-slate-500 flex items-center gap-1"><Clock size={10}/> {new Date(b.createdAt).toLocaleDateString('vi-VN')}</Text>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {/* Chữ viết gọn lại: Confirmed -> Đã duyệt, Pending -> Chờ, Cancelled -> Đã hủy */}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    b.status === 'Confirmed' 
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                      : b.status === 'Pending' 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                      : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                  }`}>
                    <span className={`size-1.5 rounded-full mr-1.5 ${
                      b.status === 'Confirmed' ? 'bg-emerald-500' : b.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'
                    }`} />
                    {b.status === 'Confirmed' ? 'Thành công' : b.status === 'Pending' ? 'Chờ duyệt' : 'Đã hủy'}
                  </span>
                </TableCell>
                <TableCell className="text-right p-4">
                  <Flex justifyContent="end" className="gap-1">
                    {actionLoading === b.id ? (
                      <Loader2 size={16} className="animate-spin text-blue-500 mr-4" />
                    ) : (
                      <>
                        {b.status === 'Pending' && (
                          <button onClick={() => handleStatusChange(b.id, 'Confirmed')} className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg" title="Duyệt"><CheckCircle size={18}/></button>
                        )}
                        {b.status !== 'Cancelled' && (
                          <button onClick={() => handleStatusChange(b.id, 'Cancelled')} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg" title="Hủy"><XCircle size={18}/></button>
                        )}
                        <button className="p-2 text-slate-500 hover:bg-slate-700 rounded-lg"><MoreHorizontal size={18}/></button>
                      </>
                    )}
                  </Flex>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="p-20 text-center text-slate-500 italic text-xs uppercase tracking-widest">Không có dữ liệu đơn hàng</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminBookings;