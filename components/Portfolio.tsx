import React, { useState, useEffect } from 'react';
import { Share, Fund } from '../types';
import { getShares, saveShares, getFunds, saveFunds } from '../services/storageService';
import { TrendingUp, PieChart as PieIcon, Plus, Trash2, DollarSign, Calendar } from 'lucide-react';

const Portfolio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'shares' | 'funds'>('shares');
  const [shares, setShares] = useState<Share[]>([]);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    setShares(getShares());
    setFunds(getFunds());
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const handleDeleteShare = (id: string) => {
      const updated = shares.filter(s => s.id !== id);
      setShares(updated);
      saveShares(updated);
  };

  const handleDeleteFund = (id: string) => {
      const updated = funds.filter(f => f.id !== id);
      setFunds(updated);
      saveFunds(updated);
  };

  return (
    <div className="pb-24 pt-4 px-4 h-full overflow-y-auto relative">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Portfolio</h2>
            <button 
                onClick={() => setShowAdd(true)}
                className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            >
                <Plus size={24} />
            </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-200 p-1 rounded-xl mb-6">
            <button
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'shares' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('shares')}
            >
                <TrendingUp size={16} /> Shares
            </button>
            <button
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'funds' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('funds')}
            >
                <PieIcon size={16} /> Funds
            </button>
        </div>

        {activeTab === 'shares' ? (
            <SharesView shares={shares} onDelete={handleDeleteShare} formatCurrency={formatCurrency} />
        ) : (
            <FundsView funds={funds} onDelete={handleDeleteFund} formatCurrency={formatCurrency} />
        )}

        {showAdd && (
            <AddPortfolioItemModal 
                type={activeTab} 
                onClose={() => setShowAdd(false)} 
                onSaveShare={(s) => {
                    const updated = [...shares, { ...s, id: crypto.randomUUID() }];
                    setShares(updated);
                    saveShares(updated);
                    setShowAdd(false);
                }}
                onSaveFund={(f) => {
                    const updated = [...funds, { ...f, id: crypto.randomUUID() }];
                    setFunds(updated);
                    saveFunds(updated);
                    setShowAdd(false);
                }}
            />
        )}
    </div>
  );
};

