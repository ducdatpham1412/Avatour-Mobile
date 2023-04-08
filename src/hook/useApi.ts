import request from 'api/request';
import useSWR, {SWRConfiguration} from 'swr';

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

export default useApi;
