import React from 'react';
import './loading.css'; // 引入 CSS 文件

const Loading: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="spinner"/>
    </div>
  );
};

export default Loading;
