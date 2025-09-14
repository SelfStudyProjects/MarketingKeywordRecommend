import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Chip,
  Typography,
  Stack,
  Alert
} from '@mui/material';

function KeywordInput({ onSubmit }) {
  const [inputValue, setInputValue] = useState('');
  const [keywords, setKeywords] = useState(['속기']);
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setErrors({});
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      addKeyword(inputValue.trim());
      setInputValue('');
    }
  };

  const addKeyword = (keyword) => {
    if (keywords.includes(keyword)) {
      setErrors({ duplicate: '이미 추가된 키워드입니다' });
      return;
    }

    if (keywords.length >= 5) {
      setErrors({ limit: '최대 5개까지 입력 가능합니다' });
      return;
    }

    if (keyword.length < 2 || keyword.length > 20) {
      setErrors({ length: '키워드는 2-20자 사이여야 합니다' });
      return;
    }

    setKeywords([...keywords, keyword]);
    setErrors({});
  };

  const removeKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter(k => k !== keywordToRemove));
  };

  const handleSubmit = () => {
    if (keywords.length === 0) {
      setErrors({ empty: '최소 1개 이상의 키워드를 입력해주세요' });
      return;
    }

    onSubmit(keywords);
  };

  const handleExampleKeywords = (exampleSet) => {
    setKeywords(exampleSet);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        📝 분석할 키워드를 입력하세요
      </Typography>

      <Stack spacing={3}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            label="키워드 입력"
            placeholder="키워드를 입력하고 Enter를 누르세요"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            error={Boolean(errors.length || errors.duplicate)}
            helperText={errors.length || errors.duplicate}
            fullWidth
          />
          <Button 
            variant="outlined" 
            onClick={() => addKeyword(inputValue.trim())}
            disabled={!inputValue.trim()}
          >
            추가
          </Button>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            선택된 키워드 ({keywords.length}/5):
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {keywords.map(keyword => (
              <Chip
                key={keyword}
                label={keyword}
                onDelete={() => removeKeyword(keyword)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            예시 키워드:
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button 
              size="small" 
              onClick={() => handleExampleKeywords(['속기', '녹취', '속기학원'])}
            >
              속기 관련
            </Button>
            <Button 
              size="small" 
              onClick={() => handleExampleKeywords(['카페', '커피', '원두'])}
            >
              카페 관련
            </Button>
          </Stack>
        </Box>

        {(errors.empty || errors.limit) && (
          <Alert severity="error">{errors.empty || errors.limit}</Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          disabled={keywords.length === 0}
          fullWidth
        >
          🎯 키워드 분석하기 ({keywords.length}/5)
        </Button>
      </Stack>
    </Box>
  );
}

export default KeywordInput;