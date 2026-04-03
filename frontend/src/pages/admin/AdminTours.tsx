import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { 
  Plus, Pencil, Trash2, Search, 
  MapPin, Box, X, Check, Upload, ImageIcon 
} from 'lucide-react';
import Swal from 'sweetalert2';

const AdminTours = () => {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '', code: '', departureLocation: '', 
    minPrice: 0, categoryId: 1
  });

  const fetchTours = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5091/api/Tours');
      setTours(res.data);
    } catch (err) {
      console.error("Lỗi fetch:", err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTours(); }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa ngay',
      background: '#0f172a', color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5091/api/Tours/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTours(tours.filter(t => t.id !== id));
        Swal.fire('Thành công', 'Đã xóa tour', 'success');
      } catch (err) { Swal.fire('Lỗi', 'Không thể xóa', 'error'); }
    }
  };

  // --- HÀM SUBMIT ĐÃ ĐƯỢC FIX LỖI TOSTRING() ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    
    // Append thủ công để đảm bảo an toàn, không dùng vòng lặp dễ gây lỗi undefined
    data.append('name', formData.name || "");
    data.append('code', formData.code || "");
    data.append('departureLocation', formData.departureLocation || "");
    data.append('minPrice', (formData.minPrice ?? 0).toString());
    data.append('categoryId', (formData.categoryId ?? 1).toString());

    if (selectedFile) {
      data.append('imageFile', selectedFile);
    }

    try {
      const url = editingTour 
        ? `http://localhost:5091/api/Tours/${editingTour.id}` 
        : 'http://localhost:5091/api/Tours';
      
      const method = editingTour ? 'put' : 'post';

      await axios({
        method: method,
        url: url,
        data: data,
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data' 
        }
      });

      setIsModalOpen(false);
      fetchTours();
      resetForm();
      Swal.fire({ 
        title: 'Thành công!', 
        text: editingTour ? 'Đã cập nhật tour' : 'Đã thêm tour mới',
        icon: 'success', 
        timer: 1500, 
        showConfirmButton: false 
      });
    } catch (err: any) {
      console.error("Lỗi API:", err.response?.data);
      Swal.fire('Lỗi', 'Kiểm tra dữ liệu hoặc Token hệ thống', 'error');
    }
  };

  const openEditModal = (tour: any) => {
    setEditingTour(tour);
    setFormData({
      name: tour.name || '', 
      code: tour.code || '', 
      departureLocation: tour.departureLocation || '',
      minPrice: tour.minPrice || 0, 
      categoryId: tour.categoryId || 1
    });
    setImagePreview(tour.thumbnail);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingTour(null);
    setFormData({ name: '', code: '', departureLocation: '', minPrice: 0, categoryId: 1 });
    setImagePreview(null);
    setSelectedFile(null);
  };

  const filteredTours = tours.filter((tour: any) =>
    tour.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-2">
            Quản trị Tours <Box size={18} className="text-blue-500"/>
          </h1>
        </div>
        <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[12px] font-black transition-all shadow-lg active:scale-95">
          <Plus size={16} /> THÊM MỚI
        </button>
      </div>

      <div className="bg-slate-900/40 p-3 rounded-2xl border border-slate-800/50 flex gap-3 backdrop-blur-sm">
        <div className="relative flex-1 text-slate-400">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={14} />
          <input 
            type="text"
            placeholder="Tìm mã tour hoặc tên địa danh..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-700/50 rounded-xl text-[12px] text-slate-200 focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder:text-slate-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-slate-900/20 rounded-2xl border border-slate-800/50 overflow-hidden shadow-2xl backdrop-blur-md">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-800/40 border-b border-slate-800 text-[10px] text-slate-500 uppercase font-black">
              <th className="p-4">Thông tin</th>
              <th className="p-4">Giá</th>
              <th className="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-[12px]">
            {loading ? (
              <tr><td colSpan={3} className="p-20 text-center animate-pulse text-slate-500 font-bold uppercase tracking-widest">Đang đồng bộ hệ thống...</td></tr>
            ) : filteredTours.map((tour) => (
              <tr key={tour.id} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors group">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                    <img src={tour.thumbnail || '/placeholder.png'} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-200">{tour.name}</p>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                      <MapPin size={10} className="text-blue-500"/> {tour.departureLocation}
                    </p>
                  </div>
                </td>
                <td className="p-4 font-black text-orange-500">{tour.minPrice?.toLocaleString()}đ</td>
                <td className="p-4 text-right">
                   <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(tour)} className="text-amber-400 p-2 hover:bg-amber-400/10 rounded-lg"><Pencil size={14}/></button>
                      <button onClick={() => handleDelete(tour.id)} className="text-rose-400 p-2 hover:bg-rose-400/10 rounded-lg"><Trash2 size={14}/></button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
            <form onSubmit={handleSubmit}>
              <div className="p-6 border-b border-slate-800 flex justify-between bg-slate-800/20">
                <h2 className="text-white font-black uppercase text-sm tracking-widest italic flex items-center gap-2">
                  {editingTour ? <Pencil size={16} className="text-amber-400"/> : <Plus size={16} className="text-blue-400"/>}
                  {editingTour ? 'Cập nhật hành trình' : 'Khởi tạo Tour mới'}
                </h2>
                <button type="button" onClick={() => setIsModalOpen(false)}><X size={20} className="text-slate-500 hover:text-white"/></button>
              </div>

              <div className="p-6 grid grid-cols-2 gap-6 text-white">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Ảnh đại diện</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-slate-800 transition-all overflow-hidden relative group"
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Upload size={24}/>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon size={32} className="mx-auto mb-2 text-slate-700"/>
                        <p className="text-[10px] text-slate-600 font-black">CHƯA CÓ ẢNH</p>
                      </div>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Tên chuyến đi</label>
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-[12px] focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Mã định danh</label>
                      <input required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-[12px] outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Giá sàn</label>
                      <input type="number" required value={formData.minPrice} onChange={e => setFormData({...formData, minPrice: Number(e.target.value)})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-[12px] outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Điểm khởi hành</label>
                    <input required value={formData.departureLocation} onChange={e => setFormData({...formData, departureLocation: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-[12px] outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-800/20 flex gap-3 border-t border-slate-800/50">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-[11px] font-black text-slate-500 uppercase hover:bg-slate-800 rounded-xl transition-all">Đóng cửa sổ</button>
                <button type="submit" className="flex-1 py-3 text-[11px] font-black text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                  <Check size={16}/> {editingTour ? 'LƯU THAY ĐỔI' : 'XÁC NHẬN TẠO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTours;