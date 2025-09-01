// PSEUDO CODE: 키워드 입력 컴포넌트
// IMPORT React, { useState }
// IMPORT TextField, Button, Chip from Material-UI
//
// FUNCTION KeywordInput({ onSubmit }):
//     [inputValue, setInputValue] = useState('')
//     [keywords, setKeywords] = useState(['속기']) // 기본값
//     [errors, setErrors] = useState({})
//     
//     FUNCTION handleInputChange(event):
//         setInputValue(event.target.value)
//         setErrors({}) // 에러 초기화
//     
//     FUNCTION handleKeyPress(event):
//         IF event.key === 'Enter' AND inputValue.trim():
//             addKeyword(inputValue.trim())
//             setInputValue('')
//     
//     FUNCTION addKeyword(keyword):
//         // [추가] 특수문자 필터링: 특수문자 제거 또는 경고
//         filteredKeyword = keyword.replace(/[^\w\s가-힣]/g, '') // 특수문자 제거
//         IF filteredKeyword !== keyword:
//             setErrors({ specialChars: '특수문자가 제거되었습니다.' })
//         
//         keyword = filteredKeyword.trim()
//         
//         // 중복 체크
//         IF keywords.includes(keyword):
//             setErrors({ duplicate: '이미 추가된 키워드입니다' })
//             RETURN
//         
//         // 최대 5개 제한
//         IF keywords.length >= 5:
//             setErrors({ limit: '최대 5개까지 입력 가능합니다' })
//             RETURN
//         
//         // 키워드 길이 체크
//         IF keyword.length < 2 OR keyword.length > 20:
//             setErrors({ length: '키워드는 2-20자 사이여야 합니다' })
//             RETURN
//         
//         setKeywords([...keywords, keyword])
//         setErrors({})
//     
//     FUNCTION removeKeyword(keywordToRemove):
//         setKeywords(keywords.filter(k => k !== keywordToRemove))
//     
//     FUNCTION handleSubmit():
//         IF keywords.length === 0:
//             setErrors({ empty: '최소 1개 이상의 키워드를 입력해주세요' })
//             RETURN
//         
//         onSubmit(keywords)
//     
//     FUNCTION handleExampleKeywords(exampleSet):
//         // 예시 키워드 세트 적용
//         setKeywords(exampleSet)
//     
//     RETURN (
//         <div className="keyword-input-container">
//             <div className="input-section">
//                 <TextField
//                     label="키워드 입력"
//                     placeholder="키워드를 입력하고 Enter를 누르세요"
//                     value={inputValue}
//                     onChange={handleInputChange}
//                     onKeyPress={handleKeyPress}
//                     error={Boolean(errors.length || errors.duplicate)}
//                     helperText={errors.length || errors.duplicate}
//                     fullWidth
//                 />
//                 
//                 <Button 
//                     variant="outlined" 
//                     onClick={() => addKeyword(inputValue.trim())}
//                     disabled={!inputValue.trim()}
//                 >
//                     추가
//                 </Button>
//             </div>
//             
//             <div className="keywords-display">
//                 {keywords.map(keyword => (
//                     <Chip
//                         key={keyword}
//                         label={keyword}
//                         onDelete={() => removeKeyword(keyword)}
//                         color="primary"
//                         variant="outlined"
//                     />
//                 ))}
//             </div>
//             
//             <div className="example-keywords">
//                 <p>예시 키워드:</p>
//                 <Button size="small" onClick={() => handleExampleKeywords(['속기', '녹취', '속기학원'])}>
//                     속기 관련
//                 </Button>
//                 <Button size="small" onClick={() => handleExampleKeywords(['카페', '커피', '원두'])}>
//                     카페 관련
//                 </Button>
//             </div>
//             
//             {errors.empty && <div className="error">{errors.empty}</div>}
//             {errors.limit && <div className="error">{errors.limit}</div>}
//             
//             <Button
//                 variant="contained"
//                 color="primary"
//                 size="large"
//                 onClick={handleSubmit}
//                 disabled={keywords.length === 0}
//                 className="analyze-button"
//             >
//                 키워드 분석하기 ({keywords.length}/5)
//             </Button>
//         </div>
//     )
//
// EXPORT KeywordInput
