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

  const API_URL = 'http://localhost:5091/api/Transactions';

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(API_URL, config);

      setTransactions(res.data.transactions || []);
      setTotalRevenue(res.data.totalRevenue || 0);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data || 'Lỗi tải dữ liệu giao dịch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const renderStatus = (status: string) => {
    const normalized = status.toLowerCase();

    const configs: Record<string, { label: string; color: string; bg: string; border: string; dot: string }> = {
      paid: { label: 'Da thanh toan', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
      success: { label: 'Thanh cong', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
      pending: { label: 'Cho xu ly', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-500' },
      unpaid: { label: 'Chua thanh toan', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', dot: 'bg-slate-400' },
      failed: { label: 'That bai', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', dot: 'bg-rose-500' },
      cancelled: { label: 'Da huy', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', dot: 'bg-rose-500' },
      refunded: { label: 'Hoan tien', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', dot: 'bg-slate-400' },
    };

    const c = configs[normalized] || configs.pending;

    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${c.bg} ${c.color} ${c.border}`}>
        <span className={`mr-1.5 size-1 rounded-full ${c.dot}`} />
        {c.label}
      </span>
    );
  };

  const filteredData = useMemo(() => {
    return transactions.filter((t) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        t.orderCode.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) ||
        t.transactionCode.toLowerCase().includes(q) ||
        (t.contactPhone || '').toLowerCase().includes(q) ||
        (t.tourName || '').toLowerCase().includes(q);

      const matchStatus = statusFilter === 'all' || t.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [transactions, searchTerm, statusFilter]);

  return (
    <>
      <div className="mx-auto max-w-7xl animate-in fade-in space-y-6 px-4 pb-10 pt-6 duration-500">
        <Grid numItemsMd={2} numItemsLg={3} className="gap-4">
          <Card className="rounded-xl border-slate-800 bg-slate-900 p-4 shadow-sm">
            <Text className="text-[10px] font-bold uppercase text-slate-500">Doanh thu rong</Text>
            <Flex justifyContent="start" alignItems="baseline" className="gap-2">
              <Metric className="text-xl font-black text-white">{totalRevenue.toLocaleString('vi-VN')}₫</Metric>
            </Flex>
          </Card>

          <Card className="rounded-xl border-slate-800 bg-slate-900 p-4 shadow-sm">
            <Text className="text-[10px] font-bold uppercase text-slate-500">Giao dich cho</Text>
            <Metric className="text-xl font-black text-amber-500">
              {transactions.filter((t) => t.status.toLowerCase() === 'pending').length}
            </Metric>
          </Card>

          <button
            onClick={() => toast.success('Dang xuat bao cao...')}
            className="group flex items-center justify-between rounded-xl bg-blue-600 p-4 transition-all hover:bg-blue-500"
          >
            <div className="text-left">
              <Text className="text-[10px] font-bold uppercase text-blue-100">Bao cao tai chinh</Text>
              <Title className="text-sm font-black uppercase text-white">Xuat Excel</Title>
            </div>
            <Download size={20} className="text-white transition-transform group-hover:scale-110" />
          </button>
        </Grid>

        <Card className="rounded-xl border-slate-800 bg-slate-900 p-4 shadow-lg">
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <div className="group relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
              <input
                type="text"
                placeholder="Tim ma giao dich, khach hang, tour..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-9 pr-4 text-[11px] text-slate-200 outline-none transition-all focus:border-blue-500/50"
              />
            </div>

            <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-1 shadow-inner">
              {['all', 'paid', 'pending', 'failed', 'unpaid'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-md px-3 py-1.5 text-[9px] font-black uppercase tracking-tighter transition-all ${
                    statusFilter === s ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {s === 'all' ? 'Tat ca' : s === 'paid' ? 'Da tra' : s === 'pending' ? 'Cho duyet' : s === 'failed' ? 'Loi' : 'Chua tra'}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden rounded-xl border-slate-800 bg-slate-900 p-0 shadow-2xl">
          <Table>
            <TableHead className="bg-slate-950/60">
              <TableRow>
                <TableHeaderCell className="p-5 text-[10px] font-bold uppercase text-slate-500">
                  Ma giao dich / Thoi gian
                </TableHeaderCell>
                <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500">
                  Khach hang / Tour
                </TableHeaderCell>
                <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500">
                  So tien
                </TableHeaderCell>
                <TableHeaderCell className="text-center text-[10px] font-bold uppercase text-slate-500">
                  Trang thai
                </TableHeaderCell>
                <TableHeaderCell className="text-right text-[10px] font-bold uppercase text-slate-500">
                  Thao tac
                </TableHeaderCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-blue-500" size={40} />
                      <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Dang tai du lieu giao dich...
                      </Text>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredData.map((t) => (
                <TableRow key={t.id} className="group border-b border-slate-800/50 transition-colors hover:bg-slate-800/40">
                  <TableCell className="p-4">
                    <Flex justifyContent="start" className="gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-blue-500 transition-all group-hover:border-blue-500/30">
                        <CreditCard size={16} />
                      </div>
                      <div>
                        <Text className="mb-0.5 text-[11px] font-bold uppercase text-slate-200">
                          {t.transactionCode}
                        </Text>
                        <Text className="flex items-center gap-1 text-[9px] text-slate-500">
                          <Clock size={9} />
                          {format(new Date(t.createdAt), 'HH:mm - dd/MM/yyyy')}
                        </Text>
                        <Text className="mt-1 text-[9px] font-mono text-slate-600">
                          BOOKING: {t.bookingId}
                        </Text>
                      </div>
                    </Flex>
                  </TableCell>

                  <TableCell>
                    <Text className="text-[11px] font-bold uppercase leading-tight text-slate-200">
                      {t.customerName}
                    </Text>
                    <Text className="mt-1 text-[9px] font-mono text-slate-600">
                      {t.orderCode} • {t.paymentMethod}
                    </Text>
                    <Text className="mt-1 text-[9px] text-slate-500">{t.tourName}</Text>
                    <Text className="mt-1 flex items-center gap-1 text-[9px] text-slate-500">
                      <Phone size={10} />
                      {t.contactPhone || 'N/A'}
                    </Text>
                    <Text className="mt-1 flex items-center gap-1 text-[9px] text-slate-500">
                      <Mail size={10} />
                      {t.contactEmail || 'N/A'}
                    </Text>
                  </TableCell>

                  <TableCell>
                    <Text className="text-[12px] font-black text-white">
                      {t.amount.toLocaleString('vi-VN')}₫
                    </Text>
                  </TableCell>

                  <TableCell className="text-center">{renderStatus(t.status)}</TableCell>

                  <TableCell className="p-4 text-right">
                    <button
                      onClick={() => setSelectedTransaction(t)}
                      className="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-700 hover:text-white"
                    >
                      <Eye size={18} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {!loading && filteredData.length === 0 && (
            <div className="p-16 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500 opacity-50">
              Khong co giao dich nao phu hop
            </div>
          )}
        </Card>
      </div>

      {selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-5">
              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                  Chi tiet giao dich
                </h2>
                <p className="mt-1 text-xs text-slate-500">{selectedTransaction.transactionCode}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
                className="text-slate-500 hover:text-rose-500"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="text-[10px] font-bold uppercase text-slate-500">Ma booking</div>
                <div className="mt-2 text-sm font-bold text-slate-100">{selectedTransaction.bookingId}</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="text-[10px] font-bold uppercase text-slate-500">Ma don</div>
                <div className="mt-2 text-sm font-bold text-slate-100">{selectedTransaction.orderCode}</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="text-[10px] font-bold uppercase text-slate-500">Khach hang</div>
                <div className="mt-2 text-sm font-bold text-slate-100">{selectedTransaction.customerName}</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="text-[10px] font-bold uppercase text-slate-500">So dien thoai</div>
                <div className="mt-2 text-sm font-bold text-slate-100">{selectedTransaction.contactPhone || 'N/A'}</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 md:col-span-2">
                <div className="text-[10px] font-bold uppercase text-slate-500">Email</div>
                <div className="mt-2 text-sm font-bold text-slate-100">{selectedTransaction.contactEmail || 'N/A'}</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 md:col-span-2">
                <div className="text-[10px] font-bold uppercase text-slate-500">Tour</div>
                <div className="mt-2 text-sm font-bold text-slate-100">{selectedTransaction.tourName}</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="text-[10px] font-bold uppercase text-slate-500">So tien</div>
                <div className="mt-2 text-sm font-black text-emerald-400">
                  {selectedTransaction.amount.toLocaleString('vi-VN')}₫
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="text-[10px] font-bold uppercase text-slate-500">Phuong thuc</div>
                <div className="mt-2 text-sm font-bold text-slate-100">{selectedTransaction.paymentMethod}</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="text-[10px] font-bold uppercase text-slate-500">Trang thai giao dich</div>
                <div className="mt-2">{renderStatus(selectedTransaction.status)}</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="text-[10px] font-bold uppercase text-slate-500">Trang thai booking</div>
                <div className="mt-2 text-sm font-bold text-slate-100">{selectedTransaction.bookingStatus}</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 md:col-span-2">
                <div className="text-[10px] font-bold uppercase text-slate-500">Thoi gian tao</div>
                <div className="mt-2 text-sm font-bold text-slate-100">
                  {format(new Date(selectedTransaction.createdAt), 'HH:mm - dd/MM/yyyy')}
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
