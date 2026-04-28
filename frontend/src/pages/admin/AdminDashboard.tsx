import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Map,
  Users,
  ClipboardList,
  ChevronRight,
  Activity,
  CreditCard,
  RefreshCcw,
  ShieldCheck,
  Database,
  TrendingUp,
  Package,
  ShoppingBag,
  Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  BarChart,
  Title,
  Text,
  Metric,
  Flex,
  ProgressBar,
  Badge,
  Grid,
  DonutChart,
  Card,
} from '@tremor/react';
import toast from 'react-hot-toast';

const API = 'http://localhost:5091/api';

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

const weekLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const startOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + diff);
  return d;
};

const formatMoney = (value: number) => `${Number(value).toLocaleString('vi-VN')}đ`;
const formatNumber = (value: number) => `${Number(value).toLocaleString('vi-VN')}`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    tours: 0,
    bookings: 0,
    users: 0,
    revenue: 0,
    prevRevenue: 0,
    confirmedBookings: 0,
  });
  const [revenueChartData, setRevenueChartData] = useState<{ time: string; revenue: number }[]>([]);
  const [bookingChartData, setBookingChartData] = useState<{ time: string; bookings: number }[]>([]);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [toursRes, bookingsRes, usersRes, transactionsRes] = await Promise.all([
        axios.get<TourItem[]>(`${API}/Tours`, { headers }),
        axios.get<BookingItem[]>(`${API}/Bookings`, { headers }),
        axios.get<UserItem[]>(`${API}/Users`, { headers }),
        axios.get<TransactionItem[]>(`${API}/Transactions`, { headers }),
      ]);

      const tours = Array.isArray(toursRes.data) ? toursRes.data : [];
      const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
      const users = Array.isArray(usersRes.data) ? usersRes.data : [];
      const transactions = Array.isArray(transactionsRes.data) ? transactionsRes.data : [];

      const confirmedBookings = bookings.filter(
        (b) => (b.status || '').toLowerCase() === 'confirmed'
      ).length;

      const successfulTransactions = transactions.filter((t) => {
        const status = (t.status || '').toLowerCase();
        return status === 'success' || status === 'completed' || status === 'paid' || status === 'confirmed';
      });

      const totalRevenue = successfulTransactions.reduce((sum, item) => sum + (item.amount || 0), 0);

      const now = new Date();
      const currentWeekStart = startOfWeek(now);
      const previousWeekStart = new Date(currentWeekStart);
      previousWeekStart.setDate(previousWeekStart.getDate() - 7);
      const previousWeekEnd = new Date(currentWeekStart);

      const revenueByDay = Array.from({ length: 7 }, (_, index) => {
        const dayStart = new Date(currentWeekStart);
        dayStart.setDate(currentWeekStart.getDate() + index);

        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayStart.getDate() + 1);

        const revenue = successfulTransactions
          .filter((item) => {
            if (!item.createdAt) return false;
            const created = new Date(item.createdAt);
            return created >= dayStart && created < dayEnd;
          })
          .reduce((sum, item) => sum + (item.amount || 0), 0);

        return {
          time: weekLabels[index],
          revenue,
        };
      });

      const bookingsByDay = Array.from({ length: 7 }, (_, index) => {
        const dayStart = new Date(currentWeekStart);
        dayStart.setDate(currentWeekStart.getDate() + index);

        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayStart.getDate() + 1);

        const count = bookings.filter((item) => {
          if (!item.createdAt) return false;
          const created = new Date(item.createdAt);
          return created >= dayStart && created < dayEnd;
        }).length;

        return {
          time: weekLabels[index],
          bookings: count,
        };
      });

      const currentWeekRevenue = successfulTransactions
        .filter((item) => {
          if (!item.createdAt) return false;
          const created = new Date(item.createdAt);
          return created >= currentWeekStart;
        })
        .reduce((sum, item) => sum + (item.amount || 0), 0);

      const previousWeekRevenue = successfulTransactions
        .filter((item) => {
          if (!item.createdAt) return false;
          const created = new Date(item.createdAt);
          return created >= previousWeekStart && created < previousWeekEnd;
        })
        .reduce((sum, item) => sum + (item.amount || 0), 0);

      const prevRevenuePercent =
        previousWeekRevenue > 0
          ? ((currentWeekRevenue - previousWeekRevenue) / previousWeekRevenue) * 100
          : currentWeekRevenue > 0
            ? 100
            : 0;

      setStats({
        tours: tours.length,
        bookings: bookings.length,
        users: users.length,
        revenue: totalRevenue,
        prevRevenue: Number(prevRevenuePercent.toFixed(1)),
        confirmedBookings,
      });

      setRevenueChartData(revenueByDay);
      setBookingChartData(bookingsByDay);
    } catch (err: any) {
      console.error('DASHBOARD_FETCH_ERROR', err.response?.data || err);
      toast.error(err.response?.data?.message || 'Không tải được dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const systemDistribution = useMemo(
    () => [
      { name: 'Tours', value: stats.tours },
      { name: 'Đơn hàng', value: stats.bookings },
      { name: 'Người dùng', value: stats.users },
    ],
    [stats]
  );

  const quickLinks = [
    { name: 'Cấu hình Tours', path: '/admin/tours', icon: <Map size={18} /> },
    { name: 'Luồng đơn hàng', path: '/admin/bookings', icon: <ClipboardList size={18} /> },
    { name: 'Tệp khách hàng', path: '/admin/users', icon: <Users size={18} /> },
    { name: 'Số dư & Ví', path: '/admin/transactions', icon: <CreditCard size={18} /> },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/95 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_rgba(2,6,23,0.45)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
              Dashboard Overview
            </div>
            <h1 className="mt-2 text-lg font-black uppercase tracking-tight text-slate-100">
              Tổng quan vận hành
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Theo dõi doanh thu, booking và trạng thái hệ thống từ dữ liệu thực.
            </p>
          </div>

          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="flex items-center gap-2 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-300 transition-all hover:bg-cyan-500/15 disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
            Làm mới
          </button>
        </div>
      </section>

      <Grid numItemsMd={2} numItemsLg={4} className="gap-5">
        <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-none">
          <Text className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Doanh thu tổng
          </Text>
          <Metric className="mt-2 text-2xl font-black text-slate-100">
            {formatMoney(stats.revenue)}
          </Metric>
          <div className="mt-4 flex items-center gap-2">
            <Badge color={stats.prevRevenue >= 0 ? 'emerald' : 'rose'}>
              {stats.prevRevenue >= 0 ? '+' : ''}
              {stats.prevRevenue}%
            </Badge>
            <span className="text-xs text-slate-400">so với tuần trước</span>
          </div>
        </Card>

        <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-none">
          <Text className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Tổng đơn hàng
          </Text>
          <Metric className="mt-2 text-2xl font-black text-slate-100">{stats.bookings}</Metric>
          <ProgressBar
            value={stats.bookings > 0 ? Math.min((stats.confirmedBookings / stats.bookings) * 100, 100) : 0}
            color="cyan"
            className="mt-5 h-1.5"
          />
          <div className="mt-3 text-xs text-slate-400">
            {stats.confirmedBookings} đơn đã xác nhận
          </div>
        </Card>

        <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-none">
          <Text className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Người dùng
          </Text>
          <Metric className="mt-2 text-2xl font-black text-slate-100">{stats.users}</Metric>
          <div className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-cyan-300">
            <Users size={12} />
            Tài khoản hiện có
          </div>
        </Card>

        <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-none">
          <Text className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Tours
          </Text>
          <Metric className="mt-2 text-2xl font-black text-slate-100">{stats.tours}</Metric>
          <div className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-400">
            <TrendingUp size={12} />
            Đang hoạt động
          </div>
        </Card>
      </Grid>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-none">
          <Flex className="mb-6">
            <div>
              <Title className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-slate-100">
                <Activity size={16} className="text-cyan-400" />
                Doanh thu theo tuần
              </Title>
              <Text className="mt-1 text-xs text-slate-500">
                Dòng tiền thực tế từ bảng giao dịch
              </Text>
            </div>
          </Flex>

          <AreaChart
            className="h-80"
            data={revenueChartData}
            index="time"
            categories={['revenue']}
            colors={['cyan']}
            valueFormatter={formatMoney}
            showLegend={false}
            showGridLines={false}
            showYAxis={false}
            curveType="monotone"
          />
        </Card>

        <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-none">
          <Title className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-slate-100">
            <ShoppingBag size={16} className="text-blue-400" />
            Booking theo tuần
          </Title>
          <Text className="mt-1 text-xs text-slate-500">
            Số lượng đơn tạo mới theo từng ngày
          </Text>

          <BarChart
            className="mt-6 h-80"
            data={bookingChartData}
            index="time"
            categories={['bookings']}
            colors={['blue']}
            valueFormatter={formatNumber}
            showLegend={false}
            showGridLines={false}
            yAxisWidth={42}
          />
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-none">
          <Title className="text-sm font-black uppercase tracking-[0.18em] text-slate-100">
            Cơ cấu dữ liệu
          </Title>
          <Text className="mt-1 text-xs text-slate-500">
            Tỷ trọng các nhóm chính trong hệ thống
          </Text>

          <DonutChart
            className="mt-6 h-64"
            data={systemDistribution}
            category="value"
            index="name"
            colors={['cyan', 'blue', 'indigo']}
            valueFormatter={formatNumber}
          />
        </Card>

        <Card className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-none">
          <Title className="text-sm font-black uppercase tracking-[0.18em] text-slate-100">
            Hạ tầng hệ thống
          </Title>

          <div className="mt-6 space-y-5">
            <div>
              <Flex>
                <Text className="flex items-center gap-2 text-xs text-slate-400">
                  <Database size={14} />
                  Database Sync
                </Text>
                <Text className="text-xs font-bold text-cyan-300">100%</Text>
              </Flex>
              <ProgressBar value={100} color="cyan" className="mt-2 h-1.5" />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Package size={14} />
                Query Log
              </div>
              <span className="text-xs font-bold uppercase text-emerald-400">Pass</span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck size={14} />
                SSL Security
              </div>
              <span className="text-xs font-bold uppercase text-emerald-400">Active</span>
            </div>
          </div>
        </Card>
      </div>

      <Grid numItemsMd={2} numItemsLg={4} className="gap-4">
        {quickLinks.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="group flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left transition-all hover:border-cyan-500/20 hover:bg-slate-900/95"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-slate-400 transition-colors group-hover:text-cyan-300">
                {item.icon}
              </div>
              <span className="text-sm font-bold text-slate-200">{item.name}</span>
            </div>
            <ChevronRight
              size={16}
              className="text-slate-600 transition-all group-hover:translate-x-1 group-hover:text-cyan-300"
            />
          </button>
        ))}
      </Grid>
    </div>
  );
};

export default AdminDashboard;
