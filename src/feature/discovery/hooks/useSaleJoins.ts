import request from 'api/request';
import {APP_EVENT, JOIN_STATUS} from 'asset/enum';
import {emitAppEvent, useApi} from 'hook';
import useSWRMutation from 'swr/mutation';

type ConfirmBoughtParams = {
  list_join_id: number[];
};

const useSaleJoins = (saleId: number) => {
  const {data, loading, validating, mutate} = useApi<TypeJoinEstimate[]>({
    path: `/profile/sales/join/${saleId}`,
    params: {
      type: 'list_estimates',
    },
  });

  const {trigger: confirmBought, isMutating: loadingConfirmBought} =
    useSWRMutation(
      'api.confirmUserBought',
      async (_, {arg}: {arg: ConfirmBoughtParams}) => {
        await request.put('/profile/sales/confirm', {
          list_joins_id: arg.list_join_id,
        });
        await mutate(
          pre => {
            if (pre) {
              return pre.map(item => {
                if (arg.list_join_id.includes(item.id)) {
                  return {
                    ...item,
                    status: JOIN_STATUS.supplierConfirmBought,
                  };
                }
                return item;
              });
            }
          },
          {revalidate: false},
        );
        emitAppEvent(APP_EVENT.refreshNotification);
      },
    );

  const {trigger: approveOrder, isMutating: loadingApproveOrder} =
    useSWRMutation(
      'api.approveOrder',
      async (_, {arg: estimateId}: {arg: number}) => {
        await request.put(`/profile/sales/join/${estimateId}`, null, {
          params: {
            type: 'approved',
          },
        });
        emitAppEvent(APP_EVENT.refreshNotification);
      },
    );

  const {trigger: rejectOrder, isMutating: loadingRejectOrder} = useSWRMutation(
    'api.approveOrder',
    async (_, {arg: estimateId}: {arg: number}) => {
      await request.put(`/profile/sales/join/${estimateId}`, null, {
        params: {
          type: 'reject',
        },
      });
      emitAppEvent(APP_EVENT.refreshNotification);
    },
  );

  return [
    {
      data,
      loading,
      validating,
      loadingConfirmBought,
      loadingApproveOrder,
      loadingRejectOrder,
    },
    {mutate, confirmBought, approveOrder, rejectOrder},
  ] as const;
};

export default useSaleJoins;
