import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const NewsPage = () => {
  const [newsList, setNewsList] = useState<any[]>([]);

  const fetchNews = async () => {
    try {
      const response = await fetch('http://localhost:5091/api/news');
      const data = await response.json();
      setNewsList(data);
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error('Không thể tải tin tức');
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // PHẢI CÓ RETURN Ở ĐÂY
  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-4xl font-black text-slate-800 mb-8">Tin tức du lịch</h1>
      
      {/* Kiểm tra nếu dữ liệu rỗng */}
      {newsList.length === 0 ? (
        <p className="text-slate-500">Đang tải dữ liệu hoặc chưa có tin tức nào...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsList.map((item: any) => (
            <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
               <img 
                 src={item.thumbnailUrl} 
                 alt={item.title} 
                 className="w-full h-48 object-cover rounded-2xl mb-4" 
                 onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400')}
               />
               <h2 className="text-xl font-bold mb-2 text-slate-800">{item.title}</h2>
               <p className="text-slate-500 text-sm line-clamp-3">{item.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsPage;