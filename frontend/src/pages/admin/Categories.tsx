import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  FolderTree,
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  ChevronRight,
  Info,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

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

const API = 'http://localhost:5091/api/Categories';

const AdminCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      setCategories(res.data);
    } catch {
      toast.error('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (category: any) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadId = toast.loading(editingId ? 'Đang cập nhật...' : 'Đang tạo danh mục...');
    setSubmitting(true);

    try {
      if (editingId) {
        await axios.put(
          `${API}/${editingId}`,
          { ...formData, id: editingId },
          { headers }
        );
      } else {
        await axios.post(API, formData, { headers });
      }

      await fetchData();
      closeModal();
      toast.success(editingId ? 'Cập nhật thành công' : 'Tạo danh mục thành công', {
        id: loadId,
      });
    } catch {
      toast.error('Lỗi dữ liệu', { id: loadId });
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (id: number) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 p-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-200">
            Xác nhận xóa danh mục này?
          </p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await axios.delete(`${API}/${id}`, { headers });
                  await fetchData();
                  toast.success('Đã xóa danh mục');
                } catch {
                  toast.error('Không thể xóa danh mục đang có Tour');
                }
              }}
              className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-rose-300"
            >
              Xóa
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-300"
            >
              Hủy
            </button>
          </div>
        </div>
      ),
      {
        style: {
          background: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '14px',
        },
      }
    );
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-xl border border-slate-800 bg-slate-900/95 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_rgba(2,6,23,0.45)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
              Category Management
            </div>
            <Title className="mt-2 flex items-center gap-2 text-lg font-black uppercase tracking-tight text-slate-100">
              Quản lý Danh mục <FolderTree size={18} className="text-cyan-400" />
            </Title>
            <Text className="mt-1 text-sm text-slate-400">
              Quản trị danh mục tour và mô tả nhóm sản phẩm trong hệ thống.
            </Text>
            <Text className="mt-2 text-[11px] font-medium text-slate-500">
              Cập nhật: {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: vi })}
            </Text>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300 transition-all hover:bg-cyan-500/15"
          >
            <Plus size={16} />
            Thêm danh mục
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={16}
          />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục theo tên..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-10 pr-10 text-sm text-slate-200 outline-none transition-all focus:border-cyan-500/40"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition-colors hover:text-rose-400"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {!loading && (
          <Text className="text-[11px] font-medium text-slate-500">
            Hiển thị {filtered.length} / {categories.length} danh mục
          </Text>
        )}
      </section>

      <Card className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-0 shadow-none">
        <Table>
          <TableHead className="bg-slate-950/60">
            <TableRow>
              <TableHeaderCell className="w-24 p-5 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                ID
              </TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Tên danh mục
              </TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Mô tả chi tiết
              </TableHeaderCell>
              <TableHeaderCell className="text-center text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                Hành động
              </TableHeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="p-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 size={28} className="animate-spin text-cyan-400" />
                    <Text className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Đang tải dữ liệu...
                    </Text>
                  </div>
                </TableCell>
              </TableRow>
            ) : filtered.length > 0 ? (
              filtered.map((category) => (
                <TableRow
                  key={category.id}
                  className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/30"
                >
                  <TableCell className="p-5 text-center">
                    <Badge
                      color="slate"
                      size="xs"
                      className="border border-slate-700 bg-slate-800 text-[10px] font-mono text-slate-300"
                    >
                      #{category.id}
                    </Badge>
                  </TableCell>

                  <TableCell className="p-5">
                    <Text className="text-sm font-bold uppercase tracking-tight text-cyan-300">
                      {category.name}
                    </Text>
                  </TableCell>

                  <TableCell className="p-5">
                    <Text className="max-w-md text-sm italic text-slate-400">
                      {category.description || 'Chưa có mô tả...'}
                    </Text>
                  </TableCell>

                  <TableCell className="p-5">
                    <Flex justifyContent="center" className="gap-2">
                      <button
                        onClick={() => openEditModal(category)}
                        className="rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-slate-400 transition-colors hover:text-amber-400"
                        title="Chỉnh sửa"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => confirmDelete(category.id)}
                        className="rounded-lg border border-rose-500/15 bg-rose-500/5 p-2.5 text-rose-300 transition-colors hover:bg-rose-500/10"
                        title="Xóa danh mục"
                      >
                        <Trash2 size={16} />
                      </button>
                    </Flex>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="p-20 text-center">
                  <div className="flex flex-col items-center">
                    <div className="mb-4 rounded-full border border-slate-800 bg-slate-950 p-4">
                      <Info size={30} className="text-slate-700" />
                    </div>
                    <Text className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      {searchTerm ? 'Không tìm thấy danh mục phù hợp' : 'Danh sách danh mục trống'}
                    </Text>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-300 hover:underline"
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-5">
              <div>
                <Title className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-100">
                  {editingId ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
                </Title>
                <Text className="mt-1 text-xs text-slate-500">
                  Điền thông tin cơ bản cho nhóm tour.
                </Text>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:text-rose-400"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/70 p-6">
              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm font-semibold text-slate-100 outline-none transition-all focus:border-cyan-500/40"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Du lịch Phú Quốc"
                />
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Mô tả chi tiết
                </label>
                <textarea
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300 outline-none transition-all focus:border-cyan-500/40"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Nhập mô tả cho danh mục này..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-900 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-300 transition-colors hover:bg-slate-800"
                >
                  Hủy bỏ
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-300 transition-all hover:bg-cyan-500/15 disabled:opacity-60"
                >
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : null}
                  {editingId ? 'Lưu thay đổi' : 'Xác nhận tạo'}
                  {!submitting ? <ChevronRight size={14} /> : null}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
