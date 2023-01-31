import React from 'react';
import {Image, ImageProps, ImageStyle, StyleProp} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

interface StyleIconProps extends ImageProps {
    size?: number;
    customStyle?: StyleProp<ImageStyle>;
}

const StyleIcon = (props: StyleIconProps) => {
    const {size = 1, customStyle} = props;

    return (
        <Image
            style={[
                {width: moderateScale(size), height: moderateScale(size)},
                customStyle,
            ]}
            resizeMode="contain"
            {...props}
        />
    );
};

export default StyleIcon;
