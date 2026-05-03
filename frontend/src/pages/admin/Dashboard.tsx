import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  RefreshCcw,
  Settings2,
  Eye,
  EyeOff,
  Search,
  Loader2,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AreaChart } from '@tremor/react';

const API = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5091'}/api`;

interface TourItem {
  id: number;
}
interface BookingItem {
  id: number;
  createdAt?: string;
  totalPrice?: number;
  status?: string;
}
interface UserItem {
  id: number;
}
interface TransactionItem {
  id: number;
  amount?: number;
  createdAt?: string;
  status?: string;
}

type Row = {
  date: string;
  bookings: number;
  confirmedBookings: number;
  revenue: number;
  successfulTransactions: number;
  confirmRate: number;
};

type DaysFilter = '7' | '14' | '30' | 'all';

const successTxStatuses = ['success', 'completed', 'paid', 'confirmed'];

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const formatMoney = (value: number) => `${Number(value || 0).toLocaleString('vi-VN')}đ`;
const formatNumber = (value: number) => `${Number(value || 0).toLocaleString('vi-VN')}`;
const formatDate = (d: Date) =>
  new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);

const normalizeArray = <T,>(payload: any): T[] => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.transactions)) return payload.transactions;
  if (Array.isArray(payload?.result)) return payload.result;
  return [];
};

