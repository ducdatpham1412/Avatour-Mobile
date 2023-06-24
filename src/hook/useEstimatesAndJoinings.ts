import {TYPE_SALE_SEARCH} from 'asset/enum';
import {useApiImmutable} from './useApi';

const useEstimatesAndJoinings = () => {
  const {data, loading, mutate} = useApiImmutable<TypeGetEstimatesAndJoinings>({
    path: 'profile/sales',
    params: {
      type: TYPE_SALE_SEARCH.joining,
    },
  });

  return {
    data: {
      estimates: data?.estimates ?? [],
      joinings: data?.joinings ?? [],
    },
    loading,
    mutate,
  } as const;
};

export default useEstimatesAndJoinings;
