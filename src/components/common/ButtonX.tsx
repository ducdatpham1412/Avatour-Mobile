import {StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';

interface Props {
    containerStyle?: StyleProp<ViewStyle>;
    iconStyle?: StyleProp<TextStyle>;
    onPress?(): void;
}

const ButtonX = ({containerStyle, onPress, iconStyle}: Props) => {
    const theme = Redux.getTheme();

    return (
        <StyleTouchable
            customStyle={[
                styles.container,
                {backgroundColor: theme.textColor},
                containerStyle,
            ]}
            onPress={onPress}
            hitSlop={10}>
            <Feather
                name="x"
                style={[
                    styles.iconX,
                    {color: theme.backgroundColor},
                    iconStyle,
                ]}
            />
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    container: {
        position: 'absolute',
        top: '-5@ms',
        right: 0,
        padding: '5@ms',
        borderRadius: '10@s',
    },
    iconX: {
        fontSize: '10@ms',
    },
});

export default ButtonX;
