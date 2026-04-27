import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTourStore } from '../../store/useTourStore';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  Pencil,
  Trash2,
  Plus,
  Box,
  X,
  ImageIcon,
  Calendar,
  Search,
  Images,
} from 'lucide-react';
import AdminSchedules from './AdminSchedules';
import MediaPicker from './components/MediaPicker';

import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
  Title,
  Badge,
  Flex,
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
  const API_BASE = 'http://localhost:5091';
  const { tours, fetchTours, deleteTour, categories, fetchCategories } = useTourStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'schedules'>('info');
  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [selectedMediaUrl, setSelectedMediaUrl] = useState('');
  const [selectedAlbumUrls, setSelectedAlbumUrls] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState('');

  const [isMainMediaPickerOpen, setIsMainMediaPickerOpen] = useState(false);
  const [isAlbumMediaPickerOpen, setIsAlbumMediaPickerOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm<Tour>();

  useEffect(() => {
    fetchTours();
    if (fetchCategories) fetchCategories();
  }, [fetchTours, fetchCategories]);

  const getFullImageUrl = (path: string | undefined) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  useEffect(() => {
    if (editingTour) {
      reset(editingTour);
      const currentImage = getFullImageUrl(editingTour.imageUrl);
      setPreviewUrl(currentImage);
      setSelectedMediaUrl(currentImage);
      setSelectedAlbumUrls(editingTour.tourImages?.map((img) => getFullImageUrl(img.imageUrl)) || []);
    } else {
      reset({
        name: '',
        code: '',
        departureLocation: '',
        categoryId: categories?.[0]?.id || 0,
      });
      setPreviewUrl('');
      setSelectedMediaUrl('');
      setSelectedAlbumUrls([]);
    }
  }, [editingTour, reset, categories]);

  const handleDeleteOldImage = async (imageId: number) => {
    if (!window.confirm('Xóa ảnh này vĩnh viễn khỏi album?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/api/TourImages/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Đã xóa ảnh!');
      if (editingTour) {
        const updatedImages = editingTour.tourImages?.filter((img) => img.id !== imageId) || [];
        setEditingTour({ ...editingTour, tourImages: updatedImages });
        setSelectedAlbumUrls(updatedImages.map((img) => getFullImageUrl(img.imageUrl)));
      }
      fetchTours();
    } catch {
      toast.error('Lỗi khi xóa ảnh!');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsMainMediaPickerOpen(false);
    setIsAlbumMediaPickerOpen(false);
    setEditingTour(null);
    setActiveTab('info');
    setSelectedMediaUrl('');
    setPreviewUrl('');
    setSelectedAlbumUrls([]);
  };

  const onSubmit = async (data: Tour) => {
    const loadId = toast.loading(editingTour ? 'Đang cập nhật...' : 'Đang tạo mới...');
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

      if (selectedMediaUrl) {
        formData.append('ImageUrl', selectedMediaUrl);
      }

      selectedAlbumUrls.forEach((url, index) => {
        formData.append(`AlbumImageUrls[${index}]`, url);
      });

      const token = localStorage.getItem('token');
      const url = editingTour ? `${API_BASE}/api/tours/${editingTour.id}` : `${API_BASE}/api/tours`;

      const response = await fetch(url, {
        method: editingTour ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error('Không thể lưu dữ liệu!');

      const updatedData = await response.json();

      toast.success(editingTour ? 'Cập nhật thành công!' : 'Tạo tour thành công!', { id: loadId });

      await fetchTours();
      setEditingTour(updatedData);
      setSelectedAlbumUrls(updatedData?.tourImages?.map((img: any) => getFullImageUrl(img.imageUrl)) || []);

      if (!editingTour) {
        setActiveTab('schedules');
      }
    } catch (error: any) {
      toast.error(error.message || 'Lỗi xử lý', { id: loadId });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Xóa tour này sẽ xóa toàn bộ dữ liệu liên quan?')) {
      try {
        await deleteTour(id);
        toast.success('Đã xóa tour!');
      } catch {
        toast.error('Không thể xóa tour!');
      }
    }
  };

  const filteredTours = tours.filter((tour: Tour) => {
    const matchesSearch =
      tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || tour.categoryId === Number(filterCategory);
    return matchesSearch && matchesCategory;
  });

  const removeAlbumPreview = (url: string) => {
    setSelectedAlbumUrls((prev) => prev.filter((item) => item !== url));
  };

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-6 px-4 pb-10">
        <Card className="rounded-xl border-slate-800 bg-slate-900 p-6 shadow-lg">
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <Title className="flex items-center gap-2 font-bold uppercase tracking-tight text-slate-100">
                Quản trị Tour <Box size={20} className="text-blue-500" />
              </Title>
              <Text className="text-[11px] font-medium italic text-slate-400">
                Dữ liệu từ bảng Tours & Categories
              </Text>
            </div>

            <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-[11px] text-slate-200 outline-none"
              >
                <option value="all">Tất cả danh mục</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  placeholder="Tìm mã hoặc tên tour..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 py-2 pl-10 pr-4 text-xs text-slate-200 outline-none focus:border-blue-500/50"
                />
              </div>

              <button
                onClick={() => {
                  setEditingTour(null);
                  setActiveTab('info');
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-[10px] font-bold uppercase text-white shadow-md transition-all hover:bg-blue-500"
              >
                <Plus size={16} />
                Thêm Tour
              </button>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden rounded-xl border-slate-800 bg-slate-900 p-0 shadow-2xl">
          <Table>
            <TableHead className="bg-slate-950/60">
              <TableRow>
                <TableHeaderCell className="p-5 text-[10px] font-bold uppercase text-slate-500">
                  Thông tin Tour
                </TableHeaderCell>
                <TableHeaderCell className="text-center text-[10px] font-bold uppercase text-slate-500">
                  Mã nhận diện
                </TableHeaderCell>
                <TableHeaderCell className="text-center text-[10px] font-bold uppercase text-slate-500">
                  Hành động
                </TableHeaderCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredTours.map((tour: Tour) => (
                <TableRow key={tour.id} className="border-b border-slate-800/50 hover:bg-slate-800/40">
                  <TableCell className="p-4">
                    <Flex justifyContent="start" className="gap-4">
                      <img
                        src={getFullImageUrl(tour.imageUrl)}
                        className="size-14 rounded-lg border border-slate-700 object-cover"
                        alt={tour.name}
                      />
                      <div>
                        <Text className="mb-1 text-[11px] font-bold uppercase leading-tight text-slate-200">
                          {tour.name}
                        </Text>
                        <Badge size="xs" color="slate" className="text-[9px] opacity-70">
                          {categories?.find((c) => c.id === tour.categoryId)?.name || 'Chưa phân loại'}
                        </Badge>
                      </div>
                    </Flex>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge color="blue" size="xs" className="text-[9px] font-bold tracking-widest">
                      {tour.code}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <Flex justifyContent="center" className="gap-1">
                      <button
                        onClick={() => {
                          setEditingTour(tour);
                          setActiveTab('schedules');
                          setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-2 text-blue-400 transition-all hover:bg-blue-500 hover:text-white"
                      >
                        <Calendar size={14} />
                        <span className="text-[9px] font-bold uppercase">Lịch & Giá</span>
                      </button>

                      <button
                        onClick={() => {
                          setEditingTour(tour);
                          setActiveTab('info');
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-slate-400 transition-colors hover:text-amber-500"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(tour.id)}
                        className="p-2 text-slate-400 transition-colors hover:text-rose-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </Flex>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md">
            <Card className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border-slate-800 bg-slate-900 p-0 shadow-2xl">
              <Flex className="shrink-0 border-b border-slate-800 bg-slate-950 px-4" justifyContent="start">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`relative px-8 py-5 text-[11px] font-bold uppercase tracking-widest transition-all ${
                    activeTab === 'info' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-slate-600'
                  }`}
                >
                  1. Thông tin & Album
                </button>

                <button
                  onClick={() => setActiveTab('schedules')}
                  disabled={!editingTour}
                  className={`relative px-8 py-5 text-[11px] font-bold uppercase tracking-widest transition-all ${
                    activeTab === 'schedules'
                      ? 'border-b-2 border-blue-500 text-blue-500'
                      : 'text-slate-600 disabled:opacity-20'
                  }`}
                >
                  2. Lịch khởi hành
                </button>

                <button onClick={closeModal} className="ml-auto p-3 text-slate-500 transition-colors hover:text-rose-500">
                  <X size={24} />
                </button>
              </Flex>

              <div className="flex-1 overflow-y-auto bg-slate-900/50 p-8">
                {activeTab === 'info' ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                      <div className="space-y-8">
                        <div className="space-y-3">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Ảnh đại diện chính
                          </label>

                          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                            <div className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-slate-800 bg-slate-950">
                              {previewUrl ? (
                                <img src={previewUrl} className="h-full w-full object-cover" alt="preview" />
                              ) : (
                                <ImageIcon className="text-slate-800" size={40} />
                              )}

                              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-all group-hover:opacity-100">
                                <Text className="text-[10px] font-bold uppercase text-white">Preview ảnh đại diện</Text>
                              </div>
                            </div>

                            <div className="flex flex-col gap-3">
                              <button
                                type="button"
                                onClick={() => setIsMainMediaPickerOpen(true)}
                                className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300"
                              >
                                Chọn từ kho ảnh
                              </button>

                              {(previewUrl || selectedMediaUrl) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedMediaUrl('');
                                    setPreviewUrl('');
                                  }}
                                  className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400"
                                >
                                  Xóa ảnh
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="flex items-center gap-2 text-[11px] font-bold uppercase text-slate-500">
                            <Images size={14} />
                            Album ảnh phụ ({selectedAlbumUrls.length})
                          </label>

                          <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/50 p-4">
                            <button
                              type="button"
                              onClick={() => setIsAlbumMediaPickerOpen(true)}
                              className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300"
                            >
                              <Plus size={16} />
                              Chọn ảnh phụ từ kho
                            </button>

                            <div className="grid grid-cols-4 gap-3">
                              {editingTour?.tourImages?.map((img) => (
                                <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-700">
                                  <img src={getFullImageUrl(img.imageUrl)} className="h-full w-full object-cover" alt="album-item" />
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteOldImage(img.id)}
                                    className="absolute right-1 top-1 rounded-lg bg-rose-600 p-1 text-white opacity-0 transition-all group-hover:opacity-100"
                                  >
                                    <X size={14} />
                                  </button>
                                  <div className="absolute bottom-0 left-0 right-0 bg-slate-950/80 py-1 text-center text-[8px] font-bold uppercase text-slate-500">
                                    Đã lưu
                                  </div>
                                </div>
                              ))}

                              {selectedAlbumUrls
                                .filter(
                                  (url) =>
                                    !editingTour?.tourImages?.some(
                                      (img) => getFullImageUrl(img.imageUrl) === url
                                    )
                                )
                                .map((url) => (
                                  <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-cyan-500/40 shadow-lg">
                                    <img src={url} className="h-full w-full object-cover" alt="album-preview" />
                                    <button
                                      type="button"
                                      onClick={() => removeAlbumPreview(url)}
                                      className="absolute inset-0 flex items-center justify-center bg-rose-500/40 text-white opacity-0 transition-all group-hover:opacity-100"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-cyan-600 py-1 text-center text-[8px] font-bold uppercase text-white">
                                      Đã chọn
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold uppercase text-slate-500">Tên tour du lịch</label>
                          <input
                            {...register('name', { required: true })}
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs font-bold text-slate-100 outline-none focus:border-blue-500/50"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase text-slate-500">Mã tour</label>
                            <input
                              {...register('code', { required: true })}
                              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs font-bold text-blue-400 outline-none"
                              placeholder="VD: SGN-HAN-01"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase text-slate-500">Nơi khởi hành</label>
                            <input
                              {...register('departureLocation')}
                              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs font-bold outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-bold uppercase text-slate-500">Danh mục tour</label>
                          <select
                            {...register('categoryId')}
                            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs font-bold text-slate-200 outline-none"
                          >
                            {categories?.map((cat: any) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-bold uppercase text-slate-500">Mô tả tóm tắt</label>
                          <textarea
                            {...register('description')}
                            rows={4}
                            className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-300 outline-none focus:border-blue-500/50"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full rounded-xl bg-blue-600 py-4 text-[11px] font-bold uppercase tracking-widest text-white shadow-xl shadow-blue-900/20 transition-all active:scale-95 hover:bg-blue-500"
                        >
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

      {isMainMediaPickerOpen && (
        <MediaPicker
          value={selectedMediaUrl || previewUrl}
          onSelect={(url) => {
            setSelectedMediaUrl(url);
            setPreviewUrl(url);
          }}
          onClose={() => setIsMainMediaPickerOpen(false)}
        />
      )}

      {isAlbumMediaPickerOpen && (
        <MediaPicker
          multiple
          values={selectedAlbumUrls}
          onSelect={() => {}}
          onSelectMany={(urls) => setSelectedAlbumUrls(urls)}
          onClose={() => setIsAlbumMediaPickerOpen(false)}
        />
      )}
    </>
  );
};

export default AdminTours;
