import {useAppSelector} from 'app-redux/store';
import {FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {APP_EVENT, STATUS} from 'asset/enum';
import {IconTour} from 'asset/icons';
import Images from 'asset/img/images';
import {horizontalPadding, safePaddingNotZero} from 'asset/metrics';
import {AppModalize, LoadingScreen, MapTour, TabView} from 'components';
import {
  StyleButton,
  StyleIcon,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {Avatar, IndicatorModal} from 'components/common';
import {emitAppEvent, useAppEvent, useSafeArea, useTheme} from 'hook';
import {goBack, navigate} from 'navigation/NavigationService';
import {AppParamsList, PROFILE_ROUTE, ROOT_SCREEN} from 'navigation/config';
import {ModalActionSheet, ModalAlert} from 'navigation/screen/modals';
import React, {ElementRef, useRef} from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {
  GestureEventPayload,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  AnimatedStyle,
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  $styleDropShadow,
  onGoToProfile,
  updateStatusLocationInSchedule,
} from 'utility/assistant';
import {impactLight} from 'utility/haptic';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {ModalSearchFilter, ToolSearch} from './components';
import {useDetailTour} from './hooks';
import {DayScheduleDetailTour} from './screens';

export const levelModalScheduleHeight = {
  low: verticalScale(180),
  middleLow: verticalScale(290),
  medium: verticalScale(400),
  middleMedium: verticalScale(560),
  high: verticalScale(720),
};

export type CTX = {
  height: number;
};

type Move = {
  duration: number;
};

interface ButtonPublicTourProps {
  aim: SharedValue<number>;
  tourId: number;
}

const move = (value: number, params?: Move) => {
  'worklet';
  return withTiming(value, {
    duration: params?.duration ?? 120,
  });
};

export const checkOnEnd = (
  shareValue: SharedValue<number>,
  event: Readonly<GestureEventPayload & PanGestureHandlerEventPayload>,
) => {
  'worklet';
  if (shareValue.value < levelModalScheduleHeight.medium) {
    if (event.velocityY < -4800) {
      shareValue.value = move(levelModalScheduleHeight.high);
      return;
    }
    if (event.velocityY < -1300) {
      shareValue.value = move(levelModalScheduleHeight.medium);
      return;
    }
    if (event.velocityY > 1300) {
      shareValue.value = move(levelModalScheduleHeight.low);
      return;
    }
  }

  if (shareValue.value >= levelModalScheduleHeight.medium) {
    if (event.velocityY > 4800) {
      shareValue.value = move(levelModalScheduleHeight.low);
      return;
    }
    if (event.velocityY > 1300) {
      shareValue.value = move(levelModalScheduleHeight.medium);
      return;
    }
    if (event.velocityY < -1300) {
      shareValue.value = move(levelModalScheduleHeight.high);
      return;
    }
  }

  /**
   * Hold and pull not to fast: -1300 < velocity < 1300
   */
  if (shareValue.value < levelModalScheduleHeight.middleLow) {
    shareValue.value = move(levelModalScheduleHeight.low);
    return;
  }
  if (
    shareValue.value >= levelModalScheduleHeight.middleLow &&
    shareValue.value <= levelModalScheduleHeight.middleMedium
  ) {
    shareValue.value = move(levelModalScheduleHeight.medium);
    return;
  }
  if (shareValue.value > levelModalScheduleHeight.middleMedium) {
    shareValue.value = move(levelModalScheduleHeight.high);
    return;
  }
};

const renderDaySchedule = (tourId: number, dayIndex: number) => {
  return () => <DayScheduleDetailTour tourId={tourId} dayIndex={dayIndex} />;
};

const ButtonPublicTour = ({aim, tourId}: ButtonPublicTourProps) => {
  const {bottom} = useSafeArea();
  const theme = useTheme();
  const [{loadingPublicTour}, {publicTour}] = useDetailTour(tourId);

  const buttonStyle = useAnimatedStyle(() => {
    const translateYButton = interpolate(
      aim.value,
      [
        levelModalScheduleHeight.low,
        levelModalScheduleHeight.medium,
        levelModalScheduleHeight.high,
      ],
      [bottom + 100, 0, 0],
      {
        extrapolateRight: Extrapolation.CLAMP,
      },
    );

    return {
      transform: [
        {
          translateY: translateYButton,
        },
      ] as never,
    };
  }, [bottom]);

  const onPublicTour = async () => {
    try {
      await publicTour();
      emitAppEvent(APP_EVENT.editTour);
      ModalAlert.success({
        title: 'discovery.thankyou',
        i18Content: 'discovery.suggestHaveBeenAcknowledged',
        icon: 'nice',
      });
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    }
  };

  return (
    <Animated.View
      style={[
        $button,
        buttonStyle,
        {
          paddingBottom: bottom,
          backgroundColor: theme.white,
          shadowColor: theme.black,
        },
      ]}>
      <StyleButton
        title="discovery.shareToCommunity"
        containerStyle={$buttonSave}
        onPress={onPublicTour}
        isLoading={loadingPublicTour}
      />
    </Animated.View>
  );
};

const DetailTour = ({
  route: {
    params: {tourId},
  },
}: RouteParams<AppParamsList[ROOT_SCREEN.detailTour]>) => {
  const {top} = useSafeAreaInsets();
  const theme = useTheme();
  const {id: myId} = useAppSelector(
    state => state.accountSlice.passport.profile,
  );

  const searchRef = useRef<ElementRef<typeof AppModalize>>(null);

  const [
    {data, loading, loadingDeleteTour, loadingPrivateTour},
    {deleteTour, privateTour, mutate},
  ] = useDetailTour(tourId, {
    revalidateAll: true,
  });

  const isMyTour = data?.creator === myId;

  useAppEvent(APP_EVENT.suggestLocation, e => {
    mutate(
      pre => {
        if (pre) {
          const newSchedules = updateStatusLocationInSchedule(pre.schedule, {
            locationId: e.locationId,
            status: e.event === 'suggest' ? STATUS.suggesting : STATUS.draft,
          });

          return {
            ...pre,
            schedule: newSchedules,
          };
        }
      },
      {revalidate: false},
    );
  });

  const aim = useSharedValue(levelModalScheduleHeight.high);
  const modalStyle = useAnimatedStyle(() => {
    return {
      height: aim.value,
    };
  });

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: CTX) => {
      ctx.height = aim.value;
    },
    onActive: (event, ctx) => {
      const newHeight = ctx.height - event.translationY;
      if (
        newHeight >= levelModalScheduleHeight.low &&
        newHeight <= levelModalScheduleHeight.high
      ) {
        aim.value = newHeight;
      }
    },
    onEnd: (event, _) => {
      checkOnEnd(aim, event);
    },
  });

  const onChangeModalHeight = (value: number) => {
    if (aim.value !== value) {
      aim.value = move(value, {
        duration: 400,
      });
    }
  };

  const onPressMore = () => {
    if (isMyTour) {
      ModalActionSheet.show({
        options: [
          {
            title: 'common.edit',
            onPress: () =>
              navigate(PROFILE_ROUTE.createTour, {
                itemTour: data,
              }),
          },
          {
            title: 'common.delete',
            onPress: () => {
              ModalAlert.options({
                i18Content: 'profile.post.sureDeletePost',
                onContinue: async () => {
                  try {
                    await deleteTour();
                    emitAppEvent(APP_EVENT.deleteTour, {
                      tourId,
                    });
                    goBack();
                  } catch (err) {
                    ModalAlert.error({
                      content: err,
                    });
                  }
                },
                icon: 'cute',
              });
            },
          },
          data?.status === STATUS.active
            ? {
                title: 'tour.switchToPrivateMode',
                onPress: () => {
                  ModalAlert.options({
                    i18Content: 'tour.afterToPrivate',
                    onContinue: async () => {
                      try {
                        await privateTour();
                      } catch (err) {
                        ModalAlert.error({
                          content: err,
                        });
                      }
                    },
                    icon: 'cute',
                  });
                },
              }
            : null,
        ],
      });
    } else if (data) {
      ModalActionSheet.show({
        options: [
          {
            title: 'profile.report',
            onPress: () =>
              navigate(ROOT_SCREEN.reportUser, {
                idUser: data?.creator,
                nameUser: data?.creator_name,
              }),
          },
        ],
      });
    }
  };

  /**
   * Render view
   */
  const renderContent = () => {
    if (loading || !data) {
      return (
        <Animated.View
          style={[$body, {backgroundColor: theme.background}, modalStyle]}>
          <IndicatorModal />
          <LoadingScreen containerStyle={{backgroundColor: 'transparent'}} />
        </Animated.View>
      );
    }

    return (
      <>
        <Animated.View
          style={[$body, {backgroundColor: theme.background}, modalStyle]}>
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[$gesture, {backgroundColor: theme.white}]}>
              <View style={$avatar}>
                <StyleTouchable
                  customStyle={$nameAvatar}
                  onPress={() => {
                    if (data) {
                      onGoToProfile(data?.creator);
                    }
                  }}>
                  <Avatar source={{uri: data?.creator_avatar}} size={25} />
                  <StyleText
                    originValue={data?.creator_name}
                    customStyle={$name}
                  />
                </StyleTouchable>
                <StyleTouchable
                  onPress={() => {
                    navigate(PROFILE_ROUTE.createTour, {
                      itemTour: isMyTour ? data : {...data, id: 'create-new'},
                    });
                  }}>
                  <StyleText
                    i18Text={isMyTour ? 'common.edit' : 'profile.createTour'}
                    customStyle={[$textEdit, {color: theme.blue}]}
                  />
                </StyleTouchable>
              </View>

              <View style={$tourName}>
                <IconTour size={20} tintColor={theme.black} />
                <StyleText
                  originValue={data?.name}
                  customStyle={$tourNameText}
                />
              </View>

              <ToolSearch
                numberPeople={data.number_people}
                startPrice={data.start_price}
                endPrice={data.end_price}
                services={data.services}
                containerStyle={$tool}
                isEditMode={false}
                onPress={() => {
                  searchRef.current?.show();
                  impactLight();
                }}
                haveBorder={false}
              />
            </Animated.View>
          </PanGestureHandler>

          <IndicatorModal />

          <View style={$listView}>
            <TabView
              listElements={data?.schedule?.map((_, index) => {
                return renderDaySchedule(tourId, index);
              })}
              tabBarType="scroll"
              tabBarStyle={$tabBar}
              listIconTabBar={data?.schedule?.map((_, index) => {
                return (
                  <View style={$tabBox}>
                    <StyleText
                      key={index}
                      i18Text="discovery.dayNumber"
                      i18Params={{value: index + 1}}
                      customStyle={$textIndex}
                    />
                  </View>
                );
              })}
              lazy={false}
              style={{flex: 1}}
            />
          </View>
        </Animated.View>

        {data?.status === STATUS.draft && (
          <ButtonPublicTour aim={aim} tourId={tourId} />
        )}

        <ModalSearchFilter
          ref={searchRef}
          initSearchParams={{
            text_search: data.name,
            number_people: data.number_people,
            services: data.services,
            transports: data.transports,
            start_time: data.start_time,
            end_time: data.end_time,
            start_price: data.start_price,
            end_price: data.end_price,
          }}
          onChangeSearch={() => null}
          titleButton="common.save"
          notIncludes={['transport', 'date_time']}
          isGetFromAsync={false}
          editable={false}
        />
      </>
    );
  };

  return (
    <>
      <View style={[$container, {backgroundColor: theme.background}]}>
        <MapTour
          onChangeModalHeight={onChangeModalHeight}
          onTouchEnd={() => {
            if (aim.value === levelModalScheduleHeight.high) {
              onChangeModalHeight(levelModalScheduleHeight.medium);
            }
          }}>
          <StyleTouchable
            customStyle={[
              $iconMore,
              $styleDropShadow,
              {
                backgroundColor: theme.white,
                shadowColor: theme.black,
                top: top || safePaddingNotZero,
              },
            ]}
            onPress={onPressMore}>
            <StyleIcon
              source={Images.icons.more}
              size={23}
              customStyle={{tintColor: theme.black}}
            />
          </StyleTouchable>
        </MapTour>

        {renderContent()}
      </View>

      {(loadingDeleteTour || loadingPrivateTour) && <LoadingScreen />}
    </>
  );
};

