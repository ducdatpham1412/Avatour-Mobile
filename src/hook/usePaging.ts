import {useRequest, useUnmount} from 'ahooks';
import {SIZE_LOADING_LIMIT} from 'asset/standardValue';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useUpdateEffect} from 'react-use';

const {CancelToken} = axios;

/**
 * TODO: Move to useSWRInfinity instead of ahooks
 */
const usePaging = <TResult = any, TParams = TypeObjectAny>(paramsPaging: {
  request: (config: any) => Promise<any>;
  // request: (config: AxiosRequestConfig) => Promise<any>;
  params?: {
    take?: number;
  } & TParams;
  onSuccess?: (data?: any, cbParams?: any) => void;
  onError?: (error?: Error, cbParams?: any) => void;
  isInitNotRunRequest?: boolean;
}) => {
  //   const hookRenderedAll = useRef(false);

  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initLoading, setInitLoading] = useState(
    // !paramsPaging?.isInitNotRunRequest,
    true,
  );

  const [pageIndex, setPageIndex] = useState(
    paramsPaging?.isInitNotRunRequest ? 0 : 1,
  );
  const [params, setParams] = useState(paramsPaging.params);
  const [list, setList] = useState<Array<TResult>>([]);

  const [error, setError] = useState<Error | null>();
  const [noMore, setNoMore] = useState(false);

  const source = CancelToken.source();

  /**
   * Assistant functions
   */
  const handleOnSuccess = (data: any, cbParams: any) => {
    const resData = data || {};
    const newList: Array<any> = resData?.data || [];

    if (refreshing) {
      setList(newList);
    } else if (newList.length > 0) {
      setList(list.concat(newList));
    }
    setNoMore(pageIndex >= resData?.totalPages);
    setRefreshing(false);
    setLoadingMore(false);
    setInitLoading(false);

    paramsPaging?.onSuccess?.(data, cbParams);
  };

  const handleOnError = (err: Error, cbParams: any) => {
    setError(err);
    setRefreshing(false);
    setLoadingMore(false);
    paramsPaging?.onError?.(err, cbParams);
  };

  const umiRequest = useRequest<TypePagingResponse<TResult[]>, any>(
    paramsPaging.request,
    {
      manual: true,
      onSuccess: handleOnSuccess,
      onError: handleOnError,
    },
  );

  const runRequest = (requestPageIndex: number, otherParams?: any) => {
    umiRequest.run({
      params: {
        page_index: requestPageIndex,
        ...otherParams,
        take: params?.take || SIZE_LOADING_LIMIT,
      },
      cancelToken: source.token,
    });
  };

  /**
   * Actions
   */
  const onRefresh = () => {
    if (!umiRequest.loading) {
      setRefreshing(true);
    }
  };

  const onLoadMore = () => {
    if (!noMore && !umiRequest.loading) {
      setLoadingMore(true);
      setPageIndex(pageIndex + 1);
    }
  };

  /**
   * Use of hook
   */
  useEffect(() => {
    // console.log(1);
    if (pageIndex > 1) {
      setLoadingMore(true);
    }
    if (pageIndex > 0) {
      runRequest(pageIndex, params);
    }
  }, [pageIndex]);

  useUpdateEffect(() => {
    // console.log(2);
    if (refreshing) {
      setPageIndex(1);
      runRequest(1, params);
    }
  }, [refreshing]);

  useUpdateEffect(() => {
    // console.log(3);
    // if (!umiRequest.loading && hookRenderedAll.current) {
    //   onRefresh();
    // }
    if (!umiRequest.loading) {
      onRefresh();
    }
  }, [params]);

  //   useEffect(() => {
  //     hookRenderedAll.current = true;
  //   }, []);

  useUnmount(() => {
    source.cancel('useEffect cleanup...');
  });

  return {
    ...umiRequest,
    list,
    setList,
    noMore,
    refreshing,
    loadingMore,
    error,
    onRefresh,
    onLoadMore,
    setParams,
    initLoading,
  };
};

export default usePaging;
