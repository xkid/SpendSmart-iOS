import React from 'react';
import { Home, PlusCircle, PieChart, Sparkles, Users, TrendingUp } from 'lucide-react';
import { View } from '../types';

interface BottomNavProps {
  currentView: View;
  setView: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  const navItems = [
    { view: View.DASHBOARD, icon: Home, label: 'Home' },
    { view: View.PARENTS, icon: Users, label: 'Parents' },
    { view: View.ADD, icon: PlusCircle, label: 'Add' },
    { view: View.PORTFOLIO, icon: TrendingUp, label: 'Invest' },
    { view: View.STATS, icon: PieChart, label: 'Stats' },
    { view: View.INSIGHTS, icon: Sparkles, label: 'AI Tips' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 safe-area-bottom z-50">
      <div className="flex justify-around items-center h-16 w-full max-w-md mx-auto px-1">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              currentView === item.view ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <item.icon size={22} strokeWidth={currentView === item.view ? 2.5 : 2} />
            <span className="text-[9px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;