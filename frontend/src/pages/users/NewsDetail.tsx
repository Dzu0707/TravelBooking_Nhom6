import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const NewsDetail = () => {
  const { slug } = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    axios.get(`http://localhost:5091/api/public/news/${slug}`)
      .then((res) => setItem(res.data))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="text-sm font-bold uppercase text-slate-400">Đang tải bài viết...</div>;
  }

  if (!item) {
    return <div className="text-sm font-bold uppercase text-rose-500">Bài viết không tồn tại</div>;
  }

  return (
    <article className="mx-auto max-w-4xl space-y-8">
      {item.thumbnailUrl && (
        <img src={item.thumbnailUrl} alt={item.title} className="h-[420px] w-full rounded-3xl object-cover shadow-xl" />
      )}

      <div className="space-y-4">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">{item.category?.name}</div>
        <h1 className="text-4xl font-black leading-tight text-slate-900">{item.title}</h1>
        <p className="text-lg text-slate-500">{item.summary}</p>
      </div>

      <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
        <span>Tác giả: {item.author}</span>
        <span>Lượt xem: {item.viewCount}</span>
      </div>

      <div className="prose prose-lg max-w-none text-slate-700 whitespace-pre-line">
        {item.content}
      </div>
    </article>
  );
};

export default NewsDetail;
