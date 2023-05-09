import {useAppSelector} from 'app-redux/store';
import {ACCOUNT, TYPE_FOLLOW} from 'asset/enum';
import {Metrics, safePaddingNotZero} from 'asset/metrics';
import {BORDER_RADIUS, FONT_SIZE} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {navigate, push} from 'navigation/NavigationService';
import React from 'react';
import {ImageStyle, TextStyle, View, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {moderateScale, scale, verticalScale} from 'utility/scale';

interface Props {
  profile?: TypeGetProfileResponse;
  isFollowing?: boolean;
  onFollow?: () => Promise<void>;
}

const avatarSize = Metrics.width / 3.5;

const InformationProfile = ({profile, isFollowing, onFollow}: Props) => {
  const theme = useTheme();
  const myId = useAppSelector(state => state.accountSlice.passport.profile.id);

  if (!profile) {
    return <View style={[$container, {backgroundColor: theme.gray_200}]} />;
  }

  const {
    name,
    description,
    followers,
    followings,
    avatar,
    account_type,
    average_stars,
    id,
  } = profile;

  const isShopAccount = account_type === ACCOUNT.shop;
  const isMyProfile = myId === id;

  const onNavigateFollow = (type: number) => {
    push(ROOT_SCREEN.listFollows, {
      userId: id,
      name,
      type,
    });
  };

  const renderStars = () => {
    if (average_stars <= 0 || average_stars > 5 || !isShopAccount) {
      return null;
    }
    const arrayStars = Array(Math.floor(5)).fill(0);
    return (
      <View style={styles.starBox}>
        {arrayStars.map((_, index) => {
          const isStar = index + 1 <= average_stars;
          return (
            <AntDesign
              key={index}
              name={isStar ? 'star' : 'staro'}
              style={[styles.iconStar, {color: theme.orange}]}
            />
          );
        })}
        <StyleText
          originValue={`${average_stars} / 5`}
          customStyle={[$textNumberStar, {color: theme.gray_500}]}
        />
      </View>
    );
  };

  const renderButton = () => {
    if (isMyProfile) {
      return (
        <View style={$buttonView}>
          <StyleTouchable
            customStyle={[$buttonTouch, {backgroundColor: theme.gray_300}]}
            onPress={() => {
              navigate(ROOT_SCREEN.editProfile);
            }}>
            <StyleText
              i18Text="profile.editProfile"
              customStyle={$textButton}
            />
          </StyleTouchable>
          {isShopAccount && (
            <StyleTouchable
              customStyle={[
                $buttonTouch,
                {
                  backgroundColor: theme.p_600,
                  marginLeft: 5,
                },
              ]}
              onPress={() => {
                navigate(PROFILE_ROUTE.createPostPickImg, {
                  isCreateGB: true,
                });
              }}
              hitSlop={{right: 20}}>
              <Entypo name="plus" style={[$iconPlus, {color: theme.white}]} />
              <StyleText
                i18Text="profile.postGroupBuying"
                customStyle={[$textPostNew, {color: theme.white}]}
              />
            </StyleTouchable>
          )}
        </View>
      );
    }

    return (
      <View style={$buttonView}>
        <StyleTouchable
          customStyle={[$buttonTouch, {backgroundColor: theme.gray_300}]}
          onPress={onFollow}>
          <StyleText
            i18Text={isFollowing ? 'profile.unFollow' : 'profile.follow'}
            customStyle={$textButton}
          />
        </StyleTouchable>
        {isShopAccount && (
          <StyleTouchable
            customStyle={[
              $buttonTouch,
              {
                backgroundColor: theme.gray_300,
                marginLeft: 5,
              },
            ]}
            onPress={() => {
              console.log('Writing review supplier');
            }}
            hitSlop={{right: 20}}>
            <Entypo name="plus" style={[$iconPlus, {color: theme.black}]} />
            <StyleText
              i18Text="profile.reviewProvider"
              customStyle={[$textPostNew, {color: theme.black}]}
            />
          </StyleTouchable>
        )}
      </View>
    );
  };

  return (
    <View style={$container}>
      <View style={$introduceView}>
        <StyleImage source={{uri: avatar}} customStyle={$avatarHeader} />
        <View style={$boxNameAndDescription}>
          <StyleText
            customStyle={$textName}
            originValue={name}
            numberOfLines={1}
          />
          {!!profile.location && isShopAccount && (
            <View style={styles.locationBox}>
              <Ionicons name="location" style={styles.iconLocation} />
              <StyleText
                originValue={profile.location}
                customStyle={[styles.textLocation, {color: theme.borderColor}]}
                numberOfLines={1}
              />
            </View>
          )}
          {!!description && (
            <StyleText
              originValue={description}
              customStyle={[$textDescription, {color: theme.gray_500}]}
              numberOfLines={3}
            />
          )}
          {renderStars()}
        </View>
      </View>

      <View style={$followBox}>
        {/* Follower */}
        <StyleTouchable
          customStyle={styles.elementFollow}
          onPress={() => onNavigateFollow(TYPE_FOLLOW.follower)}>
          <StyleText
            i18Text="profile.follower"
            customStyle={{color: theme.gray_500}}
          />
          <StyleText
            originValue={String(followers)}
            customStyle={styles.numberFollow}
          />
        </StyleTouchable>

        {/* Following */}
        <StyleTouchable
          customStyle={styles.elementFollow}
          onPress={() => onNavigateFollow(TYPE_FOLLOW.following)}>
          <StyleText
            i18Text="profile.following"
            customStyle={{color: theme.gray_500}}
          />
          <StyleText
            originValue={String(followings)}
            customStyle={styles.numberFollow}
          />
        </StyleTouchable>
      </View>

      {renderButton()}
    </View>
  );
};

const $container: ViewStyle = {
  width: '100%',
  paddingHorizontal: scale(16),
  minHeight: avatarSize,
  marginTop: safePaddingNotZero,
};
const $introduceView: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
};
const $avatarHeader: ImageStyle = {
  width: avatarSize,
  height: avatarSize,
  borderRadius: moderateScale(20),
};
const $boxNameAndDescription: ViewStyle = {
  flex: 1,
  paddingLeft: scale(16),
  justifyContent: 'center',
};
const $textName: TextStyle = {
  fontSize: FONT_SIZE.h2,
  fontWeight: 'bold',
};
const $textDescription: TextStyle = {
  marginTop: verticalScale(7),
};
const $followBox: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  marginTop: verticalScale(12),
};
const $textNumberStar: TextStyle = {
  fontSize: FONT_SIZE.f4,
};
const $buttonView: ViewStyle = {
  marginTop: verticalScale(12),
  flexDirection: 'row',
};
const $buttonTouch: ViewStyle = {
  flex: 1,
  paddingVertical: verticalScale(6),
  borderRadius: BORDER_RADIUS.f4,
  justifyContent: 'center',
  flexDirection: 'row',
};
const $textButton: TextStyle = {
  fontSize: FONT_SIZE.f3,
  fontWeight: '500',
};
const $textPostNew: TextStyle = {
  fontSize: FONT_SIZE.f3,
  fontWeight: 'bold',
  marginLeft: 5,
};
const $iconPlus: TextStyle = {
  fontSize: moderateScale(16),
};

const styles = ScaledSheet.create({
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
  numberFollow: {
    marginLeft: '5@ms',
    fontWeight: 'bold',
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
});

export default InformationProfile;
