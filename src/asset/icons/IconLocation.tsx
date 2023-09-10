import React from 'react';
import {Path, Svg} from 'react-native-svg';
import {moderateScale} from 'utility/scale';
import {IconSvgProps} from '.';

const IconLocation = ({
  size = moderateScale(16),
  style,
  tintColor = 'black',
}: IconSvgProps) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 16 17"
      fill="none"
      style={style}>
      <Path
        d="M7.99967 14.5C10.333 12.1 12.6663 9.95097 12.6663 7.3C12.6663 4.64903 10.577 2.5 7.99967 2.5C5.42235 2.5 3.33301 4.64903 3.33301 7.3C3.33301 9.95097 5.66634 12.1 7.99967 14.5Z"
        stroke={tintColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7.99967 9.16667C9.10424 9.16667 9.99967 8.27124 9.99967 7.16667C9.99967 6.0621 9.10424 5.16667 7.99967 5.16667C6.89511 5.16667 5.99967 6.0621 5.99967 7.16667C5.99967 8.27124 6.89511 9.16667 7.99967 9.16667Z"
        stroke={tintColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default IconLocation;
