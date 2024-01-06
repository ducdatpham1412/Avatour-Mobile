import {useAppSelector} from 'app-redux/store';
import {ACCOUNT, STATUS} from 'asset/enum';
import {IconClock, IconLocation, IconPrice} from 'asset/icons';
import {Metrics, horizontalPadding, verticalMargin} from 'asset/metrics';
import {FONT_SIZE, FONT_WEIGHT_MEDIUM, ratioAvatar} from 'asset/standardValue';
import {ScrollCropImages, TextReadMore} from 'components';
import {SquareButton, StyleText, StyleTouchable} from 'components/base';
import dayjs from 'dayjs';
import {useTheme} from 'hook';
import {getCurrentRoute, navigate, push} from 'navigation/NavigationService';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {checkAuthenticated} from 'navigation/screen/AppModal';
import {ModalActionSheet, ModalAlert} from 'navigation/screen/modals';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {LayoutChangeEvent, TextStyle, View, ViewStyle} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {seeDetailImage} from 'utility/assistant';
import Authentication from 'utility/authentication';
import {formatHours, formatLocaleNumber, formatMoney} from 'utility/format';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {CallBackCheckIn, useOtherProfile} from '../hooks';

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
  checkAuthenticated({
    onAuthenticated: () => {
      push(ROOT_SCREEN.listFollows, {
        initTab: type,
        profile,
      });
    },
  });
};

const ButtonOtherProfile = ({profile}: ComponentProps) => {
  const theme = useTheme();
  const [{isFollowing, isBlocked, loadingFollow}, {follow, block, report}] =
    useOtherProfile(profile.id, {
      initValue: profile,
    });
  const haveCheckIn = profile.account_type === ACCOUNT.location;

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

    checkAuthenticated({
      onAuthenticated: async () => {
        try {
          await follow();
        } catch (err) {
          ModalAlert.error({
            content: err,
          });
        }
      },
    });
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
            },
          ]}
          titleStyle={[$textButton, {color: theme.white, fontWeight: 'bold'}]}
          title="profile.checkIn"
          icon={
            <Entypo name="plus" style={[$iconPlus, {color: theme.white}]} />
          }
          onPress={() => {
            const curRoute = getCurrentRoute();
            CallBackCheckIn.set(() => {
              navigate(curRoute.name, {
                key: curRoute.key,
                ...curRoute.params,
                tab: 'check-in',
              });
            });
            navigate(PROFILE_ROUTE.createPostPickImg, {
              mode: 'check-in',
              user: {
                id: profile.id,
                name: profile.name,
                avatar: profile.avatar,
              },
              joinId: null,
            });
          }}
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

const OpenStatus = ({profile}: ComponentProps) => {
  const theme = useTheme();
  const {t} = useTranslation();

  if (profile.start_time === 0 && profile.end_time === 0) {
    return (
      <StyleText
        i18Text="profile.openAllDay"
        customStyle={[$openClose, {color: theme.green}]}
      />
    );
  }

  const now = dayjs();
  const hourNow = Number(`${now.hour()}.${now.minute()}`);
  const isOpening = hourNow > profile.start_time && hourNow < profile.end_time;

  return (
    <>
      <StyleText
        i18Text={isOpening ? 'profile.opening' : 'profile.closing'}
        customStyle={[$openClose, {color: isOpening ? theme.green : theme.red}]}
      />
      <StyleText
        originValue={`${t('profile.businessHours')}: ${
          formatHours(profile.start_time).text
        } - ${formatHours(profile.end_time).text}`}
        customStyle={{marginTop: verticalScale(4)}}
      />
    </>
  );
};

