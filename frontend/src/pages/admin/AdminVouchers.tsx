import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { 
  Ticket, Search, X, Trash2, Copy, 
  Pencil, Plus, ShieldCheck
} from 'lucide-react';

import { 
  Card, Table, TableHead, TableRow, TableHeaderCell, 
  TableBody, TableCell, Text, Title, Flex, 
  Grid, Metric, ProgressBar
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

  useEffect(() => {
    const mockData: Voucher[] = [
      { id: '1', code: 'XUAN2026', description: 'Giảm giá khai xuân', discountType: 'percentage', discountValue: 15, minOrderValue: 5000000, expiryDate: '2026-05-01', usageLimit: 100, usedCount: 45, status: 'active' },
      { id: '2', code: 'REALESTATE1M', description: 'Ưu đãi đặt cọc', discountType: 'fixed', discountValue: 1000000, minOrderValue: 20000000, expiryDate: '2026-06-15', usageLimit: 50, usedCount: 50, status: 'expired' },
    ];
    setVouchers(mockData);
  }, []);

  const onSubmit = async (data: Voucher) => {
    const loadId = toast.loading(editingVoucher ? "Đang cập nhật..." : "Đang tạo...");
    try {
      if (editingVoucher) {
        setVouchers(prev => prev.map(v => v.id === editingVoucher.id ? { ...v, ...data } : v));
        toast.success("Cập nhật thành công", { id: loadId });
      } else {
        const newVoucher: Voucher = { ...data, id: Date.now().toString(), usedCount: 0, status: 'active' };
        setVouchers(prev => [newVoucher, ...prev]);
        toast.success("Đã thêm mã mới", { id: loadId });
      }
      handleCloseModal();
    } catch (error) {
      toast.error("Thao tác thất bại", { id: loadId });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVoucher(null);
    reset({ code: '', description: '', discountType: 'percentage', discountValue: 0, minOrderValue: 0, expiryDate: '', usageLimit: 100 });
  };

  const filteredVouchers = vouchers.filter(v => 
    v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 px-4 pt-6 animate-in fade-in duration-500">
      
      {/* TOOLBAR & STATS */}
      <Grid numItemsMd={2} numItemsLg={3} className="gap-4">
        <Card className="bg-slate-900 border-slate-800 p-4 rounded-xl lg:col-span-2">
          <Flex justifyContent="between">
            <div>
              <Title className="text-slate-100 font-bold uppercase tracking-tight flex items-center gap-2 text-lg leading-none">
                Hệ thống Voucher <ShieldCheck size={18} className="text-blue-500" />
              </Title>
              <Text className="text-[11px] text-slate-500 font-medium italic mt-1">Quản lý mã giảm giá và khuyến mãi</Text>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-[11px] uppercase transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95"
            >
              <Plus size={14}/> Tạo mới
            </button>
          </Flex>
          <div className="mt-4 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={15} />
            <input 
              type="text"
              placeholder="Tìm kiếm mã hoặc nội dung..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-9 pr-4 text-[11px] text-slate-200 focus:border-blue-500/50 outline-none transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-4 rounded-xl flex flex-col justify-center">
          <Text className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hiệu suất sử dụng</Text>
          <Metric className="text-white font-black text-xl mt-1">1,284 lượt</Metric>
          <ProgressBar value={75} color="blue" className="mt-3 h-1.5" />
          <Text className="text-[9px] text-slate-600 mt-2 font-bold uppercase tracking-tighter">Đã dùng 75% hạn mức</Text>
        </Card>
      </Grid>

      {/* TABLE */}
      <Card className="bg-slate-900 border-slate-800 rounded-xl p-0 overflow-hidden shadow-2xl">
        <Table>
          <TableHead className="bg-slate-950/60">
            <TableRow>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500 p-5">Mã / Chương trình</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500">Ưu đãi</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500">Sử dụng</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500 text-center">Trạng thái</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500 text-right">Thao tác</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVouchers.map((v) => (
              <TableRow key={v.id} className="hover:bg-slate-800/40 transition-colors border-b border-slate-800/50 group">
                <TableCell className="p-4">
                  <Flex justifyContent="start" className="gap-3">
                    <div className="size-9 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 text-blue-500 shrink-0 group-hover:border-blue-500/30 transition-all shadow-sm">
                      <Ticket size={18} />
                    </div>
                    <div>
                      <Flex justifyContent="start" className="gap-2 mb-0.5">
                        <Text className="font-bold text-slate-100 uppercase text-[11px] leading-tight">{v.code}</Text>
                        <button onClick={() => {navigator.clipboard.writeText(v.code); toast.success("Đã copy mã");}} className="text-slate-600 hover:text-blue-500 transition-colors"><Copy size={10}/></button>
                      </Flex>
                      <Text className="text-[10px] text-slate-500 truncate max-w-36">{v.description}</Text>
                    </div>
                  </Flex>
                </TableCell>
                <TableCell>
                  <Text className="font-bold text-emerald-400 text-[12px] italic">
                    {v.discountType === 'percentage' ? `${v.discountValue}%` : `${v.discountValue.toLocaleString()}₫`}
                  </Text>
                  <Text className="text-[9px] text-slate-600 uppercase font-medium">Đơn ≥ {v.minOrderValue.toLocaleString()}₫</Text>
                </TableCell>
                <TableCell>
                  <div className="w-24">
                    <Flex className="mb-1">
                      <Text className="text-[9px] font-bold text-slate-400">{v.usedCount}/{v.usageLimit}</Text>
                      <Text className="text-[9px] font-bold text-slate-600">{Math.round((v.usedCount/v.usageLimit)*100)}%</Text>
                    </Flex>
                    <ProgressBar value={(v.usedCount/v.usageLimit)*100} color={v.usedCount >= v.usageLimit ? "rose" : "blue"} className="h-1" />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                    v.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                  }`}>
                    <span className={`size-1 rounded-full mr-1.5 ${v.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                    {v.status === 'active' ? 'Hoạt động' : 'Hết hạn'}
                  </span>
                </TableCell>
                <TableCell className="text-right p-4">
                  <Flex justifyContent="end" className="gap-1">
                    <button onClick={() => { setEditingVoucher(v); reset(v); setIsModalOpen(true); }} className="p-2 text-slate-500 hover:bg-slate-700 hover:text-white rounded-lg transition-all"><Pencil size={16}/></button>
                    <button onClick={() => { if(window.confirm("Xóa mã này khỏi hệ thống?")) setVouchers(prev => prev.filter(item => item.id !== v.id)); }} className="p-2 text-rose-500/70 hover:bg-rose-500/10 hover:text-rose-500 rounded-lg transition-all"><Trash2 size={16}/></button>
                  </Flex>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredVouchers.length === 0 && (
          <div className="p-16 text-center text-slate-500 font-bold uppercase text-[10px] tracking-widest opacity-40">
            Không tìm thấy mã giảm giá
          </div>
        )}
      </Card>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="bg-slate-900 border-slate-800 w-full max-w-lg p-0 rounded-xl overflow-hidden shadow-3xl animate-in zoom-in-95 duration-200">
            <Flex className="bg-slate-950 px-6 py-4 border-b border-slate-800" justifyContent="between">
              <Text className="text-white font-bold uppercase text-[11px] tracking-widest leading-none">
                {editingVoucher ? "Hiệu chỉnh tham số" : "Thiết lập Voucher mới"}
              </Text>
              <button onClick={handleCloseModal} className="text-slate-500 hover:text-rose-500 transition-colors"><X size={18}/></button>
            </Flex>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Mã định danh</label>
                  <input {...register('code')} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-[11px] font-mono text-blue-500 font-bold uppercase outline-none focus:border-blue-500/50 transition-all" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Ngày hết hạn</label>
                  <input {...register('expiryDate')} type="date" className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-[11px] text-white outline-none focus:border-blue-500/50 transition-all" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Mô tả chương trình</label>
                <input {...register('description')} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-[11px] text-slate-200 outline-none focus:border-blue-500/50 transition-all" placeholder="Nhập tên hiển thị..." required />
              </div>

              <div className="bg-slate-950/50 p-5 rounded-lg border border-slate-800 grid grid-cols-2 gap-x-6 gap-y-4 shadow-inner">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Loại ưu đãi</label>
                  <select {...register('discountType')} className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-2 text-[11px] text-white outline-none focus:border-blue-500/50">
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="fixed">Số tiền (₫)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Giá trị giảm</label>
                  <input {...register('discountValue')} type="number" className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-[11px] text-orange-500 font-bold outline-none" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Đơn tối thiểu</label>
                  <input {...register('minOrderValue')} type="number" className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-[11px] text-white outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Giới hạn mã</label>
                  <input {...register('usageLimit')} type="number" className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-[11px] text-white outline-none" />
                </div>
              </div>

              <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all shadow-lg shadow-blue-900/30 active:scale-[0.98]">
                {editingVoucher ? "Xác nhận cập nhật" : "Phát hành Voucher"}
              </button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminVouchers;