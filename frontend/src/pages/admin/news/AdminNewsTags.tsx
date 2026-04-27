import { useEffect, useState } from 'react';
import axios from 'axios';
import { Tags, Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const API = 'http://localhost:5091/api';

interface TagItem {
  id: number;
  name: string;
  slug: string;
}

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const AdminNewsTags = () => {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const [items, setItems] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '' });

  const fetchTags = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/News/tags`, { headers });
      setItems(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'NEWS_TAG_FETCH_FAILURE: 500');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, slug: form.slug.trim() ? slugify(form.slug) : slugify(form.name) };

    try {
      await axios.post(`${API}/News/tags`, payload, { headers });
      toast.success('NEWS_TAG_CREATE_SUCCESS: 201');
      setForm({ name: '', slug: '' });
      fetchTags();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'NEWS_TAG_CREATE_FAILURE: 500');
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex items-center gap-3">
          <Tags size={18} className="text-cyan-400" />
          <h2 className="text-sm font-black uppercase text-slate-100">Thẻ tin tức</h2>
        </div>

        <input className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white"
          placeholder="Tên thẻ" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white"
          placeholder="Slug" value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })} />

        <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
          <Plus size={14} />
          Tạo thẻ
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        {loading ? (
          <div className="flex items-center justify-center p-16"><Loader2 className="animate-spin text-cyan-400" /></div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-950/70 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="p-5">Tên thẻ</th>
                <th className="p-5">Slug</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="p-5 text-sm font-bold text-slate-100">{item.name}</td>
                  <td className="p-5 text-xs uppercase text-slate-500">{item.slug}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminNewsTags;
