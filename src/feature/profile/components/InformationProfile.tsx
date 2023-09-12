import {useAppSelector} from 'app-redux/store';
import {ACCOUNT, STATUS} from 'asset/enum';
import {IconClock, IconLocation, IconPrice} from 'asset/icons';
import {Metrics, horizontalPadding, verticalMargin} from 'asset/metrics';
import {
  FONT_SIZE,
  FONT_WEIGHT_MEDIUM,
  ratioAvatarLocation,
} from 'asset/standardValue';
import {SquareButton, StyleText, StyleTouchable} from 'components/base';
import dayjs from 'dayjs';
import {useTheme} from 'hook';
import {navigate, push} from 'navigation/NavigationService';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {LayoutChangeEvent, TextStyle, View, ViewStyle} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {seeDetailImage} from 'utility/assistant';
import {formatLocaleNumber, formatMoney} from 'utility/format';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {useOtherProfile} from '../hooks';
import ScrollCropImages from './ScrollCropImages';
import {ModalActionSheet, ModalAlert} from 'navigation/screen/modals';

interface Props {
  profile: TypeGetProfileResponse;
  onLayOut?: (e: LayoutChangeEvent) => void;
}

interface ComponentProps {
  profile: TypeGetProfileResponse;
}

const {width} = Metrics;

const onNavigateFollow = (
  type: 'follower' | 'following',
  profile: TypeGetProfileResponse,
) => {
  push(ROOT_SCREEN.listFollows, {
    initTab: type,
    profile,
  });
};

const formatTime = (time: number) => {
  return String(time).replace('.', ':');
};

const ButtonOtherProfile = ({profile}: ComponentProps) => {
  const theme = useTheme();
  const [
    {isFollowing, isBlocked, loadingFollow, data},
    {follow, block, report},
  ] = useOtherProfile(profile.id, {
    initValue: profile,
  });
  const haveCheckIn =
    data?.account_type === ACCOUNT.shop ||
    data?.account_type === ACCOUNT.location;

  const onShowModalOptions = async () => {
    if (isFollowing) {
      if (!isBlocked) {
        ModalActionSheet.show({
          options: [
            {
              title: isFollowing ? 'profile.unFollow' : 'profile.follow',
              onPress: () => {
                try {
                  follow();
                } catch (err) {
                  ModalAlert.error({
                    content: err,
                  });
                }
              },
            },
            {
              title: isBlocked ? 'profile.unBlock' : 'profile.block',
              onPress: () => {
                try {
                  block();
                } catch (err) {
                  ModalAlert.error({
                    content: err,
                  });
                }
              },
            },
            {
              title: 'profile.report',
              onPress: report,
            },
          ],
        });
      }
      return;
    }

    try {
      await follow();
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    }
  };

  return (
    <View style={$buttonView}>
      <SquareButton
        containerStyle={$buttonTouch}
        titleStyle={$textButton}
        title={isFollowing ? 'profile.following' : 'profile.follow'}
        loading={loadingFollow}
        onPress={onShowModalOptions}
      />
      {haveCheckIn && (
        <SquareButton
          containerStyle={[
            $buttonTouch,
            {
              backgroundColor: theme.p_600,
              marginLeft: scale(8),
            },
          ]}
          titleStyle={[$textButton, {color: theme.white, fontWeight: 'bold'}]}
          title="profile.checkIn"
          icon={
            <Entypo name="plus" style={[$iconPlus, {color: theme.white}]} />
          }
        />
      )}
    </View>
  );
};

const Button = ({profile}: ComponentProps) => {
  const theme = useTheme();
  const {id: myId} = useAppSelector(
    state => state.accountSlice.passport.profile,
  );
  const {account_type, id} = profile;
  const isShopAccount = account_type === ACCOUNT.shop;
  const isMyProfile = myId === id;

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
              backgroundColor: isShopAccount ? theme.gray_100 : theme.p_600,
              marginLeft: scale(8),
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
                marginLeft: scale(8),
              },
            ]}
            titleStyle={[$textButton, {color: theme.white, fontWeight: 'bold'}]}
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

  if ([STATUS.draft, STATUS.suggesting].includes(profile.status)) {
    return null;
  }

  return <ButtonOtherProfile profile={profile} />;
};

