import {apiDeleteRequest, apiRequestUpdatePrice} from 'api/authentication';
import {useApi} from 'hook';
import useSWRMutation from 'swr/mutation';

const useMyRequests = () => {
  const {data, mutate, loading, validating} = useApi<
    TypeGetRequestResponse<any>[]
  >({
    path: 'auth/request',
    params: {
      type: 'all',
    },
  });

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
      initLoading: loading,
      validating,
      isCanceling,
      loadingSendRequest,
    },
    {mutate, onDeleteRequest, sendRequest},
  ] as const;
};

export default useMyRequests;
