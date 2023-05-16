import {APP_EVENT} from 'asset/enum';
import {safePaddingNotZero} from 'asset/metrics';
import {emitAppEvent, useAppEvent} from 'hook';
import {ModalAddLocation} from 'navigation/screen/modals';
import React, {useEffect, useRef, useState} from 'react';
import {ViewStyle} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale, verticalScale} from 'utility/scale';
import {ButtonAddLocation, ItemLocation} from '../components';
import {ItemLocationProps} from '../components/ItemLocation';

interface Props {
  dayIndex: number;
  schedule: TypeGetProfileResponse[];
  tourId: number;
  initEditMode: boolean;
}

const renderItemLocation = (
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

const DaySchedule = ({
  schedule: oldSchedule,
  tourId,
  dayIndex,
  initEditMode,
}: Props) => {
  const {bottom} = useSafeAreaInsets();

  const [listSchedule, setListSchedule] = useState(oldSchedule);
  const [isEditMode, setIsEditMode] = useState(initEditMode);
  const listScheduleRef = useRef(listSchedule);
  listScheduleRef.current = listSchedule;

  useAppEvent(APP_EVENT.tourEditMode, value => {
    if (value.tourId === tourId) {
      setIsEditMode(value.isEditMode);
      if (!value.isEditMode) {
        setListSchedule(oldSchedule);
      }
    }
  });

  useAppEvent(APP_EVENT.tourWantToSave, () => {
    // setTimeOut to all DaySchedule emit event back to DetailTou in order, no the sameTime
    setTimeout(() => {
      emitAppEvent(APP_EVENT.tourSave, {
        dayIndex,
        tourId,
        schedule: listScheduleRef.current,
      });
    }, dayIndex * 100);
  });

  useEffect(() => {
    emitAppEvent(APP_EVENT.tourUpdateSchedule, {
      dayIndex,
      schedule: listSchedule,
    });
  }, [listSchedule]);

  return (
    <DraggableFlatList
      data={listSchedule}
      renderItem={({item, drag, isActive, getIndex}) =>
        renderItemLocation(item, {
          onDrag: drag,
          isActive,
          getIndex,
          isEditMode,
          onAddLocation: () =>
            ModalAddLocation.show({
              onSave: newLocation => {
                const index = getIndex();
                if (index !== undefined) {
                  setListSchedule(pre => {
                    const updateList = [...pre];
                    updateList.splice(index + 1, 0, newLocation);
                    return updateList;
                  });
                }
              },
              listCurrentIds: listScheduleRef.current.map(item => item?.id),
            }),
          onDeleteLocation: () => {
            const index = getIndex();
            if (index !== undefined) {
              setListSchedule(pre => {
                const updateList = [...pre];
                updateList.splice(index, 1);
                return updateList;
              });
            }
          },
        })
      }
      onDragEnd={({data}) => setListSchedule(data)}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      contentContainerStyle={[
        $container,
        {
          paddingBottom:
            (bottom || safePaddingNotZero) +
            (isEditMode ? verticalScale(50) : 0),
        },
      ]}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        isEditMode ? (
          <ButtonAddLocation
            isActive={false}
            onPress={() =>
              ModalAddLocation.show({
                onSave: newLocation => {
                  setListSchedule(
                    [newLocation].concat(listScheduleRef.current),
                  );
                },
                listCurrentIds: listScheduleRef.current.map(item => item?.id),
              })
            }
          />
        ) : null
      }
    />
  );
};

const $container: ViewStyle = {
  flexGrow: 1,
  paddingHorizontal: scale(12),
};

export default DaySchedule;
