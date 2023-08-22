import {horizontalPadding, safePaddingNotZero} from 'asset/metrics';
import {SquareButton} from 'components/base';
import {ItemLocation} from 'feature/discovery/components';
import {useContextCreateTour} from 'feature/profile/CreateTour';
import {useTheme} from 'hook';
import {TypeShowModalAddLocation} from 'navigation/screen/modals';
import React from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {impactLight} from 'utility/haptic';
import {moderateScale, verticalScale} from 'utility/scale';
import {ItemLocationProps} from '../components/ItemLocation';
import {borderWidthTiny} from 'utility/assistant';

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
    />
  );
};

const DayScheduleCreateTour = ({dayIndex, onShowModalAddLocation}: Props) => {
  const theme = useTheme();
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
          <SquareButton
            icon={
              <AntDesign name="plus" style={[$iconAdd, {color: theme.black}]} />
            }
            title="discovery.addLocation"
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
            containerStyle={[$buttonAddLocation, {borderColor: theme.black}]}
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
