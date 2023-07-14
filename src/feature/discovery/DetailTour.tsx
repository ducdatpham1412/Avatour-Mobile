import {useAppSelector} from 'app-redux/store';
import {FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import Images from 'asset/img/images';
import {horizontalPadding, safePaddingNotZero} from 'asset/metrics';
import {AppModalize, LoadingScreen, MapTour, TabView} from 'components';
import {StyleIcon, StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {AppParamsList, PROFILE_ROUTE, ROOT_SCREEN} from 'navigation/config';
import {ModalActionSheet} from 'navigation/screen/modals';
import React, {ElementRef, useRef} from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {borderWidthTiny, onGoToProfile} from 'utility/assistant';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {ModalSearchFilter, ToolSearch} from './components';
import {useDetailTour} from './hooks';
import {DayScheduleDetailTour} from './screens';

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

  const [{data, loading}] = useDetailTour(tourId, {
    revalidateAll: true,
  });

  const savedIndexDaySchedule = useRef(0);
  const searchRef = useRef<ElementRef<typeof AppModalize>>(null);

  const isMyTour = data?.creator == myId;

  if (loading || !data) {
    return <LoadingScreen />;
  }

  const onPressMore = () => {
    if (isMyTour) {
      ModalActionSheet.show({
        options: [
          {
            title: 'profile.post.edit',
            onPress: () =>
              navigate(PROFILE_ROUTE.createTour, {
                itemTour: data,
              }),
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
          onPress={onPressMore}>
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
          <StyleTouchable
            onPress={() =>
              navigate(PROFILE_ROUTE.createTour, {
                itemTour: data,
              })
            }>
            <StyleText
              i18Text={'profile.post.edit'}
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
            onChangeIndex={index => (savedIndexDaySchedule.current = index)}
            initialIndex={savedIndexDaySchedule.current}
          />
        </View>
      </View>

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
