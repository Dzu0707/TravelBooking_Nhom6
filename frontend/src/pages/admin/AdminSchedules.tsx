import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { 
  Plus, Pencil, Trash2, Clock, X, Loader2, 
  Users, Baby, Check, CalendarDays, Hash
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
      <div className="flex flex-col gap-2 p-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-white">Xác nhận xóa lịch này?</p>
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
            className="bg-rose-600 px-3 py-1 rounded text-[10px] font-bold text-white"
          >Xóa</button>
          <button onClick={() => toast.dismiss(t.id)} className="bg-slate-700 px-3 py-1 rounded text-[10px] font-bold text-white">Hủy</button>
        </div>
      </div>
    ), { position: 'top-center' });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-slate-900/80 p-3 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <Clock size={16} className="text-emerald-500" />
          </div>
          <div>
            <h3 className="text-white font-black uppercase text-[11px] tracking-widest">Lịch khởi hành</h3>
            <p className="text-[9px] text-slate-500 font-bold uppercase italic">Tổng số: {schedules.length} đợt</p>
          </div>
        </div>
        <button 
          onClick={() => { setEditingId(null); setFormData({...initialForm, tourId: tourId || tours[0]?.id || 0}); setIsModalOpen(true); }} 
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl font-black text-[10px] transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-emerald-900/20"
        >
          <Plus size={14}/> THÊM ĐỢT MỚI
        </button>
      </div>

      {/* DANH SÁCH BẢNG - min-h-[200px] -> min-h-50 */}
      <div className="bg-slate-950/50 border border-slate-800 rounded-2xl overflow-hidden relative min-h-50">
        {loading && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center z-10 text-blue-500">
            <Loader2 className="animate-spin" size={32} />
          </div>
        )}
        
        <table className="w-full text-left">
          <thead className="bg-slate-900/50 text-slate-500 font-black border-b border-slate-800 uppercase text-[9px] tracking-tighter">
            <tr>
              {!tourId && <th className="p-4">Tour</th>}
              <th className="p-4">Ngày khởi hành</th>
              <th className="p-4 text-center">Chỗ trống</th>
              <th className="p-4 text-right">Giá NL</th>
              <th className="p-4 text-right">Giá TE</th>
              <th className="p-4 text-center">Lệnh</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {schedules.length === 0 && !loading && (
              <tr><td colSpan={6} className="p-10 text-center text-slate-600 text-[10px] font-bold uppercase italic">Chưa có lịch trình nào được tạo</td></tr>
            )}
            {schedules.map(s => (
              <tr key={s.id} className="hover:bg-blue-500/2 transition-colors group">
                {!tourId && <td className="p-4 font-black text-slate-300 max-w-40 truncate uppercase text-[11px]">{s.tourName}</td>}
                <td className="p-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                    <CalendarDays size={12}/>
                    {format(new Date(s.departureDate), 'dd/MM/yyyy')}
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-[10px] font-black border border-blue-500/20 shadow-inner">
                    {s.availableSeats} / {s.quota}
                  </span>
                </td>
                <td className="p-4 text-right text-orange-500 font-black text-xs tracking-tighter italic">{(s.adultPrice).toLocaleString()}₫</td>
                <td className="p-4 text-right text-amber-500 font-black text-xs tracking-tighter italic">{(s.childPrice).toLocaleString()}₫</td>
                <td className="p-4">
                  <div className="flex justify-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingId(s.id); setFormData({...s, departureDate: s.departureDate.split('T')[0], returnDate: s.returnDate.split('T')[0]}); setIsModalOpen(true); }} className="size-8 flex items-center justify-center hover:bg-slate-800 rounded-lg text-amber-500"><Pencil size={14}/></button>
                    <button onClick={() => confirmDelete(s.id)} className="size-8 flex items-center justify-center hover:bg-slate-800 rounded-lg text-rose-500"><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL - z-[60] -> z-60 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4">
          <form onSubmit={handleSubmit} className="bg-[#0f172a] border border-slate-700 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center bg-slate-950 px-5 py-4 border-b border-slate-800">
              <h2 className="text-white font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                <Plus size={14} className="text-emerald-500"/>
                {editingId ? 'Cập nhật lịch trình' : 'Khởi tạo đợt tour'}
              </h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={18}/></button>
            </div>
            
            <div className="p-6 space-y-5">
              {!tourId && !editingId && (
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Chọn Tour áp dụng</label>
                  <select className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none"
                    value={formData.tourId} onChange={e => setFormData({...formData, tourId: Number(e.target.value)})}>
                    {tours.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Ngày khởi hành</label>
                  <input type="date" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white text-xs font-bold outline-none focus:border-emerald-500/50"
                    value={formData.departureDate} onChange={e => setFormData({...formData, departureDate: e.target.value})} required />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Ngày kết thúc</label>
                  <input type="date" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white text-xs font-bold outline-none focus:border-emerald-500/50"
                    value={formData.returnDate} onChange={e => setFormData({...formData, returnDate: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/50 border border-slate-800 p-3 rounded-2xl">
                  {/* Đã xóa 'block' vì có 'flex' (CSS Conflict) */}
                  <label className="text-[8px] text-slate-500 font-black uppercase mb-1 flex items-center gap-1">
                    <Users size={10} className="text-orange-500"/> Giá người lớn
                  </label>
                  <input type="text" className="w-full bg-transparent text-orange-500 font-black outline-none text-sm italic" 
                    value={formData.adultPrice.toLocaleString()} onChange={e => handleNumberChange('adultPrice', e.target.value)} />
                </div>
                <div className="bg-slate-950/50 border border-slate-800 p-3 rounded-2xl">
                  <label className="text-[8px] text-slate-500 font-black uppercase mb-1 flex items-center gap-1">
                    <Baby size={10} className="text-amber-500"/> Giá trẻ em
                  </label>
                  <input type="text" className="w-full bg-transparent text-amber-500 font-black outline-none text-sm italic" 
                    value={formData.childPrice.toLocaleString()} onChange={e => handleNumberChange('childPrice', e.target.value)} />
                </div>
              </div>

              <div className="bg-slate-950/50 border border-slate-800 p-3 rounded-2xl">
                <label className="text-[8px] text-slate-500 font-black uppercase mb-1 flex items-center gap-1">
                  <Hash size={10} className="text-blue-500"/> Số lượng khách tối đa
                </label>
                <input type="text" className="w-full bg-transparent text-blue-400 font-black outline-none text-sm" 
                  value={formData.quota.toLocaleString()} onChange={e => handleNumberChange('quota', e.target.value)} />
              </div>

              {/* bg-gradient-to-r -> bg-linear-to-r */}
              <button type="submit" className="w-full py-4 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-900/20 active:scale-[0.98]">
                <Check size={16}/> LƯU CẬP NHẬT
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminSchedules;