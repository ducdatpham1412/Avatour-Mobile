import {StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';

interface HeartButtonProps {
    onPress?: any;
}

const HeartButton = (props: HeartButtonProps) => {
    const {onPress} = props;
    const theme = Redux.getTheme();

    return (
        <View
            style={[
                styles.buttonHeart,
                {backgroundColor: theme.backgroundButtonColor},
            ]}>
            <StyleTouchable onPress={onPress}>
                <Feather
                    name="heart"
                    style={[styles.icon, {color: theme.textColor}]}
                />
            </StyleTouchable>
        </View>
    );
};

const styles = ScaledSheet.create({
    buttonHeart: {
        position: 'absolute',
        left: '10@vs',
        bottom: '200@vs',
        width: '40@ms',
        height: '40@ms',
        borderRadius: '30@vs',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.7,
    },
    icon: {
        fontSize: '20@ms',
    },
});

export default HeartButton;
