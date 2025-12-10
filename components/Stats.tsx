import React, { useMemo } from 'react';
import { Transaction, PARENT_RELATED_CATEGORIES } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface StatsProps {
  transactions: Transaction[];
  currentDate: Date;
}

const Stats: React.FC<StatsProps> = ({ transactions, currentDate }) => {
  
  // Filter for Personal Transactions in the selected month
  const monthlyTransactions = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      const isSameMonth = d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
      const isPersonal = !PARENT_RELATED_CATEGORIES.includes(t.category);
      return isSameMonth && isPersonal;
    });
  }, [transactions, currentDate]);

  // Data for Stacked Bar Chart (Daily aggregation)
  const chartData = useMemo(() => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const data = [];

    for (let i = 1; i <= daysInMonth; i++) {
        data.push({ day: i, income: 0, expense: 0 });
    }

    monthlyTransactions.forEach(t => {
        const day = new Date(t.date).getDate();
        const entry = data[day - 1];
        
        if (t.type === 'income') {
            entry.income += t.amount;
        } else {
            // EXCLUDE 'Saving' from expense stats as requested
            if (t.category !== 'Saving') {
                entry.expense += t.amount;
            }
        }
    });

    // Filter out days with no activity to make chart cleaner, or keep all to show timeline
    // Let's keep days with activity only for mobile readability if densely packed, 
    // but a full timeline is usually better. Let's return all.
    return data;
  }, [monthlyTransactions, currentDate]);

  const totalIncome = chartData.reduce((acc, curr) => acc + curr.income, 0);
  const totalExpense = chartData.reduce((acc, curr) => acc + curr.expense, 0);
  const savingsTracked = monthlyTransactions
    .filter(t => t.type === 'expense' && t.category === 'Saving')
    .reduce((acc, t) => acc + t.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="pb-24 pt-4 px-4 h-full overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis</h2>
        <p className="text-gray-500 mb-6">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} (Excl. Saving)
        </p>

        {/* Totals Summary */}
        <div className="grid grid-cols-3 gap-2 mb-6">
             <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <div className="text-xs text-emerald-600 font-bold uppercase">Income</div>
                <div className="text-lg font-bold text-emerald-700">{formatCurrency(totalIncome)}</div>
             </div>
             <div className="bg-rose-50 p-3 rounded-xl border border-rose-100">
                <div className="text-xs text-rose-600 font-bold uppercase">Expense</div>
                <div className="text-lg font-bold text-rose-700">{formatCurrency(totalExpense)}</div>
             </div>
             <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                <div className="text-xs text-blue-600 font-bold uppercase">Saved</div>
                <div className="text-lg font-bold text-blue-700">{formatCurrency(savingsTracked)}</div>
             </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-4">Daily Income vs Expense</h3>
            <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" tickLine={false} axisLine={false} interval={4} />
                        <YAxis tickLine={false} axisLine={false} />
                        <Tooltip 
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend />
                        <Bar dataKey="income" name="Income" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="expense" name="Expense" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-gray-400 mt-2">* 'Saving' category excluded from Expense bar</p>
        </div>
    </div>
  );
};

export default Stats;