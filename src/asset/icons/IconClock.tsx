import React from 'react';
import {Path, Svg} from 'react-native-svg';
import {moderateScale} from 'utility/scale';
import {IconSvgProps} from '.';

const IconClock = ({size = 20, style, tintColor = 'black'}: IconSvgProps) => {
  const width = moderateScale(size);

  return (
    <Svg
      width={width}
      height={width}
      viewBox="0 0 20 20"
      fill="none"
      style={style}>
      <Path
        d="M10 5.83333V10L11.25 12.0833M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
        stroke={tintColor}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </Svg>
  );
};

export default IconClock;
