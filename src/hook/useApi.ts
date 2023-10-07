import request from 'api/request';
import {useAppSelector} from 'app-redux/store';
import useSWR, {SWRConfiguration} from 'swr';
import useSWRImmutable from 'swr/immutable';

interface TypeParamsApi {
  path: string | null | undefined;
  params?: Record<string, any>;
  config?: SWRConfiguration & {
    revalidateAll?: boolean;
    revalidateModeExpChange?: boolean;
  };
}

const useApi = <T>({path, params, config}: TypeParamsApi) => {
  const {modeExp} = useAppSelector(state => state.accountSlice);
  const moreConfig: SWRConfiguration = config?.revalidateAll
    ? {revalidateOnFocus: true, revalidateIfStale: true}
    : {};
  const {data, error, isLoading, isValidating, mutate} = useSWR<T, Error>(
    path
      ? [config?.revalidateModeExpChange ? modeExp : '', path, params, 'useApi']
      : null,
    async () => {
      const res = await request.get(path ?? '', {params});
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
    validating: isValidating,
  };
};

export const useApiImmutable = <T>({path, params, config}: TypeParamsApi) => {
  const {data, error, isLoading, isValidating, mutate} = useSWRImmutable<
    T,
    Error
  >(
    path ? [path, params, 'useApiImmutable'] : null,
    async () => {
      const res = await request.get(path ?? '', {params});
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
    validating: isValidating,
  };
};

export default useApi;
