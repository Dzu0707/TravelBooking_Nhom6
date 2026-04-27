import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  XCircle,
  User,
  MapPin,
  Search,
  ShieldCheck,
  Loader2,
  Banknote,
  AlertTriangle,
  Fingerprint,
  CalendarDays,
  Copy,
  Phone,
  Mail,
  MessageSquareMore,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
  Title,
  Flex,
  Badge,
} from '@tremor/react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const API_BASE_URL = 'http://localhost:5091/api/Bookings';

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(API_BASE_URL, config);
      setBookings(res.data);
    } catch {
      toast.error('Lỗi tải dữ liệu đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleVerifyPayment = async (id: number) => {
    const paymentCode = `PAYTOUR${id}NHOM6`;
    if (!window.confirm(`Xác nhận đã nhận đủ tiền cho nội dung: ${paymentCode}?`)) return;

    try {
      setActionLoading(id);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(`${API_BASE_URL}/${id}/confirm-payment`, {}, config);

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'Confirmed' } : b))
      );

      toast.success(`Đã duyệt thanh toán đơn #${id}`);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data || 'Lỗi xác thực';
      toast.error(errorMsg);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelAdmin = async (id: number) => {
    if (!window.confirm(`CẢNH BÁO: Bạn đang thực hiện HỦY đơn hàng #${id}. Tiếp tục?`)) return;

    try {
      setActionLoading(id);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(`${API_BASE_URL}/${id}/cancel`, {}, config);

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'Cancelled' } : b))
      );

      toast.success(`Đã hủy đơn hàng #${id}`);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data || 'Lỗi khi hủy đơn';
      toast.error(errorMsg);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Đã sao chép mã đối soát');
  };

  const filteredBookings = bookings.filter((b: any) => {
    const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
    const searchStr = searchTerm.toLowerCase().trim();

    const generatedPaymentCode = `PAYTOUR${b.id}NHOM6`.toLowerCase();
    const customerName = (b.customerName || b.contactName || b.fullName || '').toLowerCase();
    const customerPhone = (b.contactPhone || '').toLowerCase();
    const customerEmail = (b.contactEmail || b.customerEmail || '').toLowerCase();
    const tourName = (b.tourName || '').toLowerCase();

    return (
      matchesStatus &&
      (tourName.includes(searchStr) ||
        customerName.includes(searchStr) ||
        customerPhone.includes(searchStr) ||
        customerEmail.includes(searchStr) ||
        b.id.toString().includes(searchStr) ||
        generatedPaymentCode.includes(searchStr))
    );
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 pb-10 pt-6 font-sans">
      <Card className="rounded-3xl border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <Title className="flex items-center gap-2 font-black italic uppercase tracking-tight text-slate-100">
              ĐỐI SOÁT GIAO DỊCH <ShieldCheck size={20} className="text-pink-500" />
            </Title>
            <Text className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Khớp nội dung chuyển khoản từ khách hàng với hệ thống
            </Text>
          </div>

          <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Tìm mã, tên khách, sđt, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-4 text-[11px] font-bold text-slate-200 outline-none transition-all placeholder:text-slate-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500/20"
              />
            </div>

            <div className="flex rounded-xl border border-slate-800 bg-slate-950 p-1">
              {['All', 'Pending', 'Confirmed', 'Cancelled'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`rounded-lg px-4 py-2 text-[10px] font-black uppercase transition-all ${
                    filterStatus === s
                      ? 'bg-pink-600 text-white shadow-lg'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {s === 'All' ? 'Tất cả' : s === 'Pending' ? 'Chờ tiền' : s === 'Confirmed' ? 'Đã duyệt' : 'Đã hủy'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden rounded-3xl border-slate-800 bg-slate-900 p-0 shadow-2xl">
        <Table>
          <TableHead className="bg-slate-950/60">
            <TableRow>
              <TableHeaderCell className="p-5 text-[10px] font-black uppercase text-slate-500">
                Tour & Khách hàng
              </TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-black uppercase text-slate-500">
                Liên hệ & Ghi chú
              </TableHeaderCell>
              <TableHeaderCell className="text-center text-[10px] font-black uppercase text-slate-500">
                Mã đối soát
              </TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-black uppercase text-slate-500">
                Giá trị & Số lượng
              </TableHeaderCell>
              <TableHeaderCell className="text-center text-[10px] font-black uppercase text-slate-500">
                Trạng thái
              </TableHeaderCell>
              <TableHeaderCell className="p-5 text-right text-[10px] font-black uppercase text-slate-500">
                Thao tác
              </TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="p-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-pink-500" size={40} />
                    <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Đang truy xuất dữ liệu...
                    </Text>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="p-20 text-center">
                  <Text className="font-black italic uppercase tracking-widest text-slate-600">
                    Không có dữ liệu khớp với tìm kiếm
                  </Text>
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((b: any) => {
                const displayCode = `PAYTOUR${b.id}NHOM6`;

                return (
                  <TableRow key={b.id} className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/40">
                    <TableCell className="p-5">
                      <Flex justifyContent="start" className="gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-blue-400 shadow-inner">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <Text className="text-[11px] font-black uppercase italic leading-tight tracking-tight text-slate-100">
                            {b.tourName || 'N/A'}
                          </Text>
                          <Text className="mt-1 flex items-center gap-1 text-[10px] font-bold text-slate-500">
                            <User size={10} className="text-slate-400" />
                            {b.customerName || b.contactName || b.fullName}
                          </Text>
                          <Text className="mt-1 flex items-center gap-1 text-[9px] font-bold uppercase text-slate-600">
                            <CalendarDays size={10} />
                            {b.startDate ? new Date(b.startDate).toLocaleDateString('vi-VN') : 'Chưa có lịch'}
                          </Text>
                        </div>
                      </Flex>
                    </TableCell>

                    <TableCell className="p-5">
                      <div className="space-y-2">
                        <Text className="flex items-center gap-2 text-[10px] font-bold text-slate-300">
                          <Phone size={12} className="text-slate-500" />
                          {b.contactPhone || 'Chưa có SĐT'}
                        </Text>
                        <Text className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                          <Mail size={12} className="text-slate-500" />
                          {b.contactEmail || b.customerEmail || 'Chưa có email'}
                        </Text>
                        <Text className="flex items-start gap-2 text-[10px] italic text-amber-400">
                          <MessageSquareMore size={12} className="mt-0.5 text-amber-500" />
                          <span className="line-clamp-2">
                            {b.specialRequest || 'Không có yêu cầu'}
                          </span>
                        </Text>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="group flex items-center justify-center gap-2">
                        <Badge
                          color="pink"
                          icon={Fingerprint}
                          className="bg-pink-500/5 px-3 py-1.5 font-mono text-[10px] font-black uppercase ring-1 ring-pink-500/30"
                        >
                          {displayCode}
                        </Badge>
                        <button
                          onClick={() => handleCopy(displayCode)}
                          className="text-slate-500 opacity-0 transition-opacity hover:text-white group-hover:opacity-100"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Text className="text-[14px] font-black italic text-emerald-400">
                        {b.totalPrice?.toLocaleString('vi-VN')} đ
                      </Text>
                      <Text className="mt-1 flex items-center gap-1 text-[9px] font-bold text-slate-500">
                        <Users size={10} />
                        {b.totalPassengers} khách
                        {typeof b.adultCount === 'number' && ` • ${b.adultCount} NL / ${b.childCount} TE`}
                      </Text>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <span
                          className={`rounded-full border px-3 py-1 text-[9px] font-black tracking-tighter ${
                            b.status === 'Confirmed'
                              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                              : b.status === 'Pending'
                                ? 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                                : 'border-rose-500/20 bg-rose-500/10 text-rose-500'
                          }`}
                        >
                          {b.status === 'Confirmed' ? 'ĐÃ DUYỆT' : b.status === 'Pending' ? 'CHỜ TIỀN' : 'ĐÃ HỦY'}
                        </span>
                        {b.status === 'Pending' && (
                          <span className="flex animate-pulse items-center gap-1 text-[8px] font-black uppercase text-rose-500">
                            <AlertTriangle size={10} /> Kiểm tra sao kê
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="p-5 text-right">
                      <Flex justifyContent="end" className="gap-2">
                        {actionLoading === b.id ? (
                          <Loader2 size={18} className="animate-spin text-pink-500" />
                        ) : (
                          <>
                            {b.status === 'Pending' && (
                              <button
                                onClick={() => handleVerifyPayment(b.id)}
                                className="flex items-center gap-2 rounded-xl border border-emerald-600/30 bg-emerald-600/10 px-4 py-2.5 text-[10px] font-black uppercase text-emerald-500 shadow-sm transition-all hover:bg-emerald-600 hover:text-white"
                              >
                                <Banknote size={14} /> Duyệt tiền
                              </button>
                            )}
                            {b.status !== 'Cancelled' && (
                              <button
                                onClick={() => handleCancelAdmin(b.id)}
                                className="rounded-xl border border-transparent p-2.5 text-slate-600 transition-colors hover:border-rose-500/20 hover:bg-rose-600/10 hover:text-rose-500"
                                title="Hủy đơn hàng"
                              >
                                <XCircle size={18} />
                              </button>
                            )}
                          </>
                        )}
                      </Flex>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminBookings;