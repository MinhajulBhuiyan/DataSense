/**
 * Application constants
 */

export const API_BASE_URL = 'http://localhost:5001/api';

export const STORAGE_KEYS = {
  THEME: 'datasense-theme',
  LANGUAGE: 'datasense-language',
  RECENT_QUERIES: 'datasense-recent-queries',
  CONVERSATIONS: 'datasense-conversations',
  CURRENT_CONVERSATION: 'datasense-current-conversation',
  SIDEBAR_OPEN: 'datasense-sidebar-open',
  SELECTED_QUERY: 'selected-query',
} as const;

export const PRIMARY_COLOR = '#08834d';

export const MAX_RECENT_QUERIES = 10;
export const MAX_CONVERSATIONS = 20;
export const TEXTAREA_MAX_HEIGHT = 200;
export const COPIED_MESSAGE_DURATION = 2000;
