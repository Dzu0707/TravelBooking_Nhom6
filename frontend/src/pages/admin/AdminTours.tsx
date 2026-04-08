import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTourStore } from '../../store/useTourStore';
import toast from 'react-hot-toast';
import { 
  Pencil, Trash2, Plus, Box, X, 
  ImageIcon, MapPin, 
  Calendar, ChevronRight, AlertCircle, Search, Filter,
  Coins
} from 'lucide-react';
import AdminSchedules from './AdminSchedules';

import { 
  Card, Table, TableHead, TableRow, TableHeaderCell, 
  TableBody, TableCell, Text, Title, Badge, Flex 
} from '@tremor/react';

interface Tour {
  id: number;
  name: string;
  code: string;
  thumbnail: string;
  departureLocation: string;
  categoryId: number;
  description?: string;
}

const AdminTours = () => {
  const { tours, fetchTours, deleteTour, categories, fetchCategories } = useTourStore();
  
  // State quản lý UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'schedules'>('info');
  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  // State Tìm kiếm & Lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // State File & Preview
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset } = useForm<Tour>();

  useEffect(() => { 
    fetchTours(); 
    if (fetchCategories) fetchCategories(); 
  }, [fetchTours, fetchCategories]);

  useEffect(() => {
    if (editingTour) {
      reset(editingTour);
      const thumbUrl = editingTour.thumbnail?.startsWith('http') 
        ? editingTour.thumbnail 
        : `http://localhost:5091${editingTour.thumbnail}`;
      setPreviewUrl(thumbUrl);
      setSelectedFile(null);
    } else {
      reset({ 
        name: '', code: '', departureLocation: '', 
        categoryId: categories?.[0]?.id || 0 
      });
      setPreviewUrl('');
      setSelectedFile(null);
    }
  }, [editingTour, reset, categories]);

  // LOGIC LỌC DỮ LIỆU
  const filteredTours = tours.filter((tour: Tour) => {
    const matchesSearch = tour.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tour.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || tour.categoryId === Number(filterCategory);
    return matchesSearch && matchesCategory;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: Tour) => {
    const loadId = toast.loading(editingTour ? "Đang cập nhật..." : "Đang tạo mới...");
    try {
      const formData = new FormData();
      formData.append('Name', data.name);
      formData.append('Code', data.code);
      formData.append('DepartureLocation', data.departureLocation);
      formData.append('CategoryId', data.categoryId.toString());
      formData.append('Description', data.description || '');
      
      // Không gửi AdultPrice/ChildPrice từ đây vì giá nằm ở bảng Schedules
      if (selectedFile) {
        formData.append('ImageFile', selectedFile);
      }

      const token = localStorage.getItem('token'); 
      const url = editingTour 
        ? `http://localhost:5091/api/tours/${editingTour.id}` 
        : `http://localhost:5091/api/tours`;

      const response = await fetch(url, {
        method: editingTour ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Lỗi khi lưu dữ liệu!");

      toast.success("Thành công! Hãy thiết lập giá ở tab Lịch trình.", { id: loadId });
      
      if (!editingTour) {
        // Nếu tạo mới, load lại danh sách để có ID tour mới cho phần Schedule
        await fetchTours();
        setIsModalOpen(false);
      } else {
        setIsModalOpen(false);
        fetchTours();
      }
    } catch (error: any) {
      toast.error(error.message || "Lỗi đồng bộ dữ liệu", { id: loadId });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tour này? Dữ liệu lịch trình liên quan cũng sẽ bị ảnh hưởng.")) {
      try {
        await deleteTour(id);
        toast.success("Đã xóa tour!");
      } catch (error) {
        toast.error("Không thể xóa tour này!");
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 px-4">
      
      {/* TOOLBAR */}
      <Card className="bg-slate-900 border-slate-800 rounded-xl p-6 shadow-lg shadow-black/20">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <Title className="text-slate-100 font-bold uppercase tracking-tight flex items-center gap-2 text-lg">
              Quản trị Tour <Box size={20} className="text-blue-500" />
            </Title>
            <Text className="text-[11px] text-slate-400 font-medium">
              Quản lý danh sách và giá tiền theo lịch trình
            </Text>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 md:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input 
                type="text"
                placeholder="Tìm tên hoặc mã tour..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-xs text-slate-200 outline-none focus:border-blue-500/50 transition-all shadow-inner"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-rose-500 transition-colors">
                  <X size={14} strokeWidth={3} />
                </button>
              )}
            </div>

            <div className="relative flex items-center">
              <Filter className="absolute left-3 text-slate-500" size={14} />
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-8 text-[11px] font-bold text-slate-300 focus:border-blue-500 outline-none appearance-none cursor-pointer"
              >
                <option value="all">Tất cả danh mục</option>
                {categories?.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => { setEditingTour(null); setActiveTab('info'); setIsModalOpen(true); }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-bold text-[10px] uppercase transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
            >
              <Plus size={16}/> Thêm Tour mới
            </button>
          </div>
        </div>
      </Card>

      {/* TABLE */}
      <Card className="bg-slate-900 border-slate-800 rounded-xl p-0 overflow-hidden ring-1 ring-white/5 shadow-2xl">
        <Table>
          <TableHead className="bg-slate-950/60">
            <TableRow>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500 p-5">Thông tin Tour</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500 text-center">Mã/Vị trí</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500 text-right">Trạng thái giá</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500 text-center">Hành động</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTours.length > 0 ? filteredTours.map((tour: Tour) => (
              <TableRow key={tour.id} className="hover:bg-slate-800/40 transition-colors border-b border-slate-800/50">
                <TableCell className="p-4">
                  <Flex justifyContent="start" className="gap-4">
                    <div className="relative size-14 rounded-lg overflow-hidden border border-slate-700 bg-slate-800 shrink-0 shadow-md">
                      {tour.thumbnail ? (
                        <img 
                          src={tour.thumbnail.startsWith('http') ? tour.thumbnail : `http://localhost:5091${tour.thumbnail}`} 
                          className="w-full h-full object-cover" 
                          alt="" 
                        />
                      ) : (
                        <ImageIcon className="absolute inset-0 m-auto text-slate-600" size={20} />
                      )}
                    </div>
                    <div>
                      <Text className="font-bold text-slate-200 uppercase text-[11px] leading-tight mb-1">{tour.name}</Text>
                      <Badge size="xs" color="slate" className="text-[9px] opacity-70">
                        {categories?.find(c => c.id === tour.categoryId)?.name || 'Chưa phân loại'}
                      </Badge>
                    </div>
                  </Flex>
                </TableCell>
                <TableCell className="text-center">
                   <div className="flex flex-col items-center gap-1">
                     <Badge color="blue" size="xs" className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider">{tour.code}</Badge>
                     <Text className="text-[10px] flex items-center gap-1 text-slate-400 font-medium"><MapPin size={10}/> {tour.departureLocation}</Text>
                   </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1.5 rounded-lg border border-emerald-500/20 text-[10px] font-bold uppercase tracking-tighter">
                      <Coins size={12}/> Giá theo lịch
                    </span>
                    <span className="text-[9px] text-slate-500 italic">Giá linh hoạt mỗi ngày</span>
                  </div>
                </TableCell>
                <TableCell className="text-center p-4">
                  <Flex justifyContent="center" className="gap-1">
                    <button 
                      onClick={() => { setEditingTour(tour); setActiveTab('schedules'); setIsModalOpen(true); }} 
                      className="group flex items-center gap-2 px-3 py-2 bg-blue-500/5 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg transition-all border border-blue-500/10"
                    >
                      <Calendar size={16}/>
                      <span className="text-[10px] font-bold uppercase">Lịch & Giá</span>
                    </button>
                    <button onClick={() => { setEditingTour(tour); setActiveTab('info'); setIsModalOpen(true); }} className="p-2.5 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all"><Pencil size={18}/></button>
                    <button onClick={() => handleDelete(tour.id)} className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"><Trash2 size={18}/></button>
                  </Flex>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="p-20 text-center">
                  <div className="flex flex-col items-center">
                    <AlertCircle size={40} className="mb-3 text-slate-700 opacity-20" />
                    <Text className="text-slate-500 font-bold uppercase text-[10px] tracking-widest italic">Không tìm thấy dữ liệu</Text>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* MODAL CẤU CỨU */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <Card className="bg-slate-900 border-slate-800 w-full max-w-4xl h-[90vh] p-0 flex flex-col rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            {/* TABS HEADER */}
            <Flex className="bg-slate-950 px-4 border-b border-slate-800 shrink-0" justifyContent="start">
              <button 
                onClick={() => setActiveTab('info')} 
                className={`px-8 py-5 text-[11px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'info' ? 'text-blue-500' : 'text-slate-600 hover:text-slate-400'}`}
              >
                1. Thông tin cơ bản
                {activeTab === 'info' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
              </button>
              <button 
                onClick={() => setActiveTab('schedules')} 
                disabled={!editingTour} 
                className={`px-8 py-5 text-[11px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'schedules' ? 'text-blue-500' : 'text-slate-600 disabled:opacity-20 hover:text-slate-400'}`}
              >
                2. Lịch khởi hành & Giá tiền
                {activeTab === 'schedules' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
              </button>
              <button onClick={() => setIsModalOpen(false)} className="ml-auto p-3 text-slate-500 hover:text-rose-500 transition-colors"><X size={24}/></button>
            </Flex>

            {/* CONTENT AREA */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-900/50">
              {activeTab === 'info' ? (
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Cột trái: Hình ảnh */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Ảnh đại diện Tour</label>
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-auto bg-slate-950 border-2 border-dashed border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 rounded-3xl flex flex-col items-center justify-center overflow-hidden relative group cursor-pointer transition-all shadow-2xl"
                        >
                        {previewUrl ? (
                          <img src={previewUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                        ) : (
                          <div className="text-center p-6">
                            <ImageIcon className="text-slate-800 mx-auto mb-4" size={48} />
                            <Text className="text-slate-600 font-bold text-[10px] uppercase">Click để tải ảnh lên</Text>
                          </div>
                        )}
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Phân loại danh mục</label>
                      <select {...register('categoryId')} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-bold text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20">
                        {categories?.map((cat: any) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Cột phải: Form */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Tên Tour hiển thị</label>
                      <input {...register('name')} placeholder="Ví dụ: Tour Du Lịch Phú Quốc 3 Ngày 2 Đêm..." className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-bold text-slate-100 outline-none focus:border-blue-500 transition-all shadow-inner" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Mã Tour (Code)</label>
                        <input {...register('code')} placeholder="PQ3D2N" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-blue-400 font-bold uppercase outline-none focus:border-blue-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Điểm khởi hành</label>
                        <input {...register('departureLocation')} placeholder="TP. Hồ Chí Minh" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-bold text-slate-100 outline-none focus:border-blue-500" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Mô tả hành trình ngắn</label>
                      <textarea {...register('description')} rows={5} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 outline-none focus:border-blue-500 resize-none leading-relaxed shadow-inner" placeholder="Tóm tắt điểm đến nổi bật..." />
                    </div>

                    {/* Hộp thông báo về cơ chế giá mới */}
                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-2xl flex gap-4 items-start shadow-inner">
                      <div className="bg-emerald-500/10 p-2 rounded-lg">
                        <Coins className="text-emerald-500" size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Cấu hình giá linh hoạt</p>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Hệ thống đã chuyển sang chế độ giá theo ngày. Bạn hãy lưu thông tin này trước, sau đó qua tab **"Lịch khởi hành"** để nhập giá riêng cho từng đợt tour.</p>
                      </div>
                    </div>

                    <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] transition-all mt-4 flex items-center justify-center gap-3 shadow-2xl shadow-blue-900/40 active:scale-95">
                      {editingTour ? 'Lưu cập nhật' : 'Hoàn tất bước 1'} <ChevronRight size={18}/>
                    </button>
                  </div>
                </form>
              ) : (
                editingTour && <AdminSchedules tourId={editingTour.id} />
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminTours;