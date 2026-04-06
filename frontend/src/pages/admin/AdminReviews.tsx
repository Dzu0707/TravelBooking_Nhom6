import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { 
  Star, Search, CheckCircle, XCircle, 
  MessageSquare, Trash2, Filter, 
  User, MapPin, Quote
} from 'lucide-react';

import { 
  Card, Table, TableHead, TableRow, TableHeaderCell, 
  TableBody, TableCell, Text, Badge, Flex, 
  Grid, Metric, TextInput, Select, SelectItem
} from '@tremor/react';

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  projectName: string; // Tên Tour hoặc Dự án BĐS
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
    // Giả lập dữ liệu đánh giá từ khách hàng
    const mockData: Review[] = [
      { id: 'R1', userName: 'Nguyễn Minh Tâm', projectName: 'LA Home Central Park', rating: 5, comment: 'Dự án có tiến độ thi công rất nhanh, môi trường sống xanh đúng như cam kết.', status: 'approved', createdAt: '2026-04-01T10:00:00' },
      { id: 'R2', userName: 'Hoàng Thùy Linh', projectName: 'Tour Hạ Long 3N2Đ', rating: 4, comment: 'Hướng dẫn viên nhiệt tình nhưng đồ ăn trên tàu hơi ít.', status: 'pending', createdAt: '2026-04-02T15:30:00' },
      { id: 'R3', userName: 'David Nguyen', projectName: 'Angsana By Kita', rating: 2, comment: 'Thủ tục giấy tờ hơi chậm, cần cải thiện khâu chăm sóc khách hàng.', status: 'rejected', createdAt: '2026-03-28T09:15:00' },
    ];
    setReviews(mockData);
  }, []);

  const handleStatusChange = (id: string, newStatus: 'approved' | 'rejected') => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    toast.success(`Đã ${newStatus === 'approved' ? 'duyệt' : 'từ chối'} đánh giá này`);
  };

  const deleteReview = (id: string) => {
    if (window.confirm("Xóa vĩnh viễn đánh giá này?")) {
      setReviews(prev => prev.filter(r => r.id !== id));
      toast.success("Đã xóa đánh giá");
    }
  };

  const filteredReviews = reviews.filter(r => {
    const matchSearch = r.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        r.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const renderStars = (count: number) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={12} fill={i < count ? "#EAB308" : "none"} className={i < count ? "text-yellow-500" : "text-slate-700"} />
      ))}
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-950 min-h-screen text-slate-200">
      
      {/* THỐNG KÊ REVIEW */}
      <Grid numItemsLg={3} className="gap-6">
        <Card className="bg-slate-900/40 border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
          <Text className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Đánh giá trung bình</Text>
          <div className="flex items-baseline gap-2 mt-2">
            <Metric className="text-white font-black italic">4.8</Metric>
            <div className="flex mb-1">{renderStars(5)}</div>
          </div>
          <Text className="text-[9px] text-emerald-500 mt-4 font-bold uppercase italic tracking-tighter">Tăng 0.2 điểm so với tháng trước</Text>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800 rounded-3xl p-6 backdrop-blur-xl border-l-4 border-l-amber-500">
          <Text className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Đang chờ duyệt</Text>
          <Metric className="text-amber-500 font-black italic mt-2">12</Metric>
          <Text className="text-[9px] text-slate-600 mt-4 font-bold uppercase italic tracking-tighter">Cần kiểm duyệt nội dung mới</Text>
        </Card>

        <Card className="bg-blue-600 border-none rounded-3xl p-6 shadow-xl shadow-blue-900/20 flex flex-col justify-between">
          <Text className="text-blue-100 font-black uppercase text-[10px] tracking-widest">Tương tác khách hàng</Text>
          <div className="flex -space-x-2 mt-2 overflow-hidden">
             {[1,2,3,4,5].map(i => (
               <div key={i} className="h-8 w-8 rounded-full ring-2 ring-blue-600 bg-slate-800 flex items-center justify-center">
                 <User size={14}/>
               </div>
             ))}
          </div>
          <Text className="text-white text-[10px] mt-4 font-black uppercase italic tracking-widest flex items-center gap-2">
            <MessageSquare size={14}/> Phản hồi nhanh ngay nào!
          </Text>
        </Card>
      </Grid>

      {/* SEARCH & FILTER */}
      <Card className="bg-slate-900/40 border-slate-800 rounded-4xl p-6 backdrop-blur-md">
        <Flex className="gap-4 flex-col md:flex-row">
          <div className="flex-1">
            <TextInput 
              icon={Search} 
              placeholder="Tìm theo tên khách, dự án, tour..." 
              className="bg-slate-950 border-slate-800"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <Select icon={Filter} placeholder="Trạng thái..." onValueChange={setFilterStatus} className="bg-slate-950">
              <SelectItem value="all">Tất cả đánh giá</SelectItem>
              <SelectItem value="approved">Đã duyệt</SelectItem>
              <SelectItem value="pending">Chờ xử lý</SelectItem>
              <SelectItem value="rejected">Đã ẩn</SelectItem>
            </Select>
          </div>
        </Flex>
      </Card>

      {/* REVIEW LIST */}
      <Card className="bg-slate-900/40 border-slate-800 rounded-4xl p-0 overflow-hidden shadow-2xl backdrop-blur-md">
        <Table>
          <TableHead className="bg-slate-950/50">
            <TableRow>
              <TableHeaderCell className="text-[10px] font-black uppercase tracking-widest text-slate-500 p-6">Khách hàng / Dự án</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nội dung đánh giá</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-black uppercase tracking-widest text-slate-500">Xếp hạng</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-black uppercase tracking-widest text-slate-500">Trạng thái</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Hành động</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReviews.map((r) => (
              <TableRow key={r.id} className="hover:bg-blue-500/5 transition-colors group border-b border-slate-800/50">
                <TableCell className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-slate-950 flex items-center justify-center border border-slate-800 text-slate-500">
                      <User size={20}/>
                    </div>
                    <div>
                      <Text className="text-white font-black text-xs uppercase italic">{r.userName}</Text>
                      <Text className="text-[9px] text-blue-500 font-bold uppercase flex items-center gap-1 mt-1">
                        <MapPin size={10}/> {r.projectName}
                      </Text>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="flex gap-2">
                    <Quote size={12} className="text-slate-700 mt-1"/>
                    <Text className="text-[11px] text-slate-400 italic line-clamp-2">"{r.comment}"</Text>
                  </div>
                  <Text className="text-[9px] text-slate-600 font-bold uppercase mt-2">{format(new Date(r.createdAt), 'dd/MM/yyyy HH:mm')}</Text>
                </TableCell>
                <TableCell>
                  {renderStars(r.rating)}
                  <Text className="text-[9px] font-black text-slate-500 mt-1 uppercase italic">{r.rating}/5 Điểm</Text>
                </TableCell>
                <TableCell>
                   {r.status === 'approved' && <Badge color="emerald" icon={CheckCircle} size="xs" className="font-black uppercase italic">Hiển thị</Badge>}
                   {r.status === 'pending' && <Badge color="amber" icon={Filter} size="xs" className="font-black uppercase italic">Chờ duyệt</Badge>}
                   {r.status === 'rejected' && <Badge color="rose" icon={XCircle} size="xs" className="font-black uppercase italic">Đã ẩn</Badge>}
                </TableCell>
                <TableCell>
                  <Flex justifyContent="center" className="gap-2">
                    {r.status !== 'approved' && (
                      <button onClick={() => handleStatusChange(r.id, 'approved')} className="p-2.5 bg-slate-950 rounded-xl hover:text-emerald-500 transition-all border border-slate-800"><CheckCircle size={16}/></button>
                    )}
                    {r.status !== 'rejected' && (
                      <button onClick={() => handleStatusChange(r.id, 'rejected')} className="p-2.5 bg-slate-950 rounded-xl hover:text-orange-500 transition-all border border-slate-800"><XCircle size={16}/></button>
                    )}
                    <button onClick={() => deleteReview(r.id)} className="p-2.5 bg-slate-950 rounded-xl hover:text-rose-500 transition-all border border-slate-800"><Trash2 size={16}/></button>
                  </Flex>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminReviews;