import request from 'api/request';
import useSWR, {SWRConfiguration} from 'swr';
import useSWRImmutable from 'swr/immutable';

interface TypeParamsApi {
  path: string;
  params?: Record<string, any>;
  config?: SWRConfiguration & {revalidateAll?: boolean};
}

const useApi = <T>({path, params, config}: TypeParamsApi) => {
  const moreConfig: SWRConfiguration = config?.revalidateAll
    ? {revalidateOnFocus: true, revalidateIfStale: true}
    : {};
  const {data, error, isLoading, mutate} = useSWR<T, Error>(
    [path, params, 'useApi'],
    async () => {
      const res = await request.get(path, params);
      return res?.data;
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      revalidateIfStale: false,
      ...config,
      ...moreConfig,
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
    [path, params, 'useApiImmutable'],
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
