import React from 'react';
import { ProgressCircle } from 'react-native-svg-charts';

const DonutChartPoints = ({ progress, size, strokeWidth, color }) => {
  return (
    <ProgressCircle
      style={{ height: size, width: size }}
      progress={progress}
      progressColor={color}
      backgroundColor="#fff" // Background color of the unfilled part
      strokeWidth={strokeWidth}
      startAngle={-Math.PI * 0.5} // Starts from the top
      endAngle={Math.PI * 1.5} // Ends after one full circle
    />
  );
};

export default DonutChartPoints;
