import {horizontalPadding, safePaddingNotZero} from 'asset/metrics';
import {RefreshControl} from 'components/base';
import React from 'react';
import {ViewStyle} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDetailTour} from '../hooks';
import {renderItemLocation} from './DayScheduleCreateTour';

interface Props {
  tourId: number;
  dayIndex: number;
}

const DayScheduleDetailTour = ({tourId, dayIndex}: Props) => {
  const {bottom} = useSafeAreaInsets();
  const [{data, validating}, {mutate}] = useDetailTour(tourId);
  const listLocations = data?.schedule?.[dayIndex] ?? [];

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
        })
      }
      keyExtractor={(item, index) => `${item.id}-${index}`}
      contentContainerStyle={[
        $contentContainer,
        {
          paddingBottom: bottom || safePaddingNotZero,
        },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={validating} onRefresh={mutate} />
      }
      containerStyle={$container}
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
