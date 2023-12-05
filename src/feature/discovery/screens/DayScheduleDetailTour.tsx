import {APP_EVENT, STATUS} from 'asset/enum';
import {horizontalPadding, verticalMargin} from 'asset/metrics';
import {StyleList} from 'components/base';
import {useMyRequests} from 'feature/profile/hooks';
import {emitAppEvent, useSafeArea} from 'hook';
import React from 'react';
import {ViewStyle} from 'react-native';
import {verticalScale} from 'utility/scale';
import {useDetailTour} from '../hooks';
import {renderItemLocation} from './DayScheduleCreateTour';

interface Props {
  tourId: number;
  dayIndex: number;
}

const DayScheduleDetailTour = ({tourId, dayIndex}: Props) => {
  const {paddingBottom} = useSafeArea();

  const [, {suggestLocation}] = useMyRequests();
  const [{data, validating}, {mutate}] = useDetailTour(tourId);

  const listLocations = data?.schedule?.[dayIndex] ?? [];

  const onSuggestLocation = async (value: TypeGetProfileResponse) => {
    await suggestLocation(value.id);
    emitAppEvent(APP_EVENT.suggestLocation, {
      locationId: value.id,
      event: 'suggest',
    });
  };

  return (
    <StyleList
      data={listLocations}
      renderItem={({item, index}) =>
        renderItemLocation(item, {
          onDrag: () => null,
          isActive: false,
          getIndex: () => index,
          isEditMode: false,
          onDeleteLocation: () => null,
          onSuggestLocation,
        })
      }
      keyExtractor={(item, index) => `${item.id}-${index}`}
      contentContainerStyle={[
        $contentContainer,
        {
          paddingBottom:
            paddingBottom +
            (data?.status === STATUS.draft ? verticalScale(80) : 0),
        },
      ]}
      refreshing={validating}
      onRefresh={mutate}
    />
  );
};

const $contentContainer: ViewStyle = {
  paddingHorizontal: horizontalPadding,
  gap: verticalMargin,
  flexGrow: 1,
};

export default DayScheduleDetailTour;
