import React, { useState, useMemo } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Button,
  Chip,
  TextField,
  Stack,
  Divider
} from '@mui/material';
import { Download, TrendingUp, TrendingDown } from '@mui/icons-material';

function ResultsTable({ data, inputKeywords, expandedCount }) {
  const [sortConfig, setSortConfig] = useState({ 
    key: 'recommendationScore', 
    direction: 'desc' 
  });
  const [filterConfig, setFilterConfig] = useState({ 
    minScore: 0, 
    maxCPC: 1000 
  });

  // 정렬 및 필터링된 데이터
  const processedData = useMemo(() => {
    let filtered = data.filter(item => 
      item.recommendationScore >= filterConfig.minScore &&
      item.avgCPC <= filterConfig.maxCPC
    );
    
    filtered = filtered.sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      } else {
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
      }
    });
    
    return filtered;
  }, [data, sortConfig, filterConfig]);

  const handleSort = (columnKey) => {
    if (sortConfig.key === columnKey) {
      setSortConfig({
        key: columnKey,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      setSortConfig({ key: columnKey, direction: 'desc' });
    }
  };

  const handleExport = () => {
    let csvContent = "키워드,검색량,경쟁도,평균CPC,추천점수,이유\n";
    
    processedData.forEach(item => {
      csvContent += `${item.keyword},${item.searchVolume},${item.competition},${item.avgCPC},${item.recommendationScore},"${item.reasoning}"\n`;
    });
    
    // BOM 추가 (한글 깨짐 방지)
    const csvWithBOM = '\uFEFF' + csvContent;
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `키워드분석결과_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getCompetitionIcon = (competition) => {
    const competitionMap = {
      'low': { icon: '🟢', text: '낮음' },
      'medium': { icon: '🟡', text: '보통' },
      'high': { icon: '🔴', text: '높음' }
    };
    return competitionMap[competition] || competitionMap['medium'];
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return '↕️';
    return sortConfig.direction === 'asc' ? '⬆️' : '⬇️';
  };

  const formatNumber = (number) => {
    return number.toLocaleString('ko-KR');
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      {/* 결과 헤더 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          📊 키워드 추천 결과
        </Typography>
        
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Chip 
            label={`입력: ${inputKeywords.join(', ')}`} 
            color="primary" 
            variant="outlined"
          />
          <Chip 
            label={`확장: ${expandedCount}개`} 
            color="secondary" 
            variant="outlined"
          />
          <Chip 
            label={`추천: ${processedData.length}개`} 
            color="success" 
            variant="outlined"
          />
        </Stack>
        
        <Button 
          onClick={handleExport} 
          variant="outlined" 
          startIcon={<Download />}
          sx={{ mb: 2 }}
        >
          결과 내보내기
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* 필터 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          🔍 필터 옵션
        </Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            label="최소 추천 점수"
            type="number"
            size="small"
            value={filterConfig.minScore}
            onChange={(e) => setFilterConfig({
              ...filterConfig,
              minScore: parseInt(e.target.value) || 0
            })}
          />
          <TextField
            label="최대 광고비"
            type="number"
            size="small"
            value={filterConfig.maxCPC}
            onChange={(e) => setFilterConfig({
              ...filterConfig,
              maxCPC: parseInt(e.target.value) || 1000
            })}
          />
        </Stack>
      </Box>

      {/* 결과 테이블 */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell 
                onClick={() => handleSort('recommendationScore')} 
                sx={{ cursor: 'pointer', fontWeight: 'bold' }}
              >
                추천 점수 {getSortIcon('recommendationScore')}
              </TableCell>
              <TableCell 
                onClick={() => handleSort('keyword')} 
                sx={{ cursor: 'pointer', fontWeight: 'bold' }}
              >
                키워드 {getSortIcon('keyword')}
              </TableCell>
              <TableCell 
                onClick={() => handleSort('searchVolume')} 
                sx={{ cursor: 'pointer', fontWeight: 'bold' }}
              >
                월간 검색량 {getSortIcon('searchVolume')}
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>
                경쟁도
              </TableCell>
              <TableCell 
                onClick={() => handleSort('avgCPC')} 
                sx={{ cursor: 'pointer', fontWeight: 'bold' }}
              >
                평균 광고비 {getSortIcon('avgCPC')}
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>
                추천 이유
              </TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {processedData.map((row, index) => (
              <TableRow 
                key={row.keyword}
                sx={{ 
                  backgroundColor: index < 5 ? '#f0f7ff' : 'inherit',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <TableCell>
                  <Chip
                    label={`${row.recommendationScore}점`}
                    color={getScoreColor(row.recommendationScore)}
                    size="small"
                    icon={row.recommendationScore >= 80 ? <TrendingUp /> : <TrendingDown />}
                  />
                </TableCell>
                
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {row.keyword}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {formatNumber(row.searchVolume)}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{getCompetitionIcon(row.competition).icon}</span>
                    <Typography variant="body2">
                      {getCompetitionIcon(row.competition).text}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {formatNumber(row.avgCPC)}원
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {row.reasoning}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {processedData.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            필터 조건에 맞는 키워드가 없습니다.
          </Typography>
          <Button 
            onClick={() => setFilterConfig({ minScore: 0, maxCPC: 1000 })}
            sx={{ mt: 2 }}
          >
            필터 초기화
          </Button>
        </Box>
      )}
    </Paper>
  );
}

export default ResultsTable;