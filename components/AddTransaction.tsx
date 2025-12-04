import React, { useState } from 'react';
import { Transaction, TransactionType, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../types';
import { ArrowLeft, Check } from 'lucide-react';

interface AddTransactionProps {
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ onSave, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    onSave({
      amount: parseFloat(amount),
      type,
      category,
      note,
      date: new Date(date).toISOString(),
    });
  };

  return (
    <div className="bg-gray-50 h-full flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <button onClick={onCancel} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <span className="font-semibold text-lg">New Transaction</span>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      <form onSubmit={handleSubmit} className="flex-1 p-4 space-y-6 overflow-y-auto pb-24">
        {/* Type Switcher */}
        <div className="flex bg-gray-200 p-1 rounded-xl">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              type === 'expense' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => { setType('expense'); setCategory(''); }}
          >
            Expense
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              type === 'income' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => { setType('income'); setCategory(''); }}
          >
            Income
          </button>
        </div>

        {/* Amount Input */}
        <div className="bg-white p-6 rounded-2xl flex flex-col items-center shadow-sm">
            <label className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">Amount</label>
            <div className="flex items-baseline text-gray-900">
                <span className="text-3xl font-bold mr-1">$</span>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="text-5xl font-bold bg-transparent outline-none w-full text-center placeholder-gray-200"
                    autoFocus
                    step="0.01"
                />
            </div>
        </div>

        {/* Category Grid */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 ml-1">Category</label>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-3 px-2 text-xs font-medium rounded-xl border transition-all truncate ${
                  category === cat
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Note (Optional)</label>
                <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Starbucks, Gas Station..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
      </form>

      {/* Submit Button */}
      <div className="p-4 bg-white border-t border-gray-100 safe-area-bottom">
        <button
          onClick={handleSubmit}
          disabled={!amount || !category}
          className="w-full bg-blue-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-blue-200"
        >
          <Check size={20} />
          <span>Save Transaction</span>
        </button>
      </div>
    </div>
  );
};

export default AddTransaction;