import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTourStore } from '../../store/useTourStore';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { 
  Pencil, Trash2, Plus, Box, X, 
  ImageIcon, MapPin, CircleDollarSign,
  Calendar, ChevronRight 
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
  adultPrice: number;
  childPrice: number;
  categoryId: number;
}

const AdminTours = () => {
  // Lấy thêm categories và fetchCategories từ Store của bạn
  const { tours, fetchTours, deleteTour, categories, fetchCategories } = useTourStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'schedules'>('info');
  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  const { register, handleSubmit, reset } = useForm<Tour>();

  // Fetch cả tour và danh mục khi load trang
  useEffect(() => { 
    fetchTours(); 
    if (fetchCategories) fetchCategories(); 
  }, [fetchTours, fetchCategories]);

  useEffect(() => {
    if (editingTour) {
      reset(editingTour);
    } else {
      reset({ 
        name: '', code: '', departureLocation: '', 
        adultPrice: 0, childPrice: 0, categoryId: categories?.[0]?.id || 0, thumbnail: '' 
      });
    }
  }, [editingTour, reset, categories]);

  const onSubmit = async (data: Tour) => {
    const loadId = toast.loading(editingTour ? "Đang cập nhật..." : "Đang tạo mới...");
    try {
      // Logic gọi API của bạn ở đây
      console.log("Dữ liệu gửi đi:", data); 
      toast.success("Thao tác thành công!", { id: loadId });
      setIsModalOpen(false);
      fetchTours();
    } catch (error) {
      toast.error("Lỗi đồng bộ", { id: loadId });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* HEADER SECTION */}
      <Card className="bg-slate-900 border-slate-800 rounded-xl p-6">
        <Flex justifyContent="between" alignItems="center">
          <div>
            <Title className="text-slate-100 font-bold uppercase tracking-tight flex items-center gap-2 text-base">
              Quản lý Tour <Box size={18} className="text-blue-500" />
            </Title>
            <Text className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
              Cập nhật: {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: vi })}
            </Text>
          </div>
          <button 
            onClick={() => { setEditingTour(null); setActiveTab('info'); setIsModalOpen(true); }}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-bold text-[11px] uppercase transition-colors flex items-center gap-2"
          >
            <Plus size={16}/> THÊM TOUR MỚI
          </button>
        </Flex>
      </Card>

      {/* TABLE SECTION */}
      <Card className="bg-slate-900 border-slate-800 rounded-xl p-0 overflow-hidden ring-1 ring-white/5">
        <Table>
          <TableHead className="bg-slate-950/40">
            <TableRow className="border-b border-slate-800">
              <TableHeaderCell className="text-[10px] font-bold uppercase tracking-wider text-slate-500 p-5">Thông tin Tour</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Giá Người Lớn</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Giá Trẻ Em</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">Thao tác</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tours.map((tour: Tour) => (
              <TableRow key={tour.id} className="hover:bg-slate-800/30 transition-colors border-b border-slate-800/50">
                <TableCell className="p-5">
                  <Flex justifyContent="start" className="gap-4">
                    <img src={tour.thumbnail} className="size-12 rounded-lg object-cover border border-slate-800" alt="" />
                    <div>
                      <Text className="font-bold text-slate-200 uppercase text-xs">{tour.name}</Text>
                      <Flex justifyContent="start" className="gap-2 mt-1.5">
                        <Badge color="blue" size="xs" className="px-1.5 py-0 rounded text-[9px] font-bold">{tour.code}</Badge>
                        <Text className="text-[10px] flex items-center gap-1 text-slate-500 font-medium"><MapPin size={10}/> {tour.departureLocation}</Text>
                      </Flex>
                    </div>
                  </Flex>
                </TableCell>
                <TableCell className="text-right p-5">
                  <Text className="font-bold text-orange-500 text-xs">{tour.adultPrice?.toLocaleString()}₫</Text>
                </TableCell>
                <TableCell className="text-right p-5">
                  <Text className="font-bold text-emerald-500 text-xs">{tour.childPrice?.toLocaleString()}₫</Text>
                </TableCell>
                <TableCell className="p-5 text-center">
                  <Flex justifyContent="center" className="gap-2">
                    <button onClick={() => { setEditingTour(tour); setActiveTab('schedules'); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-500"><Calendar size={16}/></button>
                    <button onClick={() => { setEditingTour(tour); setActiveTab('info'); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-amber-500"><Pencil size={16}/></button>
                    <button onClick={() => deleteTour(tour.id)} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 size={16}/></button>
                  </Flex>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* MODAL SECTION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <Card className="bg-slate-900 border-slate-800 w-full max-w-4xl h-[80vh] p-0 flex flex-col rounded-xl overflow-hidden shadow-2xl">
            <Flex className="bg-slate-950 px-4 border-b border-slate-800" justifyContent="start">
              <button onClick={() => setActiveTab('info')} className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest ${activeTab === 'info' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-600'}`}>1. Thông tin chi tiết</button>
              <button onClick={() => setActiveTab('schedules')} disabled={!editingTour} className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest ${activeTab === 'schedules' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-600 disabled:opacity-30'}`}>2. Lịch khởi hành</button>
              <button onClick={() => setIsModalOpen(false)} className="ml-auto p-3 text-slate-500 hover:text-rose-500 transition-colors"><X size={20}/></button>
            </Flex>

            <div className="flex-1 overflow-y-auto p-8 bg-slate-900/50">
              {activeTab === 'info' ? (
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="aspect-video bg-slate-950 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center overflow-hidden relative group">
                       {editingTour?.thumbnail ? <img src={editingTour.thumbnail} className="w-full h-full object-cover" alt="" /> : <ImageIcon className="text-slate-800" size={32} />}
                    </div>
                    
                    {/* DANH MỤC ĐÃ ĐƯỢC FIX */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Danh mục</label>
                      <div className="relative">
                        <select 
                          {...register('categoryId')} 
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-bold text-slate-200 outline-none appearance-none focus:border-blue-500 transition-colors"
                        >
                          <option value="">-- Chọn danh mục --</option>
                          {categories?.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                           <ChevronRight size={14} className="rotate-90 text-slate-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Tên Tour</label>
                      <input {...register('name')} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-bold text-slate-100 outline-none focus:border-blue-500" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Mã Tour</label>
                        <input {...register('code')} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-blue-500 font-bold uppercase" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Điểm đi</label>
                        <input {...register('departureLocation')} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-bold text-slate-100" />
                      </div>
                    </div>
                    
                    <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 mt-4">
                      <h4 className="text-[10px] font-bold text-blue-500 uppercase flex items-center gap-2"><CircleDollarSign size={14}/> Giá gốc (VNĐ)</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Text className="text-[9px] font-bold uppercase text-slate-600">Người lớn</Text>
                          <input {...register('adultPrice')} type="number" className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs font-bold text-orange-500 w-full outline-none" />
                        </div>
                        <div className="space-y-1">
                          <Text className="text-[9px] font-bold uppercase text-slate-600">Trẻ em</Text>
                          <input {...register('childPrice')} type="number" className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs font-bold text-emerald-500 w-full outline-none" />
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all mt-6 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                      {editingTour ? 'LƯU THAY ĐỔI' : 'TẠO TOUR MỚI'} <ChevronRight size={14}/>
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