const SharesView: React.FC<{ shares: Share[], onDelete: (id: string) => void, formatCurrency: (val: number) => string }> = ({ shares, onDelete, formatCurrency }) => {
    return (
        <div className="space-y-4">
            {shares.length === 0 && <p className="text-center text-gray-400 mt-10">No shares tracked yet.</p>}
            {shares.map(share => {
                const currentValue = share.units * share.currentPrice;
                const costBasis = share.units * share.buyPrice;
                const profitLoss = currentValue - costBasis;
                const isProfit = profitLoss >= 0;

                return (
                    <div key={share.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-gray-900">{share.name}</h3>
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-uppercase">{share.code}</span>
                            </div>
                            <button onClick={() => onDelete(share.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16}/></button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 my-3 text-sm">
                            <div>
                                <span className="block text-gray-400 text-xs">Units</span>
                                <span className="font-semibold">{share.units}</span>
                            </div>
                             <div>
                                <span className="block text-gray-400 text-xs">Current Price</span>
                                <span className="font-semibold">{formatCurrency(share.currentPrice)}</span>
                            </div>
                        </div>

                        <div className={`p-3 rounded-lg flex justify-between items-center ${isProfit ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                            <span className="text-xs font-semibold">Total Value</span>
                            <span className="font-bold">{formatCurrency(currentValue)}</span>
                        </div>

                         {share.dividendAmount && (
                            <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                                <DollarSign size={12} /> Div: {formatCurrency(share.dividendAmount)} ({share.dividendDate})
                            </div>
                         )}
                    </div>
                )
            })}
        </div>
    )
}

const FundsView: React.FC<{ funds: Fund[], onDelete: (id: string) => void, formatCurrency: (val: number) => string }> = ({ funds, onDelete, formatCurrency }) => {
    return (
        <div className="space-y-4">
            {funds.length === 0 && <p className="text-center text-gray-400 mt-10">No funds tracked yet.</p>}
            {funds.map(fund => {
                const profitLoss = fund.currentValue - fund.amountInvested;
                const isProfit = profitLoss >= 0;

                return (
                     <div key={fund.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-gray-900">{fund.name}</h3>
                                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                    <Calendar size={12} /> Bought: {new Date(fund.buyDate).toLocaleDateString()}
                                </div>
                            </div>
                            <button onClick={() => onDelete(fund.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16}/></button>
                        </div>

                         <div className="grid grid-cols-2 gap-2 mb-2">
                             <div className="bg-gray-50 p-2 rounded">
                                 <span className="block text-[10px] text-gray-400 uppercase">Invested</span>
                                 <span className="font-semibold text-gray-800">{formatCurrency(fund.amountInvested)}</span>
                             </div>
                              <div className="bg-gray-50 p-2 rounded">
                                 <span className="block text-[10px] text-gray-400 uppercase">Current</span>
                                 <span className="font-semibold text-gray-800">{formatCurrency(fund.currentValue)}</span>
                             </div>
                         </div>

                         <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-50">
                             <span className="text-gray-500">Return</span>
                             <span className={`font-bold ${isProfit ? 'text-emerald-600' : 'text-rose-600'}`}>
                                 {isProfit ? '+' : ''}{formatCurrency(profitLoss)}
                             </span>
                         </div>
                    </div>
                )
            })}
        </div>
    )
}

// Modal Component for Adding Items
const AddPortfolioItemModal: React.FC<{
    type: 'shares' | 'funds', 
    onClose: () => void, 
    onSaveShare: (s: Omit<Share, 'id'>) => void,
    onSaveFund: (f: Omit<Fund, 'id'>) => void
}> = ({ type, onClose, onSaveShare, onSaveFund }) => {
    
    // Share State
    const [sName, setSName] = useState('');
    const [sCode, setSCode] = useState('');
    const [sUnits, setSUnits] = useState('');
    const [sBuyPrice, setSBuyPrice] = useState('');
    const [sCurrentPrice, setSCurrentPrice] = useState('');
    const [sBuyDate, setSBuyDate] = useState(new Date().toISOString().split('T')[0]);
    const [sDivDate, setSDivDate] = useState('');
    const [sDivAmt, setSDivAmt] = useState('');

    // Fund State
    const [fName, setFName] = useState('');
    const [fAmount, setFAmount] = useState('');
    const [fCurrent, setFCurrent] = useState('');
    const [fDate, setFDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (type === 'shares') {
            if(!sName || !sUnits || !sBuyPrice) return;
            onSaveShare({
                name: sName,
                code: sCode,
                units: Number(sUnits),
                buyPrice: Number(sBuyPrice),
                currentPrice: Number(sCurrentPrice) || Number(sBuyPrice), // Default to buy price if current not set
                buyDate: sBuyDate,
                dividendDate: sDivDate,
                dividendAmount: sDivAmt ? Number(sDivAmt) : undefined
            });
        } else {
             if(!fName || !fAmount || !fCurrent) return;
             onSaveFund({
                 name: fName,
                 amountInvested: Number(fAmount),
                 currentValue: Number(fCurrent),
                 buyDate: fDate
             });
        }
    };

    return (
        <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90%]">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg">Add {type === 'shares' ? 'Share' : 'Fund'}</h3>
                    <button onClick={onClose} className="text-gray-500">✕</button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto">
                    {type === 'shares' ? (
                        <>
                            <input placeholder="Share Name" className="input-field" value={sName} onChange={e => setSName(e.target.value)} required />
                            <input placeholder="Stock Code (e.g., AAPL)" className="input-field" value={sCode} onChange={e => setSCode(e.target.value)} />
                            <div className="grid grid-cols-2 gap-3">
                                <input type="number" placeholder="Units" className="input-field" value={sUnits} onChange={e => setSUnits(e.target.value)} required />
                                <input type="number" placeholder="Buy Price" className="input-field" value={sBuyPrice} onChange={e => setSBuyPrice(e.target.value)} required />
                            </div>
                            <input type="number" placeholder="Current Market Price" className="input-field" value={sCurrentPrice} onChange={e => setSCurrentPrice(e.target.value)} />
                            <input type="date" className="input-field" value={sBuyDate} onChange={e => setSBuyDate(e.target.value)} />
                            
                            <div className="pt-2 border-t border-gray-100">
                                <p className="text-xs font-bold text-gray-400 mb-2">DIVIDEND (Optional)</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="date" className="input-field" value={sDivDate} onChange={e => setSDivDate(e.target.value)} />
                                    <input type="number" placeholder="Amount" className="input-field" value={sDivAmt} onChange={e => setSDivAmt(e.target.value)} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <input placeholder="Fund Name" className="input-field" value={fName} onChange={e => setFName(e.target.value)} required />
                            <input type="number" placeholder="Amount Invested" className="input-field" value={fAmount} onChange={e => setFAmount(e.target.value)} required />
                            <input type="number" placeholder="Current Value" className="input-field" value={fCurrent} onChange={e => setFCurrent(e.target.value)} required />
                            <input type="date" className="input-field" value={fDate} onChange={e => setFDate(e.target.value)} />
                        </>
                    )}

                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-2">
                        Save {type === 'shares' ? 'Share' : 'Fund'}
                    </button>
                </form>
            </div>
             <style>{`
                .input-field {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    font-size: 14px;
                    outline: none;
                }
                .input-field:focus {
                    border-color: #2563eb;
                    ring: 2px solid #93c5fd;
                }
            `}</style>
        </div>
    );
};

export default Portfolio;