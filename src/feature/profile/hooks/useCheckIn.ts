import {apiGetListCheckIn} from 'api/profile';
import request from 'api/request';
import {usePagingV2} from 'hook';
import useSWRMutation from 'swr/mutation';

type CheckInRequest = {
  user_id: number;
  content: string;
  images: string[];
  stars?: number;
  feeling?: number;
};

type CheckInResponse = {
  id: number;
};

const useCheckIn = (type: GetCheckInParams['type'], userId?: number) => {
  const [
    {data, loading, refreshing, loadingMore},
    {onRefresh, onLoadMore, mutate},
  ] = usePagingV2({
    api: apiGetListCheckIn,
    nullable: !userId,
    params: {
      user_id: userId ?? 0,
      type,
    },
  });

  const {trigger: checkIn, isMutating: loadingCheckIn} = useSWRMutation(
    'api.checkIn',
    async (_, {arg: params}: {arg: CheckInRequest}) => {
      const payload = new FormData();

      payload.append('user_id', params.user_id);
      payload.append('content', params.content);
      if (params.images.length) {
        params.images.forEach(path => {
          const formatImage = {
            uri: path,
            type: 'image/jpeg',
            name: 'avatar',
          };
          payload.append('images', formatImage);
        });
      }
      if (params.stars !== undefined) {
        payload.append('stars', params.stars);
      }
      if (params.feeling !== undefined) {
        payload.append('feeling', params.feeling);
      }

      const res: CheckInResponse = await request.post(
        '/profile/check-in',
        payload,
      );
      return res;
    },
  );

  return [
    {data, loading, refreshing, loadingMore, loadingCheckIn},
    {checkIn, onRefresh, onLoadMore, mutate},
  ] as const;
};

export default useCheckIn;
