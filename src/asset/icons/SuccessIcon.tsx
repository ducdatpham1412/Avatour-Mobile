import React from 'react';
import {Circle, Path, Svg} from 'react-native-svg';
import {IconSvgProps} from '.';
import {moderateScale} from 'utility/scale';

const SuccessIcon = ({
  size = moderateScale(80),
  style,
  tintColor = '#4527CE',
}: IconSvgProps) => {
  return (
    <Svg
      width={size}
      height={size}
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
      <Circle cx="40" cy="40" r="28" fill="white" />
      <Circle cx="40" cy="40" r="22" fill={tintColor} />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 39.7565C12 24.536 24.536 12 40.2435 12C47.4261 12 54.548 14.95 59.7217 20.2783C65.05 25.452 68 32.5739 68 40.2435C68 55.464 55.464 68 39.7565 68C24.536 68 12 55.464 12 39.7565ZM38.082 51.8828L54.6988 31.7031C55.384 31.1505 55.287 30.1308 54.6988 29.7344L54.21 29.2422C53.4683 28.6022 52.5601 28.63 51.7664 29.2422L37.5932 42.5312C37.0653 43.3061 36.2095 43.3605 35.6383 43.0234L28.3074 37.6094C27.7276 37.1573 26.7815 37.2776 26.3525 38.1016L25.8637 38.5938C25.24 39.161 25.2604 40.0404 25.8637 40.5625L36.127 51.8828C36.2114 52.1926 36.6544 52.384 37.1045 52.375C37.5769 52.3654 38.012 52.1562 38.082 51.8828Z"
        fill="white"
      />
    </Svg>
  );
};

export default SuccessIcon;
