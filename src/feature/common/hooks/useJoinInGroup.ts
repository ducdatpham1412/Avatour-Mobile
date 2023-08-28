import {useApi} from 'hook';

type Params = {
  initValue?: TypeGroupJoin;
};

const useJoinInGroup = (groupId: number, params?: Params) => {
  const {data, loading, validating, mutate} = useApi<TypeJoinPersonal[]>({
    path: `/profile/sales/join/${groupId}`,
    params: {
      type: 'join_in_group',
    },
    config: {
      fallbackData: params?.initValue,
      revalidateOnMount: !params?.initValue,
    },
  });

  return [{data, loading, validating}, {mutate}] as const;
};

export default useJoinInGroup;
