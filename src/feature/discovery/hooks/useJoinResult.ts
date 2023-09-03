import {apiScanJoinResult} from 'api/discovery';
import {apiRequestBought} from 'api/profile';
import {JOIN_STATUS} from 'asset/enum';
import {useEstimatesAndJoinings} from 'hook';
import useSWRImmutable from 'swr/immutable';
import useSWRMutation from 'swr/mutation';

interface Params {
  revalidateAll?: boolean;
  joinId?: 'all' | number;
}

const useJoinResult = (shopId: number, params?: Params) => {
  const {data, isLoading, isValidating, error, mutate} = useSWRImmutable(
    [shopId, 'api.checkJoinResult'],
    async () => {
      const res = await apiScanJoinResult(shopId);
      return res.data;
    },
    /**
     * TODO: Check revalidateOnMount -> because on Android it's not called
     */
    params?.revalidateAll ? {revalidateOnMount: true} : {},
  );
  const {mutate: mutateEstimatesAndJoining} = useEstimatesAndJoinings();

  const {trigger: requestBought, isMutating: loadingRequestBought} =
    useSWRMutation(
      ['api.requestBought', params?.joinId ?? 'all'],
      async (_, {arg}: {arg: TypeRequestBought}) => {
        await apiRequestBought(arg);
        await mutate(
          pre => {
            if (pre) {
              const newToday = pre.today.map(item => {
                if (arg.list_joins_id.includes(item.id)) {
                  return {
                    ...item,
                    status: JOIN_STATUS.consumerConfirmed,
                  };
                }
                return item;
              });
              return {
                today: newToday,
                next: pre.next,
              };
            }
          },
          {revalidate: false},
        );
        await mutateEstimatesAndJoining();
      },
    );

  return [
    {
      data,
      loading: isLoading || isValidating,
      loadingRequestBought,
      error,
    },
    {requestBought, mutate},
  ] as const;
};

export default useJoinResult;
