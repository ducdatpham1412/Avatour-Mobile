import {useRoute} from '@react-navigation/native';
import {TypeGetProfileResponse} from 'api/interface';
import {ACCOUNT, TYPE_FOLLOW} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {navigate, push} from 'navigation/NavigationService';
import React, {useRef} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Props {
    profile: TypeGetProfileResponse;
}

const avatarSize = Metrics.width / 3.5;

const InformationProfile = (props: Props) => {
    const route = useRoute();
    const {profile} = props;
    const theme = Redux.getTheme();
    const myId = Redux.getPassport().profile.id;
    const {
        name,
        description,
        followers,
        followings,
        avatar,
        account_type,
        reputations,
    } = profile;

    const isMyProfile = myId === profile.id;
    const isShopAccount = account_type === ACCOUNT.shop;
    const isInTabProfile = useRef(
        route.name === PROFILE_ROUTE.myProfile,
    ).current;

    const onNavigateFollow = (type: number) => {
        push(ROOT_SCREEN.listFollows, {
            userId: profile.id,
            name: profile.name,
            type,
            onGoBack: () => navigate(route.name),
        });
    };

    const Button = () => {
        if (isMyProfile) {
            return (
                <>
                    <StyleTouchable
                        customStyle={[
                            styles.buttonTouch,
                            {backgroundColor: Theme.common.gradientTabBar1},
                        ]}
                        onPress={() => {
                            if (isInTabProfile) {
                                navigate(PROFILE_ROUTE.editProfile);
                            } else {
                                navigate(ROOT_SCREEN.editProfile);
                            }
                        }}>
                        <StyleText
                            i18Text="profile.editProfile"
                            customStyle={[
                                styles.textButton,
                                {color: Theme.common.white},
                            ]}
                        />
                    </StyleTouchable>
                    {isShopAccount && (
                        <StyleTouchable
                            customStyle={[
                                styles.buttonTouch,
                                {
                                    backgroundColor: Theme.common.commentGreen,
                                    marginLeft: 5,
                                },
                            ]}
                            onPress={() => {
                                navigate(PROFILE_ROUTE.createPostPickImg, {
                                    isCreateGB: true,
                                });
                            }}
                            hitSlop={{right: 20}}>
                            <Entypo
                                name="plus"
                                style={[
                                    styles.iconPlus,
                                    {color: Theme.common.white},
                                ]}
                            />
                        </StyleTouchable>
                    )}
                </>
            );
        }

        if (isShopAccount) {
            return (
                <StyleTouchable
                    customStyle={[
                        styles.buttonTouch,
                        {backgroundColor: Theme.common.gradientTabBar1},
                    ]}
                    onPress={() => {
                        navigate(PROFILE_ROUTE.createPostPickImg, {
                            userReviewed: {
                                id: profile.id,
                                name: profile.name,
                                avatar: profile.avatar,
                            },
                        });
                    }}>
                    <StyleText
                        i18Text="profile.reviewProvider"
                        customStyle={[
                            styles.textButton,
                            {color: Theme.common.white},
                        ]}
                    />
                </StyleTouchable>
            );
        }

        return null;
    };

    const NumberStars = () => {
        if (reputations <= 0 || reputations > 5) {
            return null;
        }
        const arrayStars = Array(Math.floor(reputations)).fill(0);
        return (
            <View style={styles.starBox}>
                {arrayStars.map((_, index) => {
                    return (
                        <AntDesign
                            key={index}
                            name="star"
                            style={[
                                styles.iconStar,
                                {color: Theme.common.orange},
                            ]}
                        />
                    );
                })}
                <StyleText
                    originValue={`${reputations} / 5`}
                    customStyle={[
                        styles.textNumberStar,
                        {color: theme.textHightLight},
                    ]}
                />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.introduceView}>
                <StyleImage
                    source={{uri: avatar}}
                    customStyle={styles.avatarHeader}
                />
                <View style={styles.boxNameAndDescription}>
                    <StyleText
                        customStyle={[
                            styles.textName,
                            {color: theme.textHightLight},
                        ]}
                        originValue={name}
                        numberOfLines={1}
                    />
                    {!!profile.location && (
                        <View style={styles.locationBox}>
                            <Ionicons
                                name="location"
                                style={styles.iconLocation}
                            />
                            <StyleText
                                originValue={profile.location}
                                customStyle={[
                                    styles.textLocation,
                                    {color: theme.borderColor},
                                ]}
                                numberOfLines={1}
                            />
                        </View>
                    )}
                    {!!description && (
                        <StyleText
                            originValue={description}
                            customStyle={[
                                styles.textDescription,
                                {color: theme.textColor},
                            ]}
                            numberOfLines={1}
                        />
                    )}
                </View>
            </View>

            <View style={styles.bottomView}>
                <View style={styles.infoPart}>
                    <View style={styles.followBox}>
                        {/* Follower */}
                        <StyleTouchable
                            customStyle={styles.elementFollow}
                            onPress={() =>
                                onNavigateFollow(TYPE_FOLLOW.follower)
                            }>
                            <StyleText
                                i18Text="profile.component.infoProfile.follower"
                                customStyle={[
                                    styles.titleFollow,
                                    {color: theme.borderColor},
                                ]}
                            />
                            <StyleText
                                originValue={String(followers)}
                                customStyle={[
                                    styles.numberFollow,
                                    {color: theme.textHightLight},
                                ]}
                            />
                        </StyleTouchable>

                        {/* Following */}
                        <StyleTouchable
                            customStyle={styles.elementFollow}
                            onPress={() =>
                                onNavigateFollow(TYPE_FOLLOW.following)
                            }>
                            <StyleText
                                i18Text="profile.component.infoProfile.following"
                                customStyle={[
                                    styles.titleFollow,
                                    {color: theme.borderColor},
                                ]}
                            />
                            <StyleText
                                originValue={String(followings)}
                                customStyle={[
                                    styles.numberFollow,
                                    {color: theme.textHightLight},
                                ]}
                            />
                        </StyleTouchable>
                    </View>

                    {NumberStars()}
                </View>

                <View style={styles.buttonBox}>{Button()}</View>
            </View>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: '20@s',
    },
    // avatar - cover
    introduceView: {
        width: '100%',
        flexDirection: 'row',
        marginTop: '10@vs',
    },
    avatarHeader: {
        width: avatarSize,
        height: avatarSize,
        borderRadius: '30@ms',
    },
    boxNameAndDescription: {
        flex: 1,
        paddingLeft: '15@s',
        justifyContent: 'center',
    },
    textName: {
        fontSize: FONT_SIZE.big,
        fontWeight: 'bold',
    },
    textDescription: {
        fontSize: FONT_SIZE.small,
        marginTop: '7@vs',
    },
    locationBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '3@vs',
    },
    iconLocation: {
        fontSize: '13@ms',
        color: Theme.common.commentGreen,
    },
    textLocation: {
        fontSize: FONT_SIZE.small,
        marginLeft: '2@s',
    },
    // box follow
    bottomView: {
        flexDirection: 'row',
        marginTop: '10@vs',
    },
    infoPart: {
        flex: 1,
    },
    followBox: {
        width: '100%',
        flexDirection: 'row',
    },
    elementFollow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: '15@s',
    },
    titleFollow: {
        fontSize: FONT_SIZE.small,
    },
    numberFollow: {
        fontSize: FONT_SIZE.small,
        marginLeft: '5@ms',
    },
    starBox: {
        width: '100%',
        flexDirection: 'row',
        marginTop: '5@vs',
        alignItems: 'flex-end',
    },
    iconStar: {
        fontSize: '17@ms',
        marginRight: '3@s',
    },
    textNumberStar: {
        fontSize: '8@ms',
    },
    buttonBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonTouch: {
        paddingHorizontal: '5@s',
        paddingVertical: '5@ms',
        alignItems: 'center',
        borderRadius: '5@ms',
    },
    textButton: {
        fontSize: FONT_SIZE.small,
        fontWeight: 'bold',
    },
    iconPlus: {
        fontSize: '14.4@ms',
    },
});

export default InformationProfile;
