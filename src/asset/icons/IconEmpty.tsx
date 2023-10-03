import {Path, Svg} from 'react-native-svg';

import {moderateScale} from 'utility/scale';
import {IconSvgProps} from '.';

const IconEmpty = ({
  size = moderateScale(45),
  style,
  tintColor = 'black',
}: IconSvgProps) => (
  <Svg
    width={size}
    height={(51 / 45) * size}
    fill="none"
    viewBox="0 0 45 51"
    style={style}>
    <Path
      d="M42 22.2427L42 16.1697C42 6.04814 38 1.99951 28 1.99951L16 1.99951C6 1.99951 2 6.04814 2 16.1697L2 28.3156C2 34.6315 3.56 38.5991 7.18 40.6639C8.2 41.251 10.24 41.6963 12.1 42"
      stroke={tintColor}
      strokeWidth="3"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M29.9714 46.9429C36.0307 46.9429 40.9429 42.0307 40.9429 35.9714C40.9429 29.9121 36.0307 25 29.9714 25C23.9121 25 19 29.9121 19 35.9714C19 42.0307 23.9121 46.9429 29.9714 46.9429Z"
      stroke={tintColor}
      strokeWidth="3"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M43.0003 49.0008L39.5718 45.5723"
      stroke={tintColor}
      strokeWidth="3"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default IconEmpty;
