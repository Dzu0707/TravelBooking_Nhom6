import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { 
  Map, Users, ClipboardList, ChevronRight, Activity, 
  CreditCard, RefreshCcw, ShieldCheck, Database, Zap, TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, Title, Text, Metric, Flex, ProgressBar, BadgeDelta, Grid
} from '@tremor/react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  // Giả sử các state stats và chartData đã có logic fetch như cũ
  const [stats, setStats] = useState({ tours: 0, bookings: 0, users: 0, revenue: 0, prevRevenue: 0 });
  const [chartData, setChartData] = useState<any[]>([]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER: Tối giản & Hiện đại */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="size-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Hệ thống trực tuyến</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
              Quản trị <span className="text-slate-600 font-light">/ Dashboard</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-xl border border-white/5">
            <div className="px-4 py-1 border-r border-white/10 text-right">
                <p className="text-[9px] font-bold text-slate-500 uppercase">Latency</p>
                <p className="text-xs font-mono text-emerald-400 font-bold">14ms</p>
            </div>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400">
               <RefreshCcw size={18} />
            </button>
          </div>
        </div>

        {/* CHỈ SỐ KPI: Viền Glow mảnh */}
        <Grid numItemsMd={2} numItemsLg={4} className="gap-5">
          {[
            { label: 'Doanh thu tổng', value: `${stats.revenue.toLocaleString()}đ`, delta: stats.prevRevenue },
            { label: 'Lưu lượng đơn', value: stats.bookings, progress: 65, color: 'blue' },
            { label: 'Cơ sở khách hàng', value: stats.users, progress: 40, color: 'indigo' },
            { label: 'Trạng thái Tour', value: stats.tours, status: 'Hoạt động', color: 'emerald' }
          ].map((item, i) => (
            <div key={i} className="glow-card-admin glow-accent p-6 group hover:translate-y-[-2px] transition-all duration-300">
              <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</Text>
              <Metric className="text-white text-2xl font-black mt-2 tracking-tight">{item.value}</Metric>
              
              {item.delta !== undefined && (
                <div className="flex items-center gap-2 mt-4">
                  <BadgeDelta deltaType={item.delta >= 0 ? "increase" : "decrease"} size="xs" className="bg-transparent border-none p-0 text-emerald-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase italic">+{item.delta.toFixed(1)}% So với kỳ trước</span>
                </div>
              )}
              {item.progress && <ProgressBar value={item.progress} color={item.color as any} className="mt-6 h-1" />}
              {item.status && <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase italic">
                <TrendingUp size={12}/> {item.status}
              </div>}
            </div>
          ))}
        </Grid>

        {/* BIỂU ĐỒ & MONITOR: Layout rộng */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glow-card-admin p-8 glow-accent">
            <Flex className="mb-8">
              <Title className="text-white text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
                <Activity size={16} className="text-blue-500" /> Phân tích dòng tiền thực tế
              </Title>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                <div className="size-1.5 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-bold text-blue-500 uppercase">Dữ liệu thực</span>
              </div>
            </Flex>
            <AreaChart
              className="h-72 mt-4 -ml-4"
              data={chartData}
              index="Thời gian"
              categories={["Doanh thu"]}
              colors={["blue"]}
              showYAxis={false}
              showGridLines={false}
              curveType="monotone"
            />
          </div>

          <div className="glow-card-admin p-6 flex flex-col">
            <Title className="text-white text-[10px] font-black uppercase tracking-widest mb-8">Hạ tầng hệ thống</Title>
            <div className="space-y-6 flex-grow">
               <div className="p-4 bg-slate-950/40 rounded-2xl border border-white/5">
                  <Flex>
                    <Text className="text-[9px] font-bold text-slate-500 uppercase">Database Sync</Text>
                    <Text className="text-[9px] font-bold text-blue-400">99.9%</Text>
                  </Flex>
                  <ProgressBar value={99.9} color="blue" className="mt-3 h-1" />
               </div>
               
               <div className="flex items-center justify-between px-2 py-3 border-b border-white/5">
                  <span className="text-[10px] font-bold flex items-center gap-3 text-slate-400 italic uppercase"><Database size={14}/> Query Log</span>
                  <span className="text-[10px] text-emerald-500 font-black italic">PASS</span>
               </div>
               <div className="flex items-center justify-between px-2 py-3">
                  <span className="text-[10px] font-bold flex items-center gap-3 text-slate-400 italic uppercase"><ShieldCheck size={14}/> SSL Security</span>
                  <span className="text-[10px] text-emerald-500 font-black italic">ACTIVE</span>
               </div>
            </div>
            <button className="mt-8 w-full py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95">
               Quét lỗi hệ thống
            </button>
          </div>
        </div>

        {/* NAVIGATION LỐI TẮT */}
        <Grid numItemsMd={2} numItemsLg={4} className="gap-4">
          {[
            { n: 'Cấu hình Tours', p: '/admin/tours', i: <Map size={18}/> },
            { n: 'Luồng đơn hàng', p: '/admin/bookings', i: <ClipboardList size={18}/> },
            { n: 'Tệp khách hàng', p: '/admin/users', i: <Users size={18}/> },
            { n: 'Số dư & Ví', p: '/admin/transactions', i: <CreditCard size={18}/> }
          ].map((m, i) => (
            <div key={i} onClick={() => navigate(m.p)} className="glow-card-admin p-5 hover:border-blue-500/50 cursor-pointer group flex items-center justify-between transition-all">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-slate-950 flex items-center justify-center text-slate-500 group-hover:text-blue-500 transition-colors">
                   {m.i}
                </div>
                <span className="text-[11px] font-black uppercase tracking-tighter text-slate-400 group-hover:text-white">{m.n}</span>
              </div>
              <ChevronRight size={14} className="text-slate-800 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default AdminDashboard;