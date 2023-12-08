import {useAppSelector} from 'app-redux/store';
import {ACCOUNT, APP_EVENT, STATUS} from 'asset/enum';
import {IconTour} from 'asset/icons';
import Images from 'asset/img/images';
import {
  horizontalMargin,
  horizontalPadding,
  verticalMargin,
} from 'asset/metrics';
import {LoadingScreen, TabView} from 'components';
import {
  RefreshControl,
  StyleButton,
  StyleContainer,
  StyleIcon,
  StyleTouchable,
} from 'components/base';
import {emitAppEvent, useSafeArea, useTheme} from 'hook';
import {goBack, navigate} from 'navigation/NavigationService';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import {ModalActionSheet, ModalAlert} from 'navigation/screen/modals';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View, ViewStyle} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {$styleTopShadow, borderWidthTiny} from 'utility/assistant';
import {scale, verticalScale} from 'utility/scale';
import {IconTabBarProfile, InformationProfile} from './components';
import {useMyLocations, useMyRequests, useOtherProfile} from './hooks';
import {ListReviews, ListSales, ListTours} from './screens';

type Props = RouteParams<AppParamsList[ROOT_SCREEN.otherProfile]>;

interface ButtonSuggestProps {
  userId: number;
}

const renderNull = () => {
  return <View />;
};

const renderTabIndex = (
  profile: TypeGetProfileResponse,
  tab: Props['route']['params']['tab'],
) => {
  if (tab) {
    switch (tab) {
      case 'shop':
        return 0;
      case 'tour':
        return 1;
      case 'check-in':
        return 2;
      default:
        return 0;
    }
  }

  if (profile.account_type === ACCOUNT.shop) {
    return 0;
  }
  if (profile.account_type === ACCOUNT.location) {
    return 2;
  }
  return 1;
};

const ButtonSuggest = ({userId}: ButtonSuggestProps) => {
  const theme = useTheme();
  const {t} = useTranslation();
  const {bottom} = useSafeArea();
  const [{data}, {mutate}] = useOtherProfile(userId);
  const [
    {loadingDeleteSuggestLocation, loadingSuggestLocation},
    {suggestLocation, deleteSuggestLocation},
  ] = useMyRequests();

  const isDraft = data?.status === STATUS.draft;
  const isSuggesting = data?.status === STATUS.suggesting;

  if (isDraft || isSuggesting) {
    const onEdit = () => {
      if (data) {
        navigate(ROOT_SCREEN.createLocation, {
          itemEdit: data,
        });
      }
    };

    const onSuggest = () => {
      if (isDraft) {
        ModalAlert.options({
          content: t('discovery.newLocation', {
            value: data?.name,
          }),
          titleButton: 'common.suggest',
          icon: 'nice',
          onContinue: async () => {
            try {
              await suggestLocation(userId);
              ModalAlert.success({
                title: 'discovery.thankyou',
                i18Content: 'discovery.suggestHaveBeenAcknowledged',
                icon: 'nice',
              });
              await mutate(
                pre => {
                  if (pre) {
                    return {
                      ...pre,
                      status: STATUS.suggesting,
                    };
                  }
                },
                {revalidate: false},
              );
              emitAppEvent(APP_EVENT.suggestLocation, {
                locationId: userId,
                event: 'suggest',
              });
            } catch (err) {
              ModalAlert.error({
                content: err,
              });
            }
          },
        });
      } else {
        ModalActionSheet.show({
          options: [
            {
              title: 'common.cancelSuggest',
              onPress: async () => {
                const agree = async () => {
                  try {
                    await deleteSuggestLocation(userId);
                    await mutate(
                      pre => {
                        if (pre) {
                          return {
                            ...pre,
                            status: STATUS.draft,
                          };
                        }
                      },
                      {revalidate: false},
                    );
                    emitAppEvent(APP_EVENT.suggestLocation, {
                      locationId: userId,
                      event: 'delete-suggest',
                    });
                  } catch (err) {
                    ModalAlert.error({
                      content: err,
                    });
                  }
                };

                ModalAlert.options({
                  i18Content: 'profile.post.sureDeletePost',
                  titleButton: 'common.cancelSuggest',
                  onContinue: agree,
                  icon: 'cute',
                });
              },
            },
          ],
        });
      }
    };

    return (
      <View
        style={[
          $button,
          $styleTopShadow,
          {
            paddingBottom: bottom,
            backgroundColor: theme.white,
          },
        ]}>
        <StyleButton
          containerStyle={[$buttonEdit, {borderColor: theme.black}]}
          titleStyle={{color: theme.black}}
          title="common.edit"
          onPress={onEdit}
        />
        <StyleButton
          containerStyle={$buttonSuggest}
          title={isDraft ? 'common.suggest' : 'common.suggesting'}
          onPress={onSuggest}
          isLoading={loadingDeleteSuggestLocation || loadingSuggestLocation}
        />
      </View>
    );
  }

  return null;
};

