import {
  apiDeleteRequest,
  apiGetAllMyRequest,
  apiRequestUpdatePrice,
} from 'api/authentication';
import useSWRImmutable from 'swr/immutable';
import useSWRMutation from 'swr/mutation';

const useMyRequests = () => {
  const {data, mutate, isLoading, isValidating} = useSWRImmutable(
    'api.getMyListRequest',
    async () => {
      const res = await apiGetAllMyRequest();
      return res?.data;
    },
  );

  const {trigger: onDeleteRequest, isMutating: isCanceling} = useSWRMutation(
    'api.cancelRequest',
    async (_, {arg: requestId}) => {
      await apiDeleteRequest(requestId);
      await mutate(
        pre => {
          if (pre) {
            return pre.filter(item => item?.id !== requestId);
          }
        },
        {revalidate: false},
      );
    },
  );

  const {trigger: sendRequest, isMutating: loadingSendRequest} = useSWRMutation(
    'api.sendRequest',
    async (_, {arg}) => {
      await apiRequestUpdatePrice({
        sale_id: arg.sale_id,
        prices: arg.prices,
      });
      await mutate();
    },
  );

  return [
    {
      data: data || ([] as TypeGetRequestResponse<any>[]),
      initLoading: isLoading,
      validating: isValidating,
      isCanceling,
      loadingSendRequest,
    },
    {mutate, onDeleteRequest, sendRequest},
  ] as const;
};

export default useMyRequests;
