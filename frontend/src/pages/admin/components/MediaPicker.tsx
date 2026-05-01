import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { Check, ImagePlus, Loader2, Search, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

const API = 'http://localhost:5091/api';
const API_BASE = 'http://localhost:5091';

const getFullUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
};
interface MediaItem {
  id: number;
  fileName: string;
  fileUrl: string;
  altText?: string;
  createdAt: string;
  uploadedBy: string;
}

interface MediaPickerProps {
  value?: string;
  values?: string[];
  multiple?: boolean;
  onSelect: (url: string) => void;
  onSelectMany?: (urls: string[]) => void;
  onClose: () => void;
}

const MediaPicker = ({
  value,
  values = [],
  multiple = false,
  onSelect,
  onSelectMany,
  onClose,
}: MediaPickerProps) => {
  const token = localStorage.getItem('token');
  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [altText, setAltText] = useState('');
  const [selectedUrls, setSelectedUrls] = useState<string[]>(values);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/Media`, { headers });
      setItems(res.data);
    } catch (err: any) {
      console.error('MEDIA_PICKER_FETCH_ERROR', err.response?.data || err);
      toast.error(err.response?.data?.message || 'MEDIA_PICKER_FETCH_FAILURE: 500');
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
      const res = await axios.post(`${API}/Media/upload`, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      });

      await fetchMedia();

      if (multiple) {
        setSelectedUrls((prev) => [...prev, res.data.fileUrl]);
      } else {
        onSelect(res.data.fileUrl);
        onClose();
      }

      toast.success('MEDIA_UPLOAD_SUCCESS: 200', { id: toastId });
    } catch (err: any) {
      console.error('MEDIA_UPLOAD_ERROR', err.response?.data || err);
      toast.error(err.response?.data?.message || 'MEDIA_UPLOAD_FAILURE: 500', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const search = keyword.trim().toLowerCase();
    if (!search) return true;

    return (
      item.fileName.toLowerCase().includes(search) ||
      item.fileUrl.toLowerCase().includes(search) ||
      (item.altText || '').toLowerCase().includes(search)
    );
  });

  const toggleSelect = (url: string) => {
    if (!multiple) {
      onSelect(url);
      onClose();
      return;
    }

    setSelectedUrls((prev) =>
      prev.includes(url)
        ? prev.filter((x) => x !== url)
        : [...prev, url]
    );
  };

  const handleApplyMulti = () => {
    onSelectMany?.(selectedUrls);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-5">
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white">
              {multiple ? 'Chọn nhiều ảnh từ kho' : 'Chọn ảnh từ kho'}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Upload vào kho trước, sau đó liên kết vào bài viết hoặc tour.
            </p>
          </div>

          <button type="button" onClick={onClose} className="text-slate-500 hover:text-rose-500">
            <X size={20} />
          </button>
        </div>

        <div className="border-b border-slate-800 p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_280px_auto]">
            <div className="relative">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm theo tên file hoặc mô tả..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-10 text-xs font-bold text-white outline-none focus:border-cyan-500/50"
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

            <input
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Alt text / mô tả ảnh"
              className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs font-bold text-white outline-none focus:border-cyan-500/50"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300 disabled:opacity-60"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              Upload
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files?.[0])}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center p-16">
              <Loader2 className="animate-spin text-cyan-400" />
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {filteredItems.map((item) => {
                  const active = multiple
                    ? selectedUrls.includes(item.fileUrl)
                    : value === item.fileUrl;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleSelect(item.fileUrl)}
                    className={`relative overflow-hidden rounded-2xl border text-left transition-all ${
                      active
                        ? 'border-cyan-500/40 bg-cyan-500/5 ring-1 ring-cyan-500/30'
                        : 'border-slate-800 bg-slate-950 hover:border-cyan-500/30'
                    }`}
                  >
                    {active && (
                      <div className="absolute right-2 top-2 z-10 rounded-full bg-cyan-500 p-1 text-slate-950">
                        <Check size={12} />
                      </div>
                    )}

                    <div className="aspect-[4/3] overflow-hidden bg-slate-900">
                      <img
                        src={getFullUrl(item.fileUrl)}
                        alt={item.altText || item.fileName}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="space-y-2 p-4">
                      <div className="line-clamp-1 text-xs font-bold text-slate-200">{item.fileName}</div>
                      <div className="line-clamp-2 text-[11px] text-slate-500">{item.altText || 'Chưa có mô tả'}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center">
              <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                <ImagePlus size={14} />
                Không có ảnh phù hợp
              </div>
            </div>
          )}
        </div>

        {multiple && (
          <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-6 py-4">
            <div className="text-xs text-slate-500">{selectedUrls.length} ảnh đã chọn</div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-slate-800 px-4 py-2 text-[11px] font-bold uppercase text-slate-400"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleApplyMulti}
                className="rounded-xl bg-cyan-600 px-4 py-2 text-[11px] font-bold uppercase text-white"
              >
                Áp dụng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaPicker;
