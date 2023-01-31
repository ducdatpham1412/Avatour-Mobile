import {StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React, {ReactNode} from 'react';
import {Platform, StyleProp, Switch, TextStyle, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {I18Normalize} from 'utility/I18Next';

interface Props {
    iconLeft: ReactNode;
    title: I18Normalize;
    titleStyle?: StyleProp<TextStyle>;
    value: boolean;
    onToggleSwitch(): void;
}

const ItemSettingSwitch = (props: Props) => {
    const {iconLeft, title, value, onToggleSwitch, titleStyle} = props;
    const theme = Redux.getTheme();

    return (
        <StyleTouchable
            customStyle={[
                styles.container,
                {
                    borderBottomColor: theme.holderColorLighter,
                },
            ]}>
            <View style={styles.iconLeftView}>{iconLeft}</View>
            <StyleText
                i18Text={title}
                customStyle={[
                    styles.textTitle,
                    {color: theme.textColor},
                    titleStyle,
                ]}
                numberOfLines={1}
            />
            <Switch
                style={styles.switchView}
                value={value}
                onValueChange={onToggleSwitch}
            />
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: Platform.select({
            ios: '0.2@ms',
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
    switchView: {
        position: 'absolute',
        right: '5@s',
    },
});

export default ItemSettingSwitch;