const $container: ViewStyle = {
  flex: 1,
};
const $body: AnimatedStyle<ViewStyle> = {
  position: 'absolute',
  width: '100%',
  bottom: 0,
  borderTopLeftRadius: moderateScale(30),
  borderTopRightRadius: moderateScale(30),
  overflow: 'hidden',
};
const $gesture: AnimatedStyle<ViewStyle> = {
  width: '100%',
  paddingVertical: verticalScale(12),
};
const $avatar: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: horizontalPadding,
};
const $nameAvatar: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  maxWidth: '60%',
};
const $name: TextStyle = {
  marginLeft: scale(8),
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $tourName: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(12),
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: horizontalPadding,
};
const $tourNameText: TextStyle = {
  fontSize: FONT_SIZE.f1,
  fontWeight: 'bold',
  marginLeft: scale(8),
};
const $tool: ViewStyle = {
  marginTop: verticalScale(4),
};
const $listView: ViewStyle = {
  flex: 1,
};
const $tabBar: ViewStyle = {
  marginBottom: verticalScale(12),
};
const $textIndex: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $iconMore: ViewStyle = {
  position: 'absolute',
  right: horizontalPadding,
  padding: moderateScale(5),
  borderRadius: 50,
};
const $textEdit: TextStyle = {
  fontWeight: 'bold',
};
const $tabBox: ViewStyle = {
  width: '100%',
  height: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
};
const $button: AnimatedStyle<ViewStyle> = {
  position: 'absolute',
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: scale(12),
  paddingTop: verticalScale(16),
  bottom: 0,
  shadowOpacity: 0.1,
  shadowOffset: {
    width: 0,
    height: -4,
  },
};
const $buttonSave: ViewStyle = {
  flex: 1,
  width: undefined,
};

export default DetailTour;
