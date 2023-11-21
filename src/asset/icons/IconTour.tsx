import React from 'react';
import {Path, Svg} from 'react-native-svg';
import {moderateScale} from 'utility/scale';
import {IconSvgProps} from '.';

const IconTour = ({size = 24, style, tintColor = 'black'}: IconSvgProps) => {
  const width = moderateScale(size);
  const height = (20 / 21) * width;

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 21 20"
      fill="none"
      style={style}>
      <Path
        d="M7.83301 16.6663L2.83301 14.1663V3.33301L7.83301 5.83301M7.83301 16.6663L12.833 14.1663M7.83301 16.6663V5.83301M12.833 14.1663L17.833 16.6663V5.83301L12.833 3.33301M12.833 14.1663V3.33301M7.83301 5.83301L12.833 3.33301"
        stroke={tintColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default IconTour;
