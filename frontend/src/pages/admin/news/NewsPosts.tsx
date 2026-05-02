import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import MediaPicker from '../../../components/ui/MediaPicker';
import {
  Plus,
  Search,
  X,
  Pencil,
  Trash2,
  CheckCircle2,
  Star,
  Loader2,
  Eye,
  Tag,
  FolderKanban,
  FileText,
  Sparkles,
  ImagePlus,
} from 'lucide-react';
import toast from 'react-hot-toast';

const BACKEND_URL = "http://localhost:5091";
const API = 'http://localhost:5091/api';
const getImageUrl = (path: string | undefined | null) => {
  if (!path) return "/placeholder.png";
  if (path.startsWith("http")) return path;
  return `${BACKEND_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};
interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
}

interface TagItem {
  id: number;
  name: string;
  slug: string;
}

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  summary: string;
  thumbnailUrl?: string;
  status: string;
  isFeatured: boolean;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  category: string;
  author: string;
  tags: string[];
}

interface NewsDetailResponse {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnailUrl?: string;
  categoryId: number;
  authorId: number;
  publishedById?: number;
  status: string;
  isFeatured: boolean;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  tagIds: number[];
}

const statusStyles: Record<string, string> = {
  Draft: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
  Published: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
  Archived: 'border-slate-600 bg-slate-800 text-slate-300',
};

const initialFormState = {
  title: '',
  slug: '',
  summary: '',
  content: '',
  thumbnailUrl: '',
  categoryId: 0,
  status: 'Draft',
  isFeatured: false,
  tagIds: [] as number[],
};

const slugify = (value: string) => {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const formatDateTime = (value?: string) => {
  if (!value) return 'Chưa xuất bản';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Không hợp lệ';

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

const AdminNewsPosts = () => {
  const token = localStorage.getItem('token');
  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const [items, setItems] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const [formData, setFormData] = useState(initialFormState);

  const metrics = useMemo(() => {
    const published = items.filter((x) => x.status === 'Published').length;
    const draft = items.filter((x) => x.status === 'Draft').length;
    const featured = items.filter((x) => x.isFeatured).length;
    const views = items.reduce((sum, item) => sum + item.viewCount, 0);

    return { published, draft, featured, views };
  }, [items]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {};
      if (keyword.trim()) params.keyword = keyword.trim();
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.categoryId = Number(categoryFilter);

      const [newsRes, categoryRes, tagRes] = await Promise.all([
        axios.get(`${API}/News`, { params, headers }),
        axios.get(`${API}/News/categories`, { headers }),
        axios.get(`${API}/News/tags`, { headers }),
      ]);

      setItems(newsRes.data);
      setCategories(categoryRes.data);
      setTags(tagRes.data);

      if (!editingId && categoryRes.data.length > 0 && formData.categoryId === 0) {
        setFormData((prev) => ({
          ...prev,
          categoryId: categoryRes.data[0].id,
        }));
      }
    } catch (err: any) {
      console.error('NEWS_FETCH_ERROR', err.response?.data || err);
      toast.error(err.response?.data?.message || 'NEWS_FETCH_FAILURE: 500');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [keyword, statusFilter, categoryFilter]);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      ...initialFormState,
      categoryId: categories[0]?.id || 0,
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsMediaPickerOpen(false);
    resetForm();
  };

  const openCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = async (id: number) => {
    try {
      const res = await axios.get<NewsDetailResponse>(`${API}/News/${id}`, { headers });

      setEditingId(id);
      setFormData({
        title: res.data.title,
        slug: res.data.slug,
        summary: res.data.summary,
        content: res.data.content,
        thumbnailUrl: res.data.thumbnailUrl || '',
        categoryId: res.data.categoryId,
        status: res.data.status,
        isFeatured: res.data.isFeatured,
        tagIds: res.data.tagIds || [],
      });
      setIsModalOpen(true);
    } catch (err: any) {
      console.error('NEWS_DETAIL_ERROR', err.response?.data || err);
      toast.error(err.response?.data?.message || 'NEWS_DETAIL_FAILURE: 500');
    }
  };

  const handleChange = (field: keyof typeof formData, value: string | number | boolean | number[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: prev.slug ? prev.slug : slugify(value),
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('TITLE_REQUIRED');
      return false;
    }

    if (!formData.summary.trim()) {
      toast.error('SUMMARY_REQUIRED');
      return false;
    }

    if (!formData.content.trim()) {
      toast.error('CONTENT_REQUIRED');
      return false;
    }

    if (!formData.categoryId) {
      toast.error('CATEGORY_REQUIRED');
      return false;
    }

    return true;
  };

  const buildPayload = () => ({
    ...formData,
    slug: formData.slug.trim() ? slugify(formData.slug) : slugify(formData.title),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = buildPayload();
    const toastId = toast.loading(editingId ? 'NEWS_UPDATE_PENDING' : 'NEWS_CREATE_PENDING');
    setSubmitting(true);

    try {
      if (editingId) {
        await axios.put(`${API}/News/${editingId}`, payload, { headers });
        toast.success('NEWS_UPDATE_SUCCESS: 200', { id: toastId });
      } else {
        await axios.post(`${API}/News`, payload, { headers });
        toast.success('NEWS_CREATE_SUCCESS: 201', { id: toastId });
      }

      closeModal();
      fetchData();
    } catch (err: any) {
      console.error('NEWS_WRITE_ERROR', err.response?.data || err);
      toast.error(err.response?.data?.message || 'NEWS_WRITE_FAILURE: 500', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Xóa bài viết này?')) return;

    try {
      await axios.delete(`${API}/News/${id}`, { headers });
      toast.success('NEWS_DELETE_SUCCESS: 200');
      fetchData();
    } catch (err: any) {
      console.error('NEWS_DELETE_ERROR', err.response?.data || err);
      toast.error(err.response?.data?.message || 'NEWS_DELETE_FAILURE: 500');
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await axios.put(`${API}/News/${id}/publish`, {}, { headers });
      toast.success('NEWS_PUBLISH_SUCCESS: 200');
      fetchData();
    } catch (err: any) {
      console.error('NEWS_PUBLISH_ERROR', err.response?.data || err);
      toast.error(err.response?.data?.message || 'NEWS_PUBLISH_FAILURE: 500');
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      await axios.put(`${API}/News/${id}/toggle-featured`, {}, { headers });
      toast.success('NEWS_FEATURE_TOGGLE_SUCCESS: 200');
      fetchData();
    } catch (err: any) {
      console.error('NEWS_FEATURE_ERROR', err.response?.data || err);
      toast.error(err.response?.data?.message || 'NEWS_FEATURE_TOGGLE_FAILURE: 500');
    }
  };

  const toggleTag = (tagId: number) => {
    setFormData((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((x) => x !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  return (
    <>
      <div className="space-y-5">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Published</span>
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            <div className="mt-4 text-2xl font-black text-slate-100">{metrics.published}</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Draft</span>
              <FileText size={16} className="text-amber-400" />
            </div>
            <div className="mt-4 text-2xl font-black text-slate-100">{metrics.draft}</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Featured</span>
              <Sparkles size={16} className="text-cyan-400" />
            </div>
            <div className="mt-4 text-2xl font-black text-slate-100">{metrics.featured}</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">View Count</span>
              <Eye size={16} className="text-blue-400" />
            </div>
            <div className="mt-4 text-2xl font-black text-slate-100">{metrics.views.toLocaleString('vi-VN')}</div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg shadow-black/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid flex-1 gap-3 xl:grid-cols-[1fr_180px_220px]">
              <div className="relative">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Truy vấn tiêu đề, slug, tóm tắt..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-10 text-xs font-bold text-white outline-none transition-all focus:border-cyan-500/50"
                />
                {keyword && (
                  <button
                    type="button"
                    onClick={() => setKeyword('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-rose-500"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-bold text-white outline-none focus:border-cyan-500/50"
              >
                <option value="">Toàn bộ trạng thái</option>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Archived">Archived</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-bold text-white outline-none focus:border-cyan-500/50"
              >
                <option value="">Toàn bộ danh mục</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-lg shadow-cyan-950/40 transition-all hover:bg-cyan-500 active:scale-95"
            >
              <Plus size={16} />
              Tạo bài viết
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 ring-1 ring-white/5">
          <table className="w-full text-left">
            <thead className="border-b border-slate-800/50 bg-slate-950/70 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="p-5">Bài viết</th>
                <th className="p-5">Phân loại</th>
                <th className="p-5 text-center">Trạng thái</th>
                <th className="p-5 text-center">Lưu lượng</th>
                <th className="p-5 text-center">Tác vụ</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/40">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={30} className="animate-spin text-cyan-400" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                        Đang đồng bộ bản tin
                      </span>
                    </div>
                  </td>
                </tr>
              ) : items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-800/40">
                    <td className="p-5">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-bold uppercase tracking-tight text-slate-100">
                            {item.title}
                          </div>
                          {item.isFeatured && (
                            <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-[9px] font-bold uppercase text-cyan-300">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                          {item.slug}
                        </div>
                        <div className="line-clamp-2 max-w-xl text-[11px] leading-5 text-slate-400">
                          {item.summary}
                        </div>
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 text-[11px] font-bold text-cyan-400">
                          <FolderKanban size={13} />
                          {item.category}
                        </div>
                        <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                          {item.author}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.tags?.slice(0, 3).map((tag) => (
                            <span
                              key={`${item.id}-${tag}`}
                              className="rounded-full border border-slate-700 bg-slate-950 px-2 py-1 text-[9px] font-bold uppercase text-slate-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>

                    <td className="p-5 text-center">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${
                          statusStyles[item.status] || 'border-slate-700 bg-slate-950 text-slate-300'
                        }`}
                      >
                        {item.status}
                      </span>
                      <div className="mt-2 text-[10px] text-slate-500">{formatDateTime(item.publishedAt)}</div>
                    </td>

                    <td className="p-5 text-center">
                      <div className="text-sm font-black text-amber-400">
                        {item.viewCount.toLocaleString('vi-VN')}
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="flex justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(item.id)}
                          className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-amber-500/10 hover:text-amber-400"
                          title="Hiệu chỉnh"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePublish(item.id)}
                          className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-emerald-500/10 hover:text-emerald-400"
                          title="Xuất bản"
                        >
                          <CheckCircle2 size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(item.id)}
                          className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-cyan-500/10 hover:text-cyan-400"
                          title="Nổi bật"
                        >
                          <Star size={16} fill={item.isFeatured ? 'currentColor' : 'none'} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-rose-500/10 hover:text-rose-400"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                        Không có bản tin khớp truy vấn
                      </div>
                      <div className="text-xs text-slate-600">
                        Kiểm tra bộ lọc hoặc khởi tạo bài viết mới.
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md">
            <form
              onSubmit={handleSubmit}
              className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-5">
                <div>
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                    {editingId ? 'Hiệu chỉnh bản tin' : 'Khởi tạo bản tin'}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Đồng bộ metadata, nội dung, tag map và trạng thái xuất bản.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="text-slate-500 transition-colors hover:text-rose-500"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid gap-4 p-6 lg:grid-cols-2">
                <div className="space-y-2 lg:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Tiêu đề
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white outline-none focus:border-cyan-500/50"
                    placeholder="Tiêu đề bài viết"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Slug
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white outline-none focus:border-cyan-500/50"
                    placeholder="du-lich-phu-quoc"
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                  />
                </div>

                <div className="space-y-2 lg:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Ảnh đại diện
                  </label>

                  <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
                    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
                      <div className="aspect-[4/3] bg-slate-900">
                        {formData.thumbnailUrl ? (
                          <img 
                            src={getImageUrl(formData.thumbnailUrl)} 
                            alt={formData.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-slate-600">
                            <ImagePlus size={28} />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-400">
                        {formData.thumbnailUrl || 'Chưa gắn ảnh đại diện'}
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setIsMediaPickerOpen(true)}
                          className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300"
                        >
                          Chọn từ kho ảnh
                        </button>

                        {formData.thumbnailUrl && (
                          <button
                            type="button"
                            onClick={() => handleChange('thumbnailUrl', '')}
                            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400"
                          >
                            Xóa ảnh
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Danh mục
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white outline-none focus:border-cyan-500/50"
                    value={formData.categoryId}
                    onChange={(e) => handleChange('categoryId', Number(e.target.value))}
                  >
                    <option value={0}>Chọn danh mục</option>
                    {categories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Trạng thái
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white outline-none focus:border-cyan-500/50"
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div className="space-y-2 lg:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Tóm tắt
                  </label>
                  <textarea
                    className="min-h-[110px] w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white outline-none focus:border-cyan-500/50"
                    placeholder="Tóm tắt ngắn gọn nội dung bài viết"
                    value={formData.summary}
                    onChange={(e) => handleChange('summary', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2 lg:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Nội dung
                  </label>
                  <textarea
                    className="min-h-[260px] w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white outline-none focus:border-cyan-500/50"
                    placeholder="Nội dung chi tiết bài viết"
                    value={formData.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    required
                  />
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 lg:col-span-2">
                  <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    <Tag size={12} />
                    Tag map
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {tags.length > 0 ? (
                      tags.map((tag) => {
                        const active = formData.tagIds.includes(tag.id);

                        return (
                          <button
                            type="button"
                            key={tag.id}
                            onClick={() => toggleTag(tag.id)}
                            className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase transition-all ${
                              active
                                ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                                : 'border-slate-700 bg-slate-900 text-slate-400'
                            }`}
                          >
                            {tag.name}
                          </button>
                        );
                      })
                    ) : (
                      <div className="text-xs text-slate-500">Chưa có tag nào được khởi tạo.</div>
                    )}
                  </div>
                </div>

                <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 lg:col-span-2">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => handleChange('isFeatured', e.target.checked)}
                  />
                  Đánh dấu nổi bật trong luồng hiển thị công khai
                </label>
              </div>

              <div className="flex gap-3 border-t border-slate-800 bg-slate-950 px-6 py-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl bg-slate-800 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white disabled:opacity-60"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  Lưu bản tin
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {isMediaPickerOpen && (
        <MediaPicker
          value={formData.thumbnailUrl}
          onSelect={(url) => handleChange('thumbnailUrl', url)}
          onClose={() => setIsMediaPickerOpen(false)}
        />
      )}
    </>
  );
};

export default AdminNewsPosts;
