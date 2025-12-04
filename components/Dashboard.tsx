import React, { useMemo } from 'react';
import { Transaction, PARENT_RELATED_CATEGORIES } from '../types';
import { ArrowUpCircle, ArrowDownCircle, Wallet, Download } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  currentDate: Date;
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, currentDate, onDelete }) => {
  const monthlyTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      const isSameMonth = d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
      // Exclude parent tracker categories from the main dashboard
      const isPersonal = !PARENT_RELATED_CATEGORIES.includes(t.category);
      return isSameMonth && isPersonal;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, currentDate]);

  const { income, expense, balance } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    monthlyTransactions.forEach(t => {
      if (t.type === 'income') inc += t.amount;
      else exp += t.amount;
    });
    return { income: inc, expense: exp, balance: inc - exp };
  }, [monthlyTransactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return 'Today';
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transactions, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "spendsmart_backup_" + new Date().toISOString().split('T')[0] + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Group by date for display
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: Transaction[] } = {};
    monthlyTransactions.forEach(t => {
      const dateKey = new Date(t.date).toDateString();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(t);
    });
    return groups;
  }, [monthlyTransactions]);

  return (
    <div className="pb-24 pt-4 px-4">
      {/* Month Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
            <h2 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <h1 className="text-4xl font-bold text-gray-900 mt-1">{formatCurrency(balance)}</h1>
            <p className="text-gray-400 text-sm mt-1">Total Balance (Personal)</p>
        </div>
        <button 
            onClick={handleExport}
            className="p-2 bg-white text-gray-500 rounded-full shadow-sm border border-gray-100 hover:text-blue-600 hover:border-blue-200 active:scale-95 transition-all"
            title="Export Data"
        >
            <Download size={20} />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-emerald-50 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center space-x-2 text-emerald-600 mb-2">
            <ArrowUpCircle size={20} />
            <span className="text-sm font-medium">Income</span>
          </div>
          <span className="text-xl font-bold text-emerald-700">{formatCurrency(income)}</span>
        </div>
        <div className="bg-rose-50 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center space-x-2 text-rose-600 mb-2">
            <ArrowDownCircle size={20} />
            <span className="text-sm font-medium">Expenses</span>
          </div>
          <span className="text-xl font-bold text-rose-700">{formatCurrency(expense)}</span>
        </div>
      </div>

      {/* Recent Transactions */}
      <h3 className="text-lg font-bold text-gray-800 mb-4">Transactions</h3>
      
      {Object.keys(groupedTransactions).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Wallet size={48} className="mb-4 opacity-20" />
          <p>No personal transactions.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTransactions).map(([dateLabel, trans]: [string, Transaction[]]) => (
            <div key={dateLabel}>
              <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2 ml-1">
                {formatDate(trans[0].date)}
              </h4>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {trans.map((t, idx) => (
                  <div 
                    key={t.id} 
                    className={`flex justify-between items-center p-4 hover:bg-gray-50 transition-colors ${idx !== trans.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {t.type === 'income' ? '+' : '-'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{t.category}</p>
                        {t.note && <p className="text-xs text-gray-500">{t.note}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                       <p className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-gray-900'}`}>
                        {t.type === 'income' ? '+' : ''}{formatCurrency(t.amount)}
                      </p>
                      <button 
                        onClick={() => { if(confirm('Delete this transaction?')) onDelete(t.id) }}
                        className="text-[10px] text-red-400 mt-1 opacity-0 group-hover:opacity-100 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;