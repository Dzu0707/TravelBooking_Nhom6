import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { 
  Star, Search, CheckCircle, XCircle, 
  Trash2, User, MapPin, Quote,
  MessageSquare
} from 'lucide-react';

import { 
  Card, Table, TableHead, TableRow, TableHeaderCell, 
  TableBody, TableCell, Text, Flex, 
  Grid, Metric
} from '@tremor/react';

interface Review {
  id: string;
  userName: string;
  projectName: string;
  rating: number;
  comment: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const mockData: Review[] = [
      { id: 'R1', userName: 'Nguyễn Minh Tâm', projectName: 'LA Home Central Park', rating: 5, comment: 'Dự án có tiến độ thi công rất nhanh, môi trường sống xanh đúng như cam kết.', status: 'approved', createdAt: '2026-04-01T10:00:00' },
      { id: 'R2', userName: 'Hoàng Thùy Linh', projectName: 'Tour Hạ Long 3N2Đ', rating: 4, comment: 'Hướng dẫn viên nhiệt tình nhưng đồ ăn trên tàu hơi ít.', status: 'pending', createdAt: '2026-04-02T15:30:00' },
      { id: 'R3', userName: 'David Nguyen', projectName: 'Angsana By Kita', rating: 2, comment: 'Thủ tục giấy tờ hơi chậm, cần cải thiện khâu chăm sóc khách hàng.', status: 'rejected', createdAt: '2026-03-28T09:15:00' },
    ];
    setReviews(mockData);
  }, []);

  const handleStatusChange = (id: string, newStatus: 'approved' | 'rejected') => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    toast.success(`Đã ${newStatus === 'approved' ? 'duyệt' : 'từ chối'} đánh giá`);
  };

  const renderStars = (count: number) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={10} fill={i < count ? "#EAB308" : "none"} className={i < count ? "text-yellow-500" : "text-slate-700"} />
      ))}
    </div>
  );

  const filteredReviews = reviews.filter(r => {
    const matchSearch = r.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        r.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 px-4 pt-6 animate-in fade-in duration-500">
      
      {/* STATS */}
      <Grid numItemsMd={2} numItemsLg={3} className="gap-4">
        <Card className="bg-slate-900 border-slate-800 p-4 rounded-xl">
          <Text className="text-[10px] text-slate-500 font-bold uppercase">Xếp hạng trung bình</Text>
          <Flex justifyContent="start" alignItems="baseline" className="gap-2 mt-1">
            <Metric className="text-white font-black text-xl">4.8</Metric>
            <div className="flex mb-1">{renderStars(5)}</div>
          </Flex>
          <Text className="text-[9px] text-emerald-500 font-bold mt-2 italic uppercase">+0.2 so với tháng trước</Text>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-4 rounded-xl border-l-4 border-l-amber-500">
          <Text className="text-[10px] text-slate-500 font-bold uppercase">Chờ kiểm duyệt</Text>
          <Metric className="text-amber-500 font-black text-xl mt-1">12</Metric>
          <Text className="text-[9px] text-slate-600 font-bold mt-2 uppercase italic tracking-tighter">Cần xử lý ngay</Text>
        </Card>

        <Card className="bg-blue-600 border-none p-4 rounded-xl flex flex-col justify-between shadow-lg shadow-blue-900/20">
          <Text className="text-blue-100 font-bold uppercase text-[10px]">Phản hồi cộng đồng</Text>
          <Flex justifyContent="start" className="mt-2 -space-x-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="size-7 rounded-full border-2 border-blue-600 bg-slate-800 flex items-center justify-center text-[10px] text-white font-bold">
                <User size={12}/>
              </div>
            ))}
            <div className="size-7 rounded-full border-2 border-blue-600 bg-blue-400 flex items-center justify-center text-[8px] text-blue-900 font-black">+99</div>
          </Flex>
          <Text className="text-white text-[9px] font-black uppercase mt-2 flex items-center gap-2">
            <MessageSquare size={12}/> 85% khách hàng hài lòng
          </Text>
        </Card>
      </Grid>

      {/* FILTER BAR */}
      <Card className="bg-slate-900 border-slate-800 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={15} />
            <input 
              type="text"
              placeholder="Tìm khách hàng, dự án, nội dung..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-[11px] text-slate-200 outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            {['all', 'approved', 'pending', 'rejected'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-md text-[9px] font-black transition-all uppercase tracking-tighter ${
                  filterStatus === s ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {s === 'all' ? 'Tất cả' : s === 'approved' ? 'Đã duyệt' : s === 'pending' ? 'Chờ' : 'Đã ẩn'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* TABLE */}
      <Card className="bg-slate-900 border-slate-800 rounded-xl p-0 overflow-hidden shadow-2xl">
        <Table>
          <TableHead className="bg-slate-950/60">
            <TableRow>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500 p-5">Khách hàng / Mục tiêu</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500">Đánh giá nội dung</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500 text-center">Trạng thái</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500 text-right">Thao tác</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReviews.map((r) => (
              <TableRow key={r.id} className="hover:bg-slate-800/40 transition-colors border-b border-slate-800/50 group">
                <TableCell className="p-4">
                  <Flex justifyContent="start" className="gap-3">
                    <div className="size-9 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-500 shrink-0">
                      <User size={18} />
                    </div>
                    <div>
                      <Text className="font-bold text-slate-100 text-[11px] uppercase leading-tight">{r.userName}</Text>
                      <Text className="text-[9px] text-blue-500 font-bold flex items-center gap-1 uppercase mt-0.5">
                        <MapPin size={10}/> {r.projectName}
                      </Text>
                    </div>
                  </Flex>
                </TableCell>
                
                <TableCell className="max-w-xs">
                  <div className="flex gap-2">
                    <Quote size={10} className="text-slate-700 shrink-0 mt-1"/>
                    <div>
                      <Text className="text-[11px] text-slate-300 italic line-clamp-2 leading-relaxed">"{r.comment}"</Text>
                      <div className="flex items-center gap-3 mt-2">
                        {renderStars(r.rating)}
                        <Text className="text-[9px] text-slate-600 font-bold uppercase">{format(new Date(r.createdAt), 'dd/MM/yyyy HH:mm')}</Text>
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                    r.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                    r.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                    'bg-rose-500/10 text-rose-500 border-rose-500/20'
                  }`}>
                    <span className={`size-1 rounded-full mr-1.5 ${
                      r.status === 'approved' ? 'bg-emerald-500' : 
                      r.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'
                    }`} />
                    {r.status === 'approved' ? 'Đã duyệt' : r.status === 'pending' ? 'Đang chờ' : 'Đã ẩn'}
                  </span>
                </TableCell>

                <TableCell className="text-right p-4">
                  <Flex justifyContent="end" className="gap-1">
                    {r.status !== 'approved' && (
                      <button onClick={() => handleStatusChange(r.id, 'approved')} className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all" title="Duyệt hiển thị">
                        <CheckCircle size={18}/>
                      </button>
                    )}
                    {r.status !== 'rejected' && (
                      <button onClick={() => handleStatusChange(r.id, 'rejected')} className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all" title="Ẩn đánh giá">
                        <XCircle size={18}/>
                      </button>
                    )}
                    <button onClick={() => { if(window.confirm("Xóa vĩnh viễn?")) setReviews(prev => prev.filter(item => item.id !== r.id)); }} className="p-2 text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all">
                      <Trash2 size={18}/>
                    </button>
                  </Flex>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredReviews.length === 0 && (
          <div className="p-16 text-center text-slate-500 font-bold uppercase text-[10px] tracking-widest opacity-40">
            Không có đánh giá nào được tìm thấy
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminReviews;