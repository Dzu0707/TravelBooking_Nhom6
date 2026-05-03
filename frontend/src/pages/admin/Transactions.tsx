import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  CreditCard,
  Search,
  Download,
  Clock,
  Eye,
  Phone,
  Mail,
  Loader2,
  XCircle,
} from 'lucide-react';
import axios from 'axios';

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
  Grid,
  Metric,
} from '@tremor/react';

interface TransactionItem {
  id: number;
  transactionCode: string;
  orderCode: string;
  customerName: string;
  contactPhone?: string;
  contactEmail?: string;
  amount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  bookingId: number;
  tourName: string;
  bookingStatus: string;
}

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionItem | null>(null);

  const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5091'}/api/Transactions`;
const SUCCESS_STATUSES = ['paid', 'success', 'completed', 'confirmed'];

const normalizeTransactions = (payload: unknown): TransactionItem[] => {
  if (Array.isArray(payload)) return payload as TransactionItem[];

  if (payload && typeof payload === 'object') {
    const data = payload as {
      transactions?: unknown;
      data?: unknown;
    };

    if (Array.isArray(data.transactions)) return data.transactions as TransactionItem[];
    if (Array.isArray(data.data)) return data.data as TransactionItem[];
  }

  return [];
};

const fetchTransactions = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const res = await axios.get(API_URL, config);

    const payload = res.data;
    const normalizedTransactions = normalizeTransactions(payload);
    setTransactions(normalizedTransactions);

    const fallbackRevenue = normalizedTransactions
      .filter((t) => SUCCESS_STATUSES.includes((t.status || '').toLowerCase()))
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const apiRevenue =
      payload && typeof payload === 'object' && 'totalRevenue' in payload
        ? Number((payload as { totalRevenue?: number }).totalRevenue)
        : NaN;

    setTotalRevenue(Number.isFinite(apiRevenue) ? apiRevenue : fallbackRevenue);
  } catch (err: any) {
    console.error(err);
    const errorMessage =
      err?.response?.data?.message ||
      err?.response?.data ||
      err?.message ||
      'Lỗi tải dữ liệu giao dịch';

    toast.error(typeof errorMessage === 'string' ? errorMessage : 'Lỗi tải dữ liệu giao dịch');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchTransactions();
  }, []);

  const renderStatus = (status: string) => {
    const normalized = (status || '').toLowerCase();

    const configs: Record<string, { label: string; color: string; bg: string; border: string; dot: string }> = {
      paid: { label: 'Đã thanh toán', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
      success: { label: 'Thành công', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
      pending: { label: 'Chờ xử lý', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-500' },
      unpaid: { label: 'Chưa thanh toán', color: 'text-slate-300', bg: 'bg-slate-500/10', border: 'border-slate-500/20', dot: 'bg-slate-400' },
      failed: { label: 'Thất bại', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', dot: 'bg-rose-500' },
      cancelled: { label: 'Đã hủy', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', dot: 'bg-rose-500' },
      refunded: { label: 'Hoàn tiền', color: 'text-slate-300', bg: 'bg-slate-500/10', border: 'border-slate-500/20', dot: 'bg-slate-400' },
    };

    const c = configs[normalized] || configs.pending;

    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] ${c.bg} ${c.color} ${c.border}`}>
        <span className={`mr-1.5 size-1 rounded-full ${c.dot}`} />
        {c.label}
      </span>
    );
  };

  const filteredData = useMemo(() => {
    return transactions.filter((t) => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        (t.orderCode || '').toLowerCase().includes(q) ||
        (t.customerName || '').toLowerCase().includes(q) ||
        (t.transactionCode || '').toLowerCase().includes(q) ||
        (t.contactPhone || '').toLowerCase().includes(q) ||
        (t.tourName || '').toLowerCase().includes(q);

      const matchStatus = statusFilter === 'all' || (t.status || '').toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [transactions, searchTerm, statusFilter]);

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-xl border border-slate-800 bg-slate-900/95 p-4 md:p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_rgba(2,6,23,0.45)]">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">Transaction Management</div>
              <Title className="mt-2 flex items-center gap-2 text-base md:text-lg font-black uppercase tracking-tight text-slate-100">
                Giao dịch thanh toán <CreditCard size={20} className="text-cyan-400" />
              </Title>
              <Text className="mt-1 text-sm text-slate-400">
                Theo dõi doanh thu, trạng thái thanh toán và chi tiết giao dịch của booking.
              </Text>
            </div>

            <button
              onClick={() => toast.success('Đang xuất báo cáo...')}
              className="group flex items-center justify-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300 transition-all hover:bg-cyan-500/15"
            >
              <Download size={16} className="transition-transform group-hover:scale-110" />
              Xuất Excel
            </button>
          </div>
        </section>

        <Grid numItemsMd={2} numItemsLg={3} className="gap-4">
          <Card className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-none">
            <Text className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Doanh thu ròng</Text>
            <Metric className="mt-2 text-2xl font-black text-slate-100">{totalRevenue.toLocaleString('vi-VN')}₫</Metric>
          </Card>

          <Card className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-none">
            <Text className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Giao dịch chờ</Text>
            <Metric className="mt-2 text-2xl font-black text-amber-400">
              {transactions.filter((t) => (t.status || '').toLowerCase() === 'pending').length}
            </Metric>
          </Card>

          <Card className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-none">
            <Text className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Tổng giao dịch</Text>
            <Metric className="mt-2 text-2xl font-black text-cyan-300">{transactions.length}</Metric>
          </Card>
        </Grid>

        <Card className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-none">
          <div className="flex flex-col gap-4 xl:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Tìm mã giao dịch, khách hàng, tour..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-4 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-600 focus:border-cyan-500/40"
              />
            </div>

            <div className="flex flex-wrap rounded-xl border border-slate-800 bg-slate-950 p-1">
              {['all', 'paid', 'pending', 'failed', 'unpaid'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] transition-all ${statusFilter === s ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
                    }`}
                >
                  {s === 'all' ? 'Tất cả' : s === 'paid' ? 'Đã trả' : s === 'pending' ? 'Chờ duyệt' : s === 'failed' ? 'Lỗi' : 'Chưa trả'}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-0 shadow-none">
          <div className="overflow-x-auto">
            <Table className="min-w-[1100px]">
              <TableHead className="bg-slate-950/60">
                <TableRow>
                  <TableHeaderCell className="p-5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Mã giao dịch / Thời gian</TableHeaderCell>
                  <TableHeaderCell className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Khách hàng / Tour</TableHeaderCell>
                  <TableHeaderCell className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Số tiền</TableHeaderCell>
                  <TableHeaderCell className="text-center text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Trạng thái</TableHeaderCell>
                  <TableHeaderCell className="text-right text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Thao tác</TableHeaderCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-cyan-400" size={32} />
                        <Text className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Đang tải dữ liệu giao dịch...</Text>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredData.length > 0 ? (
                  filteredData.map((t) => (
                    <TableRow key={t.id} className="group border-b border-slate-800/50 transition-colors hover:bg-slate-800/30">
                      <TableCell className="p-5">
                        <Flex justifyContent="start" className="gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-cyan-300">
                            <CreditCard size={16} />
                          </div>

                          <div className="min-w-0">
                            <Text className="mb-0.5 text-[11px] font-bold uppercase text-slate-200 break-all">{t.transactionCode || `TRANS-${t.id}`}</Text>
                            <Text className="flex items-center gap-1 text-[10px] text-slate-500">
                              <Clock size={10} />
                              {t.createdAt ? format(new Date(t.createdAt), 'HH:mm - dd/MM/yyyy') : 'N/A'}
                            </Text>
                            <Text className="mt-1 text-[10px] font-mono text-slate-600">BOOKING: {t.bookingId}</Text>
                          </div>
                        </Flex>
                      </TableCell>

                      <TableCell className="p-5">
                        <Text className="text-sm font-bold uppercase tracking-tight text-slate-100 break-words">{t.customerName || 'N/A'}</Text>
                        <Text className="mt-1 text-[10px] font-mono text-slate-500 break-all">{t.orderCode || 'N/A'} • {t.paymentMethod || 'N/A'}</Text>
                        <Text className="mt-1 text-[10px] text-slate-500 break-words">{t.tourName || 'N/A'}</Text>
                        <Text className="mt-1 flex items-center gap-1 text-[10px] text-slate-500 break-all"><Phone size={10} />{t.contactPhone || 'N/A'}</Text>
                        <Text className="mt-1 flex items-center gap-1 text-[10px] text-slate-500 break-all"><Mail size={10} />{t.contactEmail || 'N/A'}</Text>
                      </TableCell>

                      <TableCell className="p-5">
                        <Text className="text-[14px] font-bold text-emerald-400">{Number(t.amount || 0).toLocaleString('vi-VN')}₫</Text>
                      </TableCell>

                      <TableCell className="p-5 text-center">{renderStatus(t.status)}</TableCell>

                      <TableCell className="p-5 text-right">
                        <button
                          onClick={() => setSelectedTransaction(t)}
                          className="rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-slate-400 transition-all hover:text-cyan-300"
                        >
                          <Eye size={16} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : null}
              </TableBody>
            </Table>
          </div>

          {!loading && filteredData.length === 0 && (
            <div className="p-16 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Không có giao dịch nào phù hợp
            </div>
          )}
        </Card>
      </div>

      {selectedTransaction && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 p-3 md:p-4 backdrop-blur-md">
          <div className="mx-auto my-6 w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
            <div className="max-h-[85vh] overflow-y-auto">
              {/* Header sticky để luôn thấy nút đóng */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-5">
                <div>
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-100">
                    Chi tiết giao dịch
                  </h2>
                  <p className="mt-1 break-all text-xs text-slate-500">
                    {selectedTransaction.transactionCode}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTransaction(null)}
                  className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-800 hover:text-rose-400"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <div className="grid gap-4 p-6 md:grid-cols-2">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Mã booking
                  </div>
                  <div className="mt-2 text-sm font-bold text-slate-100">
                    {selectedTransaction.bookingId}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Mã đơn
                  </div>
                  <div className="mt-2 break-all text-sm font-bold text-slate-100">
                    {selectedTransaction.orderCode || 'N/A'}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Khách hàng
                  </div>
                  <div className="mt-2 text-sm font-bold text-slate-100">
                    {selectedTransaction.customerName || 'N/A'}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Số điện thoại
                  </div>
                  <div className="mt-2 text-sm font-bold text-slate-100">
                    {selectedTransaction.contactPhone || 'N/A'}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 md:col-span-2">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Email
                  </div>
                  <div className="mt-2 break-all text-sm font-bold text-slate-100">
                    {selectedTransaction.contactEmail || 'N/A'}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 md:col-span-2">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Tour
                  </div>
                  <div className="mt-2 break-words text-sm font-bold text-slate-100">
                    {selectedTransaction.tourName || 'N/A'}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Số tiền
                  </div>
                  <div className="mt-2 text-sm font-black text-emerald-400">
                    {Number(selectedTransaction.amount || 0).toLocaleString('vi-VN')}₫
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Phương thức
                  </div>
                  <div className="mt-2 text-sm font-bold text-slate-100">
                    {selectedTransaction.paymentMethod || 'N/A'}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Trạng thái giao dịch
                  </div>
                  <div className="mt-2">{renderStatus(selectedTransaction.status)}</div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Trạng thái booking
                  </div>
                  <div className="mt-2 text-sm font-bold text-slate-100">
                    {selectedTransaction.bookingStatus || 'N/A'}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 md:col-span-2">
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Thời gian tạo
                  </div>
                  <div className="mt-2 text-sm font-bold text-slate-100">
                    {selectedTransaction.createdAt
                      ? format(new Date(selectedTransaction.createdAt), 'HH:mm - dd/MM/yyyy')
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminTransactions;