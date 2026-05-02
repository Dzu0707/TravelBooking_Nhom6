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

interface TourItem { id: number; }
interface BookingItem { id: number; createdAt?: string; totalPrice?: number; status?: string; }
interface UserItem { id: number; }
interface TransactionItem { id: number; amount?: number; createdAt?: string; status?: string; }

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

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

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

      // Logic xử lý số liệu
      const confirmedBookings = bookings.filter(b => (b.status || '').toLowerCase() === 'confirmed').length;
      const successfulTransactions = transactions.filter(t => {
        const s = (t.status || '').toLowerCase();
        return ['success', 'completed', 'paid', 'confirmed'].includes(s);
      });

      const totalRevenue = successfulTransactions.reduce((sum, item) => sum + (item.amount || 0), 0);

      // Xử lý dữ liệu biểu đồ 7 ngày
      const now = new Date();
      const currentWeekStart = startOfWeek(now);
      
      const revenueByDay = Array.from({ length: 7 }, (_, index) => {
        const d = new Date(currentWeekStart);
        d.setDate(currentWeekStart.getDate() + index);
        const nextD = new Date(d); nextD.setDate(d.getDate() + 1);

        const rev = successfulTransactions
          .filter(t => t.createdAt && new Date(t.createdAt) >= d && new Date(t.createdAt) < nextD)
          .reduce((sum, t) => sum + (t.amount || 0), 0);

        return { time: weekLabels[index], revenue: rev };
      });

      const bookingsByDay = Array.from({ length: 7 }, (_, index) => {
        const d = new Date(currentWeekStart);
        d.setDate(currentWeekStart.getDate() + index);
        const nextD = new Date(d); nextD.setDate(d.getDate() + 1);

        const count = bookings.filter(b => b.createdAt && new Date(b.createdAt) >= d && new Date(b.createdAt) < nextD).length;
        return { time: weekLabels[index], bookings: count };
      });

      // Tính toán tăng trưởng % (giả định đơn giản cho tuần này)
      const currentWeekRevenue = successfulTransactions
        .filter(t => t.createdAt && new Date(t.createdAt) >= currentWeekStart)
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      
      const prevWeekStart = new Date(currentWeekStart);
      prevWeekStart.setDate(prevWeekStart.getDate() - 7);
      const prevWeekRevenue = successfulTransactions
        .filter(t => t.createdAt && new Date(t.createdAt) >= prevWeekStart && new Date(t.createdAt) < currentWeekStart)
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const growth = prevWeekRevenue > 0 ? ((currentWeekRevenue - prevWeekRevenue) / prevWeekRevenue) * 100 : (currentWeekRevenue > 0 ? 100 : 0);

      setStats({
        tours: tours.length,
        bookings: bookings.length,
        users: users.length,
        revenue: totalRevenue,
        prevRevenue: Number(growth.toFixed(1)),
        confirmedBookings,
      });

      setRevenueChartData(revenueByDay);
      setBookingChartData(bookingsByDay);
    } catch (err: any) {
      toast.error('Không tải được dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const systemDistribution = useMemo(() => [
    { name: 'Tours', value: stats.tours },
    { name: 'Đơn hàng', value: stats.bookings },
    { name: 'Người dùng', value: stats.users },
  ], [stats]);

  const quickLinks = [
    { name: 'Cấu hình Tours', path: '/admin/tours', icon: <Map size={18} /> },
    { name: 'Luồng đơn hàng', path: '/admin/bookings', icon: <ClipboardList size={18} /> },
    { name: 'Tệp khách hàng', path: '/admin/users', icon: <Users size={18} /> },
    { name: 'Số dư & Ví', path: '/admin/transactions', icon: <CreditCard size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans p-6 lg:p-10 space-y-8">
      {/* Header Section */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">System Analytics</div>
            <h1 className="mt-2 text-2xl font-black uppercase tracking-tight text-slate-100">Tổng quan vận hành</h1>
            <p className="text-sm text-slate-400">Theo dõi doanh thu và trạng thái hệ thống thời gian thực.</p>
          </div>
          <button 
            onClick={fetchDashboard}
            className="flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-3 text-sm font-bold text-cyan-300 hover:bg-cyan-500/20 transition-all"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
            Làm mới dữ liệu
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <Grid numItemsMd={2} numItemsLg={4} className="gap-6">
        <Card className="bg-slate-900 border-slate-800 p-5">
          <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Doanh thu tổng</Text>
          <Metric className="mt-2 text-2xl font-black text-white">{formatMoney(stats.revenue)}</Metric>
          <div className="mt-4 flex items-center gap-2">
            <Badge color={stats.prevRevenue >= 0 ? 'emerald' : 'rose'}>{stats.prevRevenue >= 0 ? '+' : ''}{stats.prevRevenue}%</Badge>
            <span className="text-xs text-slate-500 italic">so với tuần trước</span>
          </div>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-5">
          <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Tổng đơn hàng</Text>
          <Metric className="mt-2 text-2xl font-black text-white">{formatNumber(stats.bookings)}</Metric>
          <ProgressBar value={stats.bookings > 0 ? (stats.confirmedBookings / stats.bookings) * 100 : 0} color="cyan" className="mt-5 h-1.5" />
          <Text className="mt-2 text-[10px] text-slate-400 uppercase font-bold">{stats.confirmedBookings} đơn đã xác nhận</Text>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-5">
          <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Người dùng</Text>
          <Metric className="mt-2 text-2xl font-black text-white">{formatNumber(stats.users)}</Metric>
          <div className="mt-5 flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase italic">
            <Users size={12} /> Live Accounts
          </div>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-5">
          <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Tours</Text>
          <Metric className="mt-2 text-2xl font-black text-white">{stats.tours}</Metric>
          <div className="mt-5 flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase italic">
            <TrendingUp size={12} /> Đang hoạt động
          </div>
        </Card>
      </Grid>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-slate-900 border-slate-800">
          <Title className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 mb-6">
            <Activity size={16} className="text-cyan-400" /> Doanh thu theo tuần
          </Title>
          <AreaChart
            className="h-72"
            data={revenueChartData}
            index="time"
            categories={['revenue']}
            colors={['cyan']}
            valueFormatter={formatMoney}
            showLegend={false}
            showYAxis={false}
            curveType="monotone"
          />
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <Title className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 mb-6">
            <ShoppingBag size={16} className="text-blue-400" /> Booking theo tuần
          </Title>
          <BarChart
            className="h-72"
            data={bookingChartData}
            index="time"
            categories={['bookings']}
            colors={['blue']}
            valueFormatter={formatNumber}
            showLegend={false}
          />
        </Card>
      </div>

      {/* Distribution & Infrastructure */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-slate-900 border-slate-800">
          <Title className="text-white text-xs font-black uppercase tracking-widest mb-6">Cơ cấu dữ liệu</Title>
          <DonutChart
            className="h-64"
            data={systemDistribution}
            category="value"
            index="name"
            colors={['cyan', 'blue', 'indigo']}
            valueFormatter={formatNumber}
          />
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <Title className="text-white text-xs font-black uppercase tracking-widest mb-6">Hạ tầng hệ thống</Title>
          <div className="space-y-6">
            <div>
              <Flex><Text className="text-xs text-slate-400">Database Sync</Text><Text className="text-xs font-bold text-cyan-300">100%</Text></Flex>
              <ProgressBar value={100} color="cyan" className="mt-2 h-1.5" />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 flex items-center gap-2"><ShieldCheck size={14} /> SSL Security</span>
              <Badge color="emerald">ACTIVE</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 flex items-center gap-2"><Database size={14} /> Query Performance</span>
              <Badge color="emerald">OPTIMIZED</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Links */}
      <Grid numItemsMd={2} numItemsLg={4} className="gap-4">
        {quickLinks.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="group flex items-center justify-between p-5 bg-slate-900 border border-slate-800 rounded-2xl hover:border-cyan-500/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-950 rounded-xl text-slate-500 group-hover:text-cyan-300 transition-colors">
                {item.icon}
              </div>
              <span className="text-xs font-black uppercase tracking-tighter text-slate-400 group-hover:text-white">{item.name}</span>
            </div>
            <ChevronRight size={14} className="text-slate-700 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </Grid>
    </div>
  );
};

export default AdminDashboard;