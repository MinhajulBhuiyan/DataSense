/**
 * Type definitions for DataSense application
 */

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sql?: string;
  results?: any[];
  columns?: string[];
  error?: string;
  rowCount?: number;
  has_more?: boolean;
  exportToken?: string;
  previewCount?: number;
  timestamp: Date;
  liked?: boolean;
  disliked?: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'bn';
export type SettingsTab = 'model' | 'schema' | 'help' | 'language';

export interface Translation {
  appName: string;
  tagline: string;
  databaseAssistant: string;
  newChat: string;
  exampleQueries: string;
  viewExampleQueries: string;
  recentQueries: string;
  connected: string;
  disconnected: string;
  checking: string;
  welcomeTitle: string;
  welcomeMessage: string;
  inputPlaceholder: string;
  send: string;
  sendOrPressEnter: string;
  processing: string;
  like: string;
  dislike: string;
  copyCsv: string;
  retry: string;
  sqlQuery: string;
  results: string;
  rows: string;
  settings: string;
  close: string;
  save: string;
  model: string;
  schema: string;
  language: string;
  help: string;
  recentConversations: string;
  rename: string;
  delete: string;
  deleteConversation: string;
  renameConversation: string;
}
