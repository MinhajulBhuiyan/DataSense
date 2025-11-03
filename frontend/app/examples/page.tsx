'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ExampleQuery {
  id: number;
  title: string;
  description: string;
  query: string;
  category: string;
  icon: string;
}

interface Category {
  value: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export default function ExampleQueries() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Initialize theme
  useEffect(() => {
    setMounted(true);
    const savedTheme = window.localStorage.getItem('datasense-theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    window.localStorage.setItem('datasense-theme', newTheme);
  };

  const exampleQueries: ExampleQuery[] = [
    // Distributors (15)
    { id: 1, title: 'Show all distributors', description: 'See the list of distributors with their contact info', query: 'show me all distributors', category: 'distributors', icon: 'users' },
    { id: 2, title: 'Distributor orders', description: 'What orders has a particular distributor placed', query: 'what orders did distributor 1 place', category: 'distributors', icon: 'users' },
    { id: 3, title: 'Distributor total sales', description: 'Total sales amount for each distributor', query: 'how much has each distributor bought from us', category: 'distributors', icon: 'users' },
    { id: 4, title: 'Find a distributor', description: 'Search for a specific distributor by name', query: 'find distributor with North in the name', category: 'distributors', icon: 'users' },
    { id: 5, title: 'Active distributors', description: 'Which distributors are currently active', query: 'show me all active distributors', category: 'distributors', icon: 'users' },
    { id: 6, title: 'Distributor contact info', description: 'Get phone and email for a distributor', query: 'what is the contact info for distributor 2', category: 'distributors', icon: 'users' },
    { id: 7, title: 'New distributors', description: 'Distributors who joined recently', query: 'show me distributors who registered this year', category: 'distributors', icon: 'users' },
    { id: 8, title: 'Top buying distributors', description: 'Who spends the most with us', query: 'which distributors have the highest order totals', category: 'distributors', icon: 'users' },
    { id: 9, title: 'Distributor addresses', description: 'Where are our distributors located', query: 'show me distributor addresses', category: 'distributors', icon: 'users' },
    { id: 10, title: 'Distributors without orders', description: 'Who hasnt ordered anything', query: 'which distributors have not placed any orders', category: 'distributors', icon: 'users' },
    { id: 11, title: 'Distributor order count', description: 'How many orders each distributor placed', query: 'count the orders for each distributor', category: 'distributors', icon: 'users' },
    { id: 12, title: 'Distributor last order', description: 'When did they last order from us', query: 'when was the last order from each distributor', category: 'distributors', icon: 'users' },
    { id: 13, title: 'Distributor with returns', description: 'Which distributors returned products', query: 'show me distributors who have returned items', category: 'distributors', icon: 'users' },
    { id: 14, title: 'Registration dates', description: 'When distributors joined', query: 'show me when each distributor registered', category: 'distributors', icon: 'users' },
    { id: 15, title: 'Distributor payment history', description: 'Payment records for a distributor', query: 'show me all payments from distributor 3', category: 'distributors', icon: 'users' },

    // Products & Inventory (15)
    { id: 21, title: 'List all products', description: 'Show all ice cream products we have', query: 'show me all products', category: 'inventory', icon: 'package' },
    { id: 22, title: 'Current stock levels', description: 'How much stock do we have for each product', query: 'what is the current stock for all products', category: 'inventory', icon: 'package' },
    { id: 23, title: 'Low stock items', description: 'Products running low in inventory', query: 'which products have low stock', category: 'inventory', icon: 'package' },
    { id: 24, title: 'Product sales history', description: 'How much of a product has been sold', query: 'how many units of Vanilla Delight have been sold', category: 'inventory', icon: 'package' },
    { id: 25, title: 'Product prices', description: 'List prices for all products', query: 'what are the prices for all our products', category: 'inventory', icon: 'package' },
    { id: 26, title: 'Most expensive products', description: 'Which products cost the most', query: 'show me the most expensive products', category: 'inventory', icon: 'package' },
    { id: 27, title: 'Cheapest products', description: 'Which products are least expensive', query: 'what are the cheapest products', category: 'inventory', icon: 'package' },
    { id: 28, title: 'Out of stock', description: 'Products we need to restock', query: 'which products are out of stock', category: 'inventory', icon: 'package' },
    { id: 29, title: 'Product descriptions', description: 'Details about our products', query: 'show me product names and descriptions', category: 'inventory', icon: 'package' },
    { id: 30, title: 'Stock value', description: 'Total value of inventory', query: 'what is the total value of our inventory', category: 'inventory', icon: 'package' },
    { id: 31, title: 'Product by name', description: 'Find a specific product', query: 'show me details for Chocolate Supreme', category: 'inventory', icon: 'package' },
    { id: 32, title: 'Inventory movements', description: 'Recent stock changes', query: 'show me recent inventory transactions', category: 'inventory', icon: 'package' },
    { id: 33, title: 'Stock additions', description: 'When we added new stock', query: 'show me when products were added to inventory', category: 'inventory', icon: 'package' },
    { id: 34, title: 'Stock sold', description: 'Inventory that went out', query: 'show me all sale transactions from inventory', category: 'inventory', icon: 'package' },
    { id: 35, title: 'High stock items', description: 'Products with plenty of stock', query: 'which products have the most stock', category: 'inventory', icon: 'package' },

    // Orders & Invoices (15)
    { id: 41, title: 'Recent orders', description: 'Show latest orders placed', query: 'show me recent orders', category: 'orders', icon: 'shopping' },
    { id: 42, title: 'Order details', description: 'Details of a specific order', query: 'show me details of order 1', category: 'orders', icon: 'shopping' },
    { id: 43, title: 'Cancelled orders', description: 'Which orders were cancelled', query: 'show me cancelled orders', category: 'orders', icon: 'ban' },
    { id: 44, title: 'Invoice status', description: 'Check status of invoices', query: 'show me all invoices and their status', category: 'orders', icon: 'shopping' },
    { id: 45, title: 'Large orders', description: 'Orders above a certain amount', query: 'show me orders above 2000', category: 'orders', icon: 'shopping' },
    { id: 46, title: 'Small orders', description: 'Orders below a certain amount', query: 'show me orders under 1000', category: 'orders', icon: 'shopping' },
    { id: 47, title: 'Orders by date', description: 'Orders from a specific time period', query: 'show me orders from October 2024', category: 'orders', icon: 'shopping' },
    { id: 48, title: 'Order items', description: 'What products are in an order', query: 'what products are in order 3', category: 'orders', icon: 'shopping' },
    { id: 49, title: 'Invoiced orders', description: 'Orders that have invoices', query: 'show me all invoiced orders', category: 'orders', icon: 'shopping' },
    { id: 50, title: 'Invoice amounts', description: 'How much each invoice is worth', query: 'show me all invoices with their amounts', category: 'orders', icon: 'shopping' },
    { id: 51, title: 'Delivered invoices', description: 'Which invoices were fully delivered', query: 'show me fully delivered invoices', category: 'orders', icon: 'shopping' },
    { id: 52, title: 'Partial deliveries', description: 'Invoices not fully delivered', query: 'show me partially delivered invoices', category: 'orders', icon: 'shopping' },
    { id: 53, title: 'Total orders', description: 'Count of all orders', query: 'how many orders have we received', category: 'orders', icon: 'shopping' },
    { id: 54, title: 'Order notes', description: 'Special notes on orders', query: 'show me orders with notes', category: 'orders', icon: 'shopping' },
    { id: 55, title: 'Invoice products', description: 'Products in each invoice', query: 'show me what products are in invoice 5', category: 'orders', icon: 'shopping' },

    // Payments & Revenue (15)
    { id: 61, title: 'Total revenue', description: 'How much money we made', query: 'what is our total revenue', category: 'revenue', icon: 'chart' },
    { id: 62, title: 'Payments by method', description: 'How customers paid us', query: 'show me payments by payment method', category: 'revenue', icon: 'credit-card' },
    { id: 63, title: 'Unpaid invoices', description: 'Which invoices havent been fully paid', query: 'show me unpaid invoices', category: 'revenue', icon: 'chart' },
    { id: 64, title: 'Monthly sales', description: 'Sales breakdown by month', query: 'show me sales by month', category: 'revenue', icon: 'chart' },
    { id: 65, title: 'Cash payments', description: 'Payments made in cash', query: 'show me all cash payments', category: 'revenue', icon: 'credit-card' },
    { id: 66, title: 'Cheque payments', description: 'Payments made by cheque', query: 'show me all cheque payments', category: 'revenue', icon: 'credit-card' },
    { id: 67, title: 'Bank deposits', description: 'Payments through bank transfer', query: 'show me all bank deposit payments', category: 'revenue', icon: 'credit-card' },
    { id: 68, title: 'Payment dates', description: 'When payments were received', query: 'show me payment dates for all invoices', category: 'revenue', icon: 'chart' },
    { id: 69, title: 'Recent payments', description: 'Latest payments received', query: 'show me recent payments', category: 'revenue', icon: 'credit-card' },
    { id: 70, title: 'Total payments', description: 'Sum of all payments', query: 'how much have we received in payments', category: 'revenue', icon: 'chart' },
    { id: 71, title: 'Invoice payment status', description: 'Which invoices are paid', query: 'show me which invoices have been paid', category: 'revenue', icon: 'chart' },
    { id: 72, title: 'Outstanding amounts', description: 'Money still owed to us', query: 'how much money is outstanding', category: 'revenue', icon: 'chart' },
    { id: 73, title: 'Payment for invoice', description: 'Payments for a specific invoice', query: 'show me payments for invoice 10', category: 'revenue', icon: 'credit-card' },
    { id: 74, title: 'Largest payments', description: 'Biggest payments received', query: 'show me the largest payments', category: 'revenue', icon: 'chart' },
    { id: 75, title: 'Revenue by distributor', description: 'How much each distributor paid', query: 'show me total revenue from each distributor', category: 'revenue', icon: 'chart' },

    // Returns (15)
    { id: 81, title: 'All returns', description: 'Show products that were returned', query: 'show me all returns', category: 'returns', icon: 'return' },
    { id: 82, title: 'Return reasons', description: 'Why products were returned', query: 'why were products returned', category: 'returns', icon: 'return' },
    { id: 83, title: 'Refunds issued', description: 'Money refunded to customers', query: 'show me all refunds', category: 'returns', icon: 'credit-card' },
    { id: 84, title: 'Return dates', description: 'When returns happened', query: 'show me when returns were made', category: 'returns', icon: 'return' },
    { id: 85, title: 'Returned products', description: 'Which products were returned', query: 'what products have been returned', category: 'returns', icon: 'return' },
    { id: 86, title: 'Return amounts', description: 'Value of returned items', query: 'how much were the returns worth', category: 'returns', icon: 'return' },
    { id: 87, title: 'Returns by invoice', description: 'Returns for a specific invoice', query: 'show me returns for invoice 3', category: 'returns', icon: 'return' },
    { id: 88, title: 'Damaged returns', description: 'Items returned due to damage', query: 'show me returns because of damage', category: 'returns', icon: 'return' },
    { id: 89, title: 'Quality issues', description: 'Returns due to quality problems', query: 'show me returns for quality issues', category: 'returns', icon: 'return' },
    { id: 90, title: 'Total refunds', description: 'Sum of all refunds given', query: 'how much have we refunded in total', category: 'returns', icon: 'credit-card' },
    { id: 91, title: 'Refund methods', description: 'How refunds were given', query: 'show me refund methods used', category: 'returns', icon: 'credit-card' },
    { id: 92, title: 'Return status', description: 'Status of each return', query: 'show me the status of all returns', category: 'returns', icon: 'return' },
    { id: 93, title: 'Processed returns', description: 'Returns that are complete', query: 'show me processed returns', category: 'returns', icon: 'return' },
    { id: 94, title: 'Return quantities', description: 'How many items were returned', query: 'show me quantities for each return', category: 'returns', icon: 'return' },
    { id: 95, title: 'Recent refunds', description: 'Latest refunds issued', query: 'show me recent refunds', category: 'returns', icon: 'credit-card' },

    // Analytics (15)
    { id: 101, title: 'Best selling products', description: 'Which products sell the most', query: 'what are our best selling products', category: 'analytics', icon: 'chart' },
    { id: 102, title: 'Average order value', description: 'Typical order size', query: 'what is the average order value', category: 'analytics', icon: 'analytics' },
    { id: 103, title: 'Delivery performance', description: 'How many deliveries were completed', query: 'show me delivery completion rate', category: 'analytics', icon: 'truck' },
    { id: 104, title: 'Total orders count', description: 'How many orders in total', query: 'how many orders have we had', category: 'analytics', icon: 'analytics' },
    { id: 105, title: 'Sales trends', description: 'How sales changed over time', query: 'show me sales trends by month', category: 'analytics', icon: 'chart' },
    { id: 106, title: 'Product performance', description: 'Which products do well', query: 'compare sales for each product', category: 'analytics', icon: 'chart' },
    { id: 107, title: 'Return rate', description: 'Percentage of items returned', query: 'what is our return rate', category: 'analytics', icon: 'analytics' },
    { id: 108, title: 'Load plans', description: 'Delivery schedule overview', query: 'show me all load plans', category: 'analytics', icon: 'truck' },
    { id: 109, title: 'Completed deliveries', description: 'How many loads were delivered', query: 'how many load plans were completed', category: 'analytics', icon: 'truck' },
    { id: 110, title: 'Vehicles used', description: 'Which vehicles we use for delivery', query: 'show me all delivery vehicles', category: 'analytics', icon: 'truck' },
    { id: 111, title: 'Gate passes', description: 'Delivery gate pass records', query: 'show me all gate passes', category: 'analytics', icon: 'truck' },
    { id: 112, title: 'Challans', description: 'Delivery documentation', query: 'show me all challans', category: 'analytics', icon: 'truck' },
    { id: 113, title: 'Revenue vs returns', description: 'Compare income and returns', query: 'compare total revenue with total returns', category: 'analytics', icon: 'analytics' },
    { id: 114, title: 'Cancellation rate', description: 'How many orders get cancelled', query: 'what percentage of orders are cancelled', category: 'analytics', icon: 'analytics' },
    { id: 115, title: 'Payment collection', description: 'How well we collect payments', query: 'what is our payment collection rate', category: 'analytics', icon: 'analytics' }
  ];

  const categories: Category[] = [
    { 
      value: 'all', 
      label: 'All',
      color: '#08834d',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    { 
      value: 'distributors', 
      label: 'Distributors',
      color: '#08834d',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      value: 'inventory', 
      label: 'Inventory',
      color: '#08834d',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    { 
      value: 'orders', 
      label: 'Orders',
      color: '#08834d',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    { 
      value: 'revenue', 
      label: 'Revenue',
      color: '#08834d',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      value: 'returns', 
      label: 'Returns',
      color: '#08834d',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      )
    },
    { 
      value: 'analytics', 
      label: 'Analytics',
      color: '#08834d',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      )
    }
  ];

  const filteredQueries = selectedCategory === 'all' 
    ? exampleQueries 
    : exampleQueries.filter(q => q.category === selectedCategory);

  const copyToClipboard = (query: string, id: number) => {
    navigator.clipboard.writeText(query);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const useQuery = (query: string) => {
    // Store the query in localStorage to be picked up by the main page
    localStorage.setItem('selected-query', query);
    // Navigate back to main page
    window.location.href = '/';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      distributors: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      inventory: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      orders: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      revenue: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      returns: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      ),
      analytics: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      )
    };
    return icons[category] || icons.distributors;
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Header - Compact */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Back</span>
              </Link>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-base font-semibold text-gray-900 dark:text-white">
                Example Queries
              </h1>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Category Filter - Compact */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.value
                    ? 'text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500 hover:shadow-sm'
                }`}
                style={selectedCategory === category.value ? { backgroundColor: category.color } : {}}
              >
                {category.icon}
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Query Grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredQueries.map((query) => (
            <div
              key={query.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/30 transition-all duration-200 group hover:border-green-300 dark:hover:border-green-600"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                  style={{ 
                    backgroundColor: theme === 'light' ? 'rgba(8, 131, 77, 0.1)' : 'rgba(8, 131, 77, 0.2)'
                  }}>
                  <div style={{ color: '#08834d' }}>
                    {getCategoryIcon(query.category)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                    {query.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {query.description}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 mb-4 border border-gray-200 dark:border-gray-700">
                <code className="text-xs text-gray-800 dark:text-gray-200 font-mono line-clamp-2">
                  {query.query}
                </code>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => useQuery(query.query)}
                  className="flex-1 flex items-center justify-center gap-2 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                  style={{ backgroundColor: '#08834d' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#06a35a'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#08834d'}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  Use Query
                </button>
                <button
                  onClick={() => copyToClipboard(query.query, query.id)}
                  className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600"
                  title="Copy to clipboard"
                >
                  {copiedId === query.id ? (
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredQueries.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-200 dark:border-gray-700">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h.01M15 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No queries found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No queries match the selected category.
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-colors"
              style={{ backgroundColor: '#08834d' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              View all categories
            </button>
          </div>
        )}
      </main>
    </div>
  );
}