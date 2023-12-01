import React from 'react';
import {Path, Svg} from 'react-native-svg';
import {moderateScale} from 'utility/scale';
import {IconSvgProps} from '.';

const IconPrice = ({size = 24, style, tintColor = 'black'}: IconSvgProps) => {
  const width = moderateScale(size);
  const height = (25 / 24) * width;

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 25"
      fill="none"
      style={style}>
      <Path
        d="M18.9996 10.9468V19.9468C18.9996 21.0513 18.1041 21.9468 16.9996 21.9468H6.99957C5.895 21.9468 4.99957 21.0513 4.99957 19.9468V10.9468M13.9996 21.9468V17.9468C13.9996 16.8422 13.1041 15.9468 11.9996 15.9468C10.895 15.9468 9.99957 16.8422 9.99957 17.9468V21.9468M6.90844 4.94678H17.0907C17.834 4.94678 18.516 5.35899 18.8615 6.01711L20.252 8.66563C21.0807 10.2441 19.5861 12.0361 17.8845 11.5042L16.5144 11.0759C15.9793 10.9087 15.3985 10.9737 14.9136 11.2552L13.0036 12.3639C12.3828 12.7243 11.6164 12.7243 10.9955 12.3639L9.08553 11.2552C8.60065 10.9737 8.01988 10.9087 7.48476 11.0759L6.11465 11.5042C4.41306 12.0361 2.91848 10.2441 3.74717 8.66563L5.13764 6.01711C5.48315 5.35899 6.16514 4.94678 6.90844 4.94678Z"
        stroke={tintColor}
        strokeWidth="1.5"
      />
    </Svg>
  );
};

export default IconPrice;
