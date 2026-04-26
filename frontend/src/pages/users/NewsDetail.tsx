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
  );
};

export default NewsDetail;