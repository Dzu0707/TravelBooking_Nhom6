import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { 
  Newspaper, Plus, Pencil, Trash2, X, Search, ChevronRight, Image as ImageIcon, UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

import { 
  Card, Table, TableHead, TableRow, TableHeaderCell, 
  TableBody, TableCell, Text, Title, Badge, Flex 
} from '@tremor/react';

const AdminNews = () => {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Đã thêm trường expiryDate vào formData mặc định
  const defaultForm = { 
    title: '', category: 'Cẩm nang', summary: '', content: '', imageUrl: '', expiryDate: '' 
  };
  const [formData, setFormData] = useState(defaultForm);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5091/api/News');
      setNewsList(res.data);
    } catch (err) { 
      toast.error("Không thể tải danh sách tin tức");
    } finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  const handleApprove = async (id: number) => {
    try {
      await axios.patch(`http://localhost:5091/api/News/${id}/approve`, {}, { headers });
      fetchNews();
      toast.success("Bài viết đã được xuất bản!");
    } catch {
      toast.error("Lỗi khi duyệt bài");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadId = toast.loading("Đang xử lý...");
    
    // Xử lý payload: Nếu expiryDate rỗng thì gửi lên null để DB hiểu là vô thời hạn
    const payload = {
        ...formData,
        expiryDate: formData.expiryDate ? formData.expiryDate : null
    };

    try {
      if (editingId) {
        await axios.put(`http://localhost:5091/api/News/${editingId}`, { ...payload, id: editingId }, { headers });
      } else {
        await axios.post('http://localhost:5091/api/News', payload, { headers });
      }
      setIsModalOpen(false);
      fetchNews();
      toast.success(editingId ? "Cập nhật thành công" : "Đăng bài thành công", { id: loadId });
    } catch (err) { 
      toast.error("Lỗi khi lưu bài viết", { id: loadId }); 
    }
  };

  const confirmDelete = (id: number) => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <p className="text-[11px] font-bold uppercase tracking-tight text-slate-300">Xác nhận xóa bài viết này?</p>
        <div className="flex gap-2">
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.delete(`http://localhost:5091/api/News/${id}`, { headers });
                fetchNews();
                toast.success("Đã xóa bài viết");
              } catch { 
                toast.error("Lỗi: Không thể xóa"); 
              }
            }}
            className="bg-red-600 text-white px-4 py-1.5 rounded-md text-[10px] font-bold uppercase"
          >Xóa</button>
          <button onClick={() => toast.dismiss(t.id)} className="bg-slate-800 text-slate-400 px-4 py-1.5 rounded-md text-[10px] font-bold uppercase">Hủy</button>
        </div>
      </div>
    ), { style: { background: '#0f172a', border: '1px solid #1e293b' } });
  };

  const filtered = newsList.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 px-4">
      <Card className="bg-slate-900 border-slate-800 rounded-xl p-6">
        <Flex justifyContent="between" alignItems="center">
          <div>
            <Title className="text-slate-100 font-bold uppercase tracking-tight flex items-center gap-2 text-base">
              Quản lý Tin Tức <Newspaper size={18} className="text-blue-500" />
            </Title>
            <Text className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1 flex items-center gap-2">
              <span className="size-1.5 inline-block bg-emerald-500 rounded-full animate-pulse" />
              Cập nhật: {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: vi })}
            </Text>
          </div>
          <button 
            onClick={() => { setIsModalOpen(true); setEditingId(null); setFormData(defaultForm); }}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-bold text-[11px] uppercase transition-all flex items-center gap-2"
          >
            <Plus size={16}/> VIẾT BÀI MỚI
          </button>
        </Flex>
      </Card>

      <div className="relative group w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input 
            type="text"
            placeholder="Tìm kiếm bài báo..."
            className="w-full pl-11 pr-10 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-bold outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
      </div>

      <Card className="bg-slate-900 border-slate-800 rounded-xl p-0 overflow-hidden">
        <Table>
          <TableHead className="bg-slate-950/60">
            <TableRow>
              <TableHeaderCell className="p-5 text-center">ID</TableHeaderCell>
              <TableHeaderCell>Tiêu đề</TableHeaderCell>
              <TableHeaderCell>Trạng thái</TableHeaderCell>
              <TableHeaderCell>Hết hạn</TableHeaderCell>
              <TableHeaderCell className="text-right">Thao tác</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={5} className="text-center p-10">Đang tải...</TableCell></TableRow> : 
             filtered.length > 0 ? filtered.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-800/40">
                  <TableCell className="text-center"><Badge size="xs" className="bg-slate-800 text-slate-400">#{item.id}</Badge></TableCell>
                  <TableCell className="font-bold text-xs text-white">
                      <div className="flex items-center gap-3">
                          {item.imageUrl ? <img src={item.imageUrl} className="w-10 h-10 object-cover rounded" alt="news" /> : <ImageIcon size={20} className="text-slate-600"/>}
                          <div className="flex flex-col">
                            <span>{item.title}</span>
                            <span className="text-[10px] text-slate-500 font-normal">{item.category}</span>
                          </div>
                      </div>
                  </TableCell>
                  <TableCell>
                      {item.isPublished ? <Badge color="emerald">Đã duyệt</Badge> : <Badge color="amber">Chờ duyệt</Badge>}
                  </TableCell>
                  <TableCell>
                      {/* Hiển thị ngày hết hạn nếu có, nếu không thì báo Vô thời hạn */}
                      {item.expiryDate ? (
                        <span className="text-xs text-rose-400">{format(new Date(item.expiryDate), 'dd/MM/yyyy HH:mm')}</span>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Vô thời hạn</span>
                      )}
                  </TableCell>
                  <TableCell className="text-right">
                      <Flex justifyContent="end" className="gap-2">
                          {!item.isPublished && <button onClick={() => handleApprove(item.id)} className="px-3 py-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 rounded"><UserCheck size={12}/> Duyệt</button>}
                          <button 
                            onClick={() => { 
                                setEditingId(item.id); 
                                // Format lại ExpiryDate để đưa vào ô input type="datetime-local" (cắt bỏ phần giây)
                                setFormData({
                                    ...item,
                                    expiryDate: item.expiryDate ? item.expiryDate.substring(0, 16) : ''
                                }); 
                                setIsModalOpen(true); 
                            }} 
                            className="px-3 py-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 rounded"
                          ><Pencil size={12}/> Sửa</button>
                          <button onClick={() => confirmDelete(item.id)} className="px-3 py-1 text-[10px] font-bold text-rose-500 bg-rose-500/10 rounded"><Trash2 size={12}/> Xóa</button>
                      </Flex>
                  </TableCell>
                </TableRow>
              )) : <TableRow><TableCell colSpan={5} className="text-center p-10 italic">Chưa có bài viết</TableCell></TableRow>
            }
          </TableBody>
        </Table>
      </Card>

      {/* MODAL THÊM / SỬA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto">
            <Card className="bg-slate-900 border-slate-800 w-full max-w-2xl p-6 my-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Title className="text-white flex justify-between items-center mb-6">
                        {editingId ? 'Sửa Bài Viết' : 'Thêm Bài Viết Mới'}
                        <button type="button" onClick={() => setIsModalOpen(false)} className="hover:bg-slate-800 p-1 rounded transition"><X size={20} className="text-slate-500 hover:text-white"/></button>
                    </Title>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <input className="col-span-2 w-full bg-slate-950 p-3 rounded text-white text-xs border border-slate-800 focus:border-blue-500 outline-none" placeholder="Tiêu đề bài viết (*)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                        
                        <input className="w-full bg-slate-950 p-3 rounded text-white text-xs border border-slate-800 focus:border-blue-500 outline-none" placeholder="Link ảnh (URL)" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                        
                        <input className="w-full bg-slate-950 p-3 rounded text-white text-xs border border-slate-800 focus:border-blue-500 outline-none" placeholder="Thể loại (VD: Tin tức, Cẩm nang)" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                    </div>

                    <textarea className="w-full bg-slate-950 p-3 rounded text-white text-xs border border-slate-800 focus:border-blue-500 outline-none" placeholder="Tóm tắt ngắn gọn" rows={2} value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} />
                    
                    <textarea className="w-full bg-slate-950 p-3 rounded text-white text-xs border border-slate-800 focus:border-blue-500 outline-none" placeholder="Nội dung chi tiết" rows={5} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
                    
                    <div className="flex flex-col gap-1.5 p-3 border border-slate-800 rounded bg-slate-900/50">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Thời gian hết hạn (Bài viết tự động ẩn)</label>
                        <input 
                            type="datetime-local" 
                            className="w-full bg-slate-950 p-2.5 rounded text-white text-xs border border-slate-800 focus:border-blue-500 outline-none" 
                            value={formData.expiryDate} 
                            onChange={e => setFormData({...formData, expiryDate: e.target.value})} 
                        />
                        <span className="text-[10px] text-slate-500 italic">* Để trống nếu muốn bài viết hiển thị vĩnh viễn</span>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white px-4 py-2 text-xs font-bold uppercase transition">Hủy</button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-xs font-bold uppercase flex items-center gap-2 transition shadow-lg shadow-blue-500/20">Lưu lại <ChevronRight size={14}/></button>
                    </div>
                </form>
            </Card>
        </div>
      )}
    </div>
  );
};

export default AdminNews;