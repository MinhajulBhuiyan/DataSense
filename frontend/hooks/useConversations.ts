import { useState, useEffect } from 'react';
import { Conversation, Message } from '@/types';
import { STORAGE_KEYS, MAX_CONVERSATIONS } from '@/utils/constants';

/**
 * Generate a conversation name from the first user message
 */
function generateConversationName(firstMessage: string): string {
  const maxLength = 40;
  const cleaned = firstMessage.trim();
  
  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  
  // Try to cut at word boundary
  const truncated = cleaned.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.6) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

/**
 * Custom hook for managing conversations with localStorage persistence
 */
export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Load conversations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const conversationsWithDates = parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setConversations(conversationsWithDates);
      } catch (e) {
        console.error('Failed to parse conversations:', e);
      }
    }

    const savedCurrent = localStorage.getItem(STORAGE_KEYS.CURRENT_CONVERSATION);
    if (savedCurrent) {
      setCurrentConversationId(savedCurrent);
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    }
  }, [conversations]);

  // Save current conversation ID
  useEffect(() => {
    if (currentConversationId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_CONVERSATION, currentConversationId);
    }
  }, [currentConversationId]);

  const getCurrentConversation = (): Conversation | null => {
    if (!currentConversationId) return null;
    return conversations.find(c => c.id === currentConversationId) || null;
  };

  const createNewConversation = (firstMessage?: Message): Conversation => {
    const newConversation: Conversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: firstMessage ? generateConversationName(firstMessage.content) : 'New Conversation',
      messages: firstMessage ? [firstMessage] : [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setConversations(prev => {
      const updated = [newConversation, ...prev].slice(0, MAX_CONVERSATIONS);
      return updated;
    });
    setCurrentConversationId(newConversation.id);
    
    return newConversation;
  };

  const updateConversation = (conversationId: string, messages: Message[]) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        // Auto-generate name from first user message if still default
        let newName = conv.name;
        if (conv.name === 'New Conversation' && messages.length > 0) {
          const firstUserMsg = messages.find(m => m.role === 'user');
          if (firstUserMsg) {
            newName = generateConversationName(firstUserMsg.content);
          }
        }

        return {
          ...conv,
          name: newName,
          messages,
          updatedAt: new Date()
        };
      }
      return conv;
    }));
  };

  const renameConversation = (conversationId: string, newName: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId 
        ? { ...conv, name: newName.trim() || conv.name }
        : conv
    ));
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null);
    }
  };

  const switchConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
  };

  return {
    conversations,
    currentConversationId,
    currentConversation: getCurrentConversation(),
    createNewConversation,
    updateConversation,
    renameConversation,
    deleteConversation,
    switchConversation
  };
}
