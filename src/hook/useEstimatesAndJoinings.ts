import {useAppSelector} from 'app-redux/store';
import {TYPE_SALE_SEARCH} from 'asset/enum';
import useApi from './useApi';

const useEstimatesAndJoinings = () => {
  const {modeExp} = useAppSelector(state => state.accountSlice);

  const {data, loading, mutate} = useApi<TypeGetEstimatesAndJoinings>({
    path: modeExp ? null : 'profile/sales',
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
