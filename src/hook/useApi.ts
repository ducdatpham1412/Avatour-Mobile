import request from 'api/request';
import useSWR, {SWRConfiguration} from 'swr';
import useSWRImmutable from 'swr/immutable';

interface TypeParamsApi {
  path: string;
  params?: Record<string, any>;
  config?: SWRConfiguration;
}

const useApi = <T>({path, params, config}: TypeParamsApi) => {
  const {data, error, isLoading, mutate} = useSWR<T, Error>(
    path,
    async () => {
      const res = await request.get(path, params);
      return res?.data;
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      revalidateIfStale: false,
      ...config,
    },
  );

  return {
    data,
    error,
    loading: isLoading,
    mutate,
  };
};

export const useApiImmutable = <T>({path, params, config}: TypeParamsApi) => {
  const {data, error, isLoading, mutate} = useSWRImmutable<T, Error>(
    path,
    async () => {
      const res = await request.get(path, params);
      return res?.data;
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      revalidateIfStale: false,
      ...config,
    },
  );

  return {
    data,
    error,
    loading: isLoading,
    mutate,
  };
};

export default useApi;
