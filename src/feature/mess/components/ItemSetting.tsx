import {StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React, {ReactNode} from 'react';
import {Platform, StyleProp, TextStyle, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {I18Normalize} from 'utility/I18Next';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

interface Props {
    iconLeft: ReactNode;
    title: I18Normalize;
    titleParams?: object;
    titleStyle?: StyleProp<TextStyle>;
    hadIconRight?: boolean;
    onPress?(): void;
}

const ItemSetting = (props: Props) => {
    const {iconLeft, title, titleParams, hadIconRight, onPress, titleStyle} =
        props;
    const theme = Redux.getTheme();

    return (
        <StyleTouchable
            customStyle={[
                styles.container,
                {borderBottomColor: theme.holderColorLighter},
            ]}
            onPress={onPress}>
            <View style={styles.iconLeftView}>{iconLeft}</View>
            <StyleText
                i18Text={title}
                i18Params={titleParams}
                customStyle={[
                    styles.textTitle,
                    {color: theme.textColor},
                    titleStyle,
                ]}
                numberOfLines={1}
            />
            {hadIconRight && (
                <EvilIcons
                    name="chevron-right"
                    style={[styles.iconRight, {color: theme.borderColor}]}
                />
            )}
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        marginBottom: '7@vs',
    },
    iconLeftView: {
        width: '40@s',
        height: '40@s',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textTitle: {
        fontSize: '14@ms',
        maxWidth: '70%',
        marginLeft: '5@s',
    },
    iconRight: {
        fontSize: '25@ms',
        position: 'absolute',
        right: '5@s',
    },
});

export default ItemSetting;
