import {apiCreateTour} from 'api/discovery';
import dayjs from 'dayjs';
import {navigate} from 'navigation/NavigationService';
import {MAIN_SCREEN} from 'navigation/config';
import {ModalAlert} from 'navigation/screen/modals';
import {useState} from 'react';
import {formatUTCDate} from 'utility/format';

type TypeCreateTourParams = {
  schedule: TourDetail['schedule'];
  searchParams: TypeSearchParams;
};

const useCreateTour = () => {
  const [shouldRenderTab, setShouldRenderTab] = useState(true);
  const [loadingCreateTour, setLoadingCreateTour] = useState(false);

  const onCreateTour = async ({
    schedule,
    searchParams,
  }: TypeCreateTourParams) => {
    try {
      const scheduleNumber = schedule.map(day =>
        day.map(location => location.id),
      );
      await apiCreateTour({
        schedule: scheduleNumber,
        input_tour: {
          location: searchParams?.location || '',
          start_location: searchParams?.start_location || '',
          number_people: searchParams?.number_people || 0,
          services: searchParams?.services || [],
          start_price: searchParams.start_price || 0,
          end_price: searchParams.end_price || 0,
          start_time: formatUTCDate(dayjs()),
          end_time: formatUTCDate(dayjs()),
        },
      });
      ModalAlert.success({
        i18Content: 'profile.createTourSuccess',
        onClose: () => navigate(MAIN_SCREEN.favorite),
      });
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    } finally {
      setLoadingCreateTour(false);
    }
  };

  return [
    {shouldRenderTab, loadingCreateTour},
    {setShouldRenderTab, setLoadingCreateTour, onCreateTour},
  ] as const;
};

export default useCreateTour;
