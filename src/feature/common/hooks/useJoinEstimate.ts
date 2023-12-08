import {apiDeleteEstimate} from 'api/discovery';
import {apiRequestBought} from 'api/profile';
import {APP_EVENT, JOIN_STATUS} from 'asset/enum';
import {emitAppEvent, useApi} from 'hook';
import {useMemo} from 'react';
import useSWRMutation from 'swr/mutation';
import {calculatePriceDeposit} from 'utility/assistant';

interface Params {
  initValue?: TypeJoinEstimate;
  revalidateAll?: boolean;
}

const useJoinEstimate = (id: number | null, params?: Params) => {
  const {data, error, loading, mutate, validating} = useApi<TypeJoinEstimate>({
    path: id ? `/profile/sales/join/${id}` : null,
    params: {
      type: 'join_estimate',
    },
    config: {
      fallbackData: params?.initValue,
      revalidateAll: params?.revalidateAll,
    },
  });

  const priceDeposit = useMemo(() => {
    return data ? calculatePriceDeposit(data) : {price: 0, deposit: 0};
  }, [data]);

  const {trigger: deleteEstimate, isMutating: loadingDeleteEstimate} =
    useSWRMutation('api.deleteEstimateJoinSale', async () => {
      if (id) {
        await apiDeleteEstimate(id);
      }
    });

  const {trigger: confirmArrived, isMutating: loadingConfirmArrived} =
    useSWRMutation(
      'api.requestBought',
      async (_, {arg: listJoinIds}: {arg: number[]}) => {
        await apiRequestBought({
          list_joins_id: listJoinIds,
        });
        await mutate(
          () => {
            if (data) {
              return {
                ...data,
                status: JOIN_STATUS.consumerConfirmed,
              };
            }
          },
          {revalidate: false},
        );
        emitAppEvent(APP_EVENT.confirmArrived);
      },
    );

  return [
    {
      data,
      priceDeposit,
      error,
      loading,
      validating,
      loadingDeleteEstimate,
      loadingConfirmArrived,
    },
    {mutate, deleteEstimate, confirmArrived},
  ] as const;
};

export default useJoinEstimate;