const InformationSupplier = ({profile}: ComponentProps) => {
  const theme = useTheme();
  const arrayStars = Array(Math.floor(5)).fill(0);
  const now = dayjs();
  const hourNow = Number(`${now.hour()}.${now.minute()}`);
  const isOpening = hourNow > profile.start_time && hourNow < profile.end_time;

  return (
    <View style={$introduceView}>
      {!!profile.name && (
        <StyleText customStyle={$textName} originValue={profile?.name} />
      )}

      <View style={$locationBox}>
        <IconLocation tintColor={theme.gray_500} />
        <StyleText
          originValue={profile?.location}
          customStyle={[$textLocation, {color: theme.gray_500}]}
        />
      </View>

      <View style={$starBox}>
        {arrayStars.map((_, index) => {
          const isStar = index + 1 <= profile?.average_stars;
          return (
            <AntDesign
              key={index}
              name={isStar ? 'star' : 'staro'}
              style={[$iconStar, {color: theme.orange}]}
            />
          );
        })}
        {profile?.average_stars ? (
          <StyleText
            originValue={`${profile.average_stars} / 5`}
            customStyle={[$textNumberStar, {color: theme.gray_500}]}
          />
        ) : (
          <StyleText
            i18Text="profile.noReviewYet"
            customStyle={[$textNumberStar, {color: theme.gray_500}]}
          />
        )}
      </View>

      <View style={$followBox}>
        <StyleTouchable
          customStyle={$elementFollow}
          onPress={() => onNavigateFollow('follower', profile)}>
          <StyleText i18Text="profile.follower" customStyle={$textFollow} />
          <StyleText
            originValue={profile.followers}
            customStyle={$numberFollow}
          />
        </StyleTouchable>

        <StyleTouchable
          customStyle={[$elementFollow, {marginLeft: scale(20)}]}
          onPress={() => onNavigateFollow('following', profile)}>
          <StyleText i18Text="profile.following" customStyle={$textFollow} />
          <StyleText
            originValue={profile.followings}
            customStyle={$numberFollow}
          />
        </StyleTouchable>
      </View>

      <Button profile={profile} />

      <StyleText
        i18Text={isOpening ? 'profile.opening' : 'profile.closing'}
        customStyle={[$openClose, {color: isOpening ? theme.green : theme.red}]}
      />
      <StyleText
        originValue={`${formatTime(profile.start_time)} - ${profile.end_time}`}
      />
      <View style={$moreInfoBox}>
        <IconClock size={18} tintColor={theme.black} />
        <StyleText
          customStyle={[$textMoreInfo, {marginLeft: scale(4)}]}
          i18Text="profile.enjoyTime">
          <StyleText
            originValue={`: ${profile.duration}h`}
            customStyle={[$textMoreInfo, {fontWeight: FONT_WEIGHT_MEDIUM}]}
          />
        </StyleText>
      </View>
      {!!profile.min_cost && !!profile.max_cost && (
        <View style={$moreInfoBox}>
          <IconPrice size={18} tintColor={theme.black} />
          <StyleText
            customStyle={[
              $textMoreInfo,
              {marginLeft: scale(4), fontWeight: FONT_WEIGHT_MEDIUM},
            ]}
            originValue={`${formatLocaleNumber(
              profile.min_cost,
            )} - ${formatMoney(profile.max_cost)}`}
          />
        </View>
      )}

      {/* TODO: Check see more text here */}
      {!!profile.description && (
        <StyleText
          originValue={profile.description}
          customStyle={$textDescription}
          numberOfLines={3}
        />
      )}
    </View>
  );
};

const InformationUser = ({profile}: ComponentProps) => {
  return (
    <View style={$introduceView}>
      {!!profile.name && (
        <StyleText customStyle={$textName} originValue={profile?.name} />
      )}
      <View style={$followBox}>
        <StyleTouchable
          customStyle={$elementFollow}
          onPress={() => onNavigateFollow('follower', profile)}>
          <StyleText i18Text="profile.follower" customStyle={$textFollow} />
          <StyleText
            originValue={profile.followers}
            customStyle={$numberFollow}
          />
        </StyleTouchable>

        <StyleTouchable
          customStyle={[$elementFollow, {marginLeft: scale(20)}]}
          onPress={() => onNavigateFollow('following', profile)}>
          <StyleText i18Text="profile.following" customStyle={$textFollow} />
          <StyleText
            originValue={profile.followings}
            customStyle={$numberFollow}
          />
        </StyleTouchable>
      </View>

      <Button profile={profile} />

      {!!profile.description && (
        <StyleText
          originValue={profile.description}
          customStyle={$textDescription}
          numberOfLines={3}
        />
      )}
    </View>
  );
};

const InformationProfile = ({profile, onLayOut}: Props) => {
  const {avatar, account_type} = profile;

  const isShopAccount = account_type === ACCOUNT.shop;

  const renderContent = () => {
    if (isShopAccount || account_type === ACCOUNT.location) {
      return <InformationSupplier profile={profile} />;
    }
    return <InformationUser profile={profile} />;
  };

  return (
    <View style={$container} onLayout={onLayOut}>
      <StyleTouchable
        onPress={() =>
          seeDetailImage({
            images: [avatar],
          })
        }>
        <ScrollCropImages
          images={[profile.avatar]}
          width={width}
          height={width * ratioAvatarLocation}
          enableRemoveImage={false}
        />
      </StyleTouchable>
      {renderContent()}
    </View>
  );
};

const $container: ViewStyle = {
  width: '100%',
};
const $introduceView: ViewStyle = {
  width: '100%',
  paddingHorizontal: horizontalPadding,
  marginTop: verticalMargin,
};
const $textName: TextStyle = {
  fontSize: FONT_SIZE.h2,
  fontWeight: 'bold',
};
const $textDescription: TextStyle = {
  marginTop: verticalMargin,
};
const $followBox: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  marginTop: verticalScale(4),
};
const $elementFollow: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};
const $numberFollow: TextStyle = {
  fontWeight: 'bold',
  marginLeft: scale(4),
};
const $textFollow: TextStyle = {
  fontSize: FONT_SIZE.f2,
};
const $textNumberStar: TextStyle = {
  fontSize: FONT_SIZE.f4,
};
const $buttonView: ViewStyle = {
  marginTop: verticalMargin,
  flexDirection: 'row',
};
const $buttonTouch: ViewStyle = {
  flex: 1,
};
const $textButton: TextStyle = {
  fontSize: FONT_SIZE.f3,
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
const $textLocation: TextStyle = {
  marginLeft: scale(4),
  fontSize: FONT_SIZE.f3,
};
const $starBox: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'flex-end',
  marginTop: verticalMargin,
};
const $iconStar: TextStyle = {
  fontSize: moderateScale(17),
  marginRight: scale(4),
};
const $openClose: TextStyle = {
  marginTop: verticalMargin,
  fontWeight: 'bold',
};
const $moreInfoBox: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: verticalScale(4),
};
const $textMoreInfo: TextStyle = {
  fontSize: FONT_SIZE.f2,
};

export default InformationProfile;
