import { useEffect, useState } from 'react';
import axios from 'axios';
import { FolderKanban, Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const API = 'http://localhost:5091/api';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
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

const AdminNewsCategories = () => {
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', description: '', isActive: true });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/News/categories`, { headers });
      setItems(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'NEWS_CATEGORY_FETCH_FAILURE: 500');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, slug: form.slug.trim() ? slugify(form.slug) : slugify(form.name) };

    try {
      await axios.post(`${API}/News/categories`, payload, { headers });
      toast.success('NEWS_CATEGORY_CREATE_SUCCESS: 201');
      setForm({ name: '', slug: '', description: '', isActive: true });
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'NEWS_CATEGORY_CREATE_FAILURE: 500');
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex items-center gap-3">
          <FolderKanban size={18} className="text-cyan-400" />
          <h2 className="text-sm font-black uppercase text-slate-100">Danh mục tin tức</h2>
        </div>

        <input className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white"
          placeholder="Tên danh mục" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white"
          placeholder="Slug" value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <textarea className="min-h-[100px] w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white"
          placeholder="Mô tả" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <label className="flex items-center gap-3 text-sm text-slate-300">
          <input type="checkbox" checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          Kích hoạt danh mục
        </label>

        <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
          <Plus size={14} />
          Tạo danh mục
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        {loading ? (
          <div className="flex items-center justify-center p-16"><Loader2 className="animate-spin text-cyan-400" /></div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-950/70 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="p-5">Tên</th>
                <th className="p-5">Slug</th>
                <th className="p-5">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="p-5 text-sm font-bold text-slate-100">{item.name}</td>
                  <td className="p-5 text-xs uppercase text-slate-500">{item.slug}</td>
                  <td className="p-5">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                      item.isActive ? 'bg-emerald-500/10 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminNewsCategories;
