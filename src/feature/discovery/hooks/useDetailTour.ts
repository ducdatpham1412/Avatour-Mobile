import {apiEditTour} from 'api/discovery';
import {useApi} from 'hook';
import {ModalAlert} from 'navigation/screen/modals';
import {useRef, useState} from 'react';
import isEqual from 'react-fast-compare';

interface Params {
  tourId?: number;
  tour?: Tour;
}

const useDetailTour = ({tourId, tour}: Params) => {
  const {data, loading, validating, mutate} = useApi<TourDetail>({
    path: `/common/tours/${tour?.id ?? tourId}`,
    config: {
      revalidateAll: true,
    },
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingEditTour, setLoadingEditTour] = useState(false);
  const [shouldRenderTab, setShouldRenderTab] = useState(true);
  const dataRef = useRef<TourDetail>();
  dataRef.current = data;

  const onRefresh = async () => {
    await mutate();
  };

  const onEditTour = async (
    value: Omit<TypeEditTour, 'schedule'> & {schedule: TourDetail['schedule']},
  ) => {
    if (dataRef.current) {
      try {
        setLoadingEditTour(true);
        const update: TypeEditTour = {};
        Object.keys(value).forEach(key => {
          const valueKey = (value as any)?.[key];
          const dataKey = (dataRef.current as any)?.[key];

          if (!isEqual(valueKey, dataKey) && valueKey && dataKey) {
            if (key === 'schedule') {
              update.schedule = value?.schedule?.map(day =>
                day.map(lo => lo?.id),
              );
            } else {
              (update as any)[key] = valueKey;
            }
          }
        });
        // If update have value => call api update tour
        if (!isEqual(update, {})) {
          setShouldRenderTab(false);
          await apiEditTour(dataRef.current?.id, update);
          await mutate();
        }
        setIsEditMode(false);
      } catch (err) {
        ModalAlert.error({
          content: err,
        });
      } finally {
        setLoadingEditTour(false);
        setShouldRenderTab(true);
      }
    }
  };

  return [
    {data, loading, validating, loadingEditTour, shouldRenderTab, isEditMode},
    {
      onRefresh,
      onEditTour,
      setLoadingEditTour,
      setIsEditMode,
      setShouldRenderTab,
    },
  ] as const;
};

export default useDetailTour;
