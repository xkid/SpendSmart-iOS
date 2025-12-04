import React, { useMemo } from 'react';
import { Transaction } from '../types';
import { ArrowUpCircle, ArrowDownCircle, Users, History, Wallet, Calendar } from 'lucide-react';

interface ParentTrackerProps {
  transactions: Transaction[];
  currentDate: Date;
}

const ParentTracker: React.FC<ParentTrackerProps> = ({ transactions, currentDate }) => {
  const PARENT_CATEGORY = 'Parents';
  const CONTRIBUTION_CATEGORY = 'Sibling Contribution';

  // Helper to determine if a transaction is relevant
  const isParentTx = (t: Transaction) => t.category === PARENT_CATEGORY || t.category === CONTRIBUTION_CATEGORY;

  // 1. Calculate Opening Balance (Carry Forward from previous months)
  const openingBalance = useMemo(() => {
    // Get start of current month
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    let balance = 0;
    transactions.forEach(t => {
        const tDate = new Date(t.date);
        if (tDate < startOfMonth && isParentTx(t)) {
            if (t.type === 'income') balance += t.amount;
            else balance -= t.amount;
        }
    });
    return balance;
  }, [transactions, currentDate]);

  // 2. Calculate Monthly Activity
  const monthlyActivity = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      const isSameMonth = d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
      return isSameMonth && isParentTx(t);
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, currentDate]);

  const monthlyTotals = useMemo(() => {
     let inc = 0;
     let exp = 0;
     monthlyActivity.forEach(t => {
         if (t.type === 'income') inc += t.amount;
         else exp += t.amount;
     });
     return { inc, exp, net: inc - exp };
  }, [monthlyActivity]);

  // 3. Closing Balance
  const closingBalance = openingBalance + monthlyTotals.net;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="pb-24 pt-4 px-4 h-full overflow-y-auto">
       <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                <Users size={24} />
            </div>
            <div>
                <h1 className="text-xl font-bold text-gray-900">Parent Tracker</h1>
                <p className="text-xs text-gray-500">Shared expenses & contributions</p>
            </div>
       </div>

       {/* Monthly Statement Card */}
       <div className="bg-gradient-to-br from-purple-700 to-indigo-800 rounded-2xl p-6 text-white shadow-lg mb-8">
            <h3 className="text-purple-200 text-xs font-bold uppercase tracking-widest mb-4">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Statement
            </h3>
            
            <div className="space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-purple-600/30 pb-2">
                    <span className="text-purple-200 flex items-center gap-2">
                        <History size={14} /> Opening Balance
                    </span>
                    <span className="font-semibold">{formatCurrency(openingBalance)}</span>
                </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-emerald-300 flex items-center gap-2">
                        <ArrowUpCircle size={14} /> Month Contributions
                    </span>
                    <span className="font-semibold text-emerald-300">+{formatCurrency(monthlyTotals.inc)}</span>
                </div>
                 <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                    <span className="text-rose-300 flex items-center gap-2">
                        <ArrowDownCircle size={14} /> Month Expenses
                    </span>
                    <span className="font-semibold text-rose-300">-{formatCurrency(monthlyTotals.exp)}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                    <span className="text-lg font-bold">Closing Balance</span>
                    <span className="text-2xl font-bold">{formatCurrency(closingBalance)}</span>
                </div>
            </div>
       </div>

       {/* Transactions List */}
       <h3 className="text-gray-800 font-bold mb-3 flex items-center gap-2">
           <Calendar size={18} /> Monthly Details
       </h3>
       
       {monthlyActivity.length === 0 ? (
           <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
               <p className="text-sm">No parent-related activity this month.</p>
           </div>
       ) : (
           <div className="space-y-3">
               {monthlyActivity.map(t => (
                   <div key={t.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                       <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                t.category === CONTRIBUTION_CATEGORY 
                                ? 'bg-emerald-100 text-emerald-600' 
                                : 'bg-rose-100 text-rose-600'
                            }`}>
                                {t.type === 'income' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">{t.category}</p>
                                <p className="text-xs text-gray-500">{formatDate(t.date)} {t.note ? `• ${t.note}` : ''}</p>
                            </div>
                       </div>
                       <span className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-gray-900'}`}>
                           {t.type === 'income' ? '+' : ''}{formatCurrency(t.amount)}
                       </span>
                   </div>
               ))}
           </div>
       )}
    </div>
  );
};

export default ParentTracker;