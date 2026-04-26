import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, ArrowLeft } from 'lucide-react';

interface News {
  id: number;
  title: string;
  shortDescription: string;
  imageUrl: string;
  createdAt: string;
}

const NewsList = () => {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5091/api/news')
      .then(res => setNewsList(res.data))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-600 font-bold mb-8 hover:underline">
        <ArrowLeft size={20} /> Quay lại
      </button>
      
      <h1 className="text-4xl font-black text-gray-900 mb-10">Tất cả tin tức du lịch</h1>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsList.map((news) => (
            <div key={news.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all">
              <img src={news.imageUrl} className="w-full h-56 object-cover" alt={news.title} />
              <div className="p-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">{new Date(news.createdAt).toLocaleDateString()}</p>
                <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">{news.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-4">{news.shortDescription}</p>
                <button 
                  onClick={() => navigate(`/news/${news.id}`)}
                  className="text-blue-600 font-bold text-sm hover:underline"
                >
                  Đọc tiếp →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsList;