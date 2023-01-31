import {FONT_SIZE} from 'asset/standardValue';
import {StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import {toolProfileHeight} from './ToolMyProfile';

interface Props {
    index: number;
    onChangeTab(index: number): void;
}

const unFocusOpacity = 0.3;

const ToolOtherProfile = (props: Props) => {
    const {index, onChangeTab} = props;
    const theme = Redux.getTheme();

    const isInListPosts = index === 0;
    const isPostReview = index === 1;

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.spaceBackground,
                    {backgroundColor: theme.backgroundColor},
                ]}
            />
            <StyleTouchable
                onPress={() => onChangeTab(0)}
                customStyle={styles.buttonBox}>
                <Entypo
                    name="shop"
                    style={[
                        styles.icon,
                        {
                            color: theme.textHightLight,
                            opacity: isInListPosts ? 1 : unFocusOpacity,
                        },
                    ]}
                />
                <StyleText
                    i18Text="profile.shop"
                    customStyle={[
                        styles.textDescription,
                        {
                            color: theme.borderColor,
                        },
                    ]}
                />
            </StyleTouchable>

            <StyleTouchable
                customStyle={styles.buttonBox}
                onPress={() => onChangeTab(1)}>
                <Feather
                    name="star"
                    style={[
                        styles.icon,
                        {
                            color: theme.textHightLight,
                            opacity: isPostReview ? 1 : unFocusOpacity,
                        },
                    ]}
                />
                <StyleText
                    i18Text="profile.rating"
                    customStyle={[
                        styles.textDescription,
                        {color: theme.borderColor},
                    ]}
                />
            </StyleTouchable>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        height: toolProfileHeight,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -1,
    },
    spaceBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.95,
    },
    buttonBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: '25@ms',
    },
    textDescription: {
        fontSize: FONT_SIZE.tiny,
        marginTop: '3@vs',
    },
});

export default ToolOtherProfile;
