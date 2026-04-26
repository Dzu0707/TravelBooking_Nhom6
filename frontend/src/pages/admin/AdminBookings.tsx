import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  XCircle, User, MapPin, 
  Search, ShieldCheck, Loader2, 
  Banknote, AlertTriangle, Fingerprint,
  CalendarDays, Copy, 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  Card, Table, TableHead, TableRow, TableHeaderCell, 
  TableBody, TableCell, Text, Title, Flex, Badge
} from '@tremor/react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const API_BASE_URL = "http://localhost:5091/api/Bookings";

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(API_BASE_URL, config);
      setBookings(res.data);
    } catch (err) {
      toast.error("Lỗi tải dữ liệu đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleVerifyPayment = async (id: number) => {
    const paymentCode = `PAYTOUR${id}NHOM6`;
    if (!window.confirm(`Xác nhận đã nhận đủ tiền cho nội dung: ${paymentCode}?`)) return;
    
    try {
      setActionLoading(id);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.put(`${API_BASE_URL}/${id}/confirm-payment`, {}, config);
      
      setBookings(prev => prev.map(b => 
        b.id === id ? { ...b, status: "Confirmed" } : b
      ));
      
      toast.success(`Đã duyệt thanh toán đơn #${id}`);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data || "Lỗi xác thực";
      toast.error(errorMsg);
    } finally {
      setActionLoading(null);
    }
  };

  // --- HÀM HỦY DÀNH CHO ADMIN MỚI THÊM ---
  const handleCancelAdmin = async (id: number) => {
    if (!window.confirm(`CẢNH BÁO: Bạn đang thực hiện HỦY đơn hàng #${id}. Thao tác này không thể hoàn tác. Tiếp tục?`)) return;
    
    try {
      setActionLoading(id);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Sử dụng API hủy của hệ thống
      await axios.put(`${API_BASE_URL}/${id}/cancel`, {}, config);
      
      setBookings(prev => prev.map(b => 
        b.id === id ? { ...b, status: "Cancelled" } : b
      ));
      
      toast.success(`Đã hủy đơn hàng #${id}`);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data || "Lỗi khi hủy đơn";
      toast.error(errorMsg);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Đã sao chép mã đối soát");
  };

  const filteredBookings = bookings.filter((b: any) => {
    const matchesStatus = filterStatus === "All" || b.status === filterStatus;
    const searchStr = searchTerm.toLowerCase().trim();
    const generatedPaymentCode = `PAYTOUR${b.id}NHOM6`.toLowerCase();
    const customerName = (b.customerName || b.fullName || "").toLowerCase();
    const tourName = (b.tourName || "").toLowerCase();

    return matchesStatus && (
      tourName.includes(searchStr) || 
      customerName.includes(searchStr) ||
      b.id.toString().includes(searchStr) ||
      generatedPaymentCode.includes(searchStr)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 px-4 pt-6 font-sans">
      
      <Card className="bg-slate-900 border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <Title className="text-slate-100 font-black uppercase italic flex items-center gap-2 tracking-tight">
              ĐỐI SOÁT GIAO DỊCH <ShieldCheck size={20} className="text-pink-500" />
            </Title>
            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">
              Khớp nội dung chuyển khoản từ khách hàng với hệ thống
            </Text>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text"
                placeholder="Dán mã PAYTOUR... hoặc tìm tên khách"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-[11px] font-bold text-slate-200 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/20 transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              {["All", "Pending", "Confirmed", "Cancelled"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                    filterStatus === s ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {s === "All" ? "Tất cả" : s === "Pending" ? "Chờ tiền" : s === "Confirmed" ? "Đã duyệt" : "Đã hủy"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-slate-900 border-slate-800 rounded-3xl p-0 overflow-hidden shadow-2xl">
        <Table>
          <TableHead className="bg-slate-950/60">
            <TableRow>
              <TableHeaderCell className="text-[10px] font-black uppercase text-slate-500 p-5">Tour & Khách hàng</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-black uppercase text-slate-500 text-center">Mã đối soát (Nội dung CK)</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-black uppercase text-slate-500">Giá trị & Ngày đặt</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-black uppercase text-slate-500 text-center">Trạng thái</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-black uppercase text-slate-500 text-right">Thao tác</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="p-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-pink-500" size={40}/>
                    <Text className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Đang truy xuất dữ liệu...</Text>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="p-20 text-center">
                   <Text className="text-slate-600 uppercase font-black italic tracking-widest">Không có dữ liệu khớp với tìm kiếm</Text>
                </TableCell>
              </TableRow>
            ) : filteredBookings.map((b: any) => {
              const displayCode = `PAYTOUR${b.id}NHOM6`;
              return (
                <TableRow key={b.id} className="hover:bg-slate-800/40 transition-colors border-b border-slate-800/50">
                  <TableCell className="p-5">
                    <Flex justifyContent="start" className="gap-3">
                      <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400 border border-slate-700 shadow-inner">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <Text className="font-black text-slate-100 uppercase text-[11px] italic tracking-tight leading-tight">{b.tourName || "N/A"}</Text>
                        <Text className="text-[10px] text-slate-500 font-bold flex items-center gap-1 mt-1">
                          <User size={10} className="text-slate-400"/> {b.customerName || b.fullName}
                        </Text>
                      </div>
                    </Flex>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="group flex items-center justify-center gap-2">
                      <Badge color="pink" icon={Fingerprint} className="font-mono font-black uppercase text-[10px] px-3 py-1.5 ring-1 ring-pink-500/30 bg-pink-500/5">
                        {displayCode}
                      </Badge>
                      <button 
                        onClick={() => handleCopy(displayCode)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-white"
                      >
                        <Copy size={14}/>
                      </button>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Text className="font-black text-emerald-400 text-[14px] italic">{b.totalPrice?.toLocaleString('vi-VN')} đ</Text>
                    <Text className="text-[9px] text-slate-500 flex items-center gap-1 mt-1 font-bold">
                      <CalendarDays size={10}/> {new Date(b.createdAt).toLocaleDateString('vi-VN')}
                    </Text>
                  </TableCell>

                  <TableCell className="text-center">
                     <div className="flex flex-col gap-1.5 items-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black border tracking-tighter ${
                          b.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          b.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                        }`}>
                          {b.status === 'Confirmed' ? 'ĐÃ DUYỆT' : b.status === 'Pending' ? 'CHỜ TIỀN' : 'ĐÃ HỦY'}
                        </span>
                        {b.status === 'Pending' && (
                          <span className="flex items-center gap-1 text-rose-500 text-[8px] font-black animate-pulse uppercase">
                            <AlertTriangle size={10}/> Kiểm tra sao kê
                          </span>
                        )}
                     </div>
                  </TableCell>

                  <TableCell className="text-right p-5">
                    <Flex justifyContent="end" className="gap-2">
                      {actionLoading === b.id ? (
                        <Loader2 size={18} className="animate-spin text-pink-500" />
                      ) : (
                        <>
                          {b.status === 'Pending' && (
                            <button 
                              onClick={() => handleVerifyPayment(b.id)} 
                              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white rounded-xl transition-all border border-emerald-600/30 text-[10px] font-black uppercase shadow-sm"
                            >
                              <Banknote size={14}/> Duyệt tiền
                            </button>
                          )}
                          
                          {/* NÚT HỦY CỦA ADMIN: Luôn hiển thị nếu đơn chưa bị hủy */}
                          {b.status !== 'Cancelled' && (
                            <button 
                              onClick={() => handleCancelAdmin(b.id)}
                              title="Hủy đơn hàng này"
                              className="p-2.5 text-slate-600 hover:bg-rose-600/10 hover:text-rose-500 rounded-xl transition-colors border border-transparent hover:border-rose-500/20"
                            >
                              <XCircle size={18}/>
                            </button>
                          )}
                        </>
                      )}
                    </Flex>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminBookings;