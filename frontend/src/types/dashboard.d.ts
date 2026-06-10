// frontend/src/types/dashboard.d.ts

export type ResourceType = 'Document' | 'Link' | 'Note';
export type ChatMode = 'Resource Chat' | 'All Resource Chat';

export interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  content: string;
}

export interface ChatMessage {
  role: 'user' | 'ai';
  message: string;
}
