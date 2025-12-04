import React, { useState, useEffect } from 'react';
import { View, Transaction, PARENT_RELATED_CATEGORIES } from './types';
import Dashboard from './components/Dashboard';
import AddTransaction from './components/AddTransaction';
import Stats from './components/Stats';
import AIInsights from './components/AIInsights';
import ParentTracker from './components/ParentTracker';
import Portfolio from './components/Portfolio';
import BottomNav from './components/BottomNav';
import { saveTransactions, getTransactions } from './services/storageService';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setView] = useState<View>(View.DASHBOARD);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const loaded = getTransactions();
    setTransactions(loaded);
  }, []);

  const handleSaveTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...t,
      id: crypto.randomUUID(),
    };
    const updated = [newTransaction, ...transactions];
    setTransactions(updated);
    saveTransactions(updated);
    
    // Automatically redirect to the relevant tracker
    if (PARENT_RELATED_CATEGORIES.includes(t.category)) {
        setView(View.PARENTS);
    } else {
        setView(View.DASHBOARD);
    }
  };

  const handleDeleteTransaction = (id: string) => {
      const updated = transactions.filter(t => t.id !== id);
      setTransactions(updated);
      saveTransactions(updated);
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value) {
          // Input type="month" returns YYYY-MM
          const [year, month] = e.target.value.split('-').map(Number);
          const newDate = new Date(currentDate);
          newDate.setFullYear(year);
          newDate.setMonth(month - 1); // Month is 0-indexed in JS Date
          setCurrentDate(newDate);
      }
  };

  // Format for the month input value (YYYY-MM)
  const monthInputValue = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return (
          <Dashboard 
            transactions={transactions} 
            currentDate={currentDate} 
            onDelete={handleDeleteTransaction}
          />
        );
      case View.PARENTS:
        return (
          <ParentTracker
            transactions={transactions}
            currentDate={currentDate}
          />
        );
      case View.PORTFOLIO:
        return <Portfolio />;
      case View.ADD:
        return (
          <AddTransaction
            onSave={handleSaveTransaction}
            onCancel={() => setView(View.DASHBOARD)}
          />
        );
      case View.STATS:
        return <Stats transactions={transactions} currentDate={currentDate} />;
      case View.INSIGHTS:
        return <AIInsights transactions={transactions} currentDate={currentDate} />;
      default:
        return null;
    }
  };

  // If in Add mode, we hide the layout wrapper for full focus
  if (currentView === View.ADD) {
      return renderView();
  }

  return (
    <div className="h-full w-full bg-gray-100 flex justify-center">
      <div className="w-full max-w-md bg-gray-50 h-full relative shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top Month Selector (Only visible on Main Views) */}
        {currentView !== View.ADD && (
            <div className="px-4 py-3 bg-gray-50 flex items-center justify-between sticky top-0 z-10 pt-safe">
                {(currentView === View.DASHBOARD || currentView === View.STATS || currentView === View.INSIGHTS || currentView === View.PARENTS || currentView === View.PORTFOLIO) && (
                    <div className="flex items-center space-x-3 bg-white rounded-full px-3 py-1.5 shadow-sm border border-gray-200 mx-auto">
                        <button onClick={() => changeMonth(-1)} className="p-1 text-gray-400 hover:text-gray-800 rounded-full hover:bg-gray-100">
                            <ChevronLeft size={20} />
                        </button>
                        
                        {/* Custom Date Picker Wrapper */}
                        <div className="relative group">
                            <div className="flex items-center space-x-2 px-2 py-1 rounded cursor-pointer group-hover:bg-gray-50 transition-colors">
                                <span className="text-sm font-semibold w-28 text-center select-none truncate">
                                    {currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </span>
                                <Calendar size={14} className="text-gray-400" />
                            </div>
                            <input 
                                type="month" 
                                value={monthInputValue}
                                onChange={handleDateChange}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                aria-label="Select Month"
                            />
                        </div>

                        <button onClick={() => changeMonth(1)} className="p-1 text-gray-400 hover:text-gray-800 rounded-full hover:bg-gray-100">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        )}

        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
            {renderView()}
        </div>
        
        <BottomNav currentView={currentView} setView={setView} />
      </div>
    </div>
  );
};

export default App;