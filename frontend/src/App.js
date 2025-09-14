import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Alert 
} from '@mui/material';
import KeywordInput from './components/keyword/KeywordInput';
import Loading from './components/common/Loading';

function App() {
  const [analysisState, setAnalysisState] = useState({
    isLoading: false,
    results: null,
    error: null
  });

  const [inputKeywords, setInputKeywords] = useState([]);

  const handleKeywordSubmit = async (keywords) => {
    setInputKeywords(keywords);
    setAnalysisState({ isLoading: true, results: null, error: null });

    try {
      const response = await fetch('https://marketingkeywordrecommend.onrender.com/api/keywords/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seedKeywords: keywords,
          businessDomain: '속기'
        })
      });

      const data = await response.json();

      if (data.success) {
        setAnalysisState({
          isLoading: false,
          results: data,
          error: null
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setAnalysisState({
        isLoading: false,
        results: null,
        error: error.message
      });
    }
  };

  const handleRetry = () => {
    if (inputKeywords.length > 0) {
      handleKeywordSubmit(inputKeywords);
    }
  };

  const formatNumber = (number) => {
    return number.toLocaleString('ko-KR');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          🎯 네이버 검색광고 키워드 추천
        </Typography>
        
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
          효과적인 네이버 파워링크 광고를 위한 키워드를 찾아드려요
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <KeywordInput onSubmit={handleKeywordSubmit} />
        </Paper>

        {analysisState.isLoading && (
          <Loading message="키워드 분석 중..." />
        )}

        {analysisState.error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6">오류 발생</Typography>
            <Typography>{analysisState.error}</Typography>
            <button onClick={handleRetry} style={{ marginTop: '10px' }}>
              다시 시도
            </button>
          </Alert>
        )}

        {analysisState.results && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              📊 분석 결과
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography><strong>입력 키워드:</strong> {analysisState.results.inputKeywords.join(', ')}</Typography>
              <Typography><strong>추천 키워드:</strong> {analysisState.results.recommendations.length}개</Typography>
            </Box>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f7ff' }}>
                    <th style={{ padding: '12px', border: '1px solid #ddd' }}>순위</th>
                    <th style={{ padding: '12px', border: '1px solid #ddd' }}>키워드</th>
                    <th style={{ padding: '12px', border: '1px solid #ddd' }}>검색량</th>
                    <th style={{ padding: '12px', border: '1px solid #ddd' }}>경쟁도</th>
                    <th style={{ padding: '12px', border: '1px solid #ddd' }}>광고비</th>
                    <th style={{ padding: '12px', border: '1px solid #ddd' }}>점수</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisState.results.recommendations.map((item, index) => (
                    <tr key={index} style={{ backgroundColor: index < 5 ? '#f0f7ff' : 'white' }}>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{index + 1}</td>
                      <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>
                        {item.keyword}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        {formatNumber(item.searchVolume)}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        {item.competition === 'low' ? '🟢 낮음' : 
                         item.competition === 'medium' ? '🟡 보통' : '🔴 높음'}
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        {formatNumber(item.avgCPC)}원
                      </td>
                      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                        <span style={{
                          backgroundColor: item.recommendationScore >= 80 ? '#4caf50' : 
                                         item.recommendationScore >= 60 ? '#ff9800' : '#f44336',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}>
                          {item.recommendationScore}점
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default App;