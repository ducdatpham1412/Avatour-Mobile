import {FONT_SIZE} from 'asset/standardValue';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {I18Normalize} from 'utility/I18Next';

interface TypeMainSettingProps {
    icon: any;
    title: I18Normalize;
    onPress(): void;
}

const TypeMainSetting = (props: TypeMainSettingProps) => {
    const {icon, title, onPress} = props;
    const theme = Redux.getTheme();

    return (
        <StyleTouchable customStyle={styles.container} onPress={onPress}>
            <View
                style={[
                    styles.blurBackground,
                    {backgroundColor: theme.backgroundButtonColor},
                ]}
            />

            <View
                style={[
                    styles.iconBox,
                    {
                        borderColor: theme.highlightColor,
                        backgroundColor: theme.backgroundColor,
                    },
                ]}>
                <StyleImage
                    source={icon}
                    customStyle={{width: '70%', height: '70%'}}
                />
            </View>

            <View
                style={[styles.cordBox, {borderColor: theme.highlightColor}]}
            />

            <StyleText
                i18Text={title}
                customStyle={[styles.text, {color: theme.textColor}]}
            />
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        height: '55@vs',
        marginVertical: '8@vs',
        flexDirection: 'row',
        alignItems: 'center',
    },
    blurBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '100@vs',
        opacity: 0.8,
    },
    iconBox: {
        width: '45@vs',
        height: '45@vs',
        borderRadius: '30@s',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        marginLeft: '10@s',
    },
    cordBox: {
        width: '10@s',
        borderWidth: 1,
        marginRight: '10@s',
    },
    text: {
        fontSize: FONT_SIZE.normal,
    },
});

export default TypeMainSetting;
