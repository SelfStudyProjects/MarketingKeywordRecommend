import React from 'react';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';

function Loading({ message = '로딩 중...', size = 'medium' }) {
  const sizeMap = {
    small: 30,
    medium: 50,
    large: 70
  };

  return (
    <Paper elevation={2} sx={{ p: 4, textAlign: 'center', my: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <CircularProgress 
          size={sizeMap[size]} 
          color="primary"
        />
        
        <Typography variant="h6" color="text.secondary">
          {message}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              animation: 'bounce 1.5s infinite',
              '@keyframes bounce': {
                '0%, 80%, 100%': { opacity: 0.3 },
                '40%': { opacity: 1 }
              }
            }}
          >
            •
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              animation: 'bounce 1.5s infinite 0.2s',
              '@keyframes bounce': {
                '0%, 80%, 100%': { opacity: 0.3 },
                '40%': { opacity: 1 }
              }
            }}
          >
            •
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              animation: 'bounce 1.5s infinite 0.4s',
              '@keyframes bounce': {
                '0%, 80%, 100%': { opacity: 0.3 },
                '40%': { opacity: 1 }
              }
            }}
          >
            •
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          💡 팁: 더 정확한 결과를 원하시면 구체적인 키워드를 입력해보세요!
        </Typography>
      </Box>
    </Paper>
  );
}

export default Loading;