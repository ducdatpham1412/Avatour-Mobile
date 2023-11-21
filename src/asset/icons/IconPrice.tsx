import React from 'react';
import {Path, Svg} from 'react-native-svg';
import {moderateScale} from 'utility/scale';
import {IconSvgProps} from '.';

const IconPrice = ({size = 24, style, tintColor = 'black'}: IconSvgProps) => {
  const width = moderateScale(size);

  return (
    <Svg
      width={width}
      height={width}
      viewBox="0 0 24 24"
      fill="none"
      style={style}>
      <Path
        d="M14.0642 17.499V6.30722M12.4654 8.70545H15.663M20.4595 11.9031C20.4595 16.5389 16.7015 20.2969 12.0657 20.2969C7.42991 20.2969 3.67188 16.5389 3.67188 11.9031C3.67188 7.26732 7.42991 3.50928 12.0657 3.50928C16.7015 3.50928 20.4595 7.26732 20.4595 11.9031ZM14.0642 14.3013C14.0642 15.6258 12.9905 16.6996 11.666 16.6996C10.3415 16.6996 9.26775 15.6258 9.26775 14.3013C9.26775 12.9768 10.3415 11.9031 11.666 11.9031C12.9905 11.9031 14.0642 12.9768 14.0642 14.3013Z"
        stroke={tintColor}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default IconPrice;
