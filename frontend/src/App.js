import React, { useState } from 'react';

function App() {
  const [keywords, setKeywords] = useState(['속기']);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeKeywords = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/keywords/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seedKeywords: keywords
        })
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('오류:', error);
      alert('분석 중 오류가 발생했습니다.');
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎯 네이버 검색광고 키워드 추천</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>현재 키워드: {keywords.join(', ')}</h3>
        <button 
          onClick={analyzeKeywords}
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '분석 중...' : '키워드 분석하기'}
        </button>
      </div>

      {results && (
        <div>
          <h2>📊 분석 결과</h2>
          <p>추천 키워드 {results.recommendations.length}개</p>
          
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '10px' }}>키워드</th>
                <th style={{ padding: '10px' }}>검색량</th>
                <th style={{ padding: '10px' }}>경쟁도</th>
                <th style={{ padding: '10px' }}>점수</th>
              </tr>
            </thead>
            <tbody>
              {results.recommendations.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: '8px' }}>{item.keyword}</td>
                  <td style={{ padding: '8px' }}>{item.searchVolume}</td>
                  <td style={{ padding: '8px' }}>{item.competition}</td>
                  <td style={{ padding: '8px' }}>{item.recommendationScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;