import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Map, ClipboardList, 
  Users, LogOut, ChevronRight, Zap 
} from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Dùng để highlight mục đang chọn

  const menuItems = [
    { title: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { title: 'Quản lý Tours', path: '/admin/tours', icon: <Map size={20} /> },
    { title: 'Đơn hàng', path: '/admin/bookings', icon: <ClipboardList size={20} /> },
    { title: 'Người dùng', path: '/admin/users', icon: <Users size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-slate-300 font-sans antialiased text-[13px]">
      <aside className="w-60 bg-[#1E293B]/50 border-r border-slate-800 backdrop-blur-xl flex flex-col sticky top-0 h-screen transition-all">
        <div className="p-5 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/10">
            <Zap size={18} className="text-white fill-white" />
          </div>
          <span className="text-lg font-black tracking-tighter text-white">TRAVEL <span className="text-blue-500 text-base">CMS</span></span>
        </div>

        <nav className="mt-2 px-3 flex-1">
          <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Hệ thống</p>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} 
                  className={`group flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                    isActive ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 text-slate-400'
                  }`}>
                  <div className="flex items-center gap-2.5 font-bold">
                    <span className={isActive ? 'text-white' : 'group-hover:text-blue-400'}>{item.icon}</span>
                    <span className="text-[12.5px]">{item.title}</span>
                  </div>
                  {isActive && <ChevronRight size={14} className="opacity-50" />}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 p-3 rounded-xl mb-3 flex items-center gap-2.5">
            <div className="w-8 h-8 bg-linear-to-tr from-blue-500 to-emerald-500 rounded-full flex items-center justify-center font-black text-white text-[10px]">AD</div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-black text-white truncate">Admin Leader</p>
              <p className="text-[9px] text-slate-500 font-medium italic">v2.0.26</p>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-2 px-3 py-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all font-bold text-[12px] group">
            <LogOut size={16} /> Thoát Admin
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto relative bg-[#0F172A]">
        <div className="absolute top-0 right-0 w-100 h-100 bg-blue-600/5 blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 p-6"><Outlet /></div>
      </main>
    </div>
  );
};

export default AdminLayout;