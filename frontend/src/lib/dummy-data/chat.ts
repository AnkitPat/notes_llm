// frontend/src/lib/dummy-data/chat.ts
import { ChatMessage } from '../../types/dashboard.d';

const dummyChatResponses: { [key: string]: ChatMessage[] } = {
  'doc-1': [
    { role: 'ai', message: 'These meeting notes seem comprehensive. Is there anything specific you would like to know about them?' },
    { role: 'ai', message: 'I can summarize the action items for you if needed.' },
  ],
  'link-1': [
    { role: 'ai', message: 'This link points to the Next.js documentation. What specifically are you trying to learn or build with Next.js?' },
  ],
  'note-1': [
    { role: 'ai', message: 'These are great ideas for authentication! What are your initial thoughts on the pros and cons of each approach?' },
  ],
  'doc-2': [
    { role: 'ai', message: 'Project Phoenix sounds ambitious! What challenges do you anticipate during the core migration phase?' },
  ],
  'link-2': [
    { role: 'ai', message: 'FastAPI is an excellent choice for backend microservices. Are you planning to integrate it with any specific frontend framework?' },
  ],
};

export default dummyChatResponses;
