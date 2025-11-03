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
    // Distributors (10)
    { id: 1, title: 'List all distributors', description: 'Show id, name, phone, email for all distributors', query: 'List all distributors with id, name, phone and email', category: 'distributors', icon: 'users' },
    { id: 2, title: 'Active distributors only', description: 'Active distributors (status = active)', query: 'Show distributors where status = "active"', category: 'distributors', icon: 'users' },
    { id: 3, title: 'Top 10 distributors by net revenue', description: 'Rank distributors by net revenue (invoices - returns)', query: 'Show top 10 distributors by net revenue', category: 'distributors', icon: 'users' },
    { id: 4, title: 'Distributors by region', description: 'Count distributors grouped by region', query: 'Count distributors grouped by region', category: 'distributors', icon: 'users' },
    { id: 5, title: 'Distributor contact for id', description: 'Contact details for distributor id = 101', query: 'Show contact details for distributor id = 101', category: 'distributors', icon: 'users' },
    { id: 6, title: 'Distributors with no orders', description: 'Find distributors who have not placed any orders in the last 6 months', query: 'Find distributors with no orders in the last 6 months', category: 'distributors', icon: 'users' },
    { id: 7, title: 'Distributors by average order value', description: 'Average order value per distributor', query: 'Calculate average order value per distributor', category: 'distributors', icon: 'users' },
    { id: 8, title: 'Distributor onboarding date range', description: 'Distributors created between two dates', query: 'Show distributors created between 2024-01-01 and 2024-12-31', category: 'distributors', icon: 'users' },
    { id: 9, title: 'Distributors with high return rate', description: 'Distributors sorted by return rate (returns/invoices)', query: 'Show distributors with highest return rate', category: 'distributors', icon: 'users' },
    { id: 10, title: 'Distributor lifetime revenue', description: 'Total invoice value per distributor since first invoice', query: 'Show lifetime invoice total by distributor', category: 'distributors', icon: 'users' },

    // Inventory (10)
    { id: 11, title: 'All products and stock', description: 'List product id, name, unit_price and current_stock', query: 'List products with id, name, unit_price and current_stock', category: 'inventory', icon: 'package' },
    { id: 12, title: 'Low stock products', description: 'Products with current_stock < 20', query: 'Find products with current_stock < 20', category: 'inventory', icon: 'package' },
    { id: 13, title: 'Out of stock products', description: 'Products with current_stock = 0', query: 'Show products where current_stock = 0', category: 'inventory', icon: 'package' },
    { id: 14, title: 'Inventory value by product', description: 'unit_price * current_stock per product', query: 'Calculate inventory value per product (unit_price * current_stock)', category: 'inventory', icon: 'package' },
    { id: 15, title: 'Top inventory value products', description: 'Top 10 products by inventory value', query: 'Show top 10 products by inventory value (unit_price * current_stock)', category: 'inventory', icon: 'package' },
    { id: 16, title: 'Inventory transactions recent', description: 'Inventory movements in last 30 days grouped by product and tx_type', query: 'Show inventory transactions in the last 30 days grouped by product and transaction type', category: 'inventory', icon: 'package' },
    { id: 17, title: 'Products with negative stock adjustments', description: 'Products with recent negative inventory transactions', query: 'Find products with negative inventory transactions in the last 60 days', category: 'inventory', icon: 'package' },
    { id: 18, title: 'Products by supplier/distributor', description: 'List products supplied by distributor id = 5', query: 'Show products supplied by distributor id = 5', category: 'inventory', icon: 'package' },
    { id: 19, title: 'Reorder candidates', description: 'Products with current_stock below reorder threshold (example threshold=50)', query: 'Find products where current_stock < 50', category: 'inventory', icon: 'package' },
    { id: 20, title: 'SKU sample rows', description: 'Show sample rows from products for quick inspection', query: 'Show 10 sample rows from products', category: 'inventory', icon: 'package' },

    // Orders & Invoices (10)
    { id: 21, title: 'Recent orders (30 days)', description: 'Orders placed in the last 30 days', query: 'Show orders from the last 30 days', category: 'orders', icon: 'shopping' },
    { id: 22, title: 'Pending orders', description: 'Orders with status = pending', query: 'Show orders where status = "pending"', category: 'orders', icon: 'shopping' },
    { id: 23, title: 'Orders by distributor', description: 'Orders placed by distributor id = 42 in last 60 days', query: 'Show orders for distributor id = 42 in the last 60 days', category: 'orders', icon: 'shopping' },
    { id: 24, title: 'Large orders over threshold', description: 'Orders with total_amount > 10000', query: 'Show orders with total_amount > 10000', category: 'orders', icon: 'shopping' },
    { id: 25, title: 'Order line items for order', description: 'Line items for order id = 555', query: 'Show order_items for order id = 555', category: 'orders', icon: 'shopping' },
    { id: 26, title: 'Invoice outstanding amounts', description: 'Invoices where outstanding amount > 0', query: 'Show invoices with outstanding amount > 0', category: 'orders', icon: 'shopping' },
    { id: 27, title: 'Cancelled orders', description: 'Orders cancelled in the last 90 days', query: 'Show cancelled orders in the last 90 days', category: 'orders', icon: 'ban' },
    { id: 28, title: 'Order fulfilment times', description: 'Average time from order to invoice per distributor', query: 'Calculate average time from order creation to invoice by distributor', category: 'orders', icon: 'clock' },
    { id: 29, title: 'Invoice items value breakdown', description: 'Show invoice_items with quantity and unit_price for invoice id = 200', query: 'Show invoice_items for invoice id = 200', category: 'orders', icon: 'shopping' },
    { id: 30, title: 'Top selling SKUs (period)', description: 'Top 10 products by sold quantity in last year', query: 'Show top 10 products by sold quantity in the last year', category: 'orders', icon: 'shopping' },

    // Revenue & Payments (10)
    { id: 31, title: 'Net revenue by distributor', description: 'Net revenue = invoices - returns per distributor', query: 'Calculate net revenue by distributor', category: 'revenue', icon: 'chart' },
    { id: 32, title: 'Monthly net revenue (year)', description: 'Monthly net revenue for current year', query: 'Show monthly net revenue for this year', category: 'revenue', icon: 'chart' },
    { id: 33, title: 'Payments summary last quarter', description: 'Total payments by method for the last quarter', query: 'Summarize payments by method for the last quarter', category: 'revenue', icon: 'chart' },
    { id: 34, title: 'Revenue by product', description: 'Net revenue per product (invoices minus returns)', query: 'Calculate net revenue per product', category: 'revenue', icon: 'chart' },
    { id: 35, title: 'Top 10 revenue-generating products', description: 'Products by net revenue', query: 'Show top 10 products by net revenue', category: 'revenue', icon: 'chart' },
    { id: 36, title: 'Revenue growth YoY', description: 'Year-over-year revenue comparison', query: 'Compare total net revenue this year vs last year', category: 'revenue', icon: 'chart' },
    { id: 37, title: 'Outstanding receivables', description: 'Total outstanding invoice amounts grouped by distributor', query: 'Show total outstanding invoice amount by distributor', category: 'revenue', icon: 'chart' },
    { id: 38, title: 'Refunds vs sales', description: 'Total refunds and total sales for last month', query: 'Show total refunds and total sales for last month', category: 'revenue', icon: 'chart' },
    { id: 39, title: 'Average payment delay', description: 'Average days between invoice date and payment date', query: 'Calculate average payment delay (days) per distributor', category: 'revenue', icon: 'clock' },
    { id: 40, title: 'Payment method distribution', description: 'Distribution of payment volume by method', query: 'Show payment volume by payment method', category: 'revenue', icon: 'credit-card' },

    // Returns & Refunds (10)
    { id: 41, title: 'Pending sales returns', description: 'Sales_returns with status = pending', query: 'Show pending sales_returns', category: 'returns', icon: 'return' },
    { id: 42, title: 'Returns this month', description: 'Returns processed this month', query: 'Show sales_returns from this month', category: 'returns', icon: 'return' },
    { id: 43, title: 'Top returned products', description: 'Products with highest returned quantity', query: 'Show products with highest returned quantities', category: 'returns', icon: 'return' },
    { id: 44, title: 'Refund totals by method', description: 'Total refund amounts grouped by refund method for last month', query: 'Summarize refunds by method for last month', category: 'returns', icon: 'credit-card' },
    { id: 45, title: 'Return reasons breakdown', description: 'Count returns grouped by reason', query: 'Count returns grouped by reason', category: 'returns', icon: 'return' },
    { id: 46, title: 'Distributors with frequent returns', description: 'Distributors with return rate above threshold', query: 'Show distributors with return rate > 0.1', category: 'returns', icon: 'users' },
    { id: 47, title: 'Refunds issued this year', description: 'Total refunds issued grouped by month', query: 'Show refunds issued this year grouped by month', category: 'returns', icon: 'return' },
    { id: 48, title: 'Return items sample rows', description: 'Inspect few rows from return_items', query: 'Show 10 sample rows from return_items', category: 'returns', icon: 'table' },
    { id: 49, title: 'Return rate by product', description: 'Return quantity / sold quantity per product', query: 'Calculate return rate per product (returned_qty / sold_qty)', category: 'returns', icon: 'return' },
    { id: 50, title: 'Refunds pending reconciliation', description: 'Refunds with status = pending_reconciliation', query: 'Show refunds with status = "pending_reconciliation"', category: 'returns', icon: 'credit-card' },

    // Analytics & KPIs (10)
    { id: 51, title: 'Average order value', description: 'Average invoice total across all orders', query: 'Calculate average invoice total', category: 'analytics', icon: 'analytics' },
    { id: 52, title: 'Customer lifetime value proxy', description: 'Total invoice amount per customer over lifetime', query: 'Show total invoice amount per customer', category: 'analytics', icon: 'users' },
    { id: 53, title: 'Churn indicator (no orders)', description: 'Distributors with no orders in last 12 months', query: 'Find distributors with no orders in last 12 months', category: 'analytics', icon: 'users' },
    { id: 54, title: 'Sales funnel counts', description: 'Count orders by status (created, invoiced, delivered)', query: 'Count orders grouped by status', category: 'analytics', icon: 'analytics' },
    { id: 55, title: 'Top SKUs trend', description: 'Monthly sold quantity for top 5 SKUs', query: 'Show monthly sold quantity for top 5 products by sales', category: 'analytics', icon: 'chart' },
    { id: 56, title: 'Delivery success rate', description: 'Delivered vs assigned invoices per load plan', query: 'Calculate delivered vs assigned invoice counts per load plan', category: 'analytics', icon: 'truck' },
    { id: 57, title: 'Sales by weekday', description: 'Total sales grouped by weekday', query: 'Show total sales grouped by weekday', category: 'analytics', icon: 'calendar' },
    { id: 58, title: 'Peak order hours', description: 'Hour-of-day distribution of orders', query: 'Show order counts by hour of day', category: 'analytics', icon: 'clock' },
    { id: 59, title: 'Inventory turnover', description: 'Inventory turnover ratio (sold / average stock)', query: 'Calculate inventory turnover ratio per product', category: 'analytics', icon: 'package' },
    { id: 60, title: 'KPI summary dashboard', description: 'High-level KPIs: net revenue, orders count, returns count for last month', query: 'Show net revenue, orders count and returns count for last month', category: 'analytics', icon: 'dashboard' },

    // Schema & Helpers (10)
    { id: 61, title: 'Describe orders table', description: 'Show columns and types for orders table', query: 'Describe the schema of the orders table', category: 'schema', icon: 'database' },
    { id: 62, title: 'Describe products table', description: 'Show columns and types for products table', query: 'Describe the schema of the products table', category: 'schema', icon: 'database' },
    { id: 63, title: 'Sample invoice_items', description: 'Show 10 sample rows from invoice_items', query: 'Show 10 sample rows from invoice_items', category: 'schema', icon: 'table' },
    { id: 64, title: 'Explain plan for sample query', description: 'Return EXPLAIN for a representative read-only query', query: 'Explain select distributor_id, sum(total_amount) from invoices group by distributor_id', category: 'schema', icon: 'tool' },
    { id: 65, title: 'List tables', description: 'Show all table names in the schema', query: 'List all tables in the database schema', category: 'schema', icon: 'database' },
    { id: 66, title: 'Primary keys overview', description: 'Show primary key columns for main tables', query: 'Show primary keys for orders, invoices, products, distributors tables', category: 'schema', icon: 'key' },
    { id: 67, title: 'Foreign key relationships', description: 'Describe foreign-key style joins between orders and order_items', query: 'Show how orders and order_items are related (foreign keys)', category: 'schema', icon: 'link' },
    { id: 68, title: 'Column value distributions', description: 'Value counts for order status column', query: 'Count orders grouped by status', category: 'schema', icon: 'chart' },
    { id: 69, title: 'Sample rows from invoices', description: 'Show 10 sample rows from invoices for data inspection', query: 'Show 10 sample rows from invoices', category: 'schema', icon: 'table' },
    { id: 70, title: 'Ad-hoc read-only check', description: 'Confirm a query is read-only: sample select', query: 'Show 1 row from distributors', category: 'schema', icon: 'check' }
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