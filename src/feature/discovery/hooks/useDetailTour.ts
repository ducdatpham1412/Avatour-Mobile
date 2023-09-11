import {apiEditTour} from 'api/discovery';
import request from 'api/request';
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

  const {trigger: privateTour, isMutating: loadingPrivateTour} = useSWRMutation(
    tourId ? 'api.privateTour' : null,
    async () => {
      if (tourId) {
        await apiEditTour(tourId, {
          status: STATUS.draft,
        });
        await mutate(pre => {
          if (pre) {
            return {
              ...pre,
              status: STATUS.draft,
            };
          }
        });
      }
    },
  );

  const {trigger: deleteTour, isMutating: loadingDeleteTour} = useSWRMutation(
    tourId ? 'api.deleteTour' : null,
    async () => {
      if (tourId) {
        await request.delete(`/common/tours/${tourId}`);
        await mutate(undefined, {revalidate: false});
      }
    },
  );

  return [
    {
      data,
      loading,
      validating,
      loadingPublicTour,
      loadingDeleteTour,
      loadingPrivateTour,
    },
    {
      mutate,
      publicTour,
      deleteTour,
      privateTour,
    },
  ] as const;
};

export default useDetailTour;
