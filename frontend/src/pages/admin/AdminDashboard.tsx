import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { 
  Map, Users, ClipboardList, ChevronRight,
  Activity, CreditCard, RefreshCcw,
  ArrowUpRight, Globe, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { 
  Card, AreaChart, Title, Text, Metric, Flex, ProgressBar
} from '@tremor/react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ tours: 0, bookings: 0, users: 0, revenue: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [toursRes, usersRes, transactionsRes, bookingsRes] = await Promise.all([
        axios.get('http://localhost:5091/api/Tours', config),
        axios.get('http://localhost:5091/api/Users', config),
        axios.get('http://localhost:5091/api/Transactions', config),
        axios.get('http://localhost:5091/api/Bookings', config)
      ]);

      const rawTransactions = transactionsRes.data.transactions || [];
      const grouped = rawTransactions.reduce((acc: any, t: any) => {
        const date = new Date(t.createdAt).toLocaleDateString('vi-VN', {day:'2-digit', month:'2-digit'});
        acc[date] = (acc[date] || 0) + t.amount;
        return acc;
      }, {});

      const formatted = Object.keys(grouped).map(date => ({
        "Ngày": date,
        "Doanh thu": grouped[date]
      })).sort((a, b) => a["Ngày"].localeCompare(b["Ngày"]));

      setStats({ 
        tours: toursRes.data.length, 
        bookings: bookingsRes.data.length, 
        users: usersRes.data.length, 
        revenue: transactionsRes.data.totalRevenue || 0 
      });
      setChartData(formatted);
    } catch (err) {
      toast.error("Lỗi đồng bộ dữ liệu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center">
      <RefreshCcw className="animate-spin text-slate-700" size={24} />
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* SECTION 1: WELCOME & PRIMARY STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 flex flex-col justify-center px-2">
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Chào buổi chiều, Admin</h1>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-1">Hệ thống TravelGo • Trạng thái ổn định</p>
        </div>
        
        <Card className="bg-slate-900 border-slate-800 rounded-2xl p-4 ring-1 ring-white/5">
          <Flex alignItems="start">
            <div>
              <Text className="text-[10px] font-bold text-slate-500 uppercase">Doanh thu tháng</Text>
              <Metric className="text-slate-100 text-xl font-bold mt-1">
                {stats.revenue.toLocaleString()}đ
              </Metric>
            </div>
            <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold italic">
              +14.2%
            </div>
          </Flex>
        </Card>

        <Card className="bg-slate-900 border-slate-800 rounded-2xl p-4 ring-1 ring-white/5">
          <Flex alignItems="start">
            <div>
              <Text className="text-[10px] font-bold text-slate-500 uppercase">Lượt đặt Tour</Text>
              <Metric className="text-slate-100 text-xl font-bold mt-1">{stats.bookings}</Metric>
            </div>
            <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-500">
               <ArrowUpRight size={14} />
            </div>
          </Flex>
        </Card>
      </div>

      {/* SECTION 2: MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-slate-900 border-slate-800 rounded-2xl p-6 ring-1 ring-white/5">
          <div className="flex justify-between items-center mb-8">
            <Title className="text-slate-100 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <Activity size={16} className="text-blue-500" /> Biểu đồ tăng trưởng
            </Title>
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 my-auto"></span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Doanh thu trực tuyến</span>
            </div>
          </div>
          <AreaChart
            className="h-64 mt-4"
            data={chartData}
            index="Ngày"
            categories={["Doanh thu"]}
            colors={["blue"]}
            showAnimation={false}
            showLegend={false}
            showYAxis={false}
            showGridLines={false}
            startEndOnly={true}
          />
        </Card>

        <Card className="bg-slate-900 border-slate-800 rounded-2xl p-6 ring-1 ring-white/5 flex flex-col gap-6">
          <Title className="text-slate-100 text-xs font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" /> Bảo mật & Hạ tầng
          </Title>
          
          <div className="space-y-6">
            <div>
              <Flex className="mb-2">
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">SSL Certificate</Text>
                <Text className="text-[9px] font-bold text-emerald-500 uppercase">Valid</Text>
              </Flex>
              <ProgressBar value={100} color="emerald" className="h-1" />
            </div>
            
            <div>
              <Flex className="mb-2">
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Database Load</Text>
                <Text className="text-[9px] font-bold text-blue-500 uppercase">Normal</Text>
              </Flex>
              <ProgressBar value={42} color="blue" className="h-1" />
            </div>

            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-xl">
               <Text className="text-[10px] text-slate-500 font-medium italic">
                 "Tất cả các dịch vụ đang vận hành ở mức tối ưu."
               </Text>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-800 flex justify-between items-center text-slate-600">
             <div className="flex items-center gap-1">
               <Globe size={12} />
               <span className="text-[9px] font-bold">VN-CDN-01</span>
             </div>
             <span className="text-[9px] font-bold uppercase tracking-widest">{new Date().toLocaleDateString('vi-VN')}</span>
          </div>
        </Card>
      </div>

      {/* SECTION 3: QUICK ACTIONS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: 'Tours', path: '/admin/tours', icon: <Map size={16}/>, count: stats.tours, color: 'blue' },
          { title: 'Đơn hàng', path: '/admin/bookings', icon: <ClipboardList size={16}/>, count: stats.bookings, color: 'emerald' },
          { title: 'Người dùng', path: '/admin/users', icon: <Users size={16}/>, count: stats.users, color: 'indigo' },
          { title: 'Thanh toán', path: '/admin/transactions', icon: <CreditCard size={16}/>, count: 'Logs', color: 'amber' }
        ].map((item, i) => (
          <div 
            key={i} 
            onClick={() => navigate(item.path)}
            className="group p-5 bg-slate-900 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className={`text-slate-500 transition-colors mb-3`}>
              {item.icon}
            </div>
            <h4 className="text-slate-200 font-bold text-xs uppercase tracking-tight">{item.title}</h4>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] text-slate-600 font-bold uppercase">{item.count} items</span>
              <ChevronRight size={12} className="text-slate-800 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;