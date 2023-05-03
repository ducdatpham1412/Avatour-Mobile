import {apiJoinSale} from 'api/discovery';
import {apiLikePost, apiRequestBought, apiUnLikePost} from 'api/profile';
import {useAppSelector} from 'app-redux/store';
import {APP_EVENT, GROUP_BUYING_STATUS, REACT} from 'asset/enum';
import dayjs from 'dayjs';
import {useApiImmutable, useAppEvent} from 'hook';
import {ModalAlert} from 'navigation/screen/modals';
import {useEffect, useState} from 'react';
import {formatUTCDate, getDateTimeNow} from 'utility/format';

interface Params {
  saleId?: number;
  sale?: TypeGroupBuying;
}

type TypeExtraParams = {
  onSuccess?: () => void;
};

const useDetailSale = ({saleId, sale}: Params) => {
  const {profile} = useAppSelector(state => state.accountSlice.passport);

  const {data, mutate, loading} = useApiImmutable<TypeGroupBuying>({
    path: `/profile/sales/${saleId ?? sale?.id}`,
    // config: {
    //   revalidateOnMount: !sale, // check to should un comment this
    // },
  });
  const dataMeJoined = useApiImmutable<TypeMeJoinResponse[]>({
    path: `/profile/sales/join/${saleId ?? sale?.id}`,
  });
  const appEvent = useAppEvent(APP_EVENT.requestBoughtJoin);
  const [loadingJoin, setLoadingJoin] = useState(false);

  useEffect(() => {
    if (sale) {
      mutate(sale, {revalidate: false});
    }
  }, []);

  const onRefresh = async () => {
    try {
      await mutate();
      await dataMeJoined.mutate();
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    }
  };

  const onReaction = async () => {
    if (data) {
      const currentLiked = !!data?.is_liked;
      try {
        await mutate({...data, is_liked: !currentLiked}, {revalidate: false});
        if (currentLiked) {
          await apiUnLikePost({
            type: REACT.sale,
            reactedId: data?.id,
          });
        } else {
          await apiLikePost({
            type: REACT.sale,
            reactedId: data?.id,
          });
        }
      } catch (err) {
        await mutate({...data, is_liked: currentLiked});
      }
    }
  };

  const onJoin = async (
    params: Omit<TypeJoinRequest, 'saleId'>,
    extraParams?: TypeExtraParams,
  ) => {
    if (data) {
      try {
        setLoadingJoin(true);
        const res = await apiJoinSale({...params, saleId: data?.id});

        await dataMeJoined.mutate(
          pre =>
            pre?.concat({
              id: res?.personal_id,
              sale_id: data?.id,
              group_id: res?.group_id,
              deposit: params.deposit,
              amount: params.amount,
              time_will_buy: params.time_will_buy,
              note: params.note,
              created: formatUTCDate(dayjs()),
              status: GROUP_BUYING_STATUS.notBought,
              sale: {
                images: data?.images,
                creator: data?.creator,
                name: data?.creator_name,
                avatar: data?.creator_avatar,
              },
            }),
          {revalidate: false},
        );

        await mutate(
          pre => {
            if (!pre) return undefined;
            const next = {...pre};
            next.total_members = next.total_members + 1;
            const checkGroup = next?.groups?.find(
              group => group?.id === res?.group_id,
            );
            if (checkGroup) {
              checkGroup.members.push({
                id: res?.personal_id,
                creator: profile?.id,
                creator_name: profile?.name,
                creator_avatar: profile?.avatar,
              });
            } else {
              next.groups.push({
                id: res?.group_id,
                created: getDateTimeNow(),
                members: [
                  {
                    id: res?.personal_id,
                    creator: profile?.id,
                    creator_name: profile?.name,
                    creator_avatar: profile?.avatar,
                  },
                ],
              });
            }
            return next;
          },
          {revalidate: false},
        );

        ModalAlert.success({
          i18Content: 'profile.joinedSuccess',
          onClose: extraParams?.onSuccess,
        });
      } catch (err) {
        ModalAlert.error({
          content: err,
        });
      } finally {
        setLoadingJoin(false);
      }
    }
  };

  const onRequestBought = async (joinId: number) => {
    if (data) {
      try {
        setLoadingJoin(true);
        await apiRequestBought({
          list_joins_id: [joinId],
        });
        // add modal alert here
        await dataMeJoined.mutate(
          pre => {
            if (pre) {
              return pre.map(join => {
                if (join.id !== joinId) {
                  return join;
                }
                return {
                  ...join,
                  status: GROUP_BUYING_STATUS.requestBought,
                };
              });
            }
            return undefined;
          },
          {revalidate: false},
        );
        appEvent.emit({joinId});
      } catch (err) {
        ModalAlert.error({
          content: err,
        });
      } finally {
        setLoadingJoin(false);
      }
    }
  };

  return [
    {
      data,
      meJoins: dataMeJoined?.data || [],
      loading: loading || dataMeJoined?.loading,
      loadingJoin,
    },
    {onRefresh, onReaction, onJoin, onRequestBought},
  ] as const;
};

export default useDetailSale;
