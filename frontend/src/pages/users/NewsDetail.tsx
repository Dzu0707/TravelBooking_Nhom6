import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const API_ORIGIN = 'http://localhost:5091';

const NewsDetail = () => {
  const { slug } = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    axios
      .get(`${API_ORIGIN}/api/public/news/${slug}`)
      .then((res) => setItem(res.data))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="text-sm font-bold uppercase text-slate-400">Đang tải bài viết...</div>;
  }

  if (!item) {
    return <div className="text-sm font-bold uppercase text-rose-500">Bài viết không tồn tại</div>;
  }

  const thumbnailSrc = item.thumbnailUrl?.startsWith('http')
    ? item.thumbnailUrl
    : item.thumbnailUrl
      ? `${API_ORIGIN}${item.thumbnailUrl}`
      : '';

  return (
    <article className="mx-auto max-w-4xl space-y-8">
      {thumbnailSrc && (
        <img
          src={thumbnailSrc}
          alt={item.title}
          className="h-[420px] w-full rounded-3xl object-cover shadow-xl"
        />
      )}

      <div className="space-y-4">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
          {item.category?.name}
        </div>
        <h1 className="text-4xl font-black leading-tight text-slate-900">{item.title}</h1>
        <p className="text-lg text-slate-500">{item.summary}</p>
      </div>

      <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
        <span>Lượt xem: {item.viewCount}</span>
      </div>

      <div className="prose prose-lg max-w-none whitespace-pre-line text-slate-700">
        {item.content}
      </div>
    </article>
  );
};

export default NewsDetail;
