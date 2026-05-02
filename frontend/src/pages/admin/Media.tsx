import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { ImagePlus, Loader2, Trash2, Upload, Image as ImageIcon, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const API = 'http://localhost:5091/api';
const BASE_URL = 'http://localhost:5091';

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

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/Media`, { headers });
      setItems(res.data);
    } catch (err: any) {
      console.error('MEDIA_FETCH_ERROR', err.response?.data || err);
      toast.error(err.response?.data?.message || 'MEDIA_FETCH_FAILURE: 500');
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

    const toastId = toast.loading('MEDIA_UPLOAD_PENDING');
    setUploading(true);

    try {
      await axios.post(`${API}/Media/upload`, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('MEDIA_UPLOAD_SUCCESS: 200', { id: toastId });
      setAltText('');
      fetchMedia();
    } catch (err: any) {
      console.error('MEDIA_UPLOAD_ERROR', err.response?.data || err);
      toast.error(err.response?.data?.message || 'MEDIA_UPLOAD_FAILURE: 500', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Xóa ảnh này khỏi kho ảnh?')) return;

    try {
      await axios.delete(`${API}/Media/${id}`, { headers });
      toast.success('MEDIA_DELETE_SUCCESS: 200');
      fetchMedia();
    } catch (err: any) {
      console.error('MEDIA_DELETE_ERROR', err.response?.data || err);
      toast.error(err.response?.data?.message || 'MEDIA_DELETE_FAILURE: 500');
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('MEDIA_URL_COPIED: 200');
    } catch {
      toast.error('MEDIA_URL_COPY_FAILURE: 500');
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/95 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_rgba(2,6,23,0.45)]">
        <div className="flex items-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
            <ImagePlus size={22} />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">Media Library</div>
            <h1 className="mt-2 text-lg font-black uppercase tracking-tight text-slate-100">Kho ảnh dùng chung</h1>
            <p className="mt-1 text-sm text-slate-400">
              Lưu trữ và tái sử dụng ảnh cho tin tức, tour và các module vận hành khác.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-4 flex items-center gap-3">
            <Upload size={18} className="text-cyan-400" />
            <h2 className="text-sm font-black uppercase text-slate-100">Tải ảnh lên</h2>
          </div>

          <div className="space-y-4">
            <input
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Alt text / mô tả ảnh"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white outline-none focus:border-cyan-500/50"
            />

            <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-6 text-center transition-all hover:border-cyan-500/40 hover:bg-slate-900">
              <Upload size={28} className="mb-3 text-cyan-400" />
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">
                Chọn ảnh từ máy
              </div>
              <div className="mt-2 text-xs text-slate-500">
                JPG, JPEG, PNG, WEBP
              </div>

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={(e) => handleUpload(e.target.files?.[0])}
              />
            </label>

            {uploading && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Loader2 size={14} className="animate-spin text-cyan-400" />
                Đang tải ảnh lên hệ thống...
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-4">
            <h3 className="text-sm font-black uppercase text-slate-100">Toàn bộ tài nguyên</h3>
            <p className="mt-1 text-xs text-slate-500">{items.length} ảnh đang lưu trữ</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-16">
              <Loader2 className="animate-spin text-cyan-400" />
            </div>
          ) : items.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
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
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Chưa có ảnh nào trong kho
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminMedia;
