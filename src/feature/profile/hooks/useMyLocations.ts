import {useApi} from 'hook';

const useMyLocations = () => {
  const {data, loading, validating, mutate} = useApi<TypeGetProfileResponse[]>({
    path: '/admin/suppliers',
    params: {
      type: 'my-location',
    },
  });

  return [{data, loading, validating}, {mutate}] as const;
};

export default useMyLocations;
