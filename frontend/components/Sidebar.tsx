 'use client';

import React, { useState } from 'react';
import { useTheme } from '@/hooks';
import { Conversation } from '@/types';

interface SidebarProps {
  isOpen: boolean;
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
  loraAvailable?: boolean;
}

export function Sidebar({
  isOpen,
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
  selectedModel,
  loraAvailable = false
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const { theme } = useTheme();

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
      className={`${isOpen ? 'w-64' : 'w-12'} border-r border-gray-300 dark:border-gray-700 flex flex-col transition-[width] duration-200 ease-in-out z-50 md:relative md:z-auto shadow-sm`}
      style={{ backgroundColor: 'var(--sidebar-bg, #edf5ee)' }}
    >
      {/* Header */}
      <div 
        className={`p-2 border border-gray-300 dark:border-gray-700 flex items-center ${isOpen ? 'justify-between min-w-64' : 'justify-center min-w-10'}`}
        style={{ backgroundColor: 'var(--sidebar-bg, #edf5ee)' }}
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
              className="p-2 rounded-lg transition-colors group hover:bg-[#08834d] dark:hover:bg-[#08834d] hover:shadow-md"
              aria-label="Close sidebar"
              title="Collapse sidebar"
            >
              <svg className="w-5 h-5 text-gray-700 dark:text-white/80 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </>
        ) : (
          <button
            onClick={onToggle}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors group"
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
          <div className="flex-1 p-3 overflow-y-auto scrollbar-thin border border-gray-200 dark:border-gray-700" style={{ minWidth: '256px' }}>
            {/* New Chat Button */}
            <button
              onClick={onNewChat}
              className="w-full mb-3 px-3 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              style={{ backgroundColor: '#08834d' }}
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>

        {/* Recent Conversations */}
        {conversations.length > 0 && (
          <div className="space-y-2 p-2">
            <div className="flex items-center gap-1 mb-2">
              <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-500/20">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Recent Conversations
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 dark:from-white/30 to-transparent"></div>
            </div>
            <div className="space-y-1">
              {conversations.slice(0, 15).map((conv) => (
                <div
                  key={conv.id}
                  className={`w-full group relative rounded-md cursor-pointer flex items-center px-1 py-0.2 ${
                    currentConversationId === conv.id
                      ? 'bg-[#08834d] dark:bg-[#08834d] border-[#08834d] text-white'
                      : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10'
                  } hover:bg-[#08834d] dark:hover:bg-[#08834d] hover:shadow-md border`}
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
                        className="w-full px-2 py-0.5 text-sm bg-white dark:bg-white/10 text-gray-900 dark:text-white border border-green-400 dark:border-white/40 rounded focus:outline-none focus:ring-1 focus:ring-green-500 dark:focus:ring-white/60"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 w-full">
                      <div className="flex-1 min-w-0 px-2 py-1">
                        <p className={`${currentConversationId === conv.id ? 'text-sm text-white font-medium truncate' : 'text-sm text-gray-900 dark:text-white font-medium truncate group-hover:text-white'}`}>
                          {conv.name}
                        </p>
                        {/* message count intentionally removed to reduce clutter */}
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRenameStart(conv);
                          }}
                          className="p-1 hover:bg-red-500/20 dark:hover:bg-red-600/20 rounded transition-colors"
                          title="Rename"
                        >
                          <svg className={`w-3.5 h-3.5 ${currentConversationId === conv.id ? 'text-white' : 'text-gray-700 dark:text-white/70 group-hover:text-white'} transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this conversation?')) {
                              onConversationDelete(conv.id);
                            }
                          }}
                          className="p-1 hover:bg-red-500/20 dark:hover:bg-red-600/20 rounded transition-colors relative z-10 text-white hover:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <svg className="w-3.5 h-3.5 text-current transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
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
          className="border border-gray-300 dark:border-gray-700 min-w-64"
          style={{ backgroundColor: 'var(--sidebar-bg, #edf5ee)' }}
        >
          {/* Action Buttons */}
            <div className="p-2 space-y-1">
            <button
              onClick={onExamplesClick}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-white/80 rounded-lg transition-colors flex items-center gap-2 group hover:bg-[#08834d] dark:hover:bg-[#08834d] hover:shadow-md hover:text-white"
            >
              <svg className="w-4 h-4 text-gray-700 dark:text-white/80 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-sm text-gray-700 dark:text-white/80 group-hover:text-white">Examples</span>
            </button>
            
            <button
              onClick={onSettingsOpen}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-white/80 rounded-lg transition-colors flex items-center gap-1 group hover:bg-[#08834d] dark:hover:bg-[#08834d] hover:shadow-md hover:text-white"
            >
              <svg className="w-4 h-4 text-gray-700 dark:text-white/80 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm text-gray-700 dark:text-white/80 group-hover:text-white">Settings</span>
            </button>

            <button
              onClick={onThemeToggle}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-white/80 rounded-lg transition-colors flex items-center gap-2 group hover:bg-[#08834d] dark:hover:bg-[#08834d] hover:shadow-md hover:text-white"
            >
              {theme === 'light' ? (
                <>
                  {/* show moon icon and 'Dark mode' when current is light */}
                  <svg className="w-4 h-4 text-gray-700 dark:text-white/80 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                  <span className="text-sm text-gray-700 dark:text-white/80 group-hover:text-white">Dark mode</span>
                </>
              ) : (
                <>
                  {/* show sun icon and 'Light mode' when current is dark */}
                  <svg className="w-4 h-4 text-gray-700 dark:text-white/80 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M7.05 7.05L5.636 5.636" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                  <span className="text-sm text-gray-700 dark:text-white/80 group-hover:text-white">Light mode</span>
                </>
              )}
            </button>
          </div>

          {/* Model indicator (minimal) */}
          {selectedModel && (
            <div className="px-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-white/60">Model</span>
                <div className="flex items-center gap-1">
                  <span className="text-gray-900 dark:text-white text-sm font-medium">{selectedModel}</span>
                  {loraAvailable && (
                    <span className="px-1.5 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded font-medium">
                      LoRA
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Connection Status */}
          <div className="px-3 py-2 border-t border-gray-300 dark:border-gray-700">
            <div className="flex items-center gap-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-gray-600 dark:text-white/60">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Collapsed sidebar - Icon buttons only */
        <div className="flex-1 flex flex-col items-center py-2 gap-2">
          <button
            onClick={onNewChat}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            title="New Chat"
            style={{ backgroundColor: '#08834d' }}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          
          <div className="flex-1" />
          
          <button
            onClick={onExamplesClick}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors group hover:bg-[#08834d] dark:hover:bg-[#08834d] hover:shadow-md"
            title="Examples"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-white group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </button>
          
          <button
            onClick={onSettingsOpen}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors group hover:bg-[#08834d] dark:hover:bg-[#08834d] hover:shadow-md"
            title="Settings"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-white group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          <button
            onClick={onThemeToggle}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors group hover:bg-[#08834d] dark:hover:bg-[#08834d] hover:shadow-md"
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5 text-gray-700 dark:text-white group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700 dark:text-white group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M7.05 7.05L5.636 5.636" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            )}
          </button>
          
          <div className="h-2" />
          
          {/* Connection indicator */}
          <div 
            className="w-2.5 h-2.5 rounded-full mb-1"
            title={isConnected ? 'Connected' : 'Disconnected'}
            style={{
              backgroundColor: isConnected ? '#22C55E' : '#EF4444'
            }}
          />
        </div>
      )}
    </div>
  );
}
