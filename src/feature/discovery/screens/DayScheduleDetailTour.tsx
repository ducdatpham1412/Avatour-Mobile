import {STATUS} from 'asset/enum';
import {horizontalPadding} from 'asset/metrics';
import {RefreshControl} from 'components/base';
import {useMyRequests} from 'feature/profile/hooks';
import {useSafeArea} from 'hook';
import React from 'react';
import {ViewStyle} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {useDetailTour} from '../hooks';
import {renderItemLocation} from './DayScheduleCreateTour';
import {Separator} from 'components';

interface Props {
  tourId: number;
  dayIndex: number;
}

const DayScheduleDetailTour = ({tourId, dayIndex}: Props) => {
  const {bottom} = useSafeArea();
  const [, {suggestLocation}] = useMyRequests();
  const [{data, validating}, {mutate}] = useDetailTour(tourId);
  const listLocations = data?.schedule?.[dayIndex] ?? [];

  const onSuggestLocation = async (value: TypeGetProfileResponse) => {
    await suggestLocation(value.id);
    await mutate(pre => {
      if (pre) {
        const newSchedule = pre.schedule.map((day, index) => {
          if (index !== dayIndex) {
            return day;
          }
          return day.map(location => {
            if (location.id !== value.id) {
              return location;
            }
            return {
              ...location,
              status: STATUS.suggesting,
            };
          });
        });
        pre.schedule = newSchedule;
        return pre;
      }
    });
  };

  return (
    <DraggableFlatList
      data={listLocations}
      renderItem={({item, drag, isActive, getIndex}) =>
        renderItemLocation(item, {
          onDrag: drag,
          isActive,
          getIndex,
          isEditMode: false,
          onDeleteLocation: () => null,
          onSuggestLocation,
        })
      }
      keyExtractor={(item, index) => `${item.id}-${index}`}
      contentContainerStyle={[
        $contentContainer,
        {
          paddingBottom: bottom,
        },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={validating} onRefresh={mutate} />
      }
      containerStyle={$container}
      ItemSeparatorComponent={Separator}
    />
  );
};

const $container: ViewStyle = {
  flex: 1,
};
const $contentContainer: ViewStyle = {
  paddingHorizontal: horizontalPadding,
};

export default DayScheduleDetailTour;
