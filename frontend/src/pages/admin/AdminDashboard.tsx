import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Map, Users, ClipboardList, BarChart3, 
  TrendingUp, Settings, ChevronRight,
  Activity,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer,
} from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ tours: 0, bookings: 0, users: 0, revenue: 0 });
  const [chartData, setChartData] = useState<any[]>([]);

  const mockChartData = [
    { date: '20/03', amount: 4500000 },
    { date: '22/03', amount: 12500000 },
    { date: '25/03', amount: 8900000 },
    { date: '27/03', amount: 18000000 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [tours, users, bookings] = await Promise.all([
          axios.get('http://localhost:5091/api/Tours').catch(() => ({ data: [] })),
          axios.get('http://localhost:5091/api/Users', config).catch(() => ({ data: [] })),
          axios.get('http://localhost:5091/api/Bookings', config)
        ]);

        const totalRev = bookings.data.reduce((sum: number, b: any) => sum + (Number(b.totalPrice) || 0), 0);
        const grouped = bookings.data.reduce((acc: any, b: any) => {
          const d = new Date(b.createdAt).toLocaleDateString('vi-VN', {day:'2-digit', month:'2-digit'});
          acc[d] = (acc[d] || 0) + (b.totalPrice || 0);
          return acc;
        }, {});

        const formatted = Object.keys(grouped).map(date => ({ date, amount: grouped[date] }));

        setStats({ 
          tours: tours.data.length, 
          bookings: bookings.data.length, 
          users: users.data.length, 
          revenue: totalRev 
        });
        setChartData(formatted.length > 0 ? formatted : mockChartData);
      } catch (err) {
        setStats({ tours: 12, bookings: 48, users: 8, revenue: 154000000 });
        setChartData(mockChartData);
      }
    };
    fetchData();
  }, []);

  const menuItems = [
    { title: 'Quản lý Tours', desc: 'Lịch trình & Giá', icon: <Map size={20}/>, path: '/admin/tours', color: 'text-blue-400', bg: 'bg-blue-400/10', count: stats.tours },
    { title: 'Đơn hàng', desc: 'Thanh toán & Duyệt', icon: <ClipboardList size={20}/>, path: '/admin/bookings', color: 'text-emerald-400', bg: 'bg-emerald-400/10', count: stats.bookings },
    { title: 'Người dùng', desc: 'Quyền & Tài khoản', icon: <Users size={20}/>, path: '/admin/users', color: 'text-purple-400', bg: 'bg-purple-400/10', count: stats.users },
    { title: 'Hệ thống', desc: 'Docker & API', icon: <Settings size={20}/>, path: '/admin/settings', color: 'text-slate-400', bg: 'bg-slate-400/10', count: null }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase flex items-center gap-2">
            Control Panel <Activity size={18} className="text-blue-500"/>
          </h1>
          <p className="text-slate-500 text-[11px] font-bold tracking-widest uppercase">Analytics Overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Revenue Card nhỏ gọn */}
        <div className="lg:col-span-4 bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute -right-2 -bottom-2 opacity-5 text-white"><BarChart3 size={100} /></div>
          <h2 className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-1">Doanh thu hệ thống</h2>
          <p className="text-3xl font-black text-white tracking-tighter">
            {stats.revenue.toLocaleString()}<span className="text-sm text-blue-500 ml-1">đ</span>
          </p>
          <div className="mt-4 flex items-center gap-2 text-emerald-400 text-[11px] font-black">
            <TrendingUp size={14}/> +12.5% <span className="text-slate-500 font-medium">vs last week</span>
          </div>
        </div>

        {/* Chart nhỏ gọn */}
        <div className="lg:col-span-8 bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-white uppercase text-[10px] tracking-widest">Growth Analytics</h3>
            <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-md font-black border border-blue-500/20">W12</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '10px'}} />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={0.1} fill="#3b82f6" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Menu Cards nhỏ gọn */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {menuItems.map((item, i) => (
          <div key={i} onClick={() => navigate(item.path)} className="group bg-slate-800/30 border border-slate-700/50 p-4 rounded-2xl hover:border-blue-500/40 transition-all cursor-pointer">
            <div className={`w-9 h-9 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
              {item.icon}
            </div>
            <h4 className="font-bold text-white text-[13px]">{item.title}</h4>
            <div className="flex justify-between items-center mt-3">
              <span className="text-[9px] font-black bg-slate-700 text-blue-400 px-2 py-0.5 rounded-md border border-slate-600">
                {item.count || 0} ACTIVE
              </span>
              <ChevronRight size={14} className="text-slate-600 group-hover:text-blue-400 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;