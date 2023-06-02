import {useAppSelector} from 'app-redux/store';
import {FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {APP_EVENT} from 'asset/enum';
import Images from 'asset/img/images';
import {horizontalPadding, safePaddingNotZero} from 'asset/metrics';
import {MapTour, TabView} from 'components';
import {
  StyleButton,
  StyleIcon,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {ButtonX} from 'components/common';
import {emitAppEvent, useAppEvent, useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import {
  ModalActionSheet,
  ModalAddLocation,
  ModalAlert,
  TypeShowModalAddLocation,
} from 'navigation/screen/modals';
import React, {ElementRef, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, TextStyle, View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useUpdateEffect} from 'react-use';
import {borderWidthTiny, onGoToProfile} from 'utility/assistant';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {ModalSearchFilter, ToolSearch} from './components';
import {useDetailTour} from './hooks';
import DaySchedule from './screens/DaySchedule';

const DetailTour = ({
  route: {
    params: {tourId, tour},
  },
}: RouteParams<AppParamsList[ROOT_SCREEN.detailTour]>) => {
  const {top, bottom} = useSafeAreaInsets();
  const theme = useTheme();
  const {id: myId} = useAppSelector(
    state => state.accountSlice.passport.profile,
  );

  const savedIndexDaySchedule = useRef(0);
  const newSchedule = useRef<TourDetail['schedule']>([]);
  const savedData = useRef<TourDetail>();
  const savedSearchParams = useRef<TypeSearchParams>();
  const timeOut = useRef<number>(0);
  const searchRef = useRef<ElementRef<typeof ModalSearchFilter>>(null);
  const modalAddLocation = useRef<ElementRef<typeof ModalAddLocation>>(null);

  const [
    {data, loadingEditTour, shouldRenderTab, isEditMode, loading, validating},
    {onEditTour, setLoadingEditTour, setIsEditMode, setShouldRenderTab},
  ] = useDetailTour({
    tour,
    tourId,
  });

  const [schedules, setSchedules] = useState(data?.schedule);
  const [searchParams, setSearchParams] = useState<TypeSearchParams>();
  const isMyTour = data?.creator == myId;
  savedData.current = data;
  savedSearchParams.current = searchParams;

  const resetRender = () => {
    setShouldRenderTab(false);
    setTimeout(() => {
      setShouldRenderTab(true);
    }, 300);
  };

  useAppEvent(APP_EVENT.tourSave, async value => {
    if (value.tourId === savedData.current?.id) {
      setLoadingEditTour(true);
      clearTimeout(timeOut.current);
      newSchedule.current[value.dayIndex] = value.schedule;
      timeOut.current = setTimeout(() => {
        onEditTour({
          schedule: newSchedule.current,
          ...savedSearchParams.current,
        });
      }, 200);
    }
  });

  useUpdateEffect(() => {
    if (!isEditMode && savedData.current) {
      setSchedules(savedData.current?.schedule);
      if (
        savedIndexDaySchedule.current >
        savedData.current?.schedule?.length - 1
      ) {
        savedIndexDaySchedule.current = 0;
      }
      resetRender();
    } else {
      emitAppEvent(APP_EVENT.tourEditMode, {
        isEditMode,
        tourId: tour?.id || tourId || 0,
      });
    }
  }, [isEditMode]);

  useEffect(() => {
    if (data?.schedule) {
      setSchedules(data?.schedule);
    }
  }, [data?.schedule]);

  useEffect(() => {
    if (data) {
      setSearchParams({
        location: data?.location,
        start_location: data?.location,
        number_people: data?.number_people,
        services: data?.services,
        transports: data?.transport,
        start_time: data?.start_time,
        end_time: data?.end_time,
        start_price: data?.start_price,
        end_price: data?.end_price,
      });
    }
  }, [data]);

  const showModalAddLocation = (params: TypeShowModalAddLocation) => {
    modalAddLocation.current?.show(params);
  };

  const listSchedules = () => {
    if (!schedules || !data) {
      return [];
    }
    return schedules.map((day, index) => {
      return () => (
        <DaySchedule
          schedule={day}
          tourId={data?.id}
          dayIndex={index}
          initEditMode={isEditMode}
          onShowModalAddLocation={showModalAddLocation}
        />
      );
    });
  };

  const listIconTabBar = () => {
    if (!schedules) {
      return [];
    }
    return schedules.map((_, index) => {
      return (
        <View style={$tabBox}>
          {isEditMode && (
            <ButtonX
              size={10}
              containerStyle={$buttonXDay}
              onPress={() => {
                ModalAlert.options({
                  i18Content: 'profile.post.sureDeletePost',
                  onContinue: () => {
                    setSchedules(pre => {
                      if (pre) {
                        const temp = [...pre];
                        temp.splice(index, 1);
                        if (savedIndexDaySchedule.current > temp.length - 1) {
                          savedIndexDaySchedule.current = temp.length - 1;
                        }
                        return temp;
                      }
                    });
                    resetRender();
                  },
                });
              }}
            />
          )}
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

  const renderIconRightTab = () => {
    if (!isMyTour || !isEditMode) {
      return null;
    }
    return (
      <StyleTouchable
        customStyle={[$buttonAddDay]}
        onPress={() => {
          setSchedules(pre => {
            if (pre) {
              const next = [...pre, []];
              savedIndexDaySchedule.current = next.length - 1;
              return next;
            }
          });
          resetRender();
        }}>
        <AntDesign name="plus" style={[$iconPlus, {color: theme.black}]} />
        <StyleText i18Text="discovery.addDay" customStyle={$textAddDay} />
      </StyleTouchable>
    );
  };

  const renderTabView = () => {
    if (loading || validating || !shouldRenderTab) {
      return (
        <View style={$loading}>
          <ActivityIndicator color={theme.p_700} />
        </View>
      );
    }
    if (!schedules?.length) {
      return null;
    }
    return (
      <View style={$listView}>
        <TabView
          listElements={listSchedules()}
          tabBarType="scroll"
          tabBarStyle={$tabBar}
          listIconTabBar={listIconTabBar()}
          lazy={false}
          style={{flex: 1}}
          onChangeIndex={index => (savedIndexDaySchedule.current = index)}
          initialIndex={savedIndexDaySchedule.current}
          RightButtonTabBar={renderIconRightTab()}
        />
      </View>
    );
  };

  return (
    <View style={[$container, {backgroundColor: theme.background}]}>
      <MapTour>
        <StyleTouchable
          customStyle={[
            $iconMore,
            {
              backgroundColor: theme.white_opacity(0.7),
              top: top || safePaddingNotZero,
            },
          ]}
          onPress={() => {
            if (data) {
              if (isMyTour) {
                ModalActionSheet.show({
                  options: [
                    {
                      title: 'profile.post.edit',
                      onPress: () => setIsEditMode(true),
                    },
                  ],
                });
              } else {
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
            }
          }}>
          <StyleIcon
            source={Images.icons.more}
            size={13}
            customStyle={{tintColor: theme.black}}
          />
        </StyleTouchable>
      </MapTour>

      <View style={$body}>
        <View
          style={[
            $avatar,
            {marginTop: verticalScale(8), paddingHorizontal: horizontalPadding},
          ]}>
          <StyleTouchable
            customStyle={$nameAvatar}
            onPress={() => {
              if (data) {
                onGoToProfile(data?.creator);
              }
            }}>
            <StyleIcon source={{uri: data?.creator_avatar}} size={30} />
            <StyleText originValue={data?.creator_name} customStyle={$name} />
          </StyleTouchable>
          {isMyTour && (
            <StyleTouchable onPress={() => setIsEditMode(pre => !pre)}>
              <StyleText
                i18Text={isEditMode ? 'common.cancel' : 'profile.post.edit'}
                customStyle={[
                  $textEdit,
                  {color: isEditMode ? theme.red : theme.blue},
                ]}
              />
            </StyleTouchable>
          )}
        </View>

        <ToolSearch
          location={searchParams?.location || ''}
          numberPeople={searchParams?.number_people}
          startPrice={searchParams?.start_price}
          endPrice={searchParams?.end_price}
          services={searchParams?.services}
          containerStyle={$tool}
          isEditMode={isEditMode}
          onPress={() => {
            if (isEditMode) {
              searchRef.current?.show();
            }
          }}
        />

        {renderTabView()}
      </View>

      {isEditMode && (
        <View style={[$button, {bottom: bottom || safePaddingNotZero}]}>
          <StyleButton
            title="common.cancel"
            containerStyle={[
              $buttonBox,
              {backgroundColor: theme.white, borderColor: theme.gray_300},
            ]}
            titleStyle={{color: theme.black}}
            onPress={() => {
              setIsEditMode(false);
            }}
            disable={loadingEditTour}
          />
          <View style={{width: scale(4)}} />
          <StyleButton
            title="common.save"
            containerStyle={[$buttonBox, {borderWidth: 0}]}
            onPress={() => {
              newSchedule.current = [];
              emitAppEvent(APP_EVENT.tourWantToSave);
            }}
            isLoading={loadingEditTour}
          />
        </View>
      )}

      {!loading && searchParams && (
        <ModalSearchFilter
          ref={searchRef}
          initSearchParams={searchParams}
          onChangeSearch={value => {
            setSearchParams({...value, location: value?.start_location});
          }}
          titleButton="common.save"
          notIncludes={['transport', 'date_time']}
          isGetFromAsync={false}
          searchPlaceHolder="profile.createNameForYourTour"
        />
      )}

      {isEditMode && <ModalAddLocation ref={modalAddLocation} />}
    </View>
  );
};

const $container: ViewStyle = {
  flex: 1,
};
const $body: ViewStyle = {
  flex: 1,
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
  paddingTop: verticalScale(12),
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
const $button: ViewStyle = {
  position: 'absolute',
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: scale(12),
};
const $buttonBox: ViewStyle = {
  flex: 1,
  width: undefined,
  borderWidth: borderWidthTiny,
};
const $textEdit: TextStyle = {
  fontWeight: 'bold',
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
const $loading: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
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

export default DetailTour;
