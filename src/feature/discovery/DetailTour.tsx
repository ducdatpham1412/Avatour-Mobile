import {useAppSelector} from 'app-redux/store';
import {FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import Images from 'asset/img/images';
import {horizontalPadding, safePaddingNotZero} from 'asset/metrics';
import {AppModalize, LoadingScreen, MapTour, TabView} from 'components';
import {StyleIcon, StyleText, StyleTouchable} from 'components/base';
import {Avatar, IndicatorModal} from 'components/common';
import {useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {AppParamsList, PROFILE_ROUTE, ROOT_SCREEN} from 'navigation/config';
import {ModalActionSheet} from 'navigation/screen/modals';
import React, {ElementRef, useRef} from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {
  GestureEventPayload,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  AnimateStyle,
  SharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {borderWidthTiny, onGoToProfile} from 'utility/assistant';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {ModalSearchFilter, ToolSearch} from './components';
import {useDetailTour} from './hooks';
import {DayScheduleDetailTour} from './screens';

export const levelModalScheduleHeight = {
  low: verticalScale(150),
  middleLow: verticalScale(275),
  medium: verticalScale(400),
  middleMedium: verticalScale(540),
  high: verticalScale(680),
};

export type CTX = {
  height: number;
};

type Move = {
  duration: number;
};

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

  const [{data, loading}] = useDetailTour(tourId, {
    revalidateAll: true,
  });
  const isMyTour = data?.creator === myId;

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
    onEnd: (event, ctx) => {
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
          <LoadingScreen />
        </Animated.View>
      );
    }

    return (
      <>
        <Animated.View
          style={[$body, {backgroundColor: theme.background}, modalStyle]}>
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={$gesture}>
              <View
                style={[
                  $avatar,
                  {
                    paddingTop: verticalScale(8),
                    paddingHorizontal: horizontalPadding,
                  },
                ]}>
                <StyleTouchable
                  customStyle={$nameAvatar}
                  onPress={() => {
                    if (data) {
                      onGoToProfile(data?.creator);
                    }
                  }}>
                  <Avatar source={{uri: data?.creator_avatar}} size={30} />
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
                    i18Text="common.edit"
                    customStyle={[$textEdit, {color: theme.blue}]}
                  />
                </StyleTouchable>
              </View>

              <ToolSearch
                location={data.location}
                numberPeople={data.number_people}
                startPrice={data.start_price}
                endPrice={data.end_price}
                services={data.services}
                containerStyle={$tool}
                isEditMode={false}
                onPress={() => {
                  searchRef.current?.show();
                }}
              />

              <View style={[$divider, {borderTopColor: theme.gray_400}]} />
            </Animated.View>
          </PanGestureHandler>

          <IndicatorModal />

          <View style={$listView}>
            <TabView
              listElements={data?.schedule?.map((_, index) => {
                return () => (
                  <DayScheduleDetailTour tourId={tourId} dayIndex={index} />
                );
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

        <ModalSearchFilter
          ref={searchRef}
          initSearchParams={{
            location: data.location,
            start_location: data.start_location,
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
          searchPlaceHolder="profile.createNameForYourTour"
          editable={false}
        />
      </>
    );
  };

  return (
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
            {
              backgroundColor: theme.white_opacity(0.8),
              top: top || safePaddingNotZero,
            },
          ]}
          onPress={onPressMore}>
          <StyleIcon
            source={Images.icons.more}
            size={20}
            customStyle={{tintColor: theme.black}}
          />
        </StyleTouchable>
      </MapTour>

      {renderContent()}
    </View>
  );
};

const $container: ViewStyle = {
  flex: 1,
};
const $body: AnimateStyle<ViewStyle> = {
  position: 'absolute',
  width: '100%',
  bottom: 0,
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
};
const $gesture: AnimateStyle<ViewStyle> = {
  width: '100%',
};
const $avatar: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};
const $nameAvatar: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  maxWidth: '60%',
};
const $name: TextStyle = {
  fontSize: FONT_SIZE.f1,
  marginLeft: scale(8),
  fontWeight: 'bold',
};
const $tool: ViewStyle = {
  marginTop: verticalScale(12),
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
  right: scale(12),
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
const $divider: ViewStyle = {
  width: '100%',
  borderTopWidth: borderWidthTiny,
  marginTop: verticalScale(12),
};

export default DetailTour;
