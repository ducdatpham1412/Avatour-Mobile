import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface IconTypeProps {
    source: any;
    title?: string;
    containerStyle?: StyleProp<ViewStyle>;
    onPress?(): void;
    disable?: boolean;
}

const IconType = (props: IconTypeProps) => {
    const {source, title, containerStyle, onPress, disable = false} = props;

    const theme = Redux.getTheme();

    return (
        <StyleTouchable
            customStyle={[styles.iconTouch, containerStyle]}
            onPress={onPress}
            disable={disable}>
            <StyleImage
                source={source}
                customStyle={[styles.icon, {tintColor: theme.textColor}]}
            />
            <StyleText
                i18Text={title}
                customStyle={[styles.textUnderIcon, {color: theme.textColor}]}
            />
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    iconTouch: {
        flex: 1,
        height: '70@vs',
        alignItems: 'center',
    },
    icon: {
        flex: 1,
        resizeMode: 'contain',
        marginBottom: '7@vs',
    },
    textUnderIcon: {
        fontSize: '11@ms',
        fontWeight: 'bold',
    },
});

export default IconType;
