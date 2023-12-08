import request from 'api/request';
import {useApi} from 'hook';
import useSWRMutation from 'swr/mutation';

const useMyLocations = () => {
  const {data, loading, validating, mutate} = useApi<TypeGetProfileResponse[]>({
    path: '/admin/suppliers',
    params: {
      type: 'my-location',
    },
    config: {
      revalidateModeExpChange: true,
    },
  });

  const {trigger: deleteLocation, isMutating: loadingDeleteLocation} =
    useSWRMutation(
      'api.deleteLocation',
      async (_, {arg: locationId}: {arg: number}) => {
        await request.delete('/admin/suppliers', {
          params: {
            user_id: locationId,
          },
        });
        mutate(
          pre => {
            if (pre) {
              return pre?.filter(location => location.id !== locationId);
            }
          },
          {revalidate: false},
        );
      },
    );

  return [
    {data, loading, validating, loadingDeleteLocation},
    {mutate, deleteLocation},
  ] as const;
};

export default useMyLocations;
