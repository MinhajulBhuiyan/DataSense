import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Theme } from '@/types';
import { TEXTAREA_MAX_HEIGHT } from '@/utils/constants';

interface ChatInputProps {
  input: string;
  loading: boolean;
  theme: Theme;
  isScrolled: boolean;
  isRotating: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export interface ChatInputRef {
  focus: () => void;
}

export const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(({
  input,
  loading,
  theme,
  isScrolled,
  isRotating,
  onInputChange,
  onSubmit,
  onStop,
  onKeyPress
}, ref) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Expose focus method to parent
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    }
  }));

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      const autoResize = () => {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, TEXTAREA_MAX_HEIGHT) + 'px';
      };
      autoResize();
    }
  }, [input]);

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 pb-2 pointer-events-none">
      <div className="max-w-5xl mx-auto pointer-events-auto">
        <div 
          className="relative bg-white dark:bg-gray-800 rounded-[28px] border-2 border-green-500 dark:border-green-500 transition-all duration-200 shadow-md shadow-gray-400/10 dark:shadow-black/20"
        >
          <div className="flex gap-2 px-5 py-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyPress={onKeyPress}
                placeholder="How can I assist you?"
                className="w-full bg-transparent border-0 px-2 py-1 text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none resize-none min-h-[24px] max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
                rows={1}
                style={{
                  height: 'auto',
                  minHeight: '24px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 200) + 'px';
                }}
              />
            </div>

            {/* Right side - Send button only */}
            <div className="flex items-center flex-shrink-0">
              {loading ? (
                <button
                  onClick={onStop}
                  className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 flex items-center justify-center flex-shrink-0 active:scale-95"
                  title="Stop generation"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="1" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (input.trim()) {
                      onSubmit();
                    }
                  }}
                  disabled={!input.trim()}
                  className={`p-2.5 rounded-full transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
                    input.trim()
                      ? 'bg-green-600 hover:bg-green-700 text-white active:scale-95'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                  title={input.trim() ? "Send message (Enter)" : "Type a message first"}
                >
                  <svg 
                    className="w-4 h-4"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ChatInput.displayName = 'ChatInput';
