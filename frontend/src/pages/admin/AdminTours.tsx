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
  tourImages?: { id: number; imageUrl: string; isPrimary: boolean }[];
}

const AdminTours = () => {
  const API_BASE = 'http://localhost:5091';
  const normalize = (url?: string) => {
    if (!url) return '';
    return url
    .replace(API_BASE, '')
    .replace(/^\/+/, '');
  };
  const getFullImageUrl = (path: string | undefined) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  };
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
      formData.append('DepartureLocation', data.departureLocation || '');
      formData.append('CategoryId', data.categoryId.toString());
      formData.append('Description', data.description || '');
      formData.append('AdultPrice', '0');
      formData.append('ChildPrice', '0');

      // 1. Chỉ gửi ImageUrl nếu nó KHÁC với ảnh hiện tại (hoặc khi tạo mới)
      const normalizedSelected = normalize(selectedMediaUrl);
      const normalizedCurrent = editingTour ? normalize(editingTour.imageUrl) : null;

      if (normalizedSelected && normalizedSelected !== normalizedCurrent) {
        formData.append('ImageUrl', normalizedSelected);
      }

      // 2. Chỉ gửi những Album URLs chưa có trong DB
      if (selectedAlbumUrls && selectedAlbumUrls.length > 0) {
        const existingUrls = editingTour?.tourImages?.map(img => normalize(img.imageUrl)) || [];
        
        selectedAlbumUrls.forEach((url) => {
          const nUrl = normalize(url);
          // Nếu là tour mới, hoặc là URL chưa tồn tại trong album cũ thì mới gửi lên
          if (nUrl && !existingUrls.includes(nUrl)) {
            formData.append('AlbumImageUrls', nUrl);
          }
        });
      }

      const token = localStorage.getItem('token');
      const url = editingTour ? `${API_BASE}/api/tours/${editingTour.id}` : `${API_BASE}/api/tours`;

      const response = await fetch(url, {
        method: editingTour ? 'PUT' : 'POST',
        headers: { 
          'Authorization': `Bearer ${token}` 
        },
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Không thể lưu dữ liệu!');
      }

      const updatedData = await response.json();
      toast.success(editingTour ? 'Cập nhật thành công!' : 'Tạo tour thành công!', { id: loadId });

      await fetchTours();
      
      // Nếu tạo mới thành công, chuyển sang tab lịch trình
      if (!editingTour) {
        setEditingTour(updatedData);
        setActiveTab('schedules');
      } else {
        // Nếu là update, cập nhật lại state tour đang sửa để đồng bộ ảnh
        setEditingTour(updatedData);
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
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-xl border border-slate-800 bg-slate-900/95 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_rgba(2,6,23,0.45)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                Tour Management
              </div>
              <Title className="mt-2 flex items-center gap-2 text-lg font-black uppercase tracking-tight text-slate-100">
                Quản trị Tour <Box size={20} className="text-cyan-400" />
              </Title>
              <Text className="mt-1 text-sm text-slate-400">
                Quản lý tour, ảnh đại diện, album và lịch khởi hành từ dữ liệu thực.
              </Text>
            </div>

            <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-500/40"
              >
                <option value="all">Tất cả danh mục</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  placeholder="Tìm mã hoặc tên tour..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-cyan-500/40"
                />
              </div>

              <button
                onClick={() => {
                  setEditingTour(null);
                  setActiveTab('info');
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300 transition-all hover:bg-cyan-500/15"
              >
                <Plus size={16} />
                Thêm Tour
              </button>
            </div>
          </div>
        </section>

        <Card className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-0 shadow-none">
          <Table>
            <TableHead className="bg-slate-950/60">
              <TableRow>
                <TableHeaderCell className="p-5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Thông tin Tour
                </TableHeaderCell>
                <TableHeaderCell className="text-center text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Mã Tour
                </TableHeaderCell>
                <TableHeaderCell className="text-center text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Hành động
                </TableHeaderCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredTours.map((tour: Tour) => (
                <TableRow key={tour.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <TableCell className="p-5">
                    <Flex justifyContent="start" className="gap-4">
                      <img
                        src={getFullImageUrl(tour.imageUrl)}
                        className="size-16 rounded-lg border border-slate-700 object-cover"
                        alt={tour.name}
                      />
                      <div>
                        <Text className="mb-1 text-sm font-bold uppercase leading-tight text-slate-100">
                          {tour.name}
                        </Text>
                        <Text className="mb-2 text-xs text-slate-500">{tour.departureLocation || 'Chưa có điểm đi'}</Text>
                        <Badge color="cyan" size="xs" className="text-[10px]">
                          {categories?.find((c) => c.id === tour.categoryId)?.name || 'Chưa phân loại'}
                        </Badge>
                      </div>
                    </Flex>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge color="blue" size="xs" className="text-[10px] font-bold tracking-[0.2em]">
                      {tour.code}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <Flex justifyContent="center" className="gap-2">
                      <button
                        onClick={() => {
                          setEditingTour(tour);
                          setActiveTab('schedules');
                          setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-cyan-300 transition-all hover:bg-cyan-500/15"
                      >
                        <Calendar size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em]">Lịch & Giá</span>
                      </button>

                      <button
                        onClick={() => {
                          setEditingTour(tour);
                          setActiveTab('info');
                          setIsModalOpen(true);
                        }}
                        className="rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-slate-400 transition-colors hover:text-amber-400"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(tour.id)}
                        className="rounded-lg border border-rose-500/15 bg-rose-500/5 p-2.5 text-rose-300 transition-colors hover:bg-rose-500/10"
                      >
                        <Trash2 size={16} />
                      </button>
                    </Flex>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
            <div className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
              <div className="flex shrink-0 items-center border-b border-slate-800 bg-slate-950 px-4">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`px-6 py-5 text-[11px] font-bold uppercase tracking-[0.18em] transition-all ${
                    activeTab === 'info'
                      ? 'border-b-2 border-cyan-400 text-cyan-300'
                      : 'text-slate-500'
                  }`}
                >
                  1. Thông tin & Album
                </button>

                <button
                  onClick={() => setActiveTab('schedules')}
                  disabled={!editingTour}
                  className={`px-6 py-5 text-[11px] font-bold uppercase tracking-[0.18em] transition-all ${
                    activeTab === 'schedules'
                      ? 'border-b-2 border-cyan-400 text-cyan-300'
                      : 'text-slate-500 disabled:opacity-20'
                  }`}
                >
                  2. Lịch khởi hành
                </button>

                <button
                  onClick={closeModal}
                  className="ml-auto rounded-lg p-3 text-slate-500 transition-colors hover:text-rose-400"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto bg-slate-900/70 p-8">
                {activeTab === 'info' ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1.1fr_0.9fr]">
                      <div className="space-y-8">
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                          <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                            Ảnh đại diện chính
                          </label>

                          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
                            <div className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-700 bg-slate-950">
                              {previewUrl ? (
                                <img src={previewUrl} className="h-full w-full object-cover" alt="preview" />
                              ) : (
                                <ImageIcon className="text-slate-700" size={40} />
                              )}

                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-all group-hover:opacity-100">
                                <Text className="text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                                  Preview ảnh đại diện
                                </Text>
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

                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                          <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                            <Images size={14} />
                            Album ảnh phụ ({selectedAlbumUrls.length})
                          </label>

                          <div className="mt-4 space-y-4">
                            <button
                              type="button"
                              onClick={() => setIsAlbumMediaPickerOpen(true)}
                              className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300"
                            >
                              <Plus size={16} />
                              Chọn ảnh phụ từ kho
                            </button>

                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                              {editingTour?.tourImages?.filter((img) => !img.isPrimary).map((img) => (
                                <div
                                  key={img.id}
                                  className="group relative aspect-square overflow-hidden rounded-lg border border-slate-700"
                                >
                                  <img
                                    src={getFullImageUrl(img.imageUrl)}
                                    className="h-full w-full object-cover"
                                    alt="album-item"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteOldImage(img.id)}
                                    className="absolute right-2 top-2 rounded-md bg-rose-600 p-1 text-white opacity-0 transition-all group-hover:opacity-100"
                                  >
                                    <X size={14} />
                                  </button>
                                  <div className="absolute bottom-0 left-0 right-0 bg-slate-950/80 py-1 text-center text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                    Đã lưu
                                  </div>
                                </div>
                              ))}

                              {selectedAlbumUrls
                                .filter(
                                  (url) =>
                                    !editingTour?.tourImages?.some(
                                      (img) => normalize(img.imageUrl) === normalize(url)
                                    )
                                )
                                .map((url) => (
                                  <div
                                    key={url}
                                    className="group relative aspect-square overflow-hidden rounded-lg border border-cyan-500/30"
                                  >
                                    <img
                                      src={url}
                                      className="h-full w-full object-cover"
                                      alt="album-preview"
                                    />

                                    <button
                                      type="button"
                                      onClick={() => removeAlbumPreview(url)}
                                      className="absolute inset-0 flex items-center justify-center bg-rose-500/30 text-white opacity-0 transition-all group-hover:opacity-100"
                                    >
                                      <Trash2 size={16} />
                                    </button>

                                    <div className="absolute bottom-0 left-0 right-0 bg-cyan-600 py-1 text-center text-[8px] font-bold uppercase tracking-[0.18em] text-white">
                                      Đã chọn
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                        <div className="space-y-5">
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                              Tên tour du lịch
                            </label>
                            <input
                              {...register('name', { required: true })}
                              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm font-semibold text-slate-100 outline-none focus:border-cyan-500/40"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                                Mã tour
                              </label>
                              <input
                                {...register('code', { required: true })}
                                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-sm font-bold text-cyan-300 outline-none focus:border-cyan-500/40"
                                placeholder="VD: SGN-HAN-01"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                                Nơi khởi hành
                              </label>
                              <input
                                {...register('departureLocation')}
                                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm font-semibold text-slate-100 outline-none focus:border-cyan-500/40"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                              Danh mục tour
                            </label>
                            <select
                              {...register('categoryId')}
                              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm font-semibold text-slate-200 outline-none focus:border-cyan-500/40"
                            >
                              {categories?.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                              Mô tả tóm tắt
                            </label>
                            <textarea
                              {...register('description')}
                              rows={5}
                              className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300 outline-none focus:border-cyan-500/40"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full rounded-xl border border-cyan-500/20 bg-cyan-500/10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300 transition-all hover:bg-cyan-500/15"
                          >
                            {editingTour ? 'Lưu cập nhật' : 'Tạo Tour & Tiếp tục'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  editingTour && <AdminSchedules tourId={editingTour.id} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {isMainMediaPickerOpen && (
        <MediaPicker
          value={selectedMediaUrl || previewUrl}
          onSelect={(url) => {
            const full = getFullImageUrl(url);
            setSelectedMediaUrl(full);
            setPreviewUrl(full);
          }}
          onClose={() => setIsMainMediaPickerOpen(false)}
        />
      )}

      {isAlbumMediaPickerOpen && (
        <MediaPicker
          multiple
          values={selectedAlbumUrls}
          onSelect={() => {}}
          onSelectMany={(urls) => {
            const fullUrls = urls.map((u) => getFullImageUrl(u));
            setSelectedAlbumUrls((prev) => Array.from(new Set([...prev, ...fullUrls])));
          }}
          onClose={() => setIsAlbumMediaPickerOpen(false)}
        />
      )}
    </>
  );
};

export default AdminTours;
