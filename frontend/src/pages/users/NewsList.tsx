<<<<<<< HEAD
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react'; // 1. Import thêm Icon

const API_BASE = 'http://localhost:5091/api/news';

const NewsList = () => {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/categories`)
      .then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    axios.get(API_BASE, {
      params: { keyword: keyword, categoryId: selectedCategory || null }
    })
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  }, [keyword, selectedCategory]);

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-8 space-y-6">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Tin tức du lịch</h1>
        
        {/* KHU VỰC TÌM KIẾM ĐÃ CẬP NHẬT */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-1 gap-2">
            <input
              type="text"
              placeholder="Tìm kiếm tin tức..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            {/* NÚT TÌM KIẾM MÀU XANH */}
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl transition-all flex items-center justify-center">
              <Search size={20} />
            </button>
          </div>
          
          <select
            className="px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white md:w-48"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-sm font-bold uppercase text-slate-400 animate-pulse">Đang tải dữ liệu...</div>
      ) : items.length === 0 ? (
        <p className="text-slate-500 italic">Không tìm thấy tin tức nào khớp với yêu cầu.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <Link key={item.id} to={`/news/${item.slug}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
              {item.thumbnailUrl && (
                <img src={item.thumbnailUrl} alt={item.title} className="h-56 w-full object-cover group-hover:scale-105 transition-transform" />
              )}
              <div className="space-y-3 p-6">
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">{item.category}</div>
                <h2 className="text-2xl font-bold text-slate-900">{item.title}</h2>
                <p className="line-clamp-3 text-sm text-slate-600">{item.summary}</p>
              </div>
            </Link>
=======
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
>>>>>>> 9fcc8939d677855e115e5ea79c439a0f496ca9fa
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsList;