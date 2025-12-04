import { Transaction, Share, Fund } from '../types';

const TRANSACTION_KEY = 'spendsmart_transactions_v1';
const SHARES_KEY = 'spendsmart_shares_v1';
const FUNDS_KEY = 'spendsmart_funds_v1';

// Transactions
export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(TRANSACTION_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Failed to save transactions', error);
  }
};

export const getTransactions = (): Transaction[] => {
  try {
    const data = localStorage.getItem(TRANSACTION_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load transactions', error);
    return [];
  }
};

// Shares
export const saveShares = (shares: Share[]): void => {
  try {
    localStorage.setItem(SHARES_KEY, JSON.stringify(shares));
  } catch (error) {
    console.error('Failed to save shares', error);
  }
};

export const getShares = (): Share[] => {
  try {
    const data = localStorage.getItem(SHARES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load shares', error);
    return [];
  }
};

// Funds
export const saveFunds = (funds: Fund[]): void => {
  try {
    localStorage.setItem(FUNDS_KEY, JSON.stringify(funds));
  } catch (error) {
    console.error('Failed to save funds', error);
  }
};

export const getFunds = (): Fund[] => {
  try {
    const data = localStorage.getItem(FUNDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load funds', error);
    return [];
  }
};