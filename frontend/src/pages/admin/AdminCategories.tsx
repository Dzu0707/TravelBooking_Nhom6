import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { 
  FolderTree, Plus, Pencil, Trash2, X, Search, ChevronRight, Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import { 
  Card, Table, TableHead, TableRow, TableHeaderCell, 
  TableBody, TableCell, Text, Title, Badge, Flex 
} from '@tremor/react';

const AdminCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5091/api/Categories');
      setCategories(res.data);
    } catch (err) { 
      toast.error("Không thể tải danh mục");
    } finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadId = toast.loading("Đang xử lý...");
    try {
      if (editingId) {
        await axios.put(`http://localhost:5091/api/Categories/${editingId}`, { ...formData, id: editingId }, { headers });
      } else {
        await axios.post('http://localhost:5091/api/Categories', formData, { headers });
      }
      setIsModalOpen(false);
      fetchData();
      toast.success("Lưu thành công", { id: loadId });
    } catch (err) { 
      toast.error("Lỗi dữ liệu", { id: loadId }); 
    }
  };

  const confirmDelete = (id: number) => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <p className="text-[11px] font-bold uppercase tracking-tight text-slate-300">Xác nhận xóa danh mục này?</p>
        <div className="flex gap-2">
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.delete(`http://localhost:5091/api/Categories/${id}`, { headers });
                fetchData();
                toast.success("Đã xóa");
              } catch { 
                toast.error("Không thể xóa danh mục đang có Tour"); 
              }
            }}
            className="bg-red-600 text-white px-4 py-1.5 rounded-md text-[10px] font-bold uppercase"
          >Xóa</button>
          <button onClick={() => toast.dismiss(t.id)} className="bg-slate-800 text-slate-400 px-4 py-1.5 rounded-md text-[10px] font-bold uppercase">Hủy</button>
        </div>
      </div>
    ), { style: { background: '#0f172a', border: '1px solid #1e293b' } });
  };

  const filtered = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 px-4">
      
      {/* HEADER SECTION */}
      <Card className="bg-slate-900 border-slate-800 rounded-xl p-6 shadow-lg shadow-black/20">
        <Flex justifyContent="between" alignItems="center">
          <div>
            <Title className="text-slate-100 font-bold uppercase tracking-tight flex items-center gap-2 text-base">
              Quản lý Danh mục <FolderTree size={18} className="text-blue-500" />
            </Title>
            <Text className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1 flex items-center gap-2">
              {/* ĐÃ SỬA: Đổi div thành span thêm inline-block */}
              <span className="size-1.5 inline-block bg-emerald-500 rounded-full animate-pulse" />
              Cập nhật: {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: vi })}
            </Text>
          </div>
          <button 
            onClick={() => { setEditingId(null); setFormData({ name: '', description: '' }); setIsModalOpen(true); }}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-bold text-[11px] uppercase transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95"
          >
            <Plus size={16}/> THÊM DANH MỤC
          </button>
        </Flex>
      </Card>

      {/* SEARCH SECTION */}
      <div className="flex items-center gap-4">
        <div className="relative group w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={14} />
          <input 
            type="text"
            placeholder="Tìm kiếm danh mục theo tên..."
            className="w-full pl-11 pr-10 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-bold outline-none focus:border-blue-500/50 transition-all ring-blue-500/0 focus:ring-4 focus:ring-blue-500/10 shadow-inner"
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
          <Text className="text-[10px] font-bold text-slate-600 uppercase tracking-widest hidden md:block">
            Hiển thị: {filtered.length} / {categories.length}
          </Text>
        )}
      </div>

      {/* TABLE SECTION */}
      <Card className="bg-slate-900 border-slate-800 rounded-xl p-0 overflow-hidden ring-1 ring-white/5">
        <Table>
          <TableHead className="bg-slate-950/60">
            <TableRow>
              <TableHeaderCell className="text-[10px] font-bold uppercase tracking-wider text-slate-500 p-5 w-24 text-center">ID</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Thông tin danh mục</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mô tả chi tiết</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">Thao tác</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              /* Hiệu ứng Loading khi đang tải dữ liệu */
              <TableRow>
                <TableCell colSpan={4} className="p-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="size-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Đang tải dữ liệu...</Text>
                  </div>
                </TableCell>
              </TableRow>
            ) : filtered.length > 0 ? (
              filtered.map((c) => (
                <TableRow key={c.id} className="hover:bg-slate-800/40 transition-colors border-b border-slate-800/50">
                  <TableCell className="p-5 text-center">
                    <Badge color="slate" size="xs" className="font-mono text-[10px] bg-slate-800 border-slate-700 text-slate-400">
                      #{c.id}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-5">
                    <Text className="font-bold text-blue-400 uppercase text-xs tracking-tight">{c.name}</Text>
                  </TableCell>
                  <TableCell className="p-5">
                    <Text className="text-[11px] text-slate-400 italic max-w-xs truncate">
                      {c.description || "Chưa có mô tả..."}
                    </Text>
                  </TableCell>
                  <TableCell className="p-5">
                    <Flex justifyContent="center" className="gap-1">
                      <button 
                        onClick={() => { setEditingId(c.id); setFormData({ name: c.name, description: c.description || '' }); setIsModalOpen(true); }}
                        className="p-2.5 text-slate-500 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all"
                        title="Chỉnh sửa"
                      >
                        <Pencil size={16}/>
                      </button>
                      <button 
                        onClick={() => confirmDelete(c.id)}
                        className="p-2.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                        title="Xóa danh mục"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </Flex>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              /* Trường hợp không có dữ liệu */
              <TableRow>
                <TableCell colSpan={4} className="p-20 text-center">
                  <div className="flex flex-col items-center">
                    <div className="p-4 bg-slate-950 rounded-full mb-4 ring-1 ring-slate-800">
                      <Info size={32} className="text-slate-800" />
                    </div>
                    <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest italic">
                      {searchTerm ? "Không tìm thấy danh mục phù hợp" : "Danh sách danh mục trống"}
                    </Text>
                    {searchTerm && (
                      <button 
                        onClick={() => setSearchTerm("")}
                        className="mt-4 text-blue-500 text-[10px] font-bold uppercase hover:underline"
                      >
                        Xóa tìm kiếm
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* MODAL SECTION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <Card className="bg-slate-900 border-slate-800 w-full max-w-lg p-0 flex flex-col rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 animate-in zoom-in-95 duration-200">
            <Flex className="bg-slate-950 px-6 py-5 border-b border-slate-800" justifyContent="between">
                <Title className="text-white font-bold uppercase text-[11px] tracking-widest flex items-center gap-3">
                  {/* ĐÃ SỬA: Đổi div thành span thêm inline-block */}
                  <span className={`size-2 inline-block rounded-full ${editingId ? 'bg-amber-500' : 'bg-blue-500'} animate-pulse shadow-[0_0_8px] ${editingId ? 'shadow-amber-500' : 'shadow-blue-500'}`} />
                  {editingId ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
                </Title>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-rose-500 transition-colors p-1"><X size={20}/></button>
            </Flex>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-slate-900/50">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Tên danh mục</label>
                <input 
                  type="text" required 
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs font-bold text-slate-100 outline-none focus:border-blue-500 transition-all shadow-inner focus:ring-4 focus:ring-blue-500/5"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="VD: Du lịch Phú Quốc"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">Mô tả chi tiết</label>
                <textarea 
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs font-medium text-slate-200 outline-none focus:border-blue-500 resize-none transition-all shadow-inner focus:ring-4 focus:ring-blue-500/5"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Nhập mô tả cho danh mục này..."
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-slate-800 hover:bg-slate-750 text-slate-400 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-900/40 active:scale-95"
                >
                  {editingId ? 'LƯU THAY ĐỔI' : 'XÁC NHẬN TẠO'} <ChevronRight size={14}/>
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;