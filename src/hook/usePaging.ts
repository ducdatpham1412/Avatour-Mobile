import {useRequest, useUnmount} from 'ahooks';
import {SIZE_LOADING_LIMIT} from 'asset/standardValue';
import axios from 'axios';
import {useEffect, useState} from 'react';

const {CancelToken} = axios;

const usePaging = (paramsPaging: {
    request: (config: any) => Promise<any>;
    // request: (config: AxiosRequestConfig) => Promise<any>;
    params?: {
        take?: number;
        [key: string]: any;
    };
    onSuccess?: (data?: any, cbParams?: any) => void;
    onError?: (error?: Error, cbParams?: any) => void;
    isInitNotRunRequest?: boolean;
}) => {
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const [pageIndex, setPageIndex] = useState(
        paramsPaging?.isInitNotRunRequest ? 0 : 1,
    );
    const [params, setParams] = useState(paramsPaging.params);
    const [list, setList] = useState<Array<any>>([]);

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

        paramsPaging?.onSuccess?.(data, cbParams);
    };

    const handleOnError = (err: Error, cbParams: any) => {
        setError(err);
        setRefreshing(false);
        setLoadingMore(false);
        paramsPaging?.onError?.(err, cbParams);
    };

    const umiRequest = useRequest(paramsPaging.request, {
        loadMore: false,
        manual: true,
        onSuccess: handleOnSuccess,
        onError: handleOnError,
        defaultLoading: true,
    });

    const runRequest = (requestPageIndex: number, otherParams?: any) => {
        umiRequest.run({
            params: {
                pageIndex: requestPageIndex,
                take: params?.take || SIZE_LOADING_LIMIT,
                ...otherParams,
            },
            cancelToken: source.token,
        });
    };

    /**
     * Actions
     */
    const onRefresh = () => {
        setRefreshing(true);
    };

    const onLoadMore = () => {
        if (!noMore) {
            setLoadingMore(true);
            setPageIndex(pageIndex + 1);
        }
    };

    /**
     * Use of hook
     */
    useEffect(() => {
        if (refreshing) {
            setPageIndex(1);
            runRequest(1, params);
        }
    }, [refreshing]);

    useEffect(() => {
        if (pageIndex > 1) {
            setLoadingMore(true);
        }
        if (pageIndex > 0) {
            runRequest(pageIndex, params);
        }
    }, [pageIndex]);

    useEffect(() => {
        if (!umiRequest.loading) {
            onRefresh();
        }
    }, [params]);

    useUnmount(() => {
        source.cancel('useEffect cleanup...');
    });

    return {
        ...umiRequest,
        list,
        noMore,
        refreshing,
        loadingMore,
        error,
        onRefresh,
        onLoadMore,
        setParams,
        setList,
    };
};

export default usePaging;
