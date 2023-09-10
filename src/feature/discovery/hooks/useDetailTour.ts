import {apiEditTour} from 'api/discovery';
import {STATUS} from 'asset/enum';
import {useApi} from 'hook';
import useSWRMutation from 'swr/mutation';

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

  const {trigger: publicTour, isMutating: loadingPublicTour} = useSWRMutation(
    tourId ? 'api.publicTour' : null,
    async () => {
      if (tourId) {
        await apiEditTour(tourId, {
          status: STATUS.active,
        });
        await mutate(pre => {
          if (pre) {
            return {
              ...pre,
              status: STATUS.active,
            };
          }
        });
      }
    },
  );

  return [
    {data, loading, validating, loadingPublicTour},
    {
      mutate,
      publicTour,
    },
  ] as const;
};

export default useDetailTour;
