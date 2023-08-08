import {horizontalPadding, safePaddingNotZero} from 'asset/metrics';
import {useContextCreateTour} from 'feature/profile/CreateTour';
import {TypeShowModalAddLocation} from 'navigation/screen/modals';
import React from 'react';
import {View, ViewStyle} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {impactLight} from 'utility/haptic';
import {verticalScale} from 'utility/scale';
import {ButtonAddLocation, ItemLocation} from '../components';
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
    onAddLocation,
    onDeleteLocation,
  }: Omit<ItemLocationProps, 'item'>,
) => {
  return (
    <ItemLocation
      item={item}
      onDrag={onDrag}
      isActive={isActive}
      getIndex={getIndex}
      isEditMode={isEditMode}
      onAddLocation={onAddLocation}
      onDeleteLocation={onDeleteLocation}
    />
  );
};

const DayScheduleCreateTour = ({dayIndex, onShowModalAddLocation}: Props) => {
  const {bottom} = useSafeAreaInsets();
  const [{schedules}, {setSchedules}] = useContextCreateTour();
  const listLocations = schedules[dayIndex];

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
            onAddLocation: () =>
              onShowModalAddLocation({
                onSave: newLocation => {
                  const index = getIndex();
                  if (index !== undefined) {
                    impactLight();
                    setSchedules(pre => {
                      return pre.map((item, __index) => {
                        if (__index !== dayIndex) {
                          return item;
                        }
                        const temp = [...item];
                        temp.splice(index + 1, 0, newLocation);
                        return temp;
                      });
                    });
                  }
                },
                listCurrentIds: listLocations.map(item => item?.id),
              }),
            onDeleteLocation: () => {
              const index = getIndex();
              if (index !== undefined) {
                setSchedules(pre => {
                  return pre.map((item, __index) => {
                    if (__index !== dayIndex) {
                      return item;
                    }
                    const temp = [...item];
                    temp.splice(index, 1);
                    return temp;
                  });
                });
              }
            },
          })
        }
        onDragEnd={({data}) => {
          setSchedules(pre => {
            return pre.map((item, __index) => {
              if (__index !== dayIndex) {
                return item;
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
            paddingBottom: (bottom || safePaddingNotZero) + verticalScale(50),
          },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <ButtonAddLocation
            isActive={false}
            onPress={() =>
              onShowModalAddLocation({
                onSave: newLocation => {
                  impactLight();
                  setSchedules(pre => {
                    return pre.map((item, __index) => {
                      if (__index !== dayIndex) {
                        return item;
                      }
                      return [newLocation].concat(item);
                    });
                  });
                },
                listCurrentIds: listLocations.map(item => item?.id),
              })
            }
          />
        )}
      />
    </View>
  );
};

const $container: ViewStyle = {
  flex: 1,
};
const $contentContainer: ViewStyle = {
  paddingHorizontal: horizontalPadding,
};

export default DayScheduleCreateTour;
