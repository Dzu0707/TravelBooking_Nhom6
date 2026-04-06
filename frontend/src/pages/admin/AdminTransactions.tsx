import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { 
  CreditCard, Search, Download, 
  CheckCircle2, Clock, AlertCircle,
  Eye, Filter, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';

import { 
  Card, Table, TableHead, TableRow, TableHeaderCell, 
  TableBody, TableCell, Text, Title, Badge, Flex, 
  Grid, Metric, TextInput, Select, SelectItem
} from '@tremor/react';

interface Transaction {
  id: string;
  orderCode: string;
  customerName: string;
  amount: number;
  method: 'VNPAY' | 'Transfer' | 'Cash';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  createdAt: string;
}

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Giả lập dữ liệu giao dịch từ hệ thống
    const mockData: Transaction[] = [
      { id: 'TX1', orderCode: 'TOUR-HL-99', customerName: 'Nguyễn Văn A', amount: 15500000, method: 'VNPAY', status: 'completed', createdAt: '2026-04-05T10:30:00' },
      { id: 'TX2', orderCode: 'TOUR-DN-45', customerName: 'Trần Thị B', amount: 8200000, method: 'Transfer', status: 'pending', createdAt: '2026-04-06T08:15:00' },
      { id: 'TX3', orderCode: 'TOUR-PQ-12', customerName: 'Lê Minh C', amount: 12000000, method: 'Cash', status: 'failed', createdAt: '2026-04-04T14:20:00' },
      { id: 'TX4', orderCode: 'TOUR-DL-07', customerName: 'Phạm Hoàng D', amount: 5400000, method: 'VNPAY', status: 'refunded', createdAt: '2026-04-03T09:00:00' },
    ];
    setTransactions(mockData);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge color="emerald" icon={CheckCircle2} size="xs" className="font-black uppercase italic">Thành công</Badge>;
      case 'pending': return <Badge color="amber" icon={Clock} size="xs" className="font-black uppercase italic">Chờ xử lý</Badge>;
      case 'failed': return <Badge color="rose" icon={AlertCircle} size="xs" className="font-black uppercase italic">Thất bại</Badge>;
      case 'refunded': return <Badge color="slate" icon={ArrowDownLeft} size="xs" className="font-black uppercase italic">Hoàn tiền</Badge>;
      default: return null;
    }
  };

  const filteredData = transactions.filter(t => {
    const matchSearch = t.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        t.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const exportData = () => {
    toast.success("Đang xuất báo cáo tài chính tháng 4/2026...");
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-950 min-h-screen">
      
      {/* THỐNG KÊ NHANH */}
      <Grid numItemsLg={3} className="gap-6">
        <Card className="bg-slate-900/40 border-slate-800 rounded-3xl p-6 backdrop-blur-xl ring-1 ring-white/5">
          <Text className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Doanh thu ròng (Tháng 4)</Text>
          <Flex justifyContent="start" alignItems="baseline" className="gap-2 mt-2">
            <Metric className="text-white font-black italic">42,500,000₫</Metric>
            <Badge color="emerald" size="xs" className="font-black italic">+12%</Badge>
          </Flex>
          <Text className="text-[9px] text-slate-600 mt-4 font-bold uppercase italic tracking-tighter flex items-center gap-1">
            <ArrowUpRight size={10}/> Tăng trưởng so với tháng trước
          </Text>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800 rounded-3xl p-6 backdrop-blur-xl ring-1 ring-white/5">
          <Text className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Giao dịch chờ duyệt</Text>
          <Metric className="text-amber-500 font-black italic mt-2">08</Metric>
          <Text className="text-[9px] text-slate-600 mt-4 font-bold uppercase italic tracking-tighter">Cần kiểm tra sao kê ngân hàng</Text>
        </Card>

        <Card className="bg-blue-600 border-none rounded-3xl p-6 shadow-xl shadow-blue-900/20 flex flex-col justify-between">
          <div>
             <Text className="text-blue-100 font-black uppercase text-[10px] tracking-widest">Hỗ trợ đối soát</Text>
             <Title className="text-white font-black uppercase mt-1 tracking-tighter">Xuất dữ liệu Excel</Title>
          </div>
          <button 
            onClick={exportData}
            className="w-full bg-white text-blue-600 py-3 rounded-2xl font-black text-[10px] uppercase transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Download size={14}/> Tải báo cáo giao dịch
          </button>
        </Card>
      </Grid>

      {/* FILTER BAR */}
      <Card className="bg-slate-900/40 border-slate-800 rounded-4xl p-6 backdrop-blur-md">
        <Flex className="gap-4 flex-col md:flex-row">
          <div className="flex-1">
            <TextInput 
              icon={Search} 
              placeholder="Tìm theo Mã đơn, Tên khách hàng..." 
              className="bg-slate-950 border-slate-800"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <Select 
              icon={Filter} 
              placeholder="Trạng thái..." 
              onValueChange={setStatusFilter} 
              className="bg-slate-950"
            >
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="completed">Thành công</SelectItem>
              <SelectItem value="pending">Đang xử lý</SelectItem>
              <SelectItem value="failed">Thất bại</SelectItem>
              <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
            </Select>
          </div>
        </Flex>
      </Card>

      {/* TRANSACTION TABLE */}
      <Card className="bg-slate-900/40 border-slate-800 rounded-4xl p-0 overflow-hidden shadow-2xl backdrop-blur-md">
        <Table>
          <TableHead className="bg-slate-950/50">
            <TableRow>
              <TableHeaderCell className="text-[10px] font-black uppercase tracking-widest text-slate-500 p-6">Mã giao dịch / Đơn hàng</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-black uppercase tracking-widest text-slate-500">Khách hàng</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Số tiền</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-black uppercase tracking-widest text-slate-500">Hình thức</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-black uppercase tracking-widest text-slate-500">Trạng thái</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Chi tiết</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((t) => (
              <TableRow key={t.id} className="hover:bg-blue-500/5 transition-colors group border-b border-slate-800/50">
                <TableCell className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-950 rounded-xl text-blue-500 border border-slate-800">
                      <CreditCard size={16}/>
                    </div>
                    <div>
                      <Text className="text-white font-black text-xs uppercase italic">{t.orderCode}</Text>
                      <Text className="text-[9px] text-slate-600 font-bold uppercase">{format(new Date(t.createdAt), 'HH:mm - dd/MM/yyyy')}</Text>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Text className="font-black text-white text-xs uppercase">{t.customerName}</Text>
                  <Text className="text-[9px] text-slate-500 font-bold italic tracking-tighter">ID: {t.id}</Text>
                </TableCell>
                <TableCell className="text-right">
                  <Text className="font-black text-white text-sm italic tracking-tighter">
                    {t.amount.toLocaleString()}₫
                  </Text>
                </TableCell>
                <TableCell>
                  <Badge color="slate" size="xs" className="font-black uppercase italic bg-slate-950 border-slate-800">
                    {t.method}
                  </Badge>
                </TableCell>
                <TableCell>
                  {getStatusBadge(t.status)}
                </TableCell>
                <TableCell>
                  <Flex justifyContent="center">
                    <button 
                      onClick={() => toast(`Xem chi tiết đơn ${t.orderCode}`)}
                      className="p-2.5 bg-slate-950 rounded-xl hover:text-blue-500 transition-all border border-slate-800 hover:border-blue-500/50 active:scale-90"
                    >
                      <Eye size={16}/>
                    </button>
                  </Flex>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredData.length === 0 && (
          <div className="p-20 text-center">
            <Text className="font-black text-slate-700 uppercase tracking-[0.3em]">Không tìm thấy dữ liệu giao dịch</Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminTransactions;