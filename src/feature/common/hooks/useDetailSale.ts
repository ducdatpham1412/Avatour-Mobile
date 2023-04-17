import {apiJoinSale} from 'api/discovery';
import {apiLikePost, apiUnLikePost} from 'api/profile';
import {REACT} from 'asset/enum';
import {useApi} from 'hook';
import {appAlert} from 'navigation/NavigationService';
import {useEffect} from 'react';

interface Params {
  saleId?: number;
  sale?: TypeGroupBuying;
}

const useDetailSale = ({saleId, sale}: Params) => {
  const {data, mutate, loading} = useApi<TypeGroupBuying>({
    path: `/profile/sales/${saleId ?? sale?.id}`,
    config: {
      revalidateOnMount: !sale,
    },
  });
  const dataMeJoined = useApi<TypeMeJoinResponse[]>({
    path: `/profile/sales/join/${saleId ?? sale?.id}`,
  });

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
      appAlert(err);
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

  const onJoin = async (params: Omit<TypeJoinRequest, 'saleId'>) => {
    if (data) {
      try {
        await apiJoinSale({...params, saleId: data?.id});
      } catch (err) {
        appAlert(err);
      }
    }
  };

  return [
    {
      data,
      loading: loading || dataMeJoined?.loading,
      meJoins: dataMeJoined?.data || [],
    },
    {onRefresh, onReaction, onJoin},
  ] as const;
};

export default useDetailSale;
