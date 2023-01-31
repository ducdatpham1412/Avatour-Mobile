import {FONT_SIZE} from 'asset/standardValue';
import {StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {View} from 'react-native';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';

interface Props {
    index: number;
    onChangeTab(index: number): void;
    isShopAccount: boolean;
}

const unFocusOpacity = 0.3;
export const toolProfileHeight = moderateScale(60);

const ToolMyProfile = (props: Props) => {
    const {index, onChangeTab, isShopAccount} = props;
    const theme = Redux.getTheme();

    const isInMyPosts = index === 0;
    const isPostsLiked = index === 1;
    const isPostsSaved = index === 2;
    const isPostArchive = index === 3;

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
                            opacity: isInMyPosts ? 1 : unFocusOpacity,
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
                    name="heart"
                    style={[
                        styles.iconStar,
                        {
                            color: theme.textHightLight,
                            opacity: isPostsLiked ? 1 : unFocusOpacity,
                        },
                    ]}
                />
                <StyleText
                    i18Text="profile.favorite"
                    customStyle={[
                        styles.textDescription,
                        {color: theme.borderColor},
                    ]}
                />
            </StyleTouchable>

            <StyleTouchable
                customStyle={styles.buttonBox}
                onPress={() => onChangeTab(2)}>
                <Feather
                    name="shopping-bag"
                    style={[
                        styles.icon,
                        {
                            color: theme.textHightLight,
                            opacity: isPostsSaved ? 1 : unFocusOpacity,
                        },
                    ]}
                />
                <StyleText
                    i18Text="profile.gbOrder"
                    customStyle={[
                        styles.textDescription,
                        {color: theme.borderColor},
                    ]}
                />
            </StyleTouchable>

            {isShopAccount && (
                <StyleTouchable
                    customStyle={styles.buttonBox}
                    onPress={() => onChangeTab(3)}>
                    <Feather
                        name="star"
                        style={[
                            styles.icon,
                            {
                                color: theme.textHightLight,
                                opacity: isPostArchive ? 1 : unFocusOpacity,
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
            )}
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
        borderTopWidth: 0,
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
    iconStar: {
        fontSize: '27@ms',
    },
    textDescription: {
        fontSize: FONT_SIZE.tiny,
        marginTop: '3@vs',
    },
});

export default ToolMyProfile;
