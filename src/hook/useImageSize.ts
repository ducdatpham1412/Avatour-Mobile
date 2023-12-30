import {Image} from 'react-native';
import useSWR from 'swr';

type ImageResponse = {
  width: number;
  height: number;
};

const useImageSize = (url: string) => {
  const {data, error, isLoading} = useSWR(
    [url, 'system.getImageSize'],
    async () => {
      const res: ImageResponse = await new Promise((resolve, reject) => {
        Image.getSize(
          url,
          (width, height) => {
            resolve({
              width,
              height,
            });
          },
          err => {
            reject(err);
          },
        );
      });

      return res;
    },
  );

  return {
    imgSize: data,
    loading: isLoading,
    error,
  };
};

export default useImageSize;
