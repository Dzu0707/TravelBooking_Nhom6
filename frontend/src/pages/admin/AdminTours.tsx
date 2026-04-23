import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTourStore } from '../../store/useTourStore';
import toast from 'react-hot-toast';
import axios from 'axios';
import { 
  Pencil, Trash2, Plus, Box, X, 
  ImageIcon, Calendar, Search, Images
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
  imageUrl: string; 
  departureLocation: string;
  categoryId: number;
  description?: string;
  tourImages?: { id: number; imageUrl: string }[];
}

const AdminTours = () => {
  const API_BASE = "http://localhost:5091";
  const { tours, fetchTours, deleteTour, categories, fetchCategories } = useTourStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'schedules'>('info');
  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [albumFiles, setAlbumFiles] = useState<File[]>([]);
  const [newAlbumPreviews, setNewAlbumPreviews] = useState<string[]>([]);
  const albumInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset } = useForm<Tour>();

  useEffect(() => { 
    fetchTours(); 
    if (fetchCategories) fetchCategories(); 
  }, [fetchTours, fetchCategories]);

  // Helper để lấy URL ảnh đầy đủ từ backend
  const getFullImageUrl = (path: string | undefined) => {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  useEffect(() => {
    if (editingTour) {
      reset(editingTour);
      setPreviewUrl(getFullImageUrl(editingTour.imageUrl));
      setAlbumFiles([]);
      setNewAlbumPreviews([]);
      setSelectedFile(null);
    } else {
      reset({ 
        name: '', code: '', departureLocation: '', 
        categoryId: categories?.[0]?.id || 0 
      });
      setPreviewUrl('');
      setAlbumFiles([]);
      setNewAlbumPreviews([]);
      setSelectedFile(null);
    }
  }, [editingTour, reset, categories]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAlbumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setAlbumFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setNewAlbumPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewAlbumPreviews(prev => prev.filter((_, i) => i !== index));
    setAlbumFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteOldImage = async (imageId: number) => {
    if (!window.confirm("Xóa ảnh này vĩnh viễn khỏi album?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/api/TourImages/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success("Đã xóa ảnh!");
      if (editingTour) {
        const updatedImages = editingTour.tourImages?.filter(img => img.id !== imageId);
        setEditingTour({ ...editingTour, tourImages: updatedImages });
      }
      fetchTours(); 
    } catch (error) {
      toast.error("Lỗi khi xóa ảnh!");
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
      
      if (!editingTour) {
        formData.append('MinPrice', '0'); 
      }

      if (selectedFile) formData.append('ImageFile', selectedFile);

      albumFiles.forEach((file) => {
        formData.append('AlbumFiles', file); 
      });

      const token = localStorage.getItem('token'); 
      const url = editingTour ? `${API_BASE}/api/tours/${editingTour.id}` : `${API_BASE}/api/tours`;

      const response = await fetch(url, {
        method: editingTour ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Không thể lưu dữ liệu!");

      const updatedData = await response.json();
      
      toast.success(editingTour ? "Cập nhật thành công!" : "Tạo tour thành công!", { id: loadId });
      
      await fetchTours(); 
      setEditingTour(updatedData);
      setAlbumFiles([]);
      setNewAlbumPreviews([]);
      setSelectedFile(null);

      if (!editingTour) setActiveTab('schedules');

    } catch (error: any) {
      toast.error(error.message || "Lỗi xử lý", { id: loadId });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Xóa tour này sẽ xóa toàn bộ dữ liệu liên quan?")) {
      try {
        await deleteTour(id);
        toast.success("Đã xóa tour!");
      } catch (error) {
        toast.error("Không thể xóa tour!");
      }
    }
  };

  const filteredTours = tours.filter((tour: Tour) => {
    const matchesSearch = tour.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tour.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || tour.categoryId === Number(filterCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 px-4">
      <Card className="bg-slate-900 border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <Title className="text-slate-100 font-bold uppercase tracking-tight flex items-center gap-2">
              Quản trị Tour <Box size={20} className="text-blue-500" />
            </Title>
            <Text className="text-[11px] text-slate-400 font-medium italic">Dữ liệu từ bảng Tours & Categories</Text>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-[11px] text-slate-200 outline-none"
            >
              <option value="all">Tất cả danh mục</option>
              {categories?.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text"
                placeholder="Tìm mã hoặc tên tour..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-xs text-slate-200 outline-none focus:border-blue-500/50"
              />
            </div>
            <button 
              onClick={() => { setEditingTour(null); setActiveTab('info'); setIsModalOpen(true); }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-bold text-[10px] uppercase transition-all shadow-md flex items-center gap-2"
            >
              <Plus size={16}/> Thêm Tour
            </button>
          </div>
        </div>
      </Card>

      <Card className="bg-slate-900 border-slate-800 rounded-xl p-0 overflow-hidden shadow-2xl">
        <Table>
          <TableHead className="bg-slate-950/60">
            <TableRow>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500 p-5">Thông tin Tour</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500 text-center">Mã nhận diện</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500 text-center">Hành động</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTours.map((tour: Tour) => (
              <TableRow key={tour.id} className="hover:bg-slate-800/40 border-b border-slate-800/50">
                <TableCell className="p-4">
                  <Flex justifyContent="start" className="gap-4">
                    <img 
                      src={getFullImageUrl(tour.imageUrl)} 
                      className="size-14 rounded-lg object-cover border border-slate-700" 
                      alt={tour.name} 
                    />
                    <div>
                      <Text className="font-bold text-slate-200 uppercase text-[11px] leading-tight mb-1">{tour.name}</Text>
                      <Badge size="xs" color="slate" className="text-[9px] opacity-70">
                        {categories?.find(c => c.id === tour.categoryId)?.name || 'Chưa phân loại'}
                      </Badge>
                    </div>
                  </Flex>
                </TableCell>
                <TableCell className="text-center">
                  <Badge color="blue" size="xs" className="text-[9px] font-bold tracking-widest">{tour.code}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Flex justifyContent="center" className="gap-1">
                    <button onClick={() => { setEditingTour(tour); setActiveTab('schedules'); setIsModalOpen(true); }} className="px-3 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-all flex items-center gap-2">
                      <Calendar size={14}/> <span className="text-[9px] font-bold uppercase">Lịch & Giá</span>
                    </button>
                    <button onClick={() => { setEditingTour(tour); setActiveTab('info'); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-amber-500 transition-colors"><Pencil size={18}/></button>
                    <button onClick={() => handleDelete(tour.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={18}/></button>
                  </Flex>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <Card className="bg-slate-900 border-slate-800 w-full max-w-5xl h-[90vh] p-0 flex flex-col rounded-2xl overflow-hidden shadow-2xl">
            <Flex className="bg-slate-950 px-4 border-b border-slate-800 shrink-0" justifyContent="start">
              <button onClick={() => setActiveTab('info')} className={`px-8 py-5 text-[11px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'info' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-600'}`}>1. Thông tin & Album</button>
              <button onClick={() => setActiveTab('schedules')} disabled={!editingTour} className={`px-8 py-5 text-[11px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'schedules' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-600 disabled:opacity-20'}`}>2. Lịch khởi hành</button>
              <button onClick={() => setIsModalOpen(false)} className="ml-auto p-3 text-slate-500 hover:text-rose-500 transition-colors"><X size={24}/></button>
            </Flex>

            <div className="flex-1 overflow-y-auto p-8 bg-slate-900/50">
              {activeTab === 'info' ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ảnh đại diện chính (ImageUrl)</label>
                        <div onClick={() => fileInputRef.current?.click()} className="aspect-video bg-slate-950 border-2 border-dashed border-slate-800 rounded-3xl flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-500/50 relative group transition-all">
                          {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" alt="preview" /> : <ImageIcon className="text-slate-800" size={40} />}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                              <Text className="text-white text-[10px] font-bold uppercase">Thay đổi ảnh chính</Text>
                          </div>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-2">
                          <Images size={14}/> Album ảnh phụ ({editingTour?.tourImages?.length || 0})
                        </label>
                        <div className="grid grid-cols-4 gap-3 bg-slate-950/50 p-4 rounded-3xl border border-slate-800">
                          <button type="button" onClick={() => albumInputRef.current?.click()} className="aspect-square bg-slate-900 border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-600 hover:text-blue-500 transition-colors">
                            <Plus size={20} />
                          </button>
                          
                          {editingTour?.tourImages?.map((img) => (
                            <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-700">
                              <img src={getFullImageUrl(img.imageUrl)} className="w-full h-full object-cover" alt="album-item" />
                              <button type="button" onClick={() => handleDeleteOldImage(img.id)} className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><X size={14} /></button>
                              <div className="absolute bottom-0 left-0 right-0 bg-slate-950/80 py-1 text-[8px] text-center text-slate-500 font-bold uppercase">Đã lưu</div>
                            </div>
                          ))}

                          {newAlbumPreviews.map((url, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-blue-500/50 shadow-lg">
                              <img src={url} className="w-full h-full object-cover opacity-60" alt="new-item" />
                              <button type="button" onClick={() => removeNewImage(idx)} className="absolute inset-0 bg-rose-500/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                              <div className="absolute bottom-0 left-0 right-0 bg-blue-600 py-1 text-[8px] text-center text-white font-bold uppercase">Mới</div>
                            </div>
                          ))}
                        </div>
                        <input type="file" multiple ref={albumInputRef} onChange={handleAlbumChange} className="hidden" accept="image/*" />
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase">Tên tour du lịch</label>
                        <input {...register('name', { required: true })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-bold text-slate-100 outline-none focus:border-blue-500/50" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-500 uppercase">Mã tour</label>
                          <input {...register('code', { required: true })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-blue-400 font-bold outline-none" placeholder="VD: SGN-HAN-01" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-500 uppercase">Nơi khởi hành</label>
                          <input {...register('departureLocation')} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-bold outline-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase">Danh mục tour</label>
                        <select {...register('categoryId')} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-bold text-slate-200 outline-none">
                          {categories?.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase">Mô tả tóm tắt</label>
                        <textarea {...register('description')} rows={4} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 outline-none resize-none focus:border-blue-500/50" />
                      </div>

                      <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all shadow-xl active:scale-95 shadow-blue-900/20">
                        {editingTour ? 'Lưu cập nhật' : 'Tạo Tour & Tiếp tục'}
                      </button>
                    </div>
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