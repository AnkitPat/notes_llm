import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import { ChatMessage, ChatMode } from '../types/dashboard';

interface ChatQnASectionProps {
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  isChatExpanded: boolean;
  onToggleChatExpand: () => void;
  chatMode: ChatMode;
}

const ChatQnASection: React.FC<ChatQnASectionProps> = ({
  chatHistory,
  onSendMessage,
  isChatExpanded,
  onToggleChatExpand,
  chatMode,
}) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Paper sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography  variant="h6"  color="text.primary">{chatMode}</Typography>
        {chatMode === 'Resource Chat' && (
          <IconButton onClick={onToggleChatExpand} size="small">
            {isChatExpanded ? <CloseFullscreenIcon fontSize="small" /> : <OpenInFullIcon fontSize="small" />}
          </IconButton>
        )}
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {chatHistory.map((msg, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <Paper
              sx={{
                maxWidth: '70%',
                p: 1.5,
                borderRadius: 2,
                bgcolor: msg.role === 'user' ? 'primary.main' : 'grey.200',
                color: msg.role === 'user' ? 'white' : 'text.primary',
              }}
            >
              <Typography variant="body2">{msg.message}</Typography>
            </Paper>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', p: 2, borderTop: 1, borderColor: 'divider', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Ask a question..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button variant="contained" onClick={handleSendMessage}>
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatQnASection;
