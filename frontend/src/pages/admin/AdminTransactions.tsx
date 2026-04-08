import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { 
  CreditCard, Search, Download, 
  Clock, Eye
} from 'lucide-react';

import { 
  Card, Table, TableHead, TableRow, TableHeaderCell, 
  TableBody, TableCell, Text, Title, Flex, 
  Grid, Metric
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
    const mockData: Transaction[] = [
      { id: 'TX1', orderCode: 'TOUR-HL-99', customerName: 'Nguyễn Văn A', amount: 15500000, method: 'VNPAY', status: 'completed', createdAt: '2026-04-05T10:30:00' },
      { id: 'TX2', orderCode: 'TOUR-DN-45', customerName: 'Trần Thị B', amount: 8200000, method: 'Transfer', status: 'pending', createdAt: '2026-04-06T08:15:00' },
      { id: 'TX3', orderCode: 'TOUR-PQ-12', customerName: 'Lê Minh C', amount: 12000000, method: 'Cash', status: 'failed', createdAt: '2026-04-04T14:20:00' },
      { id: 'TX4', orderCode: 'TOUR-DL-07', customerName: 'Phạm Hoàng D', amount: 5400000, method: 'VNPAY', status: 'refunded', createdAt: '2026-04-03T09:00:00' },
    ];
    setTransactions(mockData);
  }, []);

  const renderStatus = (status: string) => {
    const configs: any = {
      completed: { label: 'Thành công', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
      pending: { label: 'Chờ xử lý', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-500' },
      failed: { label: 'Thất bại', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', dot: 'bg-rose-500' },
      refunded: { label: 'Hoàn tiền', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', dot: 'bg-slate-400' },
    };
    const c = configs[status] || configs.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${c.bg} ${c.color} ${c.border}`}>
        <span className={`size-1 rounded-full mr-1.5 ${c.dot}`} />
        {c.label}
      </span>
    );
  };

  const filteredData = transactions.filter(t => {
    const matchSearch = t.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        t.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 px-4 pt-6 animate-in fade-in duration-500">
      
      {/* STATS */}
      <Grid numItemsMd={2} numItemsLg={3} className="gap-4">
        <Card className="bg-slate-900 border-slate-800 p-4 rounded-xl shadow-sm">
          <Text className="text-[10px] text-slate-500 font-bold uppercase">Doanh thu ròng</Text>
          <Flex justifyContent="start" alignItems="baseline" className="gap-2">
            <Metric className="text-white font-black text-xl">42,500,000₫</Metric>
            <span className="text-[10px] text-emerald-500 font-bold">+12%</span>
          </Flex>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-4 rounded-xl shadow-sm">
          <Text className="text-[10px] text-slate-500 font-bold uppercase">Giao dịch chờ</Text>
          <Metric className="text-amber-500 font-black text-xl">08</Metric>
        </Card>

        <button 
          onClick={() => toast.success("Đang xuất báo cáo...")}
          className="flex items-center justify-between bg-blue-600 hover:bg-blue-500 p-4 rounded-xl transition-all group"
        >
          <div className="text-left">
            <Text className="text-blue-100 font-bold uppercase text-[10px]">Báo cáo tài chính</Text>
            <Title className="text-white font-black text-sm uppercase">Xuất Excel</Title>
          </div>
          <Download size={20} className="text-white group-hover:scale-110 transition-transform"/>
        </button>
      </Grid>

      {/* FILTER BAR */}
      <Card className="bg-slate-900 border-slate-800 rounded-xl p-4 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
            <input 
              type="text"
              placeholder="Tìm mã đơn, khách hàng..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-[11px] text-slate-200 outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 shadow-inner">
            {['all', 'completed', 'pending', 'failed'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-md text-[9px] font-black transition-all uppercase tracking-tighter ${
                  statusFilter === s ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {s === 'all' ? 'Tất cả' : s === 'completed' ? 'Thành công' : s === 'pending' ? 'Chờ duyệt' : 'Lỗi'}
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
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500 p-5">Mã đơn / Thời gian</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500">Khách hàng</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500">Số tiền</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500 text-center">Trạng thái</TableHeaderCell>
              <TableHeaderCell className="text-[10px] font-bold uppercase text-slate-500 text-right">Thao tác</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((t) => (
              <TableRow key={t.id} className="hover:bg-slate-800/40 transition-colors border-b border-slate-800/50 group">
                <TableCell className="p-4">
                  <Flex justifyContent="start" className="gap-3">
                    <div className="size-9 rounded-lg bg-slate-800 flex items-center justify-center text-blue-500 border border-slate-700 shrink-0 group-hover:border-blue-500/30 transition-all">
                      <CreditCard size={16} />
                    </div>
                    <div>
                      <Text className="font-bold text-slate-200 text-[11px] uppercase mb-0.5">{t.orderCode}</Text>
                      <Text className="text-[9px] text-slate-500 flex items-center gap-1">
                        <Clock size={9}/> {format(new Date(t.createdAt), 'HH:mm - dd/MM/yyyy')}
                      </Text>
                    </div>
                  </Flex>
                </TableCell>
                
                <TableCell>
                  <Text className="font-bold text-slate-200 text-[11px] uppercase leading-tight">{t.customerName}</Text>
                  <Text className="text-[9px] text-slate-600 font-mono">ID: {t.id} • {t.method}</Text>
                </TableCell>

                <TableCell>
                  <Text className="font-black text-white text-[12px]">{t.amount.toLocaleString()}₫</Text>
                </TableCell>

                <TableCell className="text-center">
                  {renderStatus(t.status)}
                </TableCell>

                <TableCell className="text-right p-4">
                  <button 
                    onClick={() => toast(`Chi tiết đơn ${t.orderCode}`)}
                    className="p-2 text-slate-500 hover:bg-slate-700 hover:text-white rounded-lg transition-all"
                  >
                    <Eye size={18}/>
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredData.length === 0 && (
          <div className="p-16 text-center text-slate-500 font-bold uppercase text-[10px] tracking-widest opacity-50">
            Không có giao dịch nào phù hợp
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminTransactions;