'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sql?: string;
  results?: any[];
  columns?: string[];
  error?: string;
  rowCount?: number;
  timestamp: Date;
  liked?: boolean;
  disliked?: boolean;
}

const API_BASE_URL = 'http://localhost:5001/api';

// Translations
const translations = {
  en: {
    appName: 'DataSense',
    tagline: 'Natural Language to SQL',
    databaseAssistant: 'Database Assistant',
    newChat: 'New Chat',
    exampleQueries: 'Example Queries',
    viewExampleQueries: 'View Example Queries',
    recentQueries: 'Recent Queries',
    connected: 'Connected',
    disconnected: 'Disconnected',
    checking: 'Checking...',
    welcomeTitle: 'Welcome to DataSense',
    welcomeMessage: 'Ask questions about your data in natural language. I\'ll convert them to SQL queries and show you the results.',
    inputPlaceholder: 'Ask a question about your data...',
    send: 'Send',
    sendOrPressEnter: 'Send or press Enter',
    processing: 'Processing your query...',
    like: 'Like',
    dislike: 'Dislike',
    copyCsv: 'Copy CSV',
    retry: 'Retry',
    sqlQuery: 'SQL Query',
    results: 'Results',
    rows: 'rows',
    settings: 'Settings',
    close: 'Close',
    save: 'Save',
    model: 'Model',
    schema: 'Schema',
    language: 'Language',
    help: 'Help',
  },
  bn: {
    appName: 'ডেটাসেন্স',
    tagline: 'প্রাকৃতিক ভাষা থেকে SQL',
    databaseAssistant: 'ডেটাবেস সহায়ক',
    newChat: 'নতুন চ্যাট',
    exampleQueries: 'উদাহরণ প্রশ্ন',
    viewExampleQueries: 'উদাহরণ প্রশ্ন দেখুন',
    recentQueries: 'সাম্প্রতিক প্রশ্ন',
    connected: 'সংযুক্ত',
    disconnected: 'সংযোগ বিচ্ছিন্ন',
    checking: 'পরীক্ষা করা হচ্ছে...',
    welcomeTitle: 'ডেটাসেন্সে স্বাগতম',
    welcomeMessage: 'আপনার ডেটা সম্পর্কে প্রাকৃতিক ভাষায় প্রশ্ন করুন। আমি সেগুলিকে SQL কোয়েরিতে রূপান্তরিত করব এবং ফলাফল দেখাব।',
    inputPlaceholder: 'আপনার ডেটা সম্পর্কে একটি প্রশ্ন জিজ্ঞাসা করুন...',
    send: 'পাঠান',
    sendOrPressEnter: 'পাঠান অথবা Enter চাপুন',
    processing: 'আপনার প্রশ্ন প্রক্রিয়া করা হচ্ছে...',
    like: 'পছন্দ',
    dislike: 'অপছন্দ',
    copyCsv: 'CSV কপি করুন',
    retry: 'পুনরায় চেষ্টা করুন',
    sqlQuery: 'SQL কোয়েরি',
    results: 'ফলাফল',
    rows: 'সারি',
    settings: 'সেটিংস',
    close: 'বন্ধ করুন',
    save: 'সংরক্ষণ করুন',
    model: 'মডেল',
    schema: 'স্কিমা',
    language: 'ভাষা',
    help: 'সাহায্য',
  }
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('llama3-8b');
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [activeSettingsTab, setActiveSettingsTab] = useState<'model' | 'schema' | 'help' | 'language'>('model');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  // Translation helper
  const t = (key: keyof typeof translations.en) => translations[language][key];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      const autoResize = () => {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
      };
      autoResize();
    }
  }, [input]);

  // Single useEffect to handle theme initialization
  useEffect(() => {
    setMounted(true);
    
    // Initialize theme from localStorage or system preference
    const savedTheme = window.localStorage.getItem('datasense-theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    
    // Apply theme immediately
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem('datasense-language') as 'en' | 'bn' | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    // Load recent queries from localStorage
    const saved = localStorage.getItem('datasense-recent-queries');
    if (saved) {
      try {
        setRecentQueries(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent queries:', e);
      }
    }
    
    // Load sidebar state from localStorage
    const savedSidebarState = localStorage.getItem('datasense-sidebar-open');
    if (savedSidebarState !== null) {
      setSidebarOpen(JSON.parse(savedSidebarState));
    }
    
    // Check for selected query from examples page
    const selectedQuery = localStorage.getItem('selected-query');
    if (selectedQuery) {
      setInput(selectedQuery);
      localStorage.removeItem('selected-query');
    }
  }, []);

  // Apply theme changes when theme state changes (after mount)
  useEffect(() => {
    if (!mounted) return;

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    window.localStorage.setItem('datasense-theme', theme);
  }, [theme, mounted]);

  useEffect(() => {
    checkConnection();
  }, []);

  // Handle scroll effect for input area
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('overflow-y-auto')) {
        setIsScrolled(target.scrollTop > 20);
      }
    };

    const scrollContainers = document.querySelectorAll('.overflow-y-auto');
    scrollContainers.forEach(container => {
      container.addEventListener('scroll', handleScroll);
    });

    return () => {
      scrollContainers.forEach(container => {
        container.removeEventListener('scroll', handleScroll);
      });
    };
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      setIsConnected(response.ok);
    } catch {
      setIsConnected(false);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const generateMessageId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const saveRecentQuery = (query: string) => {
    const updatedQueries = [query, ...recentQueries.filter(q => q !== query)].slice(0, 10);
    setRecentQueries(updatedQueries);
    localStorage.setItem('datasense-recent-queries', JSON.stringify(updatedQueries));
  };

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('datasense-sidebar-open', JSON.stringify(newState));
  };

  const saveSettings = () => {
    localStorage.setItem('datasense-language', language);
    setSettingsOpen(false);
  };

  const sendQuery = async () => {
    if (!input.trim() || loading) return;

    const queryText = input.trim();
    saveRecentQuery(queryText);

    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content: queryText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Create new AbortController for this request
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage.content }),
        signal: controller.signal,
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: data.error ? data.error : data.success ? 
          `Query executed successfully. ${data.row_count || 0} rows returned.` :
          'Query completed.',
        sql: data.sql_query,
        results: data.results || [],
        columns: data.columns || [],
        error: data.error,
        rowCount: data.row_count,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        const abortedMessage: Message = {
          id: generateMessageId(),
          role: 'assistant',
          content: 'Query execution was stopped.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, abortedMessage]);
      } else {
        const errorMessage: Message = {
          id: generateMessageId(),
          role: 'assistant',
          content: 'Failed to connect to the backend server. Please ensure the API server is running.',
          error: 'Connection error',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setLoading(false);
      setAbortController(null);
      inputRef.current?.focus();
    }
  };

  const stopGeneration = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setLoading(false);
    }
  };

  const retryMessage = async (messageId: string) => {
    // Find the user message that preceded this assistant message
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex <= 0) return;
    
    const userMessage = messages[messageIndex - 1];
    if (userMessage.role !== 'user') return;

    // Remove the failed assistant message
    setMessages(prev => prev.filter(m => m.id !== messageId));
    setLoading(true);

    const queryText = userMessage.content;

    try {
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: queryText }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: data.error ? data.error : data.success ? 
          `Query executed successfully. ${data.row_count || 0} rows returned.` :
          'Query completed.',
        sql: data.sql_query,
        results: data.results || [],
        columns: data.columns || [],
        error: data.error,
        rowCount: data.row_count,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: 'Failed to connect to the backend server. Please ensure the API server is running.',
        error: 'Connection error',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleLike = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, liked: !msg.liked, disliked: false }
        : msg
    ));
  };

  const handleDislike = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, disliked: !msg.disliked, liked: false }
        : msg
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !loading) {
        setIsRotating(true);
        setTimeout(() => setIsRotating(false), 300);
        sendQuery();
      }
    }
  };

  const clearChat = () => {
    setMessages([]);
    setInput('');
    setLoading(false);
  };

  const copyAsCSV = (message: Message) => {
    if (!message.results || !message.columns) return;
    
    // Create CSV content
    const csvHeader = message.columns.join(',');
    const csvRows = message.results.map(row => 
      message.columns!.map(col => {
        const value = row[col];
        // Escape values that contain commas or quotes
        if (value && typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    );
    
    const csvContent = [csvHeader, ...csvRows].join('\n');
    
    // Copy to clipboard
    navigator.clipboard.writeText(csvContent).then(() => {
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    }).catch(err => {
      console.error('Failed to copy CSV:', err);
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ease-in-out overflow-hidden relative z-50 md:relative md:z-auto ${sidebarOpen ? 'fixed md:relative' : ''}`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 min-w-64">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/datasense-logo.svg" 
                alt="DataSense Logo" 
                className="w-8 h-8"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  DataSense
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Natural Language to SQL
                </p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors md:hidden"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto min-w-64">
          <button
            onClick={clearChat}
            className="w-full mb-4 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            New Chat
          </button>

          {/* Examples Button */}
          <button
            onClick={() => window.location.href = '/examples'}
            className="w-full mb-6 px-4 py-3 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors border border-green-200 dark:border-green-800"
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0012 15c-2.34 0-4.513.751-6.283 2.018A7.962 7.962 0 013 18.001M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Example Queries
            </div>
          </button>

          {/* Recent Queries */}
          {recentQueries.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recent Queries
              </h3>
              {recentQueries.slice(0, 8).map((query, index) => (
                <button
                  key={index}
                  onClick={() => setInput(query)}
                  className="w-full text-left p-3 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors line-clamp-2"
                  title={query}
                >
                  {query.length > 50 ? `${query.substring(0, 50)}...` : query}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Connection Status */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 min-w-64">
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${
              isConnected === null ? 'bg-yellow-500' :
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-gray-600 dark:text-gray-400">
              {isConnected === null ? 'Checking...' :
               isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Floating Sidebar Toggle Button - Only show when sidebar is closed */}
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="fixed top-4 left-4 z-50 p-3 rounded-full hover:bg-green-700 text-white shadow-lg transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: '#08834d' }}
            aria-label="Open sidebar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Only show header toggle when sidebar is open */}
            {sidebarOpen && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle sidebar"
              >
                <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            
            <img 
              src="/datasense-logo.svg" 
              alt="DataSense Logo" 
              className="w-8 h-8"
            />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Database Assistant
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => window.location.href = '/examples'}
              className="px-4 py-2 text-sm font-medium hover:text-green-700 dark:hover:text-green-300 transition-colors"
              style={{ color: '#08834d' }}
            >
              Example Queries
            </button>

            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              aria-label="Settings"
            >
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            <button
              onClick={toggleTheme}
              className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 pb-32 scrollbar-thin">
          <div className="max-w-7xl mx-auto">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(8, 131, 77, 0.1)' }}>
                  <svg className="w-8 h-8" style={{ color: '#08834d' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Welcome to DataSense
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Ask questions about your data in natural language. I'll convert them to SQL queries and show you the results.
                </p>
              </div>
            )}

            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-center'}`}>
                  <div className={`${message.role === 'user' ? 'max-w-lg' : 'max-w-6xl w-full'}`}>
                    <div className={`rounded-2xl px-6 py-4 ${
                      message.role === 'user'
                        ? 'bg-gray-600 dark:bg-gray-700 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                    }`}
                    >
                      <div className="text-base whitespace-pre-wrap leading-relaxed">{message.content}</div>
                    </div>

                    {message.sql && !message.error && (
                      <div className="mt-3 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600">
                          SQL Query
                        </div>
                        <pre className="p-4 text-sm text-gray-800 dark:text-green-400 overflow-x-auto bg-white dark:bg-gray-800">
                          {message.sql}
                        </pre>
                      </div>
                    )}

                    {message.results && message.results.length > 0 && message.columns && !message.error && (
                      <div className="mt-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              Results ({message.rowCount || message.results.length} rows)
                            </span>
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                              <tr>
                                {message.columns.map((col, i) => (
                                  <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                              {message.results.map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                  {message.columns!.map((col, j) => (
                                    <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                      {row[col] !== null && row[col] !== undefined ? String(row[col]) : '-'}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {message.error && (
                      <div className="mt-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="text-sm text-red-700 dark:text-red-300">
                            {message.content}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Like/Dislike/Retry buttons for assistant messages - moved to bottom */}
                    {message.role === 'assistant' && (
                      <div className="flex items-center justify-center gap-3 mt-4">
                        <button
                          onClick={() => handleLike(message.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors group border ${
                            message.liked 
                              ? 'bg-gray-100 dark:bg-gray-700 border-gray-400 dark:border-gray-500' 
                              : 'border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          title="Like this response"
                        >
                          <svg className={`w-4 h-4 ${message.liked ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} fill={message.liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span className={`text-sm ${message.liked ? 'text-gray-700 dark:text-gray-300' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>Like</span>
                        </button>
                        <button
                          onClick={() => handleDislike(message.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors group border ${
                            message.disliked 
                              ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700' 
                              : 'border-gray-200 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                          }`}
                          title="Dislike this response"
                        >
                          <svg className={`w-4 h-4 ${message.disliked ? 'text-red-600' : 'text-gray-500 group-hover:text-red-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className={`text-sm ${message.disliked ? 'text-red-600' : 'text-gray-600 dark:text-gray-400 group-hover:text-red-600'}`}>Dislike</span>
                        </button>
                        {message.results && message.columns && (
                          <button
                            onClick={() => copyAsCSV(message)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors group border border-gray-200 dark:border-gray-600"
                            title="Copy results as CSV"
                          >
                            <svg className="w-4 h-4 text-gray-500 group-hover:text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-purple-600">Copy CSV</span>
                          </button>
                        )}
                        <button
                          onClick={() => retryMessage(message.id)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group border border-gray-200 dark:border-gray-600"
                          title="Retry this response"
                        >
                          <svg className="w-4 h-4 text-gray-500 group-hover:text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-blue-600">Retry</span>
                        </button>
                      </div>
                    )}

                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-center">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Processing your query...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Floating Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="max-w-5xl mx-auto">
            <div className={`bg-white dark:bg-gray-800 rounded-2xl border-2 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 transition-all duration-300 ${
              isScrolled 
                ? 'shadow-2xl border-gray-300 dark:border-gray-600' 
                : 'shadow-lg border-gray-300 dark:border-gray-600 ring-2 ring-gray-200 dark:ring-gray-700'
            }`}>
              <div className="flex gap-3 p-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a question about your data..."
                  className="w-full rounded-xl border-0 bg-transparent px-4 py-2 text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0 resize-none min-h-[40px] max-h-[150px] overflow-y-auto"
                  rows={1}
                  style={{
                    height: 'auto',
                    minHeight: '40px'
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 150) + 'px';
                  }}
                />
              </div>
              {loading ? (
                <button
                  onClick={stopGeneration}
                  className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-sm self-end group relative"
                  title="Stop generation"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {/* Tooltip */}
                  <span className="absolute -top-10 right-0 bg-gray-900 dark:bg-gray-700 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Stop
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (input.trim()) {
                      setIsRotating(true);
                      setTimeout(() => setIsRotating(false), 300);
                      sendQuery();
                    }
                  }}
                  disabled={!input.trim()}
                  className="p-3 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm self-end group relative"
                  style={{ backgroundColor: !input.trim() ? '' : '#16a34a' }}
                  title="Send message (Enter)"
                >
                  <svg 
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isRotating ? 'rotate-90' : ''
                    } ${input.trim() ? 'group-hover:rotate-90' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  {/* Tooltip */}
                  <span className="absolute -top-10 right-0 bg-gray-900 dark:bg-gray-700 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Send or press Enter
                  </span>
                </button>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copied Message Notification */}
      {showCopiedMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium">Copied</span>
        </div>
      )}

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h2>
              <button
                onClick={() => setSettingsOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close settings"
              >
                <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 px-6">
              <button
                onClick={() => setActiveSettingsTab('model')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeSettingsTab === 'model'
                    ? 'border-green-600 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Model
              </button>
              <button
                onClick={() => setActiveSettingsTab('schema')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeSettingsTab === 'schema'
                    ? 'border-green-600 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Schema
              </button>
              <button
                onClick={() => setActiveSettingsTab('language')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeSettingsTab === 'language'
                    ? 'border-green-600 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Language
              </button>
              <button
                onClick={() => setActiveSettingsTab('help')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeSettingsTab === 'help'
                    ? 'border-green-600 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Help
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
              {/* Model Tab */}
              {activeSettingsTab === 'model' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Select Model</h3>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 border-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg cursor-pointer">
                      <input
                        type="radio"
                        name="model"
                        value="llama3-8b"
                        checked={selectedModel === 'llama3-8b'}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Llama 3 8B</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Optimized for SQL generation</div>
                      </div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                    Currently using Llama 3 8B model for natural language to SQL conversion.
                  </p>
                </div>
              )}

              {/* Schema Tab */}
              {activeSettingsTab === 'schema' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Database Schema</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Overview of all database tables and their relationships in the distribution management system.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 overflow-x-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-max">
                      
                      {/* Core Tables */}
                      <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">distributors</h4>
                        <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                          <li className="font-medium text-gray-900 dark:text-gray-100">distributor_id (PK)</li>
                          <li>name</li>
                          <li>address</li>
                          <li>contact_phone</li>
                          <li>contact_email</li>
                          <li>registration_date</li>
                          <li>is_active</li>
                        </ul>
                      </div>

                      <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">products</h4>
                        <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                          <li className="font-medium text-gray-900 dark:text-gray-100">product_id (PK)</li>
                          <li>name (UNIQUE)</li>
                          <li>description</li>
                          <li>unit_price</li>
                          <li>current_stock</li>
                          <li>is_active</li>
                        </ul>
                      </div>

                      {/* Order Management */}
                      <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">orders</h4>
                        <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                          <li className="font-medium text-gray-900 dark:text-gray-100">order_id (PK)</li>
                          <li className="text-gray-600 dark:text-gray-400">distributor_id (FK)</li>
                          <li>order_date</li>
                          <li>status</li>
                          <li>total_amount</li>
                          <li>notes</li>
                        </ul>
                      </div>

                      <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">order_items</h4>
                        <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                          <li className="font-medium text-gray-900 dark:text-gray-100">order_item_id (PK)</li>
                          <li className="text-gray-600 dark:text-gray-400">order_id (FK)</li>
                          <li className="text-gray-600 dark:text-gray-400">product_id (FK)</li>
                          <li>quantity</li>
                          <li>price_per_unit</li>
                        </ul>
                      </div>

                      {/* Invoice Management */}
                      <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">invoices</h4>
                        <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                          <li className="font-medium text-gray-900 dark:text-gray-100">invoice_id (PK)</li>
                          <li className="text-gray-600 dark:text-gray-400">order_id (FK)</li>
                          <li>invoice_date</li>
                          <li>status</li>
                          <li>total_amount</li>
                          <li>delivered_amount</li>
                          <li>notes</li>
                        </ul>
                      </div>

                      <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">invoice_items</h4>
                        <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                          <li className="font-medium text-gray-900 dark:text-gray-100">invoice_item_id (PK)</li>
                          <li className="text-gray-600 dark:text-gray-400">invoice_id (FK)</li>
                          <li className="text-gray-600 dark:text-gray-400">product_id (FK)</li>
                          <li>quantity_invoiced</li>
                          <li>quantity_delivered</li>
                          <li>price_per_unit</li>
                        </ul>
                      </div>

                      {/* Returns & Cancellations */}
                      <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">sales_returns</h4>
                        <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                          <li className="font-medium text-gray-900 dark:text-gray-100">return_id (PK)</li>
                          <li className="text-gray-600 dark:text-gray-400">invoice_id (FK)</li>
                          <li>return_date</li>
                          <li>reason</li>
                          <li>total_returned_amount</li>
                          <li>status</li>
                        </ul>
                      </div>

                      <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">return_items</h4>
                        <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                          <li className="font-medium text-gray-900 dark:text-gray-100">return_item_id (PK)</li>
                          <li className="text-gray-600 dark:text-gray-400">return_id (FK)</li>
                          <li className="text-gray-600 dark:text-gray-400">invoice_item_id (FK)</li>
                          <li>quantity_returned</li>
                        </ul>
                      </div>

                      <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">cancellations</h4>
                        <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                          <li className="font-medium text-gray-900 dark:text-gray-100">cancellation_id (PK)</li>
                          <li>reference_id</li>
                          <li>reference_type</li>
                          <li>cancellation_date</li>
                          <li>reason</li>
                        </ul>
                      </div>

                      {/* Logistics */}
                      <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">vehicles</h4>
                        <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                          <li className="font-medium text-gray-900 dark:text-gray-100">vehicle_id (PK)</li>
                          <li>plate_number (UNIQUE)</li>
                          <li>capacity</li>
                          <li>description</li>
                          <li>is_active</li>
                        </ul>
                      </div>

                      <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">load_plans</h4>
                        <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                          <li className="font-medium text-gray-900 dark:text-gray-100">load_plan_id (PK)</li>
                          <li className="text-gray-600 dark:text-gray-400">vehicle_id (FK)</li>
                          <li>plan_date</li>
                          <li>status</li>
                        </ul>
                      </div>

                      <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">load_plan_items</h4>
                        <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                          <li className="font-medium text-gray-900 dark:text-gray-100">load_plan_item_id (PK)</li>
                          <li className="text-gray-600 dark:text-gray-400">load_plan_id (FK)</li>
                          <li className="text-gray-600 dark:text-gray-400">invoice_id (FK)</li>
                          <li>status</li>
                        </ul>
                      </div>

                      <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">challans</h4>
                        <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                          <li className="font-medium text-gray-900 dark:text-gray-100">challan_id (PK)</li>
                          <li className="text-gray-600 dark:text-gray-400">load_plan_id (FK)</li>
                          <li>challan_date</li>
                          <li>details (JSON)</li>
                        </ul>
                      </div>

                      <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">gate_passes</h4>
                        <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                          <li className="font-medium text-gray-900 dark:text-gray-100">gate_pass_id (PK)</li>
                          <li className="text-gray-600 dark:text-gray-400">load_plan_id (FK)</li>
                          <li>gate_pass_date</li>
                          <li>details (JSON)</li>
                        </ul>
                      </div>

                      {/* Financial */}
                      <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">payments</h4>
                        <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                          <li className="font-medium text-gray-900 dark:text-gray-100">payment_id (PK)</li>
                          <li className="text-gray-600 dark:text-gray-400">invoice_id (FK)</li>
                          <li>payment_date</li>
                          <li>amount</li>
                          <li>method</li>
                        </ul>
                      </div>

                      <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">refunds</h4>
                        <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                          <li className="font-medium text-gray-900 dark:text-gray-100">refund_id (PK)</li>
                          <li className="text-gray-600 dark:text-gray-400">invoice_id (FK)</li>
                          <li>refund_date</li>
                          <li>amount</li>
                          <li>method</li>
                          <li>status</li>
                        </ul>
                      </div>

                      {/* Inventory */}
                      <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">inventory_transactions</h4>
                        <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                          <li className="font-medium text-gray-900 dark:text-gray-100">tx_id (PK)</li>
                          <li className="text-gray-600 dark:text-gray-400">product_id (FK)</li>
                          <li>tx_date</li>
                          <li>tx_type</li>
                          <li>quantity</li>
                          <li>reference_id</li>
                        </ul>
                      </div>

                    </div>
                  </div>

                  {/* Relationships Legend */}
                  <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm">Key Relationships</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-700 dark:text-gray-300">
                      <div className="p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                        <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">Order Flow</p>
                        <ul className="space-y-1 pl-2">
                          <li>distributors → orders → order_items → products</li>
                          <li>orders → invoices → invoice_items → products</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                        <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">Returns</p>
                        <ul className="space-y-1 pl-2">
                          <li>invoices → sales_returns → return_items</li>
                          <li>return_items → invoice_items</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                        <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">Logistics</p>
                        <ul className="space-y-1 pl-2">
                          <li>vehicles → load_plans → load_plan_items</li>
                          <li>load_plans → challans / gate_passes</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                        <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">Financial</p>
                        <ul className="space-y-1 pl-2">
                          <li>invoices → payments</li>
                          <li>invoices → refunds</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Language Tab */}
              {activeSettingsTab === 'language' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Interface Language</h3>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 border-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg cursor-pointer">
                      <input
                        type="radio"
                        name="language"
                        value="en"
                        checked={true}
                        readOnly
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">English</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Default interface language</div>
                      </div>
                    </label>

                    <label className="flex items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-not-allowed opacity-50">
                      <input
                        type="radio"
                        name="language"
                        value="bn"
                        checked={false}
                        disabled
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">বাংলা (Bangla)</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Coming soon</div>
                      </div>
                    </label>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <span className="font-semibold">Note:</span> Additional languages will be available in future updates. You can already ask questions in any language!
                    </p>
                  </div>
                </div>
              )}

              {/* Help Tab */}
              {activeSettingsTab === 'help' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Help & Documentation</h3>
                  
                  <div className="space-y-3">
                    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Getting Started
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        DataSense converts your natural language questions into SQL queries for your distribution management database. Simply type your question and get instant results.
                      </p>
                    </div>

                    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Example Queries
                      </h4>
                      <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1.5 mt-2">
                        <p className="font-medium">Orders & Sales:</p>
                        <ul className="pl-4 space-y-0.5">
                          <li>• Show me all pending orders</li>
                          <li>• List top 10 distributors by order value</li>
                          <li>• What are today's deliveries?</li>
                        </ul>
                        <p className="font-medium mt-2">Inventory:</p>
                        <ul className="pl-4 space-y-0.5">
                          <li>• Which products are low in stock?</li>
                          <li>• Show inventory transactions for last week</li>
                        </ul>
                        <p className="font-medium mt-2">Financial:</p>
                        <ul className="pl-4 space-y-0.5">
                          <li>• Show unpaid invoices</li>
                          <li>• List all refunds this month</li>
                        </ul>
                      </div>
                    </div>

                    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Features
                      </h4>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 mt-2">
                        <li>• AI-powered natural language to SQL conversion</li>
                        <li>• Real-time query execution and results</li>
                        <li>• View and verify generated SQL queries</li>
                        <li>• Export query results as CSV</li>
                        <li>• Query history and quick access to recent searches</li>
                        <li>• Dark mode interface</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Troubleshooting
                      </h4>
                      <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1.5 mt-2">
                        <p className="font-medium">Connection Issues:</p>
                        <p className="pl-4">Ensure the backend API server is running on port 5001. Check the connection status indicator in the sidebar.</p>
                        <p className="font-medium mt-2">Query Not Working:</p>
                        <p className="pl-4">Try rephrasing your question or check the Example Queries section for properly formatted questions.</p>
                        <p className="font-medium mt-2">Need More Help:</p>
                        <p className="pl-4">Review the database schema in the Schema tab to understand available tables and relationships.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSettingsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                {t('close')}
              </button>
              <button
                onClick={saveSettings}
                className="px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm hover:shadow-md"
                style={{ backgroundColor: '#16a34a' }}
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}