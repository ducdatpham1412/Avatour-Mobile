import {
  apiDeleteEstimate,
  apiEditEstimate,
  apiEstimate,
  apiJoinSale,
} from 'api/discovery';
import {apiLikePost, apiUnLikePost} from 'api/profile';
import {APP_EVENT, REACT} from 'asset/enum';
import {emitAppEvent, useApiImmutable, useEstimatesAndJoinings} from 'hook';
import {ModalAlert} from 'navigation/screen/modals';
import useSWRMutation from 'swr/mutation';

interface Params {
  revalidateAll?: boolean;
}

const useDetailSale = (saleId: number | undefined, options?: Params) => {
  const {revalidateAll = true} = options ?? {};

  const {data, mutate, loading} = useApiImmutable<TypeGroupBuying>({
    path: saleId ? `/profile/sales/${saleId}` : null,
    config: {
      revalidateAll,
    },
  });

  const {mutate: mutateEstimatesAndJoinings} = useEstimatesAndJoinings();

  const dataMeJoined = useApiImmutable<TypeMeJoinInSale>({
    path: saleId ? `/profile/sales/join/${saleId}` : null,
    config: {
      revalidateAll,
    },
  });

  const {trigger: onRefresh, isMutating: refreshing} = useSWRMutation(
    'api.refreshSale',
    async () => {
      try {
        await mutate();
        await dataMeJoined.mutate();
      } catch (err) {
        ModalAlert.error({
          content: err,
        });
      }
    },
  );

  const {trigger: onReaction} = useSWRMutation(
    [data?.id, 'api.reactSale'],
    async () => {
      if (data) {
        const currentLiked = !!data?.is_liked;
        let newTotalLikes = currentLiked
          ? data.total_likes - 1
          : data.total_likes + 1;
        newTotalLikes = newTotalLikes >= 0 ? newTotalLikes : 0;
        try {
          await mutate(
            {...data, is_liked: !currentLiked, total_likes: newTotalLikes},
            {revalidate: false},
          );
          if (currentLiked) {
            await apiUnLikePost({
              type: REACT.sale,
              reactedId: data?.id,
            });
            emitAppEvent(APP_EVENT.reactSale, {
              saleId: data?.id,
              type: 'dislike',
            });
          } else {
            await apiLikePost({
              type: REACT.sale,
              reactedId: data?.id,
            });
            emitAppEvent(APP_EVENT.reactSale, {
              saleId: data?.id,
              type: 'like',
            });
          }
        } catch (err) {
          await mutate({...data, is_liked: currentLiked});
        }
      }
    },
  );

  const {trigger: onJoin, isMutating: loadingJoin} = useSWRMutation(
    [data?.id, 'api.JoinSale'],
    async (_, {arg}: {arg: Omit<TypeJoinRequest, 'saleId'>}) => {
      if (data) {
        const res = await apiJoinSale({...arg, saleId: data?.id});
        await dataMeJoined.mutate(
          pre => {
            if (pre) {
              return {
                estimate: res.data,
                joinings: pre?.joinings,
              };
            }
          },
          {revalidate: false},
        );
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

  const {trigger: estimate, isMutating: loadingEstimate} = useSWRMutation(
    'api.estimateJoinSale',
    async () => {
      if (dataMeJoined.data?.estimate) {
        const res = await apiEstimate(dataMeJoined.data.estimate.id);
        await dataMeJoined.mutate(
          pre => {
            if (pre) {
              return {
                estimate: res.data,
                joinings: pre.joinings,
              };
            }
          },
          {revalidate: false},
        );
        await mutateEstimatesAndJoinings(
          pre => {
            if (pre) {
              const check = pre.estimates.find(
                item => item?.sale_id === res.data.sale_id,
              );

              if (check) {
                return {
                  estimates: pre.estimates.map(item => {
                    if (item.sale_id === res.data?.sale_id) {
                      return res.data;
                    }
                    return item;
                  }),
                  joinings: pre.joinings,
                };
              }

              return {
                estimates: [res.data].concat(pre.estimates),
                joinings: pre.joinings,
              };
            }
          },
          {revalidate: false},
        );
      } else {
        throw new Error('Estimate not exited');
      }
    },
  );

  const {trigger: deleteEstimate, isMutating: loadingDeleteEstimate} =
    useSWRMutation('api.deleteEstimateJoinSale', async () => {
      const estimateId = dataMeJoined.data?.estimate?.id;
      if (estimateId) {
        await apiDeleteEstimate(estimateId);
        await dataMeJoined.mutate(
          pre => {
            if (pre) {
              return {
                estimate: null,
                joinings: pre.joinings,
              };
            }
          },
          {revalidate: false},
        );
        await mutateEstimatesAndJoinings(
          pre => {
            if (pre) {
              return {
                estimates: pre.estimates.filter(item => item.id !== estimateId),
                joinings: pre.joinings,
              };
            }
          },
          {revalidate: false},
        );
      } else {
        throw new Error('Estimate not exited');
      }
    });

  const {trigger: editEstimate, isMutating: loadingEditEstimate} =
    useSWRMutation(
      'api.editEstimateJoinSale',
      async (_, {arg}: {arg: Omit<TypeEditEstimate, 'estimateId'>}) => {
        const estimateId = dataMeJoined.data?.estimate?.id;
        if (estimateId) {
          const res = await apiEditEstimate({
            estimateId: estimateId,
            ...arg,
          });
          await dataMeJoined.mutate(
            pre => {
              if (pre) {
                return {
                  estimate: res.data,
                  joinings: pre.joinings,
                };
              }
            },
            {revalidate: false},
          );
          await mutateEstimatesAndJoinings(
            pre => {
              if (pre) {
                return {
                  estimates: pre.estimates.map(item => {
                    if (item.id !== res.data.id) {
                      return item;
                    }
                    return res.data;
                  }),
                  joinings: pre.joinings,
                };
              }
            },
            {revalidate: false},
          );
        }
      },
    );

  return [
    {
      data,
      meJoins: dataMeJoined?.data,
      initLoading: loading || dataMeJoined?.loading,
      loadingJoin,
      refreshing,
      loadingEstimate,
      loadingDeleteEstimate,
      loadingEditEstimate,
    },
    {onRefresh, onReaction, onJoin, estimate, deleteEstimate, editEstimate},
  ] as const;
};

export default useDetailSale;
