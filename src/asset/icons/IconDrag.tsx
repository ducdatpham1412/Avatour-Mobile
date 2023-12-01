import React from 'react';
import {Path, Svg} from 'react-native-svg';
import {moderateScale} from 'utility/scale';
import {IconSvgProps} from '.';

const IconDrag = ({size = 20, style, tintColor = 'black'}: IconSvgProps) => {
  const width = moderateScale(size);

  return (
    <Svg
      width={width}
      height={(18 / 20) * width}
      viewBox="0 0 20 18"
      fill="none"
      style={style}>
      <Path
        d="M2.5 3H17.5"
        stroke={tintColor}
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <Path
        d="M2.5 9H17.5"
        stroke={tintColor}
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <Path
        d="M2.5 15H17.5"
        stroke={tintColor}
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </Svg>
  );
};

export default IconDrag;
