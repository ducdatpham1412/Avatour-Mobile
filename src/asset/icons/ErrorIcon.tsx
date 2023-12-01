import React from 'react';
import {Circle, Path, Svg} from 'react-native-svg';
import {moderateScale} from 'utility/scale';
import {IconSvgProps} from '.';

const ErrorIcon = ({size = 80, style, tintColor = '#FF3B30'}: IconSvgProps) => {
  const width = moderateScale(size);

  return (
    <Svg
      width={width}
      height={width}
      viewBox="0 0 80 80"
      fill="none"
      style={style}>
      <Circle
        opacity="0.3"
        cx="40"
        cy="40"
        r="36"
        stroke="white"
        strokeWidth="8"
        strokeDasharray="1 6"
      />
      <Circle cx="40" cy="40" r="22" fill={tintColor} />
      <Path
        d="M40.2435 12C24.536 12 12 24.536 12 39.7565C12 55.464 24.536 68 39.7565 68C55.464 68 68 55.464 68 40.2435C68 32.5739 65.05 25.452 59.7217 20.2783C54.548 14.95 47.4261 12 40.2435 12Z"
        fill="white"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M41.4106 44.1413C41.106 44.7138 40.6026 45 39.9007 45C39.1854 45 38.6887 44.7229 38.4106 44.1688C38.1325 43.6146 37.9338 42.7712 37.8146 41.6385L37.1788 32.8875C37.0596 31.1824 37 29.9583 37 29.2154C37 28.2045 37.2881 27.4159 37.8642 26.8495C38.4404 26.2832 39.1987 26 40.1391 26C41.2781 26 42.0397 26.3623 42.4238 27.087C42.8079 27.8117 43 28.8561 43 30.2202C43 31.024 42.9536 31.8401 42.8609 32.6683L42.0066 41.675C41.9139 42.7468 41.7152 43.5689 41.4106 44.1413ZM42.106 54.1973C41.5099 54.7324 40.8146 55 40.0199 55C39.2119 55 38.5066 54.7358 37.904 54.2074C37.3013 53.6789 37 52.9398 37 51.99C37 51.1605 37.2881 50.4548 37.8642 49.8729C38.4404 49.291 39.1457 49 39.9801 49C40.8146 49 41.5265 49.291 42.1159 49.8729C42.7053 50.4548 43 51.1605 43 51.99C43 52.9264 42.702 53.6622 42.106 54.1973Z"
        fill={tintColor}
      />
    </Svg>
  );
};

export default ErrorIcon;
