import React from 'react';
import { ProgressCircle } from 'react-native-svg-charts';

const DonutChartPoints = ({ progress, size, strokeWidth, color }) => {
  return (
    <ProgressCircle
      style={{ height: size, width: size }}
      progress={progress}
      progressColor={color}
      backgroundColor="#fff" 
      strokeWidth={strokeWidth}
      startAngle={-Math.PI * 0.5} 
      endAngle={Math.PI * 1.5} 
    />
  );
};

export default DonutChartPoints;
