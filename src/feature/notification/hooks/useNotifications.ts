import {apiGetListNotifications, apiReadNotification} from 'api/notification';
import {useAppSelector} from 'app-redux/store';
import {STATUS_NOTIFICATION} from 'asset/enum';
import {usePaging} from 'hook';
import useSWRMutation from 'swr/mutation';

const nullRequest = async () => {
  return [];
};

const useNotifications = () => {
  const {modeExp} = useAppSelector(state => state.accountSlice);

  const {
    list,
    setList,
    loadingMore,
    refreshing,
    onRefresh,
    onLoadMore,
    initLoading,
  } = usePaging<TypeNotification>({
    request: modeExp ? nullRequest : apiGetListNotifications,
    params: {
      take: 30,
    },
  });

  const {trigger: readNotification} = useSWRMutation(
    'api.readNotifications',
    async (_, {arg: notificationId}: {arg: number}) => {
      await apiReadNotification(notificationId);
      setList(pre => {
        return pre.map(item => {
          if (item.id !== notificationId) {
            return item;
          }
          return {
            ...item,
            status: STATUS_NOTIFICATION.read,
          };
        });
      });
    },
  );

  return [
    {list, initLoading, loadingMore, refreshing, readNotification},
    {setList, onRefresh, onLoadMore, readNotification},
  ] as const;
};

export default useNotifications;
