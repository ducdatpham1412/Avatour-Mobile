import {useApi} from 'hook';

interface Params {
  initValue?: TypeJoinPersonal;
}

const useJoinPersonal = (id: number | null, params?: Params) => {
  const {data, error, loading, mutate, validating} = useApi<TypeJoinPersonal>({
    path: id ? `/profile/sales/join/${id}` : null,
    params: {
      type: 'join_personal',
    },
    config: {
      fallbackData: params?.initValue,
    },
  });

  return {
    data,
    error,
    loading,
    validating,
    mutate,
  };
};

export default useJoinPersonal;
