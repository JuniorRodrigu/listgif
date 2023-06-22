import React from 'react';
import ProgressBar from 'react-progress-bar';

const LoadingBar = ({ progress }) => {
  return (
    <ProgressBar
      completed={progress}
      bgColor="#007bff"
      height="10px"
      labelAlignment="center"
    />
  );
};

export default LoadingBar;
