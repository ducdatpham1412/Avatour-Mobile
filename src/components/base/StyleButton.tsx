import {FONT_SIZE} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import React from 'react';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {StyleText} from '.';
import StyleTouchable from './StyleTouchable';

interface StyleTouchableProps {
    title: string;
    containerStyle?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
    disable?: boolean;
    onPress?(): any;
}

const StyleButton = (props: StyleTouchableProps) => {
    const {title, containerStyle, titleStyle, disable, onPress} = props;

    return (
        <StyleTouchable
            customStyle={[styles.container, containerStyle]}
            onPress={onPress}
            disable={disable}>
            <StyleText
                i18Text={title || 'Button'}
                customStyle={[styles.title, titleStyle]}
            />
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    container: {
        borderRadius: '8@vs',
        paddingVertical: '10@vs',
        paddingHorizontal: '60@vs',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: Theme.common.joinGroupChat,
    },
    title: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
        color: Theme.common.white,
    },
});

export default StyleButton;
