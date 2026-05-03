import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  ImagePlus,
  Loader2,
  Trash2,
  Upload,
  Image as ImageIcon,
  Copy,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

const API = 'http://localhost:5091/api';
const BASE_URL = 'http://localhost:5091';
const PAGE_SIZE = 12;

const resolveUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return BASE_URL + url;
};

interface MediaItem {
  id: number;
  fileName: string;
  fileUrl: string;
  altText?: string;
  createdAt: string;
  uploadedBy: string;
}

const formatDateTime = (value?: string) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

const AdminMedia = () => {
  const token = localStorage.getItem('token');
  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [altText, setAltText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/Media`, { headers });
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      console.error('MEDIA_FETCH_ERROR', err.response?.data || err);
      toast.error(err.response?.data?.message || 'Không tải được kho ảnh');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (file?: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('altText', altText);

    const toastId = toast.loading('Đang tải ảnh lên...');
    setUploading(true);

    try {
      await axios.post(`${API}/Media/upload`, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Tải ảnh thành công', { id: toastId });
      setAltText('');
      await fetchMedia();
      setCurrentPage(1);
    } catch (err: any) {
      console.error('MEDIA_UPLOAD_ERROR', err.response?.data || err);
      toast.error(err.response?.data?.message || 'Tải ảnh thất bại', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Xóa ảnh này khỏi kho ảnh?')) return;

    try {
      await axios.delete(`${API}/Media/${id}`, { headers });
      toast.success('Xóa ảnh thành công');
      await fetchMedia();
    } catch (err: any) {
      console.error('MEDIA_DELETE_ERROR', err.response?.data || err);
      toast.error(err.response?.data?.message || 'Xóa ảnh thất bại');
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(resolveUrl(url));
      toast.success('Đã sao chép URL');
    } catch {
      toast.error('Không thể sao chép URL');
    }
  };

  const filteredItems = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return items;

    return items.filter((item) => {
      const name = (item.fileName || '').toLowerCase();
      const alt = (item.altText || '').toLowerCase();
      const uploader = (item.uploadedBy || '').toLowerCase();
      return name.includes(q) || alt.includes(q) || uploader.includes(q);
    });
  }, [items, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {/* Header */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/95 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_rgba(2,6,23,0.45)]">
        <div className="flex items-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
            <ImagePlus size={22} />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">Media Library</div>
            <h1 className="mt-2 text-lg font-black uppercase tracking-tight text-slate-100">Kho ảnh dùng chung</h1>
            <p className="mt-1 text-sm text-slate-400">
              Lưu trữ, tìm kiếm và tái sử dụng ảnh cho tour, tin tức và các module vận hành.
            </p>
          </div>
        </div>
      </section>

      {/* Toolbar ngang gọn */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="grid gap-3 md:grid-cols-[1.2fr_1fr_auto]">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm theo tên ảnh, mô tả, người tải..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Alt text */}
          <input
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Alt text / mô tả ảnh"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3 text-sm text-white outline-none focus:border-cyan-500/50"
          />

          {/* Upload button */}
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-300 hover:bg-cyan-500/15">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? 'Đang tải...' : 'Tải ảnh'}
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files?.[0])}
              disabled={uploading}
            />
          </label>
        </div>

        <div className="mt-3 text-xs text-slate-500">
          {filteredItems.length} ảnh {searchTerm ? `(lọc từ ${items.length} ảnh)` : ''}
        </div>
      </section>

      {/* Grid ảnh */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        {loading ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 className="animate-spin text-cyan-400" />
          </div>
        ) : paginatedItems.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {paginatedItems.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
                  <div className="aspect-[4/3] overflow-hidden bg-slate-900">
                    <img
                      src={resolveUrl(item.fileUrl)}
                      alt={item.altText || item.fileName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="space-y-3 p-4">
                    <div className="line-clamp-1 text-xs font-bold text-slate-200">{item.fileName}</div>
                    <div className="line-clamp-2 text-[11px] text-slate-500">{item.altText || 'Chưa có mô tả'}</div>
                    <div className="text-[10px] uppercase tracking-[0.16em] text-slate-600">
                      {item.uploadedBy} • {formatDateTime(item.createdAt)}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => copyUrl(item.fileUrl)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 py-2 text-[10px] font-bold uppercase text-slate-300"
                      >
                        <Copy size={13} />
                        Copy URL
                      </button>

                      <a
                        href={resolveUrl(item.fileUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-300"
                      >
                        <ImageIcon size={14} />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="flex items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-rose-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
              <div className="text-xs text-slate-500">
                Trang {currentPage} / {totalPages}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 disabled:opacity-40"
                >
                  <ChevronLeft size={14} />
                  Trước
                </button>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 disabled:opacity-40"
                >
                  Sau
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              {searchTerm ? 'Không tìm thấy ảnh phù hợp' : 'Chưa có ảnh nào trong kho'}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminMedia;