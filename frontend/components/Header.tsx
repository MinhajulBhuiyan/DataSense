import React from 'react';
import { Theme } from '@/types';

interface HeaderProps {
  sidebarOpen: boolean;
  theme: Theme;
  onSidebarToggle: () => void;
  onThemeToggle: () => void;
  onSettingsOpen: () => void;
  onExamplesClick: () => void;
}

export function Header({
  sidebarOpen,
  theme,
  onSidebarToggle,
  onThemeToggle,
  onSettingsOpen,
  onExamplesClick
}: HeaderProps) {
  return (
    <header className={`bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 px-4 py-2.5 flex items-center justify-between shadow-sm shadow-green-900/5 dark:shadow-lg dark:shadow-black/10 ${!sidebarOpen ? 'pl-16' : ''}`}>
      <div className="flex items-center gap-2.5">
        {/* Only show header toggle when sidebar is open */}
        {sidebarOpen && (
          <button
            onClick={onSidebarToggle}
            className="p-2 rounded-lg bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors shadow-sm shadow-green-900/10 dark:shadow-md dark:shadow-black/20"
            aria-label="Toggle sidebar"
          >
            <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        
        <img 
          src="/datasense-logo.svg" 
          alt="DataSense Logo" 
          className="w-8 h-8"
        />
        <h2 className="text-base font-medium text-gray-900 dark:text-white">
          DataSense
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onExamplesClick}
          className="px-3.5 py-2 text-sm font-medium hover:text-green-700 dark:hover:text-green-300 transition-colors"
          style={{ color: '#08834d' }}
        >
          Examples
        </button>

        <button
          onClick={onSettingsOpen}
          className="p-2 rounded-lg bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm shadow-green-900/10 dark:shadow-md dark:shadow-black/20"
          aria-label="Settings"
        >
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <button
          onClick={onThemeToggle}
          className="relative p-2 rounded-lg bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm shadow-green-900/10 dark:shadow-md dark:shadow-black/20"
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
  );
}
