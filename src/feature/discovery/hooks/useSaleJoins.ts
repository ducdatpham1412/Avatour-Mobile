import request from 'api/request';
import {JOIN_STATUS} from 'asset/enum';
import {useApi} from 'hook';
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
        await request.put('profile/sales/confirm', {
          list_joins_id: arg.list_join_id,
        });
        await mutate(
          pre => {
            if (pre) {
              return pre.map(item => {
                if (arg.list_join_id.includes(item.id)) {
                  return {
                    ...item,
                    status: JOIN_STATUS.supplierConfirmed,
                  };
                }
                return item;
              });
            }
          },
          {revalidate: false},
        );
      },
    );

  return [
    {data, loading, validating, loadingConfirmBought},
    {mutate, confirmBought},
  ] as const;
};

export default useSaleJoins;