const AdminDashboard = () => {
  const token = localStorage.getItem('token');
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [days, setDays] = useState<DaysFilter>('30');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [summary, setSummary] = useState({
    tours: 0,
    users: 0,
    bookings: 0,
    confirmedBookings: 0,
    revenue: 0,
    successfulTransactions: 0,
  });

  const [rows, setRows] = useState<Row[]>([]);

  const [visibleCols, setVisibleCols] = useState({
    bookings: true,
    confirmedBookings: true,
    revenue: true,
    successfulTransactions: true,
    confirmRate: true,
  });

  const toggleCol = (key: keyof typeof visibleCols) =>
    setVisibleCols((prev) => ({ ...prev, [key]: !prev[key] }));

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [toursRes, bookingsRes, usersRes, transactionsRes] = await Promise.all([
        axios.get(`${API}/Tours`, { headers }),
        axios.get(`${API}/Bookings`, { headers }),
        axios.get(`${API}/Users`, { headers }),
        axios.get(`${API}/Transactions`, { headers }),
      ]);

      const tours = normalizeArray<TourItem>(toursRes.data);
      const bookings = normalizeArray<BookingItem>(bookingsRes.data);
      const users = normalizeArray<UserItem>(usersRes.data);
      const transactions = normalizeArray<TransactionItem>(transactionsRes.data);

      const successfulTransactions = transactions.filter((t) =>
        successTxStatuses.includes((t.status || '').toLowerCase())
      );
      const confirmedBookings = bookings.filter((b) => (b.status || '').toLowerCase() === 'confirmed');

      setSummary({
        tours: tours.length,
        users: users.length,
        bookings: bookings.length,
        confirmedBookings: confirmedBookings.length,
        revenue: successfulTransactions.reduce((s, t) => s + Number(t.amount || 0), 0),
        successfulTransactions: successfulTransactions.length,
      });

      const today = startOfDay(new Date());
      const oldestBooking = bookings
        .filter((b) => b.createdAt)
        .map((b) => startOfDay(new Date(b.createdAt!)))
        .sort((a, b) => a.getTime() - b.getTime())[0];

      const oldestTx = successfulTransactions
        .filter((t) => t.createdAt)
        .map((t) => startOfDay(new Date(t.createdAt!)))
        .sort((a, b) => a.getTime() - b.getTime())[0];

      const oldest =
        [oldestBooking, oldestTx].filter(Boolean).sort((a, b) => a!.getTime() - b!.getTime())[0] || today;

      const maxDays = Math.max(
        1,
        Math.floor((today.getTime() - oldest.getTime()) / (1000 * 60 * 60 * 24)) + 1
      );

      const totalDays = days === 'all' ? maxDays : Number(days);
      const dataRows: Row[] = [];

      for (let i = 0; i < totalDays; i++) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);

        const next = new Date(day);
        next.setDate(day.getDate() + 1);

        const dayBookings = bookings.filter((b) => {
          if (!b.createdAt) return false;
          const d = new Date(b.createdAt);
          return d >= day && d < next;
        });

        const dayConfirmed = dayBookings.filter(
          (b) => (b.status || '').toLowerCase() === 'confirmed'
        ).length;

        const dayTransactions = successfulTransactions.filter((t) => {
          if (!t.createdAt) return false;
          const d = new Date(t.createdAt);
          return d >= day && d < next;
        });

        const dayRevenue = dayTransactions.reduce((s, t) => s + Number(t.amount || 0), 0);

        dataRows.push({
          date: formatDate(day),
          bookings: dayBookings.length,
          confirmedBookings: dayConfirmed,
          revenue: dayRevenue,
          successfulTransactions: dayTransactions.length,
          confirmRate: dayBookings.length > 0 ? (dayConfirmed / dayBookings.length) * 100 : 0,
        });
      }

      setRows(dataRows);
      setPage(1);
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        'Không tải được dữ liệu dashboard';
      toast.error(typeof msg === 'string' ? msg : 'Không tải được dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  }, [headers, days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.date.toLowerCase().includes(q));
  }, [rows, searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, days]);

  const chartData = useMemo(
    () =>
      [...filteredRows]
        .reverse()
        .map((r) => ({
          date: r.date,
          'Doanh thu': r.revenue,
          'Đơn đặt': r.bookings,
          'Đơn xác nhận': r.confirmedBookings,
        })),
    [filteredRows]
  );

  const totalBookings = filteredRows.reduce((s, r) => s + r.bookings, 0);
  const totalConfirmed = filteredRows.reduce((s, r) => s + r.confirmedBookings, 0);
  const totalRevenue = filteredRows.reduce((s, r) => s + r.revenue, 0);
  const totalSuccessTx = filteredRows.reduce((s, r) => s + r.successfulTransactions, 0);
  const totalConfirmRate = (totalConfirmed / Math.max(1, totalBookings)) * 100;

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const currentPage = Math.min(page, pageCount);
  const pagedRows = filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="min-h-screen bg-[#020617] p-4 md:p-6 lg:p-8 text-slate-200 space-y-5">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-cyan-300 font-bold">BẢNG THỐNG KÊ</div>
            <h1 className="mt-1 text-xl md:text-2xl font-black uppercase text-white">
              Bảng hiệu suất vận hành
            </h1>
            <p className="text-sm text-slate-400">
              Dữ liệu tổng hợp theo ngày từ đơn hàng và giao dịch thực tế.
            </p>
          </div>

          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-cyan-300 hover:bg-cyan-500/20"
          >
            <RefreshCcw size={14} />
            Làm mới
          </button>
        </div>

        {/* Tóm tắt */}
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
          <div className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs">
            Tổng tour: <b>{formatNumber(summary.tours)}</b>
          </div>
          <div className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs">
            Người dùng: <b>{formatNumber(summary.users)}</b>
          </div>
          <div className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs">
            Đơn đặt: <b>{formatNumber(summary.bookings)}</b>
          </div>
          <div className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs">
            Đơn xác nhận: <b>{formatNumber(summary.confirmedBookings)}</b>
          </div>
          <div className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs">
            GD thành công: <b>{formatNumber(summary.successfulTransactions)}</b>
          </div>
          <div className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs">
            Doanh thu ({days === 'all' ? 'Từ trước đến nay' : `${days} ngày`}): <b>{formatMoney(totalRevenue)}</b>
          </div>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 w-full lg:w-80">
          <Search size={15} className="text-slate-500" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo ngày (vd: 03/05/2026)"
            className="w-full bg-transparent text-sm outline-none text-slate-200 placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={days}
            onChange={(e) => setDays(e.target.value as DaysFilter)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200"
          >
            <option value="7">7 ngày</option>
            <option value="14">14 ngày</option>
            <option value="30">30 ngày</option>
            <option value="all">Từ trước đến nay</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1 text-xs text-slate-400">
            <Settings2 size={14} />
            Hiện cột:
          </div>

          {(
            [
              ['bookings', 'Đơn đặt'],
              ['confirmedBookings', 'Đơn xác nhận'],
              ['revenue', 'Doanh thu'],
              ['successfulTransactions', 'GD thành công'],
              ['confirmRate', 'Tỷ lệ xác nhận'],
            ] as [keyof typeof visibleCols, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => toggleCol(key)}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] border ${
                visibleCols[key]
                  ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
                  : 'border-slate-700 bg-slate-950 text-slate-500'
              }`}
            >
              {visibleCols[key] ? <Eye size={12} /> : <EyeOff size={12} />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 md:p-5">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 size={16} className="text-cyan-300" />
          <h3 className="text-xs font-black uppercase tracking-[0.16em] text-slate-200">
            Hiệu suất theo ngày
          </h3>
        </div>

        {chartData.length > 0 ? (
        <AreaChart
          className="h-72 [&_.recharts-cartesian-grid_line]:stroke-slate-700 [&_.recharts-text]:fill-slate-300"
          data={chartData}
          index="date"
          categories={['Doanh thu']}
          colors={['cyan']}
          // Tăng độ rộng của trục Y (mặc định thường là 56, hãy thử 80 hoặc 100)
          yAxisWidth={100} 
          valueFormatter={(v: number) => `${Number(v || 0).toLocaleString('vi-VN')} đ`}
          showLegend={true}
          showGridLines={true}
          showYAxis={true}
          curveType="linear"
          connectNulls={false}
        />
        ) : (
          <div className="h-72 flex items-center justify-center text-slate-500 text-sm">
            Không có dữ liệu để hiển thị biểu đồ
          </div>
        )}
      </div>

      {/* Bảng lớn */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden">
        <div className="overflow-x-auto max-h-[65vh]">
          <table className="w-full min-w-[980px]">
            <thead className="bg-slate-950/90 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] uppercase tracking-[0.16em] text-slate-300">Ngày</th>
                {visibleCols.bookings && (
                  <th className="px-4 py-3 text-right text-[11px] uppercase tracking-[0.16em] text-slate-300">Đơn đặt</th>
                )}
                {visibleCols.confirmedBookings && (
                  <th className="px-4 py-3 text-right text-[11px] uppercase tracking-[0.16em] text-slate-300">Đơn xác nhận</th>
                )}
                {visibleCols.revenue && (
                  <th className="px-4 py-3 text-right text-[11px] uppercase tracking-[0.16em] text-slate-300">Doanh thu</th>
                )}
                {visibleCols.successfulTransactions && (
                  <th className="px-4 py-3 text-right text-[11px] uppercase tracking-[0.16em] text-slate-300">GD thành công</th>
                )}
                {visibleCols.confirmRate && (
                  <th className="px-4 py-3 text-right text-[11px] uppercase tracking-[0.16em] text-slate-300">Tỷ lệ xác nhận</th>
                )}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center">
                    <div className="inline-flex items-center gap-2 text-slate-400">
                      <Loader2 size={16} className="animate-spin text-cyan-400" />
                      Đang tải dữ liệu...
                    </div>
                  </td>
                </tr>
              ) : pagedRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-slate-500 text-sm">
                    Không có dữ liệu phù hợp
                  </td>
                </tr>
              ) : (
                pagedRows.map((r, idx) => (
                  <tr
                    key={`${r.date}-${idx}`}
                    className={`border-t border-slate-800 ${idx % 2 === 0 ? 'bg-slate-900/20' : 'bg-transparent'} hover:bg-slate-800/40`}
                  >
                    <td className="px-4 py-3 text-sm font-semibold text-slate-200">{r.date}</td>
                    {visibleCols.bookings && <td className="px-4 py-3 text-right text-sm">{formatNumber(r.bookings)}</td>}
                    {visibleCols.confirmedBookings && (
                      <td className="px-4 py-3 text-right text-sm text-cyan-300 font-semibold">{formatNumber(r.confirmedBookings)}</td>
                    )}
                    {visibleCols.revenue && (
                      <td className="px-4 py-3 text-right text-sm text-emerald-400 font-semibold">{formatMoney(r.revenue)}</td>
                    )}
                    {visibleCols.successfulTransactions && (
                      <td className="px-4 py-3 text-right text-sm">{formatNumber(r.successfulTransactions)}</td>
                    )}
                    {visibleCols.confirmRate && (
                      <td className="px-4 py-3 text-right text-sm">{r.confirmRate.toFixed(1)}%</td>
                    )}
                  </tr>
                ))
              )}
            </tbody>

            {!loading && filteredRows.length > 0 && (
              <tfoot className="bg-slate-950/80 border-t border-slate-700 sticky bottom-0">
                <tr>
                  <td className="px-4 py-3 text-sm font-bold text-white">Tổng</td>
                  {visibleCols.bookings && (
                    <td className="px-4 py-3 text-right font-bold">{formatNumber(totalBookings)}</td>
                  )}
                  {visibleCols.confirmedBookings && (
                    <td className="px-4 py-3 text-right font-bold text-cyan-300">{formatNumber(totalConfirmed)}</td>
                  )}
                  {visibleCols.revenue && (
                    <td className="px-4 py-3 text-right font-bold text-emerald-400">{formatMoney(totalRevenue)}</td>
                  )}
                  {visibleCols.successfulTransactions && (
                    <td className="px-4 py-3 text-right font-bold">{formatNumber(totalSuccessTx)}</td>
                  )}
                  {visibleCols.confirmRate && (
                    <td className="px-4 py-3 text-right font-bold">{totalConfirmRate.toFixed(1)}%</td>
                  )}
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {!loading && filteredRows.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/60 px-4 py-3 text-xs">
            <span className="text-slate-400">
              Trang {currentPage}/{pageCount} • {filteredRows.length} dòng
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 disabled:opacity-50"
              >
                <ChevronLeft size={14} /> Trước
              </button>
              <button
                disabled={currentPage === pageCount}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 disabled:opacity-50"
              >
                Sau <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;