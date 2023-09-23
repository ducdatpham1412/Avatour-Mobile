import {useAppSelector} from 'app-redux/store';
import {FONT_WEIGHT_MEDIUM} from 'asset';
import {APP_EVENT, STATUS} from 'asset/enum';
import {
  horizontalPadding,
  safePaddingNotZero,
  verticalMargin,
} from 'asset/metrics';
import {AppModalize, MapTour, TabView} from 'components';
import {StyleButton, StyleText, StyleTouchable} from 'components/base';
import {ButtonX, IndicatorModal, InputBox} from 'components/common';
import {CTX, checkOnEnd, levelModalScheduleHeight} from 'feature/discovery';
import {ModalSearchFilter, ToolSearch} from 'feature/discovery/components';
import {DayScheduleCreateTour} from 'feature/discovery/screens';
import {emitAppEvent, useAppEvent, useSafeArea, useTheme} from 'hook';
import {goBack, navigate} from 'navigation/NavigationService';
import {AppParamsList, PROFILE_ROUTE} from 'navigation/config';
import {
  ModalAddLocation,
  ModalAlert,
  TypeShowModalAddLocation,
} from 'navigation/screen/modals';
import React, {
  Dispatch,
  ElementRef,
  RefObject,
  SetStateAction,
  createContext,
  useContext,
  useRef,
  useState,
} from 'react';
import {ActivityIndicator, TextStyle, View, ViewStyle} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  AnimatedStyle,
  Extrapolation,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useUpdateEffect} from 'react-use';
import {
  borderWidthTiny,
  updateStatusLocationInSchedule,
} from 'utility/assistant';
import {impactLight, impactMedium} from 'utility/haptic';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {defaultSearchParams} from 'utility/staticData';
import {ParamsCreateTour, useCreateTour} from './hooks';
import {checkStatusSchedule} from 'utility/validate';
import isEqual from 'react-fast-compare';

type TypeContext = [
  {
    schedules: TourDetail['schedule'];
    name: string;
    searchParams: TypeSearchParams;
  },
  {
    setSchedules: Dispatch<SetStateAction<TourDetail['schedule']>>;
    setName: (text: string) => void;
    setSearchParams: Dispatch<SetStateAction<TypeSearchParams>>;
    onSave: () => void;
    onReset: () => void;
  },
];

interface CreateTourInstanceProps {
  tourId: ParamsCreateTour;
}

const CreateTourContext = createContext<TypeContext>([
  {
    schedules: [],
    name: '',
    searchParams: defaultSearchParams,
  },
  {
    setSchedules: () => [],
    setName: () => null,
    setSearchParams: () => defaultSearchParams,
    onSave: () => null,
    onReset: () => null,
  },
]);

const renderDaySchedule = (
  index: number,
  modalAddLocationRef: RefObject<TypeShowModalize<TypeShowModalAddLocation>>,
) => {
  return () => (
    <DayScheduleCreateTour
      dayIndex={index}
      onShowModalAddLocation={value => {
        modalAddLocationRef.current?.show(value);
      }}
    />
  );
};

