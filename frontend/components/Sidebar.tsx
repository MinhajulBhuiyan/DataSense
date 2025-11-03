import React, { useState } from 'react';
import { Theme, Conversation } from '@/types';

interface SidebarProps {
  isOpen: boolean;
  theme: Theme;
  conversations: Conversation[];
  currentConversationId: string | null;
  isConnected: boolean | null;
  onToggle: () => void;
  onNewChat: () => void;
  onConversationSelect: (id: string) => void;
  onConversationRename: (id: string, newName: string) => void;
  onConversationDelete: (id: string) => void;
  onExamplesClick: () => void;
  onThemeToggle: () => void;
  onSettingsOpen: () => void;
  selectedModel?: string;
}

export function Sidebar({
  isOpen,
  theme,
  conversations,
  currentConversationId,
  isConnected,
  onToggle,
  onNewChat,
  onConversationSelect,
  onConversationRename,
  onConversationDelete,
  onExamplesClick,
  onThemeToggle,
  onSettingsOpen,
  selectedModel
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const handleRenameStart = (conv: Conversation) => {
    setEditingId(conv.id);
    setEditingName(conv.name);
    setMenuOpenId(null);
  };

  const handleRenameSave = (id: string) => {
    if (editingName.trim()) {
      onConversationRename(id, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleRenameCancel = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <div 
      className={`${isOpen ? 'w-64' : 'w-12'} bg-gray-50 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 flex flex-col transition-[width] duration-200 ease-in-out z-50 md:relative md:z-auto shadow-sm shadow-green-900/10 dark:shadow-xl dark:shadow-black/20`}
      style={theme === 'light' ? { backgroundColor: '#edf5ee' } : undefined}
    >
      {/* Header */}
      <div 
        className={`p-2 border-b border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center ${isOpen ? 'justify-between min-w-64' : 'justify-center min-w-10'}`}
        style={theme === 'light' ? { backgroundColor: '#f5faf7' } : undefined}
      >
        {isOpen ? (
          <>
            <div className="flex items-center gap-2">
              <img 
                src="/datasense-logo.svg" 
                alt="DataSense Logo" 
                className="w-8 h-8"
              />
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                DataSense
              </h1>
            </div>
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
              aria-label="Close sidebar"
              title="Collapse sidebar"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </>
        ) : (
          <button
            onClick={onToggle}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
            aria-label="Open sidebar"
            title="Expand sidebar"
          >
            <img 
              src="/datasense-logo.svg" 
              alt="DataSense" 
              className="w-7 h-7"
            />
          </button>
        )}
      </div>

      {/* Content - Only show when open */}
      {isOpen && (
        <>
          <div className="flex-1 p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-green-500 dark:scrollbar-thumb-green-400 scrollbar-track-green-100 dark:scrollbar-track-green-900/20 hover:scrollbar-thumb-green-600 dark:hover:scrollbar-thumb-green-300" style={{ minWidth: '256px' }}>
            {/* New Chat Button */}
            <button
              onClick={onNewChat}
              className="w-full mb-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center gap-2"
              style={theme === 'light' ? { backgroundColor: '#d0d6d2' } : undefined}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>

        {/* Recent Conversations */}
        {conversations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 mb-2">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Recent Conversations
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 dark:from-gray-600 to-transparent"></div>
            </div>
            <div className="space-y-1">
              {conversations.slice(0, 15).map((conv) => (
                <div
                  key={conv.id}
                  className={`w-full group relative rounded-md cursor-pointer flex items-center px-1 py-0.1 ${
                    currentConversationId === conv.id
                      ? 'bg-green-200 dark:bg-green-900/50 border-green-400 dark:border-green-500'
                      : 'bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-200 dark:hover:border-green-700'
                  } border hover:shadow-sm hover:shadow-green-900/10 dark:hover:shadow-lg dark:hover:shadow-black/20`}
                  onClick={() => editingId !== conv.id && onConversationSelect(conv.id)}
                >
                  {editingId === conv.id ? (
                    <div className="p-1">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRenameSave(conv.id);
                          if (e.key === 'Escape') handleRenameCancel();
                        }}
                        onBlur={() => handleRenameSave(conv.id)}
                        className="w-full px-2 py-0.5 text-sm bg-white dark:bg-gray-700 border border-green-500 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 w-full">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${
                          'text-gray-900 dark:text-white'
                        }`} title={conv.name}>
                          {conv.name}
                        </p>
                      </div>
                      
                      {/* Three-dot menu */}
                      <div className="relative flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpenId(menuOpenId === conv.id ? null : conv.id);
                          }}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Options"
                        >
                          <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                        
                        {/* Dropdown menu */}
                        {menuOpenId === conv.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setMenuOpenId(null)}
                            />
                            <div className="absolute right-0 top-6 z-20 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRenameStart(conv);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Rename
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onConversationDelete(conv.id);
                                  setMenuOpenId(null);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
        </>
      )}

      {/* Footer with Actions */}
      {isOpen ? (
        <div 
          className="border-t border-gray-300 dark:border-gray-700 min-w-64 bg-gray-100 dark:bg-gray-800"
          style={theme === 'light' ? { backgroundColor: '#f5faf7' } : undefined}
        >
          {/* Action Buttons */}
            <div className="p-2 space-y-1">
            <button
              onClick={onExamplesClick}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Examples
            </button>
            
            <button
              onClick={onSettingsOpen}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>

            <button
              onClick={onThemeToggle}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
            >
              {theme === 'light' ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  Dark mode
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Light mode
                </>
              )}
            </button>
          </div>

          {/* Model indicator (minimal) */}
          <div className="px-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">Model</span>
              <span className="text-gray-800 dark:text-gray-100 text-sm font-medium">{selectedModel ?? 'llama3:8b'}</span>
            </div>
          </div>

          {/* Connection Status */}
          <div className="px-3 py-2 border-t border-gray-300 dark:border-gray-700">
            <div className="flex items-center gap-2 text-xs">
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
      ) : (
        /* Collapsed sidebar - Icon buttons only */
        <div className="flex-1 flex flex-col items-center py-2 gap-2">
          <button
            onClick={onNewChat}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 transition-colors"
            title="New Chat"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          
          <div className="flex-1" />
          
          <button
            onClick={onExamplesClick}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Examples"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </button>
          
          <button
            onClick={onSettingsOpen}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Settings"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          <button
            onClick={onThemeToggle}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title={theme === 'light' ? 'Dark mode' : 'Light mode'}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
          
          <div className="h-2" />
          
          {/* Connection indicator */}
          <div 
            className="w-2.5 h-2.5 rounded-full mb-1"
            title={isConnected === null ? 'Checking...' : isConnected ? 'Connected' : 'Disconnected'}
            style={{
              backgroundColor: isConnected === null ? '#EAB308' : isConnected ? '#22C55E' : '#EF4444'
            }}
          />
        </div>
      )}
    </div>
  );
}
