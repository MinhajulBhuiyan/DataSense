'use client';

import { useState, useEffect, useRef } from 'react';
import { Message as MessageType, SettingsTab, Language } from '@/types';
import { Sidebar, Message, ChatInput } from '@/components';
import type { ChatInputRef } from '@/components/ChatInput';
import { useTheme, useConnectionStatus, useConversations } from '@/hooks';
import { translations } from '@/utils/translations';
import { API_BASE_URL, STORAGE_KEYS, COPIED_MESSAGE_DURATION } from '@/utils/constants';
import { generateMessageId, convertToCSV, copyToClipboard } from '@/utils/helpers';

export default function Home() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const abortedHandledRef = useRef(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('llama3:8b');
  const [language, setLanguage] = useState<Language>('en');
  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTab>('model');
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [loraAvailable, setLoraAvailable] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<ChatInputRef>(null);
  
  const { theme, toggleTheme, mounted } = useTheme();
  const { isConnected, loraAvailable: loraStatus } = useConnectionStatus();
  const mountedRef = useRef(true);

  // Update loraAvailable when loraStatus changes
  useEffect(() => {
    setLoraAvailable(loraStatus);
  }, [loraStatus]);
  const {
    conversations,
    currentConversationId,
    currentConversation,
    createNewConversation,
    updateConversation,
    renameConversation,
    deleteConversation,
    switchConversation
  } = useConversations();

  const messages = currentConversation?.messages || [];

  // Translation helper
  const t = (key: keyof typeof translations.en) => translations[language][key];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    // Load model preference from localStorage
    const savedModel = localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL);
    if (savedModel) {
      setSelectedModel(savedModel);
    }
    
    // Load sidebar state from localStorage
    const savedSidebarState = localStorage.getItem(STORAGE_KEYS.SIDEBAR_OPEN);
    if (savedSidebarState !== null) {
      setSidebarOpen(JSON.parse(savedSidebarState));
    }
    
    // Check for selected query from examples page
    const selectedQuery = localStorage.getItem(STORAGE_KEYS.SELECTED_QUERY);
    if (selectedQuery) {
      setInput(selectedQuery);
      localStorage.removeItem(STORAGE_KEYS.SELECTED_QUERY);
    }
  }, []);

  // Track component mount state and ensure any in-flight request is aborted on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (abortController) {
        try {
          abortedHandledRef.current = true;
          abortController.abort();
        } catch (e) {
          // ignore
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_OPEN, JSON.stringify(newState));
  };

  const saveSettings = () => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL, selectedModel);
    setSettingsOpen(false);
  };

  const sendQuery = async () => {
    if (!input.trim() || loading) return;

    const queryText = input.trim();

    const userMessage: MessageType = {
      id: generateMessageId(),
      role: 'user',
      content: queryText,
      timestamp: new Date()
    };

    // Create new conversation if none exists, or add to current
    let convId = currentConversationId;
    if (!convId) {
      const newConv = createNewConversation(userMessage);
      convId = newConv.id;
    } else {
      updateConversation(convId, [...messages, userMessage]);
    }

    setInput('');
    setLoading(true);

  const controller = new AbortController();
  // mark that no external stop has been handled yet for this request
  abortedHandledRef.current = false;
  setAbortController(controller);

    try {
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: userMessage.content,
          model: selectedModel 
        }),
        signal: controller.signal,
      });

      const data = await response.json();

      const assistantMessage: MessageType = {
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
        has_more: data.has_more,
        exportToken: data.export_token,
        previewCount: data.preview_count,
        timestamp: new Date()
      };

      if (convId) {
        const currentMessages = currentConversationId === convId ? messages : [];
        updateConversation(convId, [...currentMessages, userMessage, assistantMessage]);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // If we already handled the abort (stop button), don't add duplicate message
        if (!abortedHandledRef.current) {
          const abortedMessage: MessageType = {
            id: generateMessageId(),
            role: 'assistant',
            content: 'Query execution was stopped.',
            timestamp: new Date()
          };
          if (convId) {
            updateConversation(convId, [...messages, userMessage, abortedMessage]);
          }
        }
      } else {
        const errorMessage: MessageType = {
          id: generateMessageId(),
          role: 'assistant',
          content: 'Failed to connect to the backend server. Please ensure the API server is running.',
          error: 'Connection error',
          timestamp: new Date()
        };
        if (convId && mountedRef.current) {
          updateConversation(convId, [...messages, userMessage, errorMessage]);
        }
      }
    } finally {
      // Only update local component state if still mounted
      if (mountedRef.current) {
        setLoading(false);
        setAbortController(null);
      }
    }
  };

  // Export full result as XLSX using export token returned by backend
  const handleExport = async (token?: string) => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(`Export failed: ${err.error || res.statusText}`);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export_${Date.now()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      alert('Export failed: ' + (e.message || e));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const stopGeneration = () => {
    // Immediate stop: abort the request and insert a stopped message so user sees instant feedback
    if (abortController) {
      try {
        console.log('stopGeneration: aborting controller', abortController);
        abortedHandledRef.current = true;
        abortController.abort();
      } catch (e) {
        console.warn('stopGeneration: error while aborting', e);
      }
      setAbortController(null);
      setLoading(false);

      const abortedMessage: MessageType = {
        id: generateMessageId(),
        role: 'assistant',
        content: 'Query execution was stopped.',
        timestamp: new Date()
      };

      if (currentConversationId) {
        // append aborted message to current conversation messages
        updateConversation(currentConversationId, [...messages, abortedMessage]);
      }
    }
  };

  const retryMessage = async (messageId: string) => {
    if (!currentConversationId) return;
    
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex <= 0) return;
    
    const userMessage = messages[messageIndex - 1];
    if (userMessage.role !== 'user') return;

    const updatedMessages = messages.filter(m => m.id !== messageId);
    updateConversation(currentConversationId, updatedMessages);
    setLoading(true);

    const queryText = userMessage.content;

    try {
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: queryText,
          model: selectedModel 
        }),
      });

      const data = await response.json();

      const assistantMessage: MessageType = {
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
        has_more: data.has_more,
        exportToken: data.export_token,
        previewCount: data.preview_count,
        timestamp: new Date()
      };

      updateConversation(currentConversationId, [...updatedMessages, assistantMessage]);
    } catch (error) {
      const errorMessage: MessageType = {
        id: generateMessageId(),
        role: 'assistant',
        content: 'Failed to connect to the backend server. Please ensure the API server is running.',
        error: 'Connection error',
        timestamp: new Date()
      };
      updateConversation(currentConversationId, [...updatedMessages, errorMessage]);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const handleLike = (messageId: string) => {
    if (!currentConversationId) return;
    
    const updatedMessages = messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, liked: !msg.liked, disliked: false }
        : msg
    );
    updateConversation(currentConversationId, updatedMessages);
  };

  const handleDislike = (messageId: string) => {
    if (!currentConversationId) return;
    
    const updatedMessages = messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, disliked: !msg.disliked, liked: false }
        : msg
    );
    updateConversation(currentConversationId, updatedMessages);
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

  const copyAsCSV = async (message: MessageType) => {
    const csvContent = convertToCSV(message);
    const success = await copyToClipboard(csvContent);
    
    if (success) {
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), COPIED_MESSAGE_DURATION);
    }
  };

  const navigateToExamples = () => {
    window.location.href = '/examples';
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-200 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        conversations={conversations}
        currentConversationId={currentConversationId}
        isConnected={isConnected}
        onToggle={toggleSidebar}
        onNewChat={() => {
          createNewConversation();
          // Focus the input after a short delay to ensure component is rendered
          setTimeout(() => {
            chatInputRef.current?.focus();
          }, 100);
        }}
        onConversationSelect={switchConversation}
        onConversationRename={renameConversation}
        onConversationDelete={deleteConversation}
        onExamplesClick={navigateToExamples}
        onThemeToggle={toggleTheme}
        onSettingsOpen={() => setSettingsOpen(true)}
        selectedModel={selectedModel}
        loraAvailable={loraAvailable}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 pb-60 scrollbar-thin scrollbar-thumb-green-500 dark:scrollbar-thumb-green-400 scrollbar-track-green-100 dark:scrollbar-track-green-900/20 hover:scrollbar-thumb-green-600 dark:hover:scrollbar-thumb-green-300 bg-gray-100 dark:bg-gray-900">
          <div className="max-w-[1400px] mx-auto">
            {messages.length === 0 && (
              <div className="text-center py-20 flex items-center justify-center min-h-[60vh]">
                <div className="max-w-lg">
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-gray-500/40 dark:shadow-2xl dark:shadow-black/70 border-2 border-gray-300/50 dark:border-gray-600/50" 
                    style={{ 
                      backgroundColor: theme === 'light' ? 'rgba(8, 131, 77, 0.12)' : 'rgba(8, 131, 77, 0.25)',
                      backdropFilter: 'blur(10px)'
                    }}>
                    <svg className="w-12 h-12" style={{ color: '#08834d' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 drop-shadow-sm">
                    {t('welcomeTitle')}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-xl leading-relaxed">
                    {t('welcomeMessage')}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  onLike={handleLike}
                  onDislike={handleDislike}
                  onCopyCSV={copyAsCSV}
                  onRetry={retryMessage}
                  onExport={handleExport}
                />
              ))}

              {loading && (
                <div className="flex justify-center">
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{t('processing')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Floating Input Area */}
        <ChatInput
          ref={chatInputRef}
          input={input}
          loading={loading}
          isScrolled={isScrolled}
          isRotating={isRotating}
          onInputChange={setInput}
          onSubmit={sendQuery}
          onStop={stopGeneration}
          onKeyPress={handleKeyPress}
        />
      </div>

      {/* Copied Message Notification */}
      {showCopiedMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg dark:shadow-xl dark:shadow-black/30 flex items-center gap-2 animate-fade-in">
          <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium">Copied to clipboard!</span>
        </div>
      )}

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h2>
                <button
                  onClick={() => setSettingsOpen(false)}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-red-500 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Tabs */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setActiveSettingsTab('model')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeSettingsTab === 'model'
                      ? 'text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  style={activeSettingsTab === 'model' ? { backgroundColor: '#08834d' } : {}}
                >
                  Model
                </button>
                <button
                  onClick={() => setActiveSettingsTab('language')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeSettingsTab === 'language'
                      ? 'text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  style={activeSettingsTab === 'language' ? { backgroundColor: '#08834d' } : {}}
                >
                  Language
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Model Settings */}
              {activeSettingsTab === 'model' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">LLM Model Selection</h3>
                  
                  <div className="grid grid-cols-2 gap-2">
                      <label
                        className={`group flex items-center p-2 border rounded-md transition-all duration-200 cursor-pointer ${selectedModel === 'llama3:8b' ? 'bg-[#08834d] dark:bg-[#08834d] border-[#08834d] text-white' : 'bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 hover:bg-[#08834d] dark:hover:bg-[#08834d] hover:shadow-md'}`}
                      >
                        <input
                          type="radio"
                          name="model"
                          value="llama3:8b"
                          checked={selectedModel === 'llama3:8b'}
                          onChange={(e) => setSelectedModel(e.target.value)}
                          className="w-4 h-4 accent-[#08834d] bg-transparent dark:bg-transparent border border-gray-300 dark:border-gray-600"
                        />
                        <div className="ml-2">
                          <div className={`${selectedModel === 'llama3:8b' ? 'text-white font-medium' : 'text-gray-900 dark:text-white group-hover:text-white'} font-medium text-base`}>Llama 3 8B</div>
                        </div>
                      </label>

                      <label
                        className={`group flex items-center p-2 border rounded-md transition-all duration-200 cursor-pointer ${selectedModel === 'qwen2.5-coder' ? 'bg-[#08834d] dark:bg-[#08834d] border-[#08834d] text-white' : 'bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 hover:bg-[#08834d] dark:hover:bg-[#08834d] hover:shadow-md'}`}
                      >
                        <input
                          type="radio"
                          name="model"
                          value="qwen2.5-coder"
                          checked={selectedModel === 'qwen2.5-coder'}
                          onChange={(e) => setSelectedModel(e.target.value)}
                          className="w-4 h-4 accent-[#08834d] bg-transparent dark:bg-transparent border border-gray-300 dark:border-gray-600"
                        />
                        <div className="ml-2">
                          <div className={`${selectedModel === 'qwen2.5-coder' ? 'text-white font-medium' : 'text-gray-900 dark:text-white group-hover:text-white'} font-medium text-base`}>Qwen 2.5 Coder</div>
                        </div>
                      </label>

                      <label
                        className={`group flex items-center p-2 border rounded-md transition-all duration-200 cursor-pointer ${selectedModel === 'sqlcoder:7b' ? 'bg-[#08834d] dark:bg-[#08834d] border-[#08834d] text-white' : 'bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 hover:bg-[#08834d] dark:hover:bg-[#08834d] hover:shadow-md'}`}
                      >
                        <input
                          type="radio"
                          name="model"
                          value="sqlcoder:7b"
                          checked={selectedModel === 'sqlcoder:7b'}
                          onChange={(e) => setSelectedModel(e.target.value)}
                          className="w-4 h-4 accent-[#08834d] bg-transparent dark:bg-transparent border border-gray-300 dark:border-gray-600"
                        />
                        <div className="ml-2">
                          <div className={`${selectedModel === 'sqlcoder:7b' ? 'text-white font-medium' : 'text-gray-900 dark:text-white group-hover:text-white'} font-medium text-base`}>SQLCoder 7B</div>
                        </div>
                      </label>

                      <label
                        className={`group flex items-center p-2 border rounded-md transition-all duration-200 cursor-pointer ${selectedModel === 'deepseek-coder:6.7b' ? 'bg-[#08834d] dark:bg-[#08834d] border-[#08834d] text-white' : 'bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 hover:bg-[#08834d] dark:hover:bg-[#08834d] hover:shadow-md'}`}
                      >
                        <input
                          type="radio"
                          name="model"
                          value="deepseek-coder:6.7b"
                          checked={selectedModel === 'deepseek-coder:6.7b'}
                          onChange={(e) => setSelectedModel(e.target.value)}
                          className="w-4 h-4 accent-[#08834d] bg-transparent dark:bg-transparent border border-gray-300 dark:border-gray-600"
                        />
                        <div className="ml-2">
                          <div className={`${selectedModel === 'deepseek-coder:6.7b' ? 'text-white font-medium' : 'text-gray-900 dark:text-white group-hover:text-white'} font-medium text-base`}>DeepSeek Coder 6.7B</div>
                        </div>
                      </label>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Models are served via Ollama running at {API_BASE_URL.replace('/api', '')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Language Settings */}
              {activeSettingsTab === 'language' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Interface Language</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Select your preferred language for the interface
                  </p>
                  
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  >
                    <option value="en">English</option>
                    <option value="bn">বাংলা (Bangla)</option>
                  </select>
                </div>
              )}
            </div>

              <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6 flex justify-end gap-3">
              <button
                onClick={() => setSettingsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
              >
                {t('close')}
              </button>
              <button
                onClick={saveSettings}
                className="px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                style={{ backgroundColor: '#08834d' }}
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