const CreateTourInstance = ({tourId}: CreateTourInstanceProps) => {
  const {bottom, top} = useSafeArea();
  const theme = useTheme();
  const {profile} = useAppSelector(state => state.accountSlice.passport);

  const [
    {data, loadingCreateTour, name, loadingEditTour, searchParams, schedules},
    {createTour, editTour, setSearchParams, setSchedules, setName, onReset},
  ] = useCreateTour(tourId);

  const searchRef = useRef<ElementRef<typeof AppModalize>>(null);
  const modalAddLocationRef = useRef<ElementRef<typeof ModalAddLocation>>(null);
  const tabViewRef = useRef<ElementRef<typeof TabView>>(null);
  const timeOutRef = useRef<NodeJS.Timeout>();
  const saveLength = useRef(0);
  const numberOfDays = schedules.length;
  const isCreateNew = useRef(tourId === 'create-new');

  const aim = useSharedValue(levelModalScheduleHeight.medium);

  const modalStyle = useAnimatedStyle(() => ({
    height: aim.value,
  }));
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
  }, []);
  const buttonSaveSmallStyle = useAnimatedStyle(() => {
    const scaleButtonSave = interpolate(
      aim.value,
      [
        levelModalScheduleHeight.low,
        levelModalScheduleHeight.medium,
        levelModalScheduleHeight.high,
      ],
      [1, 0, 0],
      {
        extrapolateRight: Extrapolation.CLAMP,
      },
    );

    return {
      transform: [
        {
          scale: scaleButtonSave,
        },
      ] as never,
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
    onEnd: event => {
      checkOnEnd(aim, event);
    },
  });

  const isLoading = loadingCreateTour || loadingEditTour;

  useUpdateEffect(() => {
    /**
     * TO DO: Optimize this
     */
    timeOutRef.current = setTimeout(() => {
      if (saveLength.current > numberOfDays) {
        tabViewRef.current?.forceNavigateToIndex(numberOfDays - 1);
        saveLength.current = numberOfDays;
      } else {
        tabViewRef.current?.navigateToIndex(numberOfDays - 1);
        saveLength.current = numberOfDays;
      }
    }, 200);
    return () => {
      clearTimeout(timeOutRef.current);
    };
  }, [numberOfDays]);

  useAppEvent(APP_EVENT.suggestLocation, e => {
    setSchedules(pre =>
      updateStatusLocationInSchedule(pre, {
        locationId: e.locationId,
        status: e.event === 'suggest' ? STATUS.suggesting : STATUS.draft,
      }),
    );
  });

  /**
   * Functions
   */
  const onSave = async () => {
    if (isCreateNew.current) {
      try {
        const res = await createTour();
        if (res) {
          impactMedium();
          navigate(PROFILE_ROUTE.createTourSuccess, {
            data: res,
          });
          emitAppEvent(APP_EVENT.createNewTour, {
            newTour: {
              id: res?.tour_id,
              name,
              number_people: searchParams.number_people ?? 0,
              start_price: searchParams.start_price ?? 0,
              end_price: searchParams.end_price ?? 0,
              creator: profile.id,
              creator_name: profile.name,
              creator_avatar: profile.avatar,
              is_liked: false,
              total_likes: 0,
              schedule: schedules.map(day => {
                return day.map(location => location.avatar);
              }),
              status: STATUS.draft,
            },
          });
        }
      } catch (err) {
        ModalAlert.error({
          content: err,
        });
      }
      return;
    }

    /**
     * Edit tour
     */
    const agree = async () => {
      try {
        await editTour();
        emitAppEvent(APP_EVENT.editTour);
        ModalAlert.success({
          i18Content: 'alert.successChange',
          onClose: goBack,
        });
      } catch (err) {
        ModalAlert.error({
          content: err,
        });
      }
    };

    if (data?.status === STATUS.active && !isEqual(schedules, data?.schedule)) {
      const scheduleStatus = checkStatusSchedule(schedules);

      if (scheduleStatus === 'draft') {
        ModalAlert.options({
          i18Content: 'tour.tourEditHaveDraftLocation',
          onContinue: agree,
        });
      } else {
        agree();
      }
    } else {
      agree();
    }
  };

  const onGoBack = () => {
    ModalAlert.options({
      i18Content: 'common.wantToDiscard',
      onContinue: goBack,
    });
  };

  const onChangeModalHeight = (value: number) => {
    if (aim.value !== value) {
      aim.value = withTiming(value, {
        duration: 300,
      });
    }
  };

  /**
   * Render views
   */
  const listIconTabBar = () => {
    if (!schedules) {
      return [];
    }
    return schedules.map((_, index) => {
      return (
        <View style={$tabBox}>
          <ButtonX
            size={10}
            containerStyle={$buttonXDay}
            onPress={() => {
              ModalAlert.options({
                i18Content: 'profile.post.sureDeletePost',
                onContinue: () => {
                  setSchedules(pre => {
                    const temp = [...pre];
                    temp.splice(index, 1);
                    return temp;
                  });
                },
              });
            }}
          />
          <StyleText
            key={index}
            i18Text="discovery.dayNumber"
            i18Params={{value: index + 1}}
            customStyle={$textIndex}
          />
        </View>
      );
    });
  };

  return (
    <View style={[$container, {backgroundColor: theme.background}]}>
      <MapTour
        onGoBack={onGoBack}
        onChangeModalHeight={onChangeModalHeight}
        onTouchEnd={() => {
          if (aim.value === levelModalScheduleHeight.high) {
            onChangeModalHeight(levelModalScheduleHeight.medium);
          }
        }}>
        <Animated.View style={[$buttonSaveSmall, buttonSaveSmallStyle]}>
          <StyleTouchable
            customStyle={[
              $buttonSaveSmallBox,
              {
                backgroundColor: theme.p_700,
                top: top || safePaddingNotZero,
              },
            ]}
            onPress={onSave}
            disable={isLoading}
            disableOpacity={1}>
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.white} />
            ) : (
              <StyleText
                i18Text={
                  isCreateNew.current ? 'common.create' : 'common.update'
                }
                customStyle={[$textSave, {color: theme.white}]}
              />
            )}
          </StyleTouchable>
        </Animated.View>
      </MapTour>

      <Animated.View
        style={[$body, {backgroundColor: theme.background}, modalStyle]}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[$gesture, {backgroundColor: theme.white}]}>
            <IndicatorModal />

            <InputBox
              style={[
                $inputTour,
                {
                  borderColor: theme.gray_500,
                },
              ]}
              i18Placeholder="profile.tourName"
              maxLength={70}
              defaultValue={name}
              onChangeText={text => setName(text)}
              onFocus={() => onChangeModalHeight(levelModalScheduleHeight.high)}
              returnKeyType="done"
            />

            <ToolSearch
              numberPeople={searchParams?.number_people}
              startPrice={searchParams?.start_price}
              endPrice={searchParams?.end_price}
              services={searchParams?.services}
              isEditMode
              onPress={() => {
                searchRef.current?.show();
                impactLight();
              }}
              containerStyle={$tool}
              haveBorder={false}
            />
          </Animated.View>
        </PanGestureHandler>

        <View style={$listView}>
          <TabView
            ref={tabViewRef}
            listElements={schedules.map((_, index) => {
              return renderDaySchedule(index, modalAddLocationRef);
            })}
            tabBarType="scroll"
            tabBarStyle={$tabBar}
            listIconTabBar={listIconTabBar()}
            lazy={false}
            style={{flex: 1}}
            initialIndex={0}
            RightButtonTabBar={
              <StyleTouchable
                customStyle={[$buttonAddDay]}
                onPress={() => {
                  setSchedules(pre => {
                    return pre.concat([[]]);
                  });
                }}>
                <AntDesign
                  name="plus"
                  style={[$iconPlus, {color: theme.black}]}
                />
                <StyleText
                  i18Text="discovery.addDay"
                  customStyle={$textAddDay}
                />
              </StyleTouchable>
            }
          />
        </View>
      </Animated.View>

      <Animated.View
        style={[
          $button,
          buttonStyle,
          {
            paddingBottom: bottom || safePaddingNotZero,
            backgroundColor: theme.white,
            shadowColor: theme.black,
          },
        ]}>
        {!isCreateNew.current && (
          <>
            <StyleButton
              title="common.resetChanges"
              containerStyle={[$buttonCancel, {borderColor: theme.black}]}
              titleStyle={{color: theme.black, fontWeight: FONT_WEIGHT_MEDIUM}}
              onPress={() =>
                ModalAlert.options({
                  i18Content: 'common.wantToDiscard',
                  onContinue: onReset,
                })
              }
              isLoading={loadingCreateTour}
            />
            <View style={{width: scale(4)}} />
          </>
        )}
        <StyleButton
          title={isCreateNew.current ? 'common.create' : 'common.update'}
          containerStyle={$buttonSave}
          onPress={onSave}
          isLoading={isLoading}
        />
      </Animated.View>

      <ModalSearchFilter
        ref={searchRef}
        initSearchParams={searchParams}
        onChangeSearch={value => {
          setSearchParams(value);
        }}
        titleButton="common.save"
        notIncludes={['transport', 'date_time']}
        isGetFromAsync={false}
      />

      <ModalAddLocation ref={modalAddLocationRef} />
    </View>
  );
};

