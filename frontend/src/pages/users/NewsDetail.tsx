<<<<<<< HEAD
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
=======
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, ArrowLeft } from 'lucide-react';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5091/api/news/${id}`)
      .then(res => setNews(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={40} /></div>;
  if (!news) return <div className="text-center py-20">Không tìm thấy bài viết!</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-600 font-bold mb-6 hover:underline">
        <ArrowLeft size={20} /> Quay lại
      </button>
      <h1 className="text-4xl font-black text-gray-900 mb-6">{news.title}</h1>
      <img src={news.imageUrl} className="w-full h-80 object-cover rounded-3xl mb-8" alt={news.title} />
      <div className="prose max-w-none text-gray-700 leading-relaxed">
        {/* Render nội dung chi tiết. Nếu content có HTML tags, bạn dùng dangerouslySetInnerHTML */}
        <div dangerouslySetInnerHTML={{ __html: news.content }} />
      </div>
    </div>
>>>>>>> 9fcc8939d677855e115e5ea79c439a0f496ca9fa
  );
};

export default NewsDetail;