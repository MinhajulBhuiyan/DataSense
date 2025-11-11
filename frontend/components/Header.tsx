import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
  onThemeToggle: () => void;
  onSettingsOpen: () => void;
  onExamplesClick: () => void;
  loraAvailable?: boolean;
}

export function Header({ sidebarOpen, onSidebarToggle, onThemeToggle, onSettingsOpen, onExamplesClick, loraAvailable = false }: HeaderProps) {
  return (
    <header className={cn("bg-accent border-b border-border px-4 py-2.5 flex items-center justify-between shadow-sm", !sidebarOpen && 'pl-16')}>
      <div className="flex items-center gap-2.5">
        {sidebarOpen && (<button onClick={onSidebarToggle} className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors shadow-sm" aria-label="Toggle sidebar"><svg className="w-4 h-4 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>)}
        <img src="/datasense-logo.svg" alt="DataSense Logo" className="w-8 h-8"/>
        <h2 className="text-base font-medium text-foreground">DataSense</h2>
        {loraAvailable && (<span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">Fine-tuned</span>)}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onExamplesClick} className="px-3.5 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">Examples</button>
        <button onClick={onSettingsOpen} className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-all duration-200 shadow-sm" aria-label="Settings"><svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></button>
        <button onClick={onThemeToggle} className="relative p-2 rounded-lg bg-muted hover:bg-muted/80 transition-all duration-200 shadow-sm" aria-label="Toggle theme"><svg className="w-5 h-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg></button>
      </div>
    </header>
  );
}
