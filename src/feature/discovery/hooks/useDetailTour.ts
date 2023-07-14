import {useApi} from 'hook';

interface Params {
  initTour?: TourDetail;
  revalidateAll?: boolean;
}

const useDetailTour = (tourId: number | null, params?: Params) => {
  const {data, loading, validating, mutate} = useApi<TourDetail>({
    path: tourId ? `/common/tours/${tourId}` : null,
    config: {
      revalidateAll: !!params?.revalidateAll,
      fallbackData: params?.initTour,
    },
  });

  return [
    {data, loading, validating},
    {
      mutate,
    },
  ] as const;
};

export default useDetailTour;
