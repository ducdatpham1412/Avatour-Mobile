import {FONT_WEIGHT_MEDIUM} from 'asset';
import {APP_EVENT} from 'asset/enum';
import {safePaddingNotZero} from 'asset/metrics';
import {MapTour, TabView} from 'components';
import {StyleButton, StyleText, StyleTouchable} from 'components/base';
import {ButtonX} from 'components/common';
import {ModalSearchFilter, ToolSearch} from 'feature/discovery/components';
import {DaySchedule} from 'feature/discovery/screens';
import {emitAppEvent, useAppEvent, useTheme} from 'hook';
import {ModalAlert} from 'navigation/screen/modals';
import React, {ElementRef, useRef, useState} from 'react';
import {ActivityIndicator, TextStyle, View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {borderWidthTiny} from 'utility/assistant';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {defaultSearchParams} from 'utility/staticData';
import {useCreateTour} from './hooks';

const CreateTour = () => {
  const {top, bottom} = useSafeAreaInsets();
  const theme = useTheme();

  const [
    {shouldRenderTab, loadingCreateTour},
    {setShouldRenderTab, setLoadingCreateTour, onCreateTour},
  ] = useCreateTour();

  const savedIndexDaySchedule = useRef(0);
  const timeOut = useRef<number>(0);
  const savedSchedule = useRef<TourDetail['schedule']>([[]]);
  const savedSearchParams = useRef<TypeSearchParams>();
  const searchRef = useRef<ElementRef<typeof ModalSearchFilter>>(null);

  const [schedules, setSchedules] = useState<TourDetail['schedule']>([[]]);
  const [searchParams, setSearchParams] =
    useState<TypeSearchParams>(defaultSearchParams);

  savedSearchParams.current = searchParams;

  const resetRender = () => {
    setShouldRenderTab(false);
    setTimeout(() => {
      setShouldRenderTab(true);
    }, 300);
  };

  useAppEvent(APP_EVENT.tourSave, async value => {
    if (value.tourId === ('create-new-one' as unknown as number)) {
      setLoadingCreateTour(true);
      clearTimeout(timeOut.current);
      timeOut.current = setTimeout(() => {
        if (savedSearchParams.current) {
          onCreateTour({
            schedule: savedSchedule.current,
            searchParams: savedSearchParams.current,
          });
        }
      }, 200);
    }
  });

  useAppEvent(APP_EVENT.tourUpdateSchedule, value => {
    savedSchedule.current[value.dayIndex] = value.schedule;
    console.log('news: ', savedSchedule.current);
  });

  const listSchedules = () => {
    return schedules.map((day, index) => {
      return () => (
        <DaySchedule
          schedule={day}
          tourId={'create-new-one' as unknown as number}
          dayIndex={index}
          initEditMode
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
          <ButtonX
            size={10}
            containerStyle={$buttonXDay}
            onPress={() => {
              ModalAlert.options({
                i18Content: 'profile.post.sureDeletePost',
                onContinue: () => {
                  savedSchedule.current.splice(index, 1);
                  if (
                    savedIndexDaySchedule.current >
                    savedSchedule.current.length - 1
                  ) {
                    savedIndexDaySchedule.current =
                      savedSchedule.current.length - 1;
                  }
                  setSchedules(savedSchedule.current);
                  resetRender();
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

  const renderIconRightTab = () => {
    return (
      <StyleTouchable
        customStyle={[$buttonAddDay]}
        onPress={() => {
          const next = [...savedSchedule.current, []];
          savedIndexDaySchedule.current = next.length - 1;
          setSchedules(next);
          resetRender();
        }}>
        <AntDesign name="plus" style={[$iconPlus, {color: theme.black}]} />
        <StyleText i18Text="discovery.addDay" customStyle={$textAddDay} />
      </StyleTouchable>
    );
  };

  const renderTabView = () => {
    if (shouldRenderTab) {
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
    }

    return (
      <View style={$loading}>
        <ActivityIndicator color={theme.p_700} />
      </View>
    );
  };

  return (
    <View style={[$container, {backgroundColor: theme.background}]}>
      <MapTour />

      <View style={$body}>
        <ToolSearch
          location={searchParams?.location || ''}
          numberPeople={searchParams?.number_people}
          startPrice={searchParams?.start_price}
          endPrice={searchParams?.end_price}
          services={searchParams?.services}
          containerStyle={$tool}
          isEditMode
          onPress={() => searchRef.current?.show()}
        />

        {renderTabView()}
      </View>

      <View style={[$button, {bottom: bottom || safePaddingNotZero}]}>
        <StyleButton
          title="common.save"
          containerStyle={[$buttonBox, {borderWidth: 0}]}
          onPress={() => {
            emitAppEvent(APP_EVENT.tourWantToSave);
          }}
          isLoading={loadingCreateTour}
        />
      </View>

      <ModalSearchFilter
        ref={searchRef}
        initSearchParams={searchParams}
        onChangeSearch={value => {
          setSearchParams({...value, location: value?.start_location});
        }}
        titleButton="profile.post.post"
        notIncludes={['transport', 'date_time']}
        isGetFromAsync={false}
        searchPlaceHolder="profile.createNameForYourTour"
      />
    </View>
  );
};

const $container: ViewStyle = {
  flex: 1,
};
const $body: ViewStyle = {
  flex: 1,
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

export default CreateTour;
