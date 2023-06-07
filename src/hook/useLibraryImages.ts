import useSWRInfinite from 'swr/infinite';
import ImageUploader from 'utility/ImageUploader';
import {isIOS} from 'utility/assistant';

type LibraryResponse = {
  urls: string[];
} & RequestParams;

type RequestParams = {
  endCursor: string | undefined;
  hasNext: boolean;
};

const firstLoad = 40;

const useLibraryImages = () => {
  const {data, setSize, isLoading, isValidating} =
    useSWRInfinite<LibraryResponse>(
      (index, preData: LibraryResponse) => {
        // if (!preData.hasNext && index > 0) {
        //   return null;
        // }
        return [{endCursor: preData?.endCursor}, 'system.getLibraryImages'];
      },
      async ([p]: [RequestParams]) => {
        const res = await ImageUploader.readImageFromLibrary({
          first: firstLoad,
          after: p?.endCursor,
        });

        console.log('Res is: ', res);

        const endCursor = res.page_info.end_cursor;
        const hasNext = res.page_info.has_next_page;
        const moreImages = res.edges.map(item => {
          if (isIOS) {
            return item.node.image.uri.concat(`/${item.node.image.filename}`);
          }
          return item.node.image.uri;
        });

        return {
          urls: moreImages,
          endCursor,
          hasNext,
        };
      },
      {
        persistSize: true,
        revalidateFirstPage: false,
      },
    );

  const list: string[] = [];
  if (data) {
    data?.forEach(item => {
      list.push(...item.urls);
    });
  }

  const onRefresh = () => {
    setSize(1);
  };

  const onLoadMore = () => {
    setSize(pre => pre + 1);
  };

  return {
    list,
    onRefresh,
    onLoadMore,
    loading: isLoading,
    loadingMore: isValidating,
  };
};

export default useLibraryImages;
