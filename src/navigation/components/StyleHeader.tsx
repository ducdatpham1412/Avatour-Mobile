import {FONT_SIZE} from 'asset/standardValue';
import {StyleText} from 'components/base';
import Redux from 'hook/useRedux';
import {goBack} from 'navigation/NavigationService';
import React from 'react';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {borderWidthTiny} from 'utility/assistant';
import {I18Normalize} from 'utility/I18Next';
import HeaderLeftIcon from './HeaderLeftIcon';

export interface StyleHeaderProps {
    title: I18Normalize | string;
    titleParams?: any;
    onGoBack?(): void;
    containerStyle?: StyleProp<ViewStyle>;
    titleStyle?: StyleProp<TextStyle>;
    iconStyle?: StyleProp<TextStyle>;
}

const StyleHeader = (props: StyleHeaderProps) => {
    const {
        title,
        titleParams,
        onGoBack,
        containerStyle,
        titleStyle,
        iconStyle,
    } = props;

    const theme = Redux.getTheme();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: theme.backgroundColor,
                    borderBottomColor: theme.holderColorLighter,
                },
                containerStyle,
            ]}>
            <StyleText
                i18Text={title}
                i18Params={titleParams}
                customStyle={[
                    styles.titleText,
                    {color: theme.textColor},
                    titleStyle,
                ]}
            />

            <HeaderLeftIcon
                style={styles.headerLeft}
                onPress={onGoBack || goBack}
                iconStyle={iconStyle}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        paddingBottom: '7@vs',
        paddingTop: '3@vs',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: borderWidthTiny,
    },
    titleText: {
        fontSize: FONT_SIZE.big,
        fontWeight: 'bold',
    },
    headerLeft: {
        position: 'absolute',
        left: '10@s',
    },
});

export default StyleHeader;
