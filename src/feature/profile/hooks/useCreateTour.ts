import {apiCreateTour, apiEditTour} from 'api/discovery';
import dayjs from 'dayjs';
import {useDetailTour} from 'feature/discovery/hooks';
import isEqual from 'react-fast-compare';
import useSWRMutation from 'swr/mutation';
import {formatUTCDate} from 'utility/format';
import {useContextCreateTour} from '../CreateTour';

export type ParamsCreateTour = 'create-new' | number;

const useCreateTour = (tourId: ParamsCreateTour) => {
  const [
    {schedules, name, searchParams},
    {setSchedules, setName, setSearchParams, onSave, onReset},
  ] = useContextCreateTour();
  const [{data}, {mutate}] = useDetailTour(
    tourId === 'create-new' ? null : tourId,
  );

  const {trigger: createTour, isMutating: loadingCreateTour} = useSWRMutation(
    [tourId, 'api.createTour'],
    async () => {
      const scheduleNumber = schedules.map(day =>
        day.map(location => location.id),
      );
      const res = await apiCreateTour({
        schedule: scheduleNumber,
        input_tour: {
          name,
          start_location: '',
          number_people: searchParams?.number_people || 0,
          services: searchParams?.services || [],
          start_price: searchParams.start_price || 0,
          end_price: searchParams.end_price || 0,
          start_time: formatUTCDate(dayjs()),
          end_time: formatUTCDate(dayjs()),
        },
      });
      onSave();
      return res.data;
    },
  );

  const {trigger: editTour, isMutating: loadingEditTour} = useSWRMutation(
    tourId === 'create-new' ? null : [tourId, 'api.editTour'],
    async () => {
      if (data) {
        const value: Omit<TypeEditTour, 'schedule'> & {
          schedule: TourDetail['schedule'];
        } = {
          name,
          services: searchParams.services,
          number_people: searchParams.number_people,
          start_price: searchParams.start_price,
          end_price: searchParams.end_price,
          schedule: schedules,
        };

        const update: TypeEditTour = {};

        Object.keys(value).forEach(key => {
          const newValue = (value as any)?.[key];
          const currentValue = (data as any)?.[key];

          if (
            !isEqual(newValue, currentValue)
            //    && newValue && currentValue
          ) {
            if (key === 'schedule') {
              update.schedule = value?.schedule?.map(day =>
                day.map(location => location?.id),
              );
            } else {
              (update as any)[key] = newValue;
            }
          }
        });

        // If update have value => call api update tour
        if (!isEqual(update, {})) {
          await apiEditTour(data.id, update);
          await mutate(
            pre => {
              if (pre) {
                return {
                  ...pre,
                  name,
                  number_people:
                    searchParams.number_people ?? pre.number_people,
                  start_price: searchParams.start_price ?? pre.start_price,
                  end_price: searchParams.end_price ?? pre.end_price,
                  services: searchParams.services ?? pre.services,
                  schedule: schedules,
                };
              }
            },
            {revalidate: false},
          );
        }
      }
    },
  );

  return [
    {loadingCreateTour, loadingEditTour, schedules, name, searchParams},
    {
      createTour,
      setName,
      setSchedules,
      setSearchParams,
      onReset,
      editTour,
    },
  ] as const;
};

export default useCreateTour;