const OtherProfile = ({
  route: {
    params: {id, initValue, tab},
  },
}: Props) => {
  const theme = useTheme();
  const {modeExp} = useAppSelector(state => state.accountSlice);
  const [
    {data, isFollowing, isBlocked, loading, validating},
    {follow, block, report, mutate},
  ] = useOtherProfile(id, {
    initValue,
    // TODO: Only = true when routeParam having revalidateAll = True => Add revalidateAll in routeParams
    revalidateAll: true,
  });
  const [{loadingDeleteLocation}, {deleteLocation}] = useMyLocations();

  const [tabViewHeight, setTabViewHeight] = useState(0);

  const isPrivate =
    data?.status && [STATUS.draft, STATUS.suggesting].includes(data?.status);

  /**
   * Functions
   */
  const onShowModalOptions = () => {
    if (isPrivate) {
      ModalActionSheet.show({
        options: [
          {
            title: 'profile.deleteLocation',
            onPress: () => {
              ModalAlert.options({
                i18Content: 'profile.post.sureDeletePost',
                onContinue: () => {
                  deleteLocation(id)
                    .then(goBack)
                    .catch(err => {
                      ModalAlert.error({
                        content: err,
                      });
                    });
                },
                icon: 'cute',
              });
            },
          },
        ],
      });
      return;
    }

    ModalActionSheet.show({
      options: [
        {
          title: isFollowing ? 'profile.unFollow' : 'profile.follow',
          onPress: follow,
        },
        {
          title: isBlocked ? 'profile.unBlock' : 'profile.block',
          onPress: block,
        },
        {
          title: 'profile.report',
          onPress: report,
        },
      ],
    });
  };

  /**
   * Render
   */
  const renderShop = () => {
    if (data) {
      return <ListSales userId={data?.id} account_type={data?.account_type} />;
    }
    return null;
  };

  const renderTour = () => {
    if (data) {
      return <ListTours userId={data?.id} />;
    }
    return null;
  };

  const listReviews = () => {
    if (data) {
      return (
        <ListReviews userId={data?.id} account_type={data?.account_type} />
      );
    }
    return null;
  };

  const renderTabView = () => {
    if (isBlocked || !data) {
      return null;
    }

    if (modeExp) {
      return (
        <TabView
          style={[$body, {height: tabViewHeight}]}
          tabBarStyle={$tabBar}
          listElements={[renderShop, renderNull, renderNull]}
          listIconTabBar={[
            <IconTabBarProfile title="profile.shop" icon={Images.icons.shop} />,
            <IconTabBarProfile
              title="discovery.tour"
              icon={<IconTour size={22} />}
            />,
            <IconTabBarProfile
              title="profile.checkIn"
              icon={Images.icons.review}
            />,
          ]}
          initialIndex={renderTabIndex(data, tab)}
        />
      );
    }

    return (
      <TabView
        style={[$body, {height: tabViewHeight}]}
        tabBarStyle={$tabBar}
        listElements={[renderShop, renderTour, listReviews]}
        listIconTabBar={[
          <IconTabBarProfile title="profile.shop" icon={Images.icons.shop} />,
          <IconTabBarProfile
            title="discovery.tour"
            icon={<IconTour size={22} />}
          />,
          <IconTabBarProfile
            title="profile.checkIn"
            icon={Images.icons.review}
          />,
        ]}
        initialIndex={renderTabIndex(data, tab)}
      />
    );
  };

  return (
    <>
      <StyleContainer
        headerProps={{
          title: 'common.null',
          RightComponent: isBlocked ? null : (
            <StyleTouchable onPress={onShowModalOptions}>
              <StyleIcon
                source={Images.icons.more}
                size={20}
                customStyle={{tintColor: theme.black}}
              />
            </StyleTouchable>
          ),
        }}
        customStyle={$content}
        backgroundColor={theme.white}
        initLoading={loading || !data}
        layOut="view"
        BottomComponent={<ButtonSuggest userId={id} />}>
        <View
          style={$container}
          onLayout={e => {
            setTabViewHeight(e.nativeEvent.layout.height);
          }}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={validating && !loading}
                onRefresh={mutate}
              />
            }
            stickyHeaderIndices={[1]}
            showsVerticalScrollIndicator={false}>
            {!!data && <InformationProfile profile={data} />}
            {renderTabView()}
          </ScrollView>
        </View>
      </StyleContainer>

      {loadingDeleteLocation && <LoadingScreen />}
    </>
  );
};

const $container: ViewStyle = {
  flex: 1,
};
const $body: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(8),
};
const $tabBar: ViewStyle = {
  paddingHorizontal: scale(16),
};
const $content: ViewStyle = {
  paddingHorizontal: 0,
};
const $button: ViewStyle = {
  width: '100%',
  paddingTop: verticalMargin,
  paddingHorizontal: horizontalPadding,
  alignItems: 'center',
  flexDirection: 'row',
};
const $buttonEdit: ViewStyle = {
  width: undefined,
  flex: 1,
  backgroundColor: 'transparent',
  borderWidth: borderWidthTiny,
};
const $buttonSuggest: ViewStyle = {
  width: undefined,
  flex: 1,
  marginLeft: horizontalMargin,
};

export default OtherProfile;
