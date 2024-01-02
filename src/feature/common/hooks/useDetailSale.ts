import {apiJoinSale} from 'api/discovery';
import {apiDeleteSale} from 'api/profile';
import {APP_EVENT, STATUS} from 'asset/enum';
import {emitAppEvent, useApi, useEstimatesAndJoinings} from 'hook';
import useSWRMutation from 'swr/mutation';

interface Params {
  revalidateAll?: boolean;
}

const useDetailSale = (saleId: number | undefined, options?: Params) => {
  const {revalidateAll = true} = options ?? {};

  const {data, mutate, loading, validating} = useApi<TypeGroupBuying>({
    path: saleId ? `/profile/sales/${saleId}` : null,
    config: {
      revalidateAll,
      revalidateModeExpChange: true,
    },
  });

  const {mutate: mutateEstimatesAndJoinings} = useEstimatesAndJoinings();

  const {trigger: onJoin, isMutating: loadingJoin} = useSWRMutation(
    [data?.id, 'api.JoinSale'],
    async (_, {arg}: {arg: Omit<TypeJoinRequest, 'saleId'>}) => {
      if (data) {
        const res = await apiJoinSale({...arg, saleId: data?.id});
        await mutateEstimatesAndJoinings(
          pre => {
            if (pre) {
              return {
                estimates: [res.data].concat(pre.estimates),
                joinings: pre.joinings,
              };
            }
          },
          {revalidate: false},
        );
        return res.data;
      } else {
        throw new Error('Sale not exited');
      }
    },
  );

  const {trigger: deleteSale, isMutating: loadingDelete} = useSWRMutation(
    'api.requestDeleteSale',
    async () => {
      if (data) {
        await apiDeleteSale(data.id);
        await mutate(
          pre => {
            if (pre) {
              return {
                ...pre,
                status: STATUS.notActive,
              };
            }
          },
          {revalidate: false},
        );
        emitAppEvent(APP_EVENT.editSale, {
          post_id: data.id,
          data: {
            status: STATUS.notActive,
          },
        });
      }
    },
  );

  return [
    {
      data,
      initLoading: loading,
      loadingJoin,
      refreshing: validating && !loading,
      loadingDelete,
    },
    {
      mutate,
      onJoin,
      deleteSale,
    },
  ] as const;
};

export default useDetailSale;
