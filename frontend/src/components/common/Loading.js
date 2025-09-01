// PSEUDO CODE: 로딩 컴포넌트
// IMPORT React from 'react'
// IMPORT CircularProgress from Material-UI
//
// FUNCTION Loading({ message = '로딩 중...', size = 'medium' }):
//     sizeMap = {
//         small: 30,
//         medium: 50,
//         large: 70
//     }
//     
//     RETURN (
//         <div className="loading-container">
//             <div className="loading-spinner">
//                 <CircularProgress 
//                     size={sizeMap[size]} 
//                     color="primary"
//                 />
//             </div>
//             
//             <div className="loading-message">
//                 <p>{message}</p>
//                 
//                 <div className="loading-dots">
//                     <span className="dot dot1">•</span>
//                     <span className="dot dot2">•</span>
//                     <span className="dot dot3">•</span>
//                 </div>
//             </div>
//             
//             <div className="loading-tips">
//                 <p>💡 팁: 더 정확한 결과를 원하시면 구체적인 키워드를 입력해보세요!</p>
//             </div>
//         </div>
//     )
//
// EXPORT Loading
