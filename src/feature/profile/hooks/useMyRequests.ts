import {apiDeleteRequest, apiGetAllMyRequest} from 'api/authentication';
import {useAppSelector} from 'app-redux/store';
import {ModalAlert} from 'navigation/screen/modals';
import useSWRImmutable from 'swr/immutable';
import useSWRMutation from 'swr/mutation';

const useMyRequests = () => {
  const {id: myId} = useAppSelector(
    state => state.accountSlice.passport.profile,
  );
  const {data, mutate, isLoading, isValidating} = useSWRImmutable(
    [myId, 'profile.getMyListRequest'],
    async () => {
      const res = await apiGetAllMyRequest();
      return res?.data;
    },
  );

  const {
    trigger: onCancelRequest,
    isMutating: isCanceling,
    error: errorCancel,
  } = useSWRMutation('proifle.cancelRequest', async (_, {arg: requestId}) => {
    await apiDeleteRequest(requestId);
    await mutate(
      pre => {
        if (pre) {
          return pre.filter(item => item?.id !== requestId);
        }
      },
      {revalidate: false},
    );
  });
  errorCancel && ModalAlert.error({content: errorCancel});

  return [
    {
      data: data || ([] as TypeGetRequestResponse<any>[]),
      initLoading: isLoading,
      validating: isValidating,
      isCanceling,
    },
    {mutate, onCancelRequest},
  ] as const;
};

export default useMyRequests;