const CreateTour = ({
  route: {params},
}: RouteParams<AppParamsList[PROFILE_ROUTE.createTour]>) => {
  const {itemTour} = params ?? {};

  const savedSearchParams = useRef<TypeSearchParams>(
    itemTour
      ? {
          text_search: '',
          start_location: itemTour.start_location,
          number_people: itemTour.number_people,
          services: itemTour.services,
          transports: itemTour.transports,
          start_price: itemTour.start_price,
          end_price: itemTour.end_price,
        }
      : defaultSearchParams,
  );
  const savedSchedule = useRef<TourDetail['schedule']>(
    itemTour?.schedule ?? [[]],
  );
  const savedName = useRef(itemTour?.name ?? '');

  const [schedules, setSchedules] = useState<TourDetail['schedule']>(
    savedSchedule.current,
  );
  const [name, setName] = useState(savedName.current);
  const [searchParams, setSearchParams] = useState<TypeSearchParams>(
    savedSearchParams.current,
  );

  const onSave = () => {
    savedSchedule.current = schedules;
    savedSearchParams.current = searchParams;
  };

  const onReset = () => {
    setSchedules(savedSchedule.current);
    setName(savedName.current);
    setSearchParams(savedSearchParams.current);
  };

  return (
    <CreateTourContext.Provider
      value={[
        {
          schedules,
          name,
          searchParams,
        },
        {
          setSchedules,
          setName,
          setSearchParams,
          onSave,
          onReset,
        },
      ]}>
      <CreateTourInstance tourId={itemTour ? itemTour?.id : 'create-new'} />
    </CreateTourContext.Provider>
  );
};

