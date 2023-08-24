import {TypeGetRequestResponse} from 'api/interface';
import request from 'api/request';
import {TYPE_AUTH_REQUEST} from 'asset/enum';
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
      await request.delete('auth/request', {params: {request_id: requestId}});
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
    async (_, {arg: body}: {arg: TypeRequestUpdatePrice}) => {
      await request.put('auth/request', body, {
        params: {
          type: TYPE_AUTH_REQUEST.update_price,
        },
      });
      await mutate();
    },
  );

  const {trigger: suggestLocation} = useSWRMutation(
    'api.suggestLocation',
    async (_, {arg: locationId}) => {
      await request.put(
        'auth/request',
        {
          location_id: locationId,
        },
        {
          params: {
            type: TYPE_AUTH_REQUEST.suggest_location,
          },
        },
      );
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
    {mutate, onDeleteRequest, sendRequest, suggestLocation},
  ] as const;
};

export default useMyRequests;
