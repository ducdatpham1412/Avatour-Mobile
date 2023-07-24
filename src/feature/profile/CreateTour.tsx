import {FONT_WEIGHT_MEDIUM} from 'asset';
import {safePaddingNotZero} from 'asset/metrics';
import {AppModalize, MapTour, TabView} from 'components';
import {StyleButton, StyleText, StyleTouchable} from 'components/base';
import {ButtonX} from 'components/common';
import {ModalSearchFilter, ToolSearch} from 'feature/discovery/components';
import {DayScheduleCreateTour} from 'feature/discovery/screens';
import {useTheme} from 'hook';
import {goBack, navigate} from 'navigation/NavigationService';
import {AppParamsList, MAIN_SCREEN, PROFILE_ROUTE} from 'navigation/config';
import {ModalAddLocation, ModalAlert} from 'navigation/screen/modals';
import React, {
  Dispatch,
  ElementRef,
  SetStateAction,
  createContext,
  useContext,
  useRef,
  useState,
} from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useUpdateEffect} from 'react-use';
import {borderWidthTiny} from 'utility/assistant';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {defaultSearchParams} from 'utility/staticData';
import {ParamsCreateTour, useCreateTour} from './hooks';

type TypeContext = [
  {
    schedules: TourDetail['schedule'];
    searchParams: TypeSearchParams;
  },
  {
    setSchedules: Dispatch<SetStateAction<TourDetail['schedule']>>;
    setSearchParams: Dispatch<SetStateAction<TypeSearchParams>>;
    onSave: () => void;
    onReset: () => void;
  },
];

const CreateTourContext = createContext<TypeContext>([
  {
    schedules: [],
    searchParams: defaultSearchParams,
  },
  {
    setSchedules: () => [],
    setSearchParams: () => defaultSearchParams,
    onSave: () => null,
    onReset: () => null,
  },
]);

const CreateTourInstance = ({tourId}: {tourId: ParamsCreateTour}) => {
  const {bottom} = useSafeAreaInsets();
  const theme = useTheme();

  const [
    {loadingCreateTour, loadingEditTour, searchParams, schedules},
    {createTour, editTour, setSearchParams, setSchedules, onReset},
  ] = useCreateTour(tourId);

  const searchRef = useRef<ElementRef<typeof AppModalize>>(null);
  const modalAddLocationRef = useRef<ElementRef<typeof ModalAddLocation>>(null);
  const tabViewRef = useRef<ElementRef<typeof TabView>>(null);
  const timeOutRef = useRef(0);
  const saveLength = useRef(0);
  const numberOfDays = schedules.length;

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

  /**
   * Functions
   */
  const onSave = async () => {
    if (tourId === 'create-new') {
      try {
        await createTour();
        ModalAlert.success({
          i18Content: 'profile.createTourSuccess',
          onClose: () => navigate(MAIN_SCREEN.favorite),
        });
      } catch (err) {
        ModalAlert.error({
          content: err,
        });
      }
      return;
    }

    try {
      await editTour();
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

  const onGoBack = () => {
    ModalAlert.options({
      i18Content: 'common.wantToDiscard',
      onContinue: goBack,
    });
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
      <MapTour onGoBack={onGoBack} />

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

        <View style={$listView}>
          <TabView
            ref={tabViewRef}
            listElements={schedules.map((_, index) => {
              return () => (
                <DayScheduleCreateTour
                  dayIndex={index}
                  initEditMode
                  onShowModalAddLocation={value => {
                    modalAddLocationRef.current?.show(value);
                  }}
                />
              );
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
      </View>

      <View style={[$button, {bottom: bottom || safePaddingNotZero}]}>
        {tourId !== 'create-new' && (
          <>
            <StyleButton
              title="common.cancel"
              containerStyle={[
                $buttonCancel,
                {backgroundColor: theme.background},
              ]}
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
          title="common.save"
          containerStyle={$buttonSave}
          onPress={onSave}
          isLoading={loadingCreateTour || loadingEditTour}
        />
      </View>

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
          location: itemTour.location,
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

  const [schedules, setSchedules] = useState<TourDetail['schedule']>(
    savedSchedule.current,
  );
  const [searchParams, setSearchParams] = useState<TypeSearchParams>(
    savedSearchParams.current,
  );

  const onSave = () => {
    savedSchedule.current = schedules;
    savedSearchParams.current = searchParams;
  };

  const onReset = () => {
    setSchedules(savedSchedule.current);
    setSearchParams(savedSearchParams.current);
  };

  return (
    <CreateTourContext.Provider
      value={[
        {
          schedules,
          searchParams,
        },
        {
          setSchedules,
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