export const useContextCreateTour = (): TypeContext =>
  useContext(CreateTourContext);

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
const $tool: ViewStyle = {
  marginTop: verticalScale(12),
};
const $listView: ViewStyle = {
  flex: 1,
};
const $tabBar: ViewStyle = {
  paddingTop: verticalScale(12),
  marginBottom: verticalScale(12),
};
const $textIndex: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
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
const $buttonCancel: ViewStyle = {
  flex: 0.5,
  width: undefined,
  borderWidth: borderWidthTiny,
  backgroundColor: 'transparent',
};
const $buttonSave: ViewStyle = {
  flex: 1,
  width: undefined,
};
const $buttonAddDay: ViewStyle = {
  width: moderateScale(120),
  height: '100%',
  borderWidth: moderateScale(0.5),
  borderRadius: 100,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
};
const $iconPlus: TextStyle = {
  fontSize: moderateScale(15),
};
const $textAddDay: TextStyle = {
  marginLeft: scale(4),
};
const $tabBox: ViewStyle = {
  width: '100%',
  height: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
};
const $buttonXDay: ViewStyle = {
  position: 'absolute',
  padding: moderateScale(2),
};
const $gesture: AnimatedStyle<ViewStyle> = {
  width: '100%',
  paddingTop: verticalMargin,
  paddingBottom: verticalScale(12),
};
const $inputTour: TextStyle = {
  width: scale(343),
  alignSelf: 'center',
  borderWidth: borderWidthTiny,
};
const $buttonSaveSmall: AnimatedStyle<ViewStyle> = {
  position: 'absolute',
  right: horizontalPadding,
};
const $buttonSaveSmallBox: ViewStyle = {
  paddingVertical: moderateScale(5),
  paddingHorizontal: moderateScale(16),
  borderRadius: 50,
};
const $textSave: TextStyle = {
  fontWeight: 'bold',
};

export default CreateTour;
