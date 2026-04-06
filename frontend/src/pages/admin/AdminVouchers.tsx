import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { 
  Ticket, Search, X, 
  CircleDollarSign, 
  Trash2, Copy, CheckCircle2, AlertCircle,
  Pencil, Plus
} from 'lucide-react';

import { 
  Card, Table, TableHead, TableRow, TableHeaderCell, 
  TableBody, TableCell, Text, Title, Badge, Flex, 
  Grid, Metric, ProgressBar, TextInput
} from '@tremor/react';

interface Voucher {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  status: 'active' | 'expired' | 'disabled';
}

const AdminVouchers = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);

  const { register, handleSubmit, reset } = useForm<Voucher>();

  // 1. READ: Lấy dữ liệu
  useEffect(() => {
    const mockData: Voucher[] = [
      { id: '1', code: 'XUAN2026', description: 'Giảm giá khai xuân', discountType: 'percentage', discountValue: 15, minOrderValue: 5000000, expiryDate: '2026-05-01', usageLimit: 100, usedCount: 45, status: 'active' },
      { id: '2', code: 'REALESTATE1M', description: 'Ưu đãi đặt cọc', discountType: 'fixed', discountValue: 1000000, minOrderValue: 20000000, expiryDate: '2026-06-15', usageLimit: 50, usedCount: 50, status: 'expired' },
    ];
    setVouchers(mockData);
  }, []);

  // 2. CREATE & UPDATE: Xử lý lưu dữ liệu
  const onSubmit = async (data: Voucher) => {
    const loadId = toast.loading(editingVoucher ? "Đang cập nhật..." : "Đang tạo mã...");
    try {
      if (editingVoucher) {
        // Update logic
        setVouchers(prev => prev.map(v => v.id === editingVoucher.id ? { ...v, ...data } : v));
        toast.success("Cập nhật thành công!", { id: loadId });
      } else {
        // Create logic
        const newVoucher: Voucher = {
          ...data,
          id: Math.random().toString(36).substr(2, 9),
          usedCount: 0,
          status: 'active'
        };
        setVouchers(prev => [newVoucher, ...prev]);
        toast.success("Đã thêm mã mới!", { id: loadId });
      }
      handleCloseModal();
    } catch (error) {
      toast.error("Thao tác thất bại", { id: loadId });
    }
  };

  // 3. DELETE: Xóa voucher
  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này không?")) {
      setVouchers(prev => prev.filter(v => v.id !== id));
      toast.success("Đã xóa voucher khỏi hệ thống");
    }
  };

  const handleEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    reset(voucher);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVoucher(null);
    reset({
        code: '', description: '', discountType: 'percentage', 
        discountValue: 0, minOrderValue: 0, expiryDate: '', usageLimit: 100
    });
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Đã copy mã: ${code}`);
  };

  const filteredVouchers = vouchers.filter(v => 
    v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-950 min-h-screen">
      
      {/* HEADER & STATS */}
      <Grid numItemsLg={3} className="gap-6">
        <Card className="bg-slate-900/40 border-slate-800 rounded-3xl p-6 backdrop-blur-xl lg:col-span-2">
          <Flex justifyContent="between" alignItems="center">
            <div>
              <Title className="text-white font-black uppercase tracking-tighter flex items-center gap-3">
                Hệ thống Voucher <Ticket size={20} className="text-blue-500" />
              </Title>
              <Text className="text-[10px] text-slate-500 font-black uppercase mt-1 italic">Quản lý tiếp thị bất động sản & du lịch</Text>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
            >
              <Plus size={14}/> Tạo mã mới
            </button>
          </Flex>
          
          <div className="mt-8">
             <TextInput 
               icon={Search} 
               placeholder="Tìm kiếm mã hoặc mô tả..." 
               className="bg-slate-950 border-slate-800"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </Card>

        <Card className="bg-blue-600 border-none rounded-3xl p-6 flex flex-col justify-between shadow-xl shadow-blue-900/20">
          <Text className="text-blue-100 font-black uppercase text-[10px] tracking-widest">Tổng lượt sử dụng</Text>
          <Metric className="text-white font-black">1,284</Metric>
          <ProgressBar value={75} color="slate" className="mt-4" />
          <Text className="text-blue-200 text-[9px] mt-2 font-bold uppercase italic tracking-tighter">Hiệu suất chiến dịch đạt 75% hạn mức</Text>
        </Card>
      </Grid>

      {/* TABLE LIST */}
      <Card className="bg-slate-900/40 border-slate-800 rounded-4xl p-0 overflow-hidden shadow-2xl backdrop-blur-md">
        <Table>
          <TableHead className="bg-slate-950/50">
            <TableRow>
              <TableHeaderCell className="text-[10px] font-black uppercase tracking-widest text-slate-500 p-6">Mã / Chương trình</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-black uppercase tracking-widest text-slate-500">Giá trị giảm</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tiến độ sử dụng</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-black uppercase tracking-widest text-slate-500">Trạng thái</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Hành động</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVouchers.map((v) => (
              <TableRow key={v.id} className="hover:bg-blue-500/5 transition-colors group border-b border-slate-800/50">
                <TableCell className="p-6">
                  <Flex justifyContent="start" className="gap-4">
                    <div className="size-10 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 text-blue-500">
                      <Ticket size={20} />
                    </div>
                    <div>
                      <Flex justifyContent="start" className="gap-2">
                        <Text className="font-black text-white uppercase text-sm">{v.code}</Text>
                        <button onClick={() => copyToClipboard(v.code)} className="text-slate-600 hover:text-blue-500 transition-colors"><Copy size={12}/></button>
                      </Flex>
                      <Text className="text-[10px] text-slate-500 font-bold uppercase">{v.description}</Text>
                    </div>
                  </Flex>
                </TableCell>
                <TableCell>
                  <Text className="font-black text-white italic">
                    {v.discountType === 'percentage' ? `${v.discountValue}%` : `${v.discountValue.toLocaleString()}₫`}
                  </Text>
                  <Text className="text-[9px] text-slate-600 font-black uppercase tracking-tighter">Đơn từ: {v.minOrderValue.toLocaleString()}₫</Text>
                </TableCell>
                <TableCell>
                  <div className="w-28">
                    <Flex className="mb-1">
                      <Text className="text-[9px] font-black text-slate-400">{v.usedCount}/{v.usageLimit}</Text>
                      <Text className="text-[9px] font-black text-slate-600">{Math.round((v.usedCount/v.usageLimit)*100)}%</Text>
                    </Flex>
                    <ProgressBar value={(v.usedCount/v.usageLimit)*100} color={v.usedCount >= v.usageLimit ? "rose" : "blue"} />
                  </div>
                </TableCell>
                <TableCell>
                   <Badge color={v.status === 'active' ? 'emerald' : 'rose'} size="xs" className="font-black uppercase italic">
                     {v.status === 'active' ? <CheckCircle2 size={10} className="mr-1 inline" /> : <AlertCircle size={10} className="mr-1 inline" />}
                     Hết hạn: {format(new Date(v.expiryDate), 'dd/MM/yyyy', { locale: vi })}
                   </Badge>
                </TableCell>
                <TableCell>
                  <Flex justifyContent="center" className="gap-2">
                    <button onClick={() => handleEdit(v)} className="p-2.5 bg-slate-950 rounded-xl hover:text-amber-500 transition-colors border border-slate-800"><Pencil size={16}/></button>
                    <button onClick={() => handleDelete(v.id)} className="p-2.5 bg-slate-950 rounded-xl hover:text-rose-500 transition-colors border border-slate-800"><Trash2 size={16}/></button>
                  </Flex>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <Card className="bg-slate-900 border-slate-800 w-full max-w-2xl p-0 flex flex-col rounded-5xl shadow-3xl overflow-hidden">
            <Flex className="bg-slate-950 px-8 py-6 border-b border-slate-800" justifyContent="between">
              <Title className="text-white font-black uppercase text-sm tracking-widest">
                {editingVoucher ? "Hiệu chỉnh Voucher" : "Cấu hình Voucher mới"}
              </Title>
              <button onClick={handleCloseModal} className="p-2 text-slate-500 hover:text-rose-500"><X/></button>
            </Flex>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 bg-slate-900/50">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mã định danh</label>
                  <input {...register('code')} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-blue-500 font-black uppercase" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ngày hết hạn</label>
                  <input {...register('expiryDate')} type="date" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-black text-white" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mô tả hiển thị</label>
                <input {...register('description')} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-bold text-white" placeholder="Tên chương trình..." required />
              </div>

              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-2"><CircleDollarSign size={14}/> Loại giảm giá</label>
                      <select {...register('discountType')} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-black text-white">
                        <option value="percentage">Phần trăm (%)</option>
                        <option value="fixed">Số tiền cố định (₫)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-blue-500 uppercase">Giá trị</label>
                      <input {...register('discountValue')} type="number" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-black text-orange-500" required />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase">Đơn tối thiểu</label>
                      <input {...register('minOrderValue')} type="number" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-black text-white" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase">Hạn mức (lần)</label>
                      <input {...register('usageLimit')} type="number" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-black text-white" />
                    </div>
                 </div>
              </div>

              <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 active:scale-95 transition-all">
                {editingVoucher ? "Lưu thay đổi hệ thống" : "Phát hành voucher"}
              </button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminVouchers;