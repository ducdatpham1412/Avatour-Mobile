import useSWRInfinite from 'swr/infinite';

type API<TRes = any, TParams = any> = (
  config: TypeParamsPaging<TParams>,
) => PagingResponse<TRes[]>;

type Response<T> = Awaited<PagingResponse<T>>;

interface Params<TRes = any, TParams = any> {
  api: API<TRes, TParams>;
  nullable?: boolean; // nullable to check can not run api => return key null
  params?: {
    take?: number;
  } & TParams;
}

const usePagingV2 = <TRes = any, TParams = any>({
  api,
  params,
  nullable = false,
}: Params<TRes, TParams>) => {
  const {data, size, setSize, mutate, isLoading, isValidating, error} =
    useSWRInfinite(
      (index, preData: Response<TRes> | undefined) => {
        if (nullable || (preData && preData.pageIndex >= preData.totalPages)) {
          return null;
        }
        const take = params?.take ?? 20;
        return [index + 1, take, api, 'usePagingV2'];
      },
      async ([page_index, take, __api]: [
        number,
        number,
        API<TRes, TParams>,
      ]) => {
        const res = await __api({
          params: {
            page_index,
            ...params,
            take,
          } as TypeParamsPaging<TParams>['params'],
        });

        return res;
      },
    );

  const onRefresh = async () => {
    await setSize(1);
  };

  const onLoadMore = async () => {
    const lastData = data ? data[data?.length - 1] : undefined;
    if (lastData && lastData.pageIndex < lastData.totalPages) {
      await setSize(pre => pre + 1);
    }
  };

  return [
    {
      data,
      loading: isLoading,
      validating: isValidating,
      refreshing: isValidating && size === 1,
      loadingMore: isValidating && size > 1,
      error,
    },
    {mutate, onRefresh, onLoadMore},
  ] as const;
};

export default usePagingV2;
