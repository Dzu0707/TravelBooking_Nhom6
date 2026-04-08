import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { 
  Plus, Pencil, Trash2, Clock, X, Loader2, 
  Users, Baby, Check, CalendarDays, Hash, Info, Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface AdminSchedulesProps {
  tourId?: number;
}

const AdminSchedules: React.FC<AdminSchedulesProps> = ({ tourId }) => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [tours, setTours] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State cho thanh tìm kiếm

  const initialForm = {
    tourId: tourId || 0,
    departureDate: '',
    returnDate: '',
    adultPrice: 0,
    childPrice: 0,
    quota: 20,
    status: 'Available'
  };

  const [formData, setFormData] = useState(initialForm);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const url = tourId 
        ? `http://localhost:5091/api/TourSchedules/by-tour/${tourId}` 
        : 'http://localhost:5091/api/TourSchedules';
      
      const [resSchedules, resTours] = await Promise.all([
        axios.get(url, { headers }),
        !tourId ? axios.get('http://localhost:5091/api/Tours', { headers }) : Promise.resolve({ data: [] })
      ]);

      setSchedules(resSchedules.data);
      if (!tourId) setTours(resTours.data);
      
      if (!editingId) {
        setFormData(p => ({ ...p, tourId: tourId || resTours.data[0]?.id || 0 }));
      }
    } catch (err: any) { 
      toast.error("Không thể tải dữ liệu lịch trình");
    } finally { 
      setLoading(false); 
    }
  }, [tourId, editingId, token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Logic lọc dữ liệu: Tìm theo tên Tour HOẶC Ngày khởi hành
  const filtered = schedules.filter(s => {
    const searchLower = searchTerm.toLowerCase();
    const tourNameMatch = s.tourName?.toLowerCase().includes(searchLower);
    const dateStr = format(new Date(s.departureDate), 'dd/MM/yyyy');
    const dateMatch = dateStr.includes(searchTerm); // Tìm theo định dạng ngày dd/MM/yyyy
    
    return tourNameMatch || dateMatch;
  });

  const handleNumberChange = (field: string, value: string) => {
    const rawValue = value.replace(/\D/g, "");
    const num = rawValue === "" ? 0 : Number(rawValue.slice(0, 10));
    setFormData(prev => ({ ...prev, [field]: num }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadId = toast.loading("Đang lưu lịch trình...");
    try {
      const isEdit = !!editingId;
      const url = isEdit ? `http://localhost:5091/api/TourSchedules/${editingId}` : 'http://localhost:5091/api/TourSchedules';
      
      const payload = {
        ...formData,
        id: editingId || 0,
        adultPrice: Number(formData.adultPrice),
        childPrice: Number(formData.childPrice),
        quota: Number(formData.quota)
      };

      await axios({ method: isEdit ? 'put' : 'post', url, data: payload, headers });
      
      toast.success(isEdit ? "Cập nhật thành công" : "Thêm lịch mới thành công", { id: loadId });
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) { 
      toast.error("Dữ liệu không hợp lệ hoặc lỗi server", { id: loadId });
    }
  };

  const confirmDelete = (id: number) => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <p className="text-[11px] font-bold uppercase tracking-tight text-slate-300">Xác nhận xóa lịch này?</p>
        <div className="flex gap-2">
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.delete(`http://localhost:5091/api/TourSchedules/${id}`, { headers });
                fetchData();
                toast.success("Đã xóa lịch trình");
              } catch { toast.error("Lỗi khi xóa"); }
            }}
            className="bg-rose-600 px-4 py-1.5 rounded-md text-[10px] font-bold text-white uppercase"
          >Xóa</button>
          <button onClick={() => toast.dismiss(t.id)} className="bg-slate-800 px-4 py-1.5 rounded-md text-[10px] font-bold text-slate-400 uppercase">Hủy</button>
        </div>
      </div>
    ), { style: { background: '#0f172a', border: '1px solid #1e293b' } });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg shadow-black/20">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <Clock size={20} className="text-emerald-500" />
          </div>
          <div>
            <h3 className="text-slate-100 font-bold uppercase text-[12px] tracking-tight flex items-center gap-2">
              Lịch khởi hành 
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
               {schedules.length} đợt khởi hành
            </p>
          </div>
        </div>
        <button 
          onClick={() => { setEditingId(null); setFormData({...initialForm, tourId: tourId || tours[0]?.id || 0}); setIsModalOpen(true); }} 
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-bold text-[11px] uppercase transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-emerald-900/20"
        >
          <Plus size={16}/> THÊM ĐỢT MỚI
        </button>
      </div>

      {/* SEARCH SECTION - MỚI THÊM */}
      <div className="flex items-center gap-4">
        <div className="relative group w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={14} />
          <input 
            type="text"
            placeholder="Tìm theo tên tour hoặc ngày (dd/mm/yyyy)..."
            className="w-full pl-11 pr-10 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-bold outline-none focus:border-emerald-500/50 transition-all shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-rose-500 transition-colors p-1"
            >
              <X size={16} strokeWidth={3} />
            </button>
          )}
        </div>
        {!loading && (
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest hidden md:block">
            Kết quả: {filtered.length} / {schedules.length}
          </span>
        )}
      </div>

      {/* TABLE SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative ring-1 ring-white/5">
        <table className="w-full text-left">
          <thead className="bg-slate-950/60 text-slate-500 font-bold border-b border-slate-800/50 uppercase text-[10px] tracking-wider">
            <tr>
              {!tourId && <th className="p-5">Tên Tour</th>}
              <th className="p-5">Ngày khởi hành</th>
              <th className="p-5 text-center">Chỗ trống</th>
              <th className="p-5 text-right">Giá Người Lớn</th>
              <th className="p-5 text-right">Giá Trẻ Em</th>
              <th className="p-5 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-emerald-500" size={32} />
                    <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Đang truy xuất lịch trình...</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition-colors group border-b border-slate-800/30">
                  {!tourId && (
                    <td className="p-5 font-bold text-blue-400 max-w-40 truncate uppercase text-[11px]">
                      {s.tourName || "N/A"}
                    </td>
                  )}
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                      <CalendarDays size={14} className="text-emerald-500/50"/>
                      {format(new Date(s.departureDate), 'dd/MM/yyyy')}
                    </div>
                  </td>
                  <td className="p-5 text-center">
                    <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold border border-blue-500/20 shadow-inner">
                      {s.availableSeats} / {s.quota}
                    </span>
                  </td>
                  <td className="p-5 text-right text-orange-500 font-bold text-xs tracking-tighter italic">{(s.adultPrice).toLocaleString()}₫</td>
                  <td className="p-5 text-right text-amber-500 font-bold text-xs tracking-tighter italic">{(s.childPrice).toLocaleString()}₫</td>
                  <td className="p-5">
                    <div className="flex justify-center gap-1">
                      <button 
                        onClick={() => { setEditingId(s.id); setFormData({...s, departureDate: s.departureDate.split('T')[0], returnDate: s.returnDate.split('T')[0]}); setIsModalOpen(true); }} 
                        className="size-9 flex items-center justify-center hover:bg-amber-500/10 rounded-lg text-slate-500 hover:text-amber-500 transition-all"
                      >
                        <Pencil size={16}/>
                      </button>
                      <button 
                        onClick={() => confirmDelete(s.id)} 
                        className="size-9 flex items-center justify-center hover:bg-rose-500/10 rounded-lg text-slate-500 hover:text-rose-500 transition-all"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-20 text-center">
                  <div className="flex flex-col items-center">
                    <div className="p-4 bg-slate-950 rounded-full mb-4 ring-1 ring-slate-800">
                      <Info size={32} className="text-slate-800" />
                    </div>
                    <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest italic">
                      {searchTerm ? "Không tìm thấy lịch trình phù hợp" : "Chưa có lịch trình nào được tạo"}
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL SECTION - Giữ nguyên logic cũ đã tối ưu giao diện */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center bg-slate-950 px-6 py-5 border-b border-slate-800">
              <h2 className="text-white font-bold uppercase text-[11px] tracking-widest flex items-center gap-3">
                <div className={`size-2 rounded-full ${editingId ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
                {editingId ? 'Cập nhật lịch trình' : 'Khởi tạo đợt tour'}
              </h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-rose-500 transition-colors p-1"><X size={20}/></button>
            </div>
            
            <div className="p-8 space-y-6">
              {!tourId && !editingId && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Chọn Tour áp dụng</label>
                  <select className="w-full bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-white text-xs font-bold outline-none focus:border-blue-500 transition-all"
                    value={formData.tourId} onChange={e => setFormData({...formData, tourId: Number(e.target.value)})}>
                    {tours.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Ngày khởi hành</label>
                  <input type="date" className="w-full bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-white text-xs font-bold outline-none focus:border-emerald-500/50"
                    value={formData.departureDate} onChange={e => setFormData({...formData, departureDate: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Ngày kết thúc</label>
                  <input type="date" className="w-full bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-white text-xs font-bold outline-none focus:border-emerald-500/50"
                    value={formData.returnDate} onChange={e => setFormData({...formData, returnDate: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl shadow-inner group focus-within:border-orange-500/50">
                  <label className="text-[9px] text-slate-500 font-bold uppercase mb-2 flex items-center gap-2">
                    <Users size={12} className="text-orange-500"/> Giá người lớn
                  </label>
                  <input type="text" className="w-full bg-transparent text-orange-500 font-bold outline-none text-sm italic" 
                    value={formData.adultPrice.toLocaleString()} onChange={e => handleNumberChange('adultPrice', e.target.value)} />
                </div>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl shadow-inner group focus-within:border-amber-500/50">
                  <label className="text-[9px] text-slate-500 font-bold uppercase mb-2 flex items-center gap-2">
                    <Baby size={12} className="text-amber-500"/> Giá trẻ em
                  </label>
                  <input type="text" className="w-full bg-transparent text-amber-500 font-bold outline-none text-sm italic" 
                    value={formData.childPrice.toLocaleString()} onChange={e => handleNumberChange('childPrice', e.target.value)} />
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl shadow-inner group focus-within:border-blue-500/50">
                <label className="text-[9px] text-slate-500 font-bold uppercase mb-2 flex items-center gap-2">
                  <Hash size={12} className="text-blue-500"/> Số lượng khách tối đa
                </label>
                <input type="text" className="w-full bg-transparent text-blue-400 font-bold outline-none text-sm" 
                  value={formData.quota.toLocaleString()} onChange={e => handleNumberChange('quota', e.target.value)} />
              </div>

              <div className="flex gap-3 mt-4">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-800 text-slate-400 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all">
                  Hủy bỏ
                </button>
                <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-900/40 active:scale-95">
                  <Check size={16}/> LƯU CẬP NHẬT
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminSchedules;