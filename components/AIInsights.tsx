import React, { useState } from 'react';
import { Transaction, PARENT_RELATED_CATEGORIES } from '../types';
import { generateMonthlyAnalysis } from '../services/geminiService';
import { Sparkles, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIInsightsProps {
  transactions: Transaction[];
  currentDate: Date;
}

const AIInsights: React.FC<AIInsightsProps> = ({ transactions, currentDate }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const monthlyTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      const isSameMonth = d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
      const isPersonal = !PARENT_RELATED_CATEGORIES.includes(t.category);
      return isSameMonth && isPersonal;
  });

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await generateMonthlyAnalysis(monthlyTransactions, monthName);
      setAnalysis(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">AI Assistant</h2>
            <Sparkles className="text-purple-500" />
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg mb-8">
            <h3 className="text-xl font-bold mb-2">Monthly Insights</h3>
            <p className="text-purple-100 mb-6 text-sm">
                Get personalized advice and a summary of your personal spending habits for {monthName} powered by Gemini.
            </p>
            <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-white text-purple-700 font-bold py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-opacity-90 transition-all active:scale-95 disabled:opacity-70 disabled:scale-100"
            >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <Sparkles size={20} />}
                <span>{loading ? 'Analyzing...' : analysis ? 'Refresh Analysis' : 'Generate Report'}</span>
            </button>
        </div>

        {analysis && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 prose prose-sm prose-purple max-w-none">
                <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
        )}

        {!analysis && !loading && (
             <div className="text-center text-gray-400 mt-12 px-8">
                <p>Tap "Generate Report" to let Gemini analyze your {monthlyTransactions.length} personal transactions for this month.</p>
             </div>
        )}
    </div>
  );
};

export default AIInsights;