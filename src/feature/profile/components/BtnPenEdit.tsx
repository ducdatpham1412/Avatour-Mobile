import {StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

interface BtnPenEditProps {
    btnStyle?: StyleProp<ViewStyle>;
    iconStyle?: StyleProp<TextStyle>;
    onPress(): void;
}

const BtnPenEdit = (props: BtnPenEditProps) => {
    const {btnStyle, iconStyle, onPress} = props;
    const theme = Redux.getTheme();

    return (
        <StyleTouchable
            onPress={onPress}
            customStyle={[styles.touch, btnStyle]}>
            <View
                style={[
                    styles.blurBackground,
                    {
                        backgroundColor: 'white',
                        borderColor: theme.borderColor,
                    },
                ]}
            />

            <EvilIcons
                name="camera"
                style={[
                    {
                        fontSize: moderateScale(23),
                        color: 'black',
                        fontWeight: 'bold',
                    },
                    iconStyle,
                ]}
            />
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    touch: {
        position: 'absolute',
        width: '30@s',
        height: '30@s',
        alignItems: 'center',
        justifyContent: 'center',
    },
    blurBackground: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        borderRadius: '50@s',
        borderWidth: 1.5,
    },
});

export default BtnPenEdit;
