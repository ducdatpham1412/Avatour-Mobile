import {useMemo} from 'react';
import useSWRInfinite from 'swr/infinite';
import ImageUploader from 'utility/ImageUploader';

const useLibrary = () => {
  const {data, setSize, size, isLoading, isValidating} = useSWRInfinite(
    index => {
      // if (!preData.hasNext && index > 0) {
      //   return null;
      // }
      return [index, 'system.getLibraryImages'];
    },
    async ([index]) => {
      const res = await ImageUploader.readImageFromLibrary();

      // const endCursor = res.page_info.end_cursor;
      // const hasNext = res.page_info.has_next_page;
      // const moreImages = res.edges.map(item => {
      //   if (isIOS) {
      //     return item.node.image.uri.concat(`/${item.node.image.filename}`);
      //   }
      //   return item.node.image.uri;
      // });

      return {
        imgs: res,
        index,
      };
    },
    {
      persistSize: true,
      revalidateFirstPage: false,
    },
  );

  const list: LibraryImage[] = useMemo(() => {
    return (
      data?.reduce((pre, cur) => {
        return pre.concat(cur.imgs);
      }, [] as LibraryImage[]) ?? []
    );
  }, [data]);

  const onRefresh = () => {
    setSize(1);
  };

  const onLoadMore = () => {
    // setSize(pre => pre + 1);
  };

  return [
    {
      list,
      loading: isLoading,
      validating: isValidating,
      loadingMore: isValidating && size > 1,
    },
    {onRefresh, onLoadMore},
  ] as const;
};

export default useLibrary;
