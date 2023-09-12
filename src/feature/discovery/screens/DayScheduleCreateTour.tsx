import {APP_EVENT} from 'asset/enum';
import {horizontalPadding} from 'asset/metrics';
import {Separator} from 'components';
import {SquareButton} from 'components/base';
import {ItemLocation} from 'feature/discovery/components';
import {useContextCreateTour} from 'feature/profile/CreateTour';
import {useMyRequests} from 'feature/profile/hooks';
import {emitAppEvent, useSafeArea, useTheme} from 'hook';
import {TypeShowModalAddLocation} from 'navigation/screen/modals';
import React from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {borderWidthTiny} from 'utility/assistant';
import {impactLight} from 'utility/haptic';
import {moderateScale, verticalScale} from 'utility/scale';
import {ItemLocationProps} from '../components/ItemLocation';

interface Props {
  dayIndex: number;
  onShowModalAddLocation: (value: TypeShowModalAddLocation) => void;
}

export const renderItemLocation = (
  item: TypeGetProfileResponse,
  {
    onDrag,
    isActive,
    getIndex,
    isEditMode,
    onDeleteLocation,
    onSuggestLocation,
  }: Omit<ItemLocationProps, 'item'>,
) => {
  return (
    <ItemLocation
      item={item}
      onDrag={onDrag}
      isActive={isActive}
      getIndex={getIndex}
      isEditMode={isEditMode}
      onDeleteLocation={onDeleteLocation}
      onSuggestLocation={onSuggestLocation}
    />
  );
};

const DayScheduleCreateTour = ({dayIndex, onShowModalAddLocation}: Props) => {
  const theme = useTheme();
  const {bottom} = useSafeArea();
  const [, {suggestLocation}] = useMyRequests();
  const [{schedules}, {setSchedules}] = useContextCreateTour();
  const listLocations = schedules[dayIndex];

  const onSuggestLocation = async (value: TypeGetProfileResponse) => {
    await suggestLocation(value.id);
    emitAppEvent(APP_EVENT.suggestLocation, {
      locationId: value.id,
      event: 'suggest',
    });
  };

  return (
    <View style={{flex: 1}}>
      <DraggableFlatList
        data={listLocations}
        renderItem={({item, drag, isActive, getIndex}) =>
          renderItemLocation(item, {
            onDrag: drag,
            isActive,
            getIndex,
            isEditMode: true,
            onDeleteLocation: () => {
              const index = getIndex();
              if (index !== undefined) {
                setSchedules(pre => {
                  return pre.map((__item, __index) => {
                    if (__index !== dayIndex) {
                      return __item;
                    }
                    const temp = [...__item];
                    temp.splice(index, 1);
                    return temp;
                  });
                });
                impactLight();
              }
            },
            onSuggestLocation,
          })
        }
        onDragEnd={({data}) => {
          setSchedules(pre => {
            return pre.map((day, __index) => {
              if (__index !== dayIndex) {
                return day;
              }
              return data;
            });
          });
        }}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        containerStyle={$container}
        contentContainerStyle={[
          $contentContainer,
          {
            paddingBottom: bottom + verticalScale(80),
          },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <SquareButton
            icon={
              <AntDesign name="plus" style={[$iconAdd, {color: theme.black}]} />
            }
            title="discovery.addLocation"
            onPress={() =>
              onShowModalAddLocation({
                onSelect: location => {
                  impactLight();
                  setSchedules(pre => {
                    return pre.map((day, __index) => {
                      if (__index !== dayIndex) {
                        return day;
                      }
                      return [location].concat(day);
                    });
                  });
                },
                onDelete: location => {
                  impactLight();
                  setSchedules(pre => {
                    return pre.map((day, __index) => {
                      if (__index !== dayIndex) {
                        return day;
                      }
                      return day.filter(p => p.id !== location.id);
                    });
                  });
                },
              })
            }
            containerStyle={[$buttonAddLocation, {borderColor: theme.black}]}
          />
        )}
        ItemSeparatorComponent={Separator}
      />
    </View>
  );
};

const $container: ViewStyle = {
  flex: 1,
};
const $contentContainer: ViewStyle = {
  flexGrow: 1,
  paddingHorizontal: horizontalPadding,
};
const $iconAdd: TextStyle = {
  fontSize: moderateScale(15),
};
const $buttonAddLocation: ViewStyle = {
  width: '80%',
  height: verticalScale(35),
  borderWidth: borderWidthTiny,
  alignSelf: 'center',
  backgroundColor: 'transparent',
  marginBottom: verticalScale(12),
};

export default DayScheduleCreateTour;
