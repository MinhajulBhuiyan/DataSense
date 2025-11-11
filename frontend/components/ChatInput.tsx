import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { TEXTAREA_MAX_HEIGHT } from '@/utils/constants';

interface ChatInputProps {
  input: string;
  loading: boolean;
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
  <div className="relative bg-white dark:bg-gray-800 rounded-[28px] border-2 border-green-500 transition-all duration-200 shadow-lg shadow-gray-400/20 dark:shadow-gray-900/20">
  <div className="flex gap-2 px-5 py-2 items-center">
            <div className="flex-1 relative">
                <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyPress={onKeyPress}
                placeholder="How can I assist you?"
                className="w-full bg-transparent border-0 px-2 py-2.5 text-base text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none resize-none min-h-[32px] max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent leading-6"
                rows={1}
                style={{
                  height: 'auto',
                  minHeight: '36px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  // reset height to allow shrink/grow correctly
                  target.style.height = 'auto';
                  const newHeight = Math.min(target.scrollHeight, TEXTAREA_MAX_HEIGHT);
                  target.style.height = `${newHeight}px`;
                  // only enable scroll when exceeding max
                  target.style.overflowY = target.scrollHeight > TEXTAREA_MAX_HEIGHT ? 'auto' : 'hidden';
                }}
              />
            </div>

            {/* Right side - Send button only */}
            <div className="ml-auto flex items-center flex-shrink-0">
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
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    input.trim()
                      ? 'bg-[#08834d] hover:bg-[#06693b] text-white shadow-md'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300 cursor-not-allowed border border-gray-300 dark:border-gray-700'
                  }`}
                  title={input.trim() ? "Send message (Enter)" : "Type a message first"}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
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
