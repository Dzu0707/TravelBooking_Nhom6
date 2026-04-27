import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API = 'http://localhost:5091/api/public/news';

const NewsList = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(API)
      .then((res) => setItems(res.data.items || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Tin tức du lịch</h1>
        <p className="mt-2 text-slate-500">Dòng tin hệ thống, xu hướng điểm đến và cập nhật vận hành tour.</p>
      </div>

      {loading ? (
        <div className="text-sm font-bold uppercase text-slate-400">Đang tải dữ liệu...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <Link key={item.id} to={`/news/${item.slug}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
              {item.thumbnailUrl && (
                <img src={item.thumbnailUrl} alt={item.title} className="h-56 w-full object-cover" />
              )}
              <div className="space-y-3 p-6">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">{item.category?.name}</div>
                <h2 className="text-2xl font-bold text-slate-900">{item.title}</h2>
                <p className="line-clamp-3 text-sm text-slate-600">{item.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsList;
