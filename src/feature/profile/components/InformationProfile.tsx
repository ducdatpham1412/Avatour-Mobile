import {useAppSelector} from 'app-redux/store';
import {ACCOUNT} from 'asset/enum';
import {Metrics, safePaddingNotZero} from 'asset/metrics';
import {FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset/standardValue';
import {
  SquareButton,
  StyleImage,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {useTheme} from 'hook';
import {navigate, push} from 'navigation/NavigationService';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {
  ImageStyle,
  LayoutChangeEvent,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {seeDetailImage} from 'utility/assistant';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {useOtherProfile} from '../hooks';

interface Props {
  profile?: TypeGetProfileResponse;
  onLayOut?: (e: LayoutChangeEvent) => void;
}

interface ButtonOtherProfileProps {
  id: number;
}

const avatarSize = Metrics.width / 3.5;

const ButtonOtherProfile = ({id}: ButtonOtherProfileProps) => {
  const theme = useTheme();
  const [{isFollowing, loadingFollow, data}, {follow}] = useOtherProfile(id);
  const isShopAccount = data?.account_type === ACCOUNT.shop;

  return (
    <View style={$buttonView}>
      <SquareButton
        containerStyle={$buttonTouch}
        titleStyle={$textButton}
        title={isFollowing ? 'profile.unFollow' : 'profile.follow'}
        loading={loadingFollow}
        onPress={follow}
      />
      {isShopAccount && (
        <SquareButton
          containerStyle={[
            $buttonTouch,
            {
              backgroundColor: theme.p_600,
              marginLeft: 5,
            },
          ]}
          titleStyle={[$textButton, {color: theme.white}]}
          title="profile.reviewProvider"
          icon={
            <Entypo name="plus" style={[$iconPlus, {color: theme.white}]} />
          }
        />
      )}
    </View>
  );
};

const InformationProfile = ({profile, onLayOut}: Props) => {
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

  const onNavigateFollow = (type: 'follower' | 'following') => {
    push(ROOT_SCREEN.listFollows, {
      userId: id,
      name,
      initTab: type,
    });
  };

  const renderStars = () => {
    if (average_stars <= 0 || average_stars > 5 || !isShopAccount) {
      return null;
    }
    const arrayStars = Array(Math.floor(5)).fill(0);
    return (
      <View style={$starBox}>
        {arrayStars.map((_, index) => {
          const isStar = index + 1 <= average_stars;
          return (
            <AntDesign
              key={index}
              name={isStar ? 'star' : 'staro'}
              style={[$iconStar, {color: theme.orange}]}
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
          <SquareButton
            containerStyle={$buttonTouch}
            titleStyle={$textButton}
            title="common.edit"
            onPress={() => {
              navigate(ROOT_SCREEN.editProfile);
            }}
          />

          <SquareButton
            containerStyle={[
              $buttonTouch,
              {
                backgroundColor: isShopAccount ? theme.gray_300 : theme.p_600,
                marginLeft: 5,
              },
            ]}
            titleStyle={[
              $textButton,
              {
                color: isShopAccount ? theme.black : theme.white,
                fontWeight: isShopAccount ? FONT_WEIGHT_MEDIUM : 'bold',
              },
            ]}
            title="profile.createTour"
            onPress={() => {
              navigate(PROFILE_ROUTE.createTour);
            }}
            icon={
              <Entypo
                name="plus"
                style={[
                  $iconPlus,
                  {color: isShopAccount ? theme.black : theme.white},
                ]}
              />
            }
          />

          {isShopAccount && (
            <SquareButton
              containerStyle={[
                $buttonTouch,
                {
                  backgroundColor: theme.p_600,
                  marginLeft: 5,
                },
              ]}
              titleStyle={[
                $textButton,
                {color: theme.white, fontWeight: 'bold'},
              ]}
              onPress={() => {
                navigate(PROFILE_ROUTE.createPostPickImg, {
                  mode: 'sale',
                });
              }}
              title="profile.postGroupBuying"
              icon={
                <Entypo name="plus" style={[$iconPlus, {color: theme.white}]} />
              }
            />
          )}
        </View>
      );
    }

    return <ButtonOtherProfile id={id} />;
  };

  return (
    <View style={$container} onLayout={onLayOut}>
      <View style={$introduceView}>
        <StyleTouchable
          onPress={() =>
            seeDetailImage({
              images: [avatar],
            })
          }>
          <StyleImage source={{uri: avatar}} customStyle={$avatarHeader} />
        </StyleTouchable>
        <View style={$boxNameAndDescription}>
          <StyleText customStyle={$textName} originValue={name} />
          {!!profile.location && isShopAccount && (
            <View style={$locationBox}>
              <Ionicons
                name="location"
                style={[$iconLocation, {color: theme.blue}]}
              />
              <StyleText
                originValue={profile.location}
                customStyle={[$textLocation, {color: theme.gray_700}]}
              />
            </View>
          )}
          <View style={$followBox}>
            <StyleTouchable
              customStyle={$elementFollow}
              onPress={() => onNavigateFollow('follower')}>
              <StyleText
                i18Text="profile.follower"
                customStyle={[$textFollow, {color: theme.gray_500}]}
              />
              <StyleText
                originValue={String(followers)}
                customStyle={$numberFollow}
              />
            </StyleTouchable>

            <StyleTouchable
              customStyle={$elementFollow}
              onPress={() => onNavigateFollow('following')}>
              <StyleText
                i18Text="profile.following"
                customStyle={[$textFollow, {color: theme.gray_500}]}
              />
              <StyleText
                originValue={String(followings)}
                customStyle={$numberFollow}
              />
            </StyleTouchable>
          </View>
        </View>
      </View>

      {renderStars()}

      {!!description && (
        <StyleText originValue={description} customStyle={$textDescription} />
      )}

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
  marginTop: verticalScale(8),
  fontSize: FONT_SIZE.f3,
};
const $followBox: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  marginTop: verticalScale(7),
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
};
const $textButton: TextStyle = {
  fontSize: FONT_SIZE.f4,
  fontWeight: '500',
};
const $iconPlus: TextStyle = {
  fontSize: moderateScale(16),
};
const $locationBox: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: verticalScale(4),
};
const $iconLocation: TextStyle = {
  fontSize: moderateScale(14),
};
const $textLocation: TextStyle = {
  marginLeft: scale(4),
};
const $elementFollow: ViewStyle = {
  flex: 1,
  alignItems: 'center',
};
const $numberFollow: TextStyle = {
  fontWeight: 'bold',
};
const $textFollow: TextStyle = {
  fontSize: FONT_SIZE.f3,
};
const $starBox: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'flex-end',
  marginTop: verticalScale(12),
};
const $iconStar: TextStyle = {
  fontSize: moderateScale(17),
  marginRight: scale(4),
};

export default InformationProfile;
