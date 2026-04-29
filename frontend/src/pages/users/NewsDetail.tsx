import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const NewsDetail = () => {
  const { slug } = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    // SỬA: Đường dẫn đúng là /api/news/slug/ + slug
    axios.get(`http://localhost:5091/api/news/slug/${slug}`)
      .then((res) => setItem(res.data))
      .catch((err) => {
          console.error(err);
          setItem(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="p-10 text-center">Đang tải bài viết...</div>;
  if (!item) return <div className="p-10 text-center text-rose-500 font-bold">Bài viết không tồn tại</div>;

  return (
    <article className="mx-auto max-w-4xl space-y-8">
      {item.thumbnailUrl && (
        <img src={item.thumbnailUrl} alt={item.title} className="h-[420px] w-full rounded-3xl object-cover shadow-xl" />
      )}

      <div className="space-y-4">
        {/* SỬA: Dùng item.categoryName */}
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">{item.categoryName}</div>
        <h1 className="text-4xl font-black leading-tight text-slate-900">{item.title}</h1>
        <p className="text-lg text-slate-500">{item.summary}</p>
      </div>

      <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
        <span>Tác giả: {item.authorName}</span>
        <span>Lượt xem: {item.viewCount}</span>
      </div>

      <div className="prose prose-lg max-w-none text-slate-700 whitespace-pre-line">
        {item.content}
      </div>
    </article>
  );
};

export default NewsDetail;