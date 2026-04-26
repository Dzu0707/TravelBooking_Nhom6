import { useState } from 'react';
import { Newspaper, FolderKanban, Tags } from 'lucide-react';
import AdminNewsPosts from './news/AdminNewsPosts';
import AdminNewsCategories from './news/AdminNewsCategories';
import AdminNewsTags from './news/AdminNewsTags';

type NewsView = 'posts' | 'categories' | 'tags';

const tabs: { key: NewsView; label: string; icon: React.ReactNode }[] = [
  { key: 'posts', label: 'Bài viết', icon: <Newspaper size={16} /> },
  { key: 'categories', label: 'Danh mục', icon: <FolderKanban size={16} /> },
  { key: 'tags', label: 'Thẻ', icon: <Tags size={16} /> },
];

const AdminNews = () => {
  const [view, setView] = useState<NewsView>('posts');

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/95 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_rgba(2,6,23,0.45)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">News Control</div>
            <h1 className="mt-2 text-lg font-black uppercase tracking-tight text-slate-100">Điều phối tin tức</h1>
            <p className="mt-1 text-sm text-slate-400">
              Quản trị bài viết, danh mục và thẻ trong cùng một module vận hành.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const active = view === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setView(tab.key)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] transition-all ${
                    active
                      ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {view === 'posts' && <AdminNewsPosts />}
      {view === 'categories' && <AdminNewsCategories />}
      {view === 'tags' && <AdminNewsTags />}
    </div>
  );
};

export default AdminNews;
