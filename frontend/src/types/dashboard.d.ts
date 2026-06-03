// frontend/src/types/dashboard.d.ts

export type ResourceType = 'Document' | 'Link' | 'Note';

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