const InformationSupplier = ({profile}: ComponentProps) => {
  const theme = useTheme();

  const renderPx = () => {
    if (!profile.min_cost && !profile.max_cost) {
      return (
        <StyleText
          customStyle={[
            $textMoreInfo,
            {marginLeft: scale(4), fontWeight: FONT_WEIGHT_MEDIUM},
          ]}
          i18Text="discovery.free"
        />
      );
    }

    if (profile.min_cost === profile.max_cost) {
      return (
        <StyleText
          customStyle={[
            $textMoreInfo,
            {marginLeft: scale(4), fontWeight: FONT_WEIGHT_MEDIUM},
          ]}
          originValue={`${formatMoney(profile.min_cost)}`}
        />
      );
    }

    return (
      <StyleText
        customStyle={[
          $textMoreInfo,
          {marginLeft: scale(4), fontWeight: FONT_WEIGHT_MEDIUM},
        ]}
        originValue={`${formatLocaleNumber(profile.min_cost)} - ${formatMoney(
          profile.max_cost,
        )}`}
      />
    );
  };

  return (
    <View style={$introduceView}>
      {!!profile.name && (
        <StyleText customStyle={$textName} originValue={profile?.name} />
      )}

      <View style={$locationBox}>
        <IconLocation tintColor={theme.gray_500} />
        <StyleText
          originValue={profile?.location}
          customStyle={$textLocation}
        />
      </View>

      {!!profile.description && (
        <TextReadMore
          value={profile.description}
          containerStyle={$textDescription}
          textStyle={{color: theme.gray_600}}
          minRows={5}
        />
      )}

      {/* <View style={$starBox}>
        <Stars value={profile?.average_stars} />
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
      </View> */}

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

        {profile.account_type !== ACCOUNT.location && (
          <StyleTouchable
            customStyle={[$elementFollow, {marginLeft: scale(20)}]}
            onPress={() => onNavigateFollow('following', profile)}>
            <StyleText i18Text="profile.following" customStyle={$textFollow} />
            <StyleText
              originValue={profile.followings}
              customStyle={$numberFollow}
            />
          </StyleTouchable>
        )}
      </View>

      <Button profile={profile} />

      <OpenStatus profile={profile} />

      <View style={$moreInfoBox}>
        <IconClock size={18} tintColor={theme.black} />
        <StyleText
          customStyle={[$textMoreInfo, {marginLeft: scale(4)}]}
          i18Text="discovery.durationHere">
          <StyleText
            originValue={`: ${profile.duration}h`}
            customStyle={[$textMoreInfo, {fontWeight: FONT_WEIGHT_MEDIUM}]}
          />
        </StyleText>
      </View>
      <View style={$moreInfoBox}>
        <IconPrice size={18} tintColor={theme.black} />
        {renderPx()}
      </View>
    </View>
  );
};

const InformationUser = ({profile}: ComponentProps) => {
  const theme = useTheme();

  return (
    <View style={$introduceView}>
      {!!profile.name && (
        <StyleText customStyle={$textName} originValue={profile?.name} />
      )}
      {!!profile.description && (
        <TextReadMore
          value={profile.description}
          containerStyle={$textDescription}
          textStyle={{color: theme.gray_600}}
        />
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
    </View>
  );
};

const InformationModeExp = () => {
  const theme = useTheme();

  return (
    <View style={$introduceView}>
      <View style={[$buttonView, {marginTop: 0}]}>
        <SquareButton
          title="setting.signInSignUp"
          titleStyle={$textButton}
          containerStyle={$buttonTouch}
          onPress={() => {
            const curRoute = getCurrentRoute();
            Authentication.open(() => {
              navigate(curRoute.name, {
                key: curRoute.key,
                ...curRoute.params,
              });
            });
          }}
        />
        <SquareButton
          title="profile.createTour"
          containerStyle={[$buttonTouch, {backgroundColor: theme.p_600}]}
          titleStyle={[
            $textButton,
            {
              color: theme.white,
              fontWeight: 'bold',
            },
          ]}
          onPress={() => {
            navigate(PROFILE_ROUTE.createTour);
          }}
          icon={
            <Entypo name="plus" style={[$iconPlus, {color: theme.white}]} />
          }
        />
      </View>
    </View>
  );
};

const InformationProfile = ({profile, onLayOut}: Props) => {
  const {avatar, account_type} = profile;
  const {modeExp} = useAppSelector(state => state.accountSlice);

  const isShopAccount = account_type === ACCOUNT.shop;

  const renderContent = () => {
    if (isShopAccount || account_type === ACCOUNT.location) {
      return <InformationSupplier profile={profile} />;
    }
    if (modeExp) {
      return <InformationModeExp />;
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
          height={width * ratioAvatar}
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
  marginTop: verticalScale(4),
};
const $followBox: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  marginTop: verticalMargin,
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
// const $textNumberStar: TextStyle = {
//   fontSize: FONT_SIZE.f4,
// };
const $buttonView: ViewStyle = {
  marginTop: verticalMargin,
  flexDirection: 'row',
  gap: scale(8),
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
};
// const $starBox: ViewStyle = {
//   width: '100%',
//   flexDirection: 'row',
//   alignItems: 'flex-end',
//   marginTop: verticalMargin,
//   gap: horizontalMargin,
// };
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
