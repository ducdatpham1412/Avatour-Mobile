const useSocketNotifications = () => {
  // const {list, setList, onRefresh, onLoadMore, refreshing} = usePaging({
  //     request: apiGetListNotifications,
  //     params: {
  //       take: 30,
  //     },
  //   });
  //   const hearingSocket = () => {
  //     socket?.off(SOCKET_EVENT.notification);
  //     socket.on(SOCKET_EVENT.notification, (data: TypeNotificationResponse) => {
  //       setList((preValue: Array<TypeNotificationResponse>) => {
  //         return [data].concat(preValue);
  //       });
  //       const {numberNewNotifications} = FindmeStore.getState().logicSlice;
  //       Redux.setNumberNewNotifications(numberNewNotifications + 1);
  //     });
  //   };
  //   useEffect(() => {
  //     hearingSocket();
  //   }, []);
  //   return {
  //     list,
  //     setList,
  //     onRefresh,
  //     refreshing,
  //     onLoadMore,
  //   };

  return [
    {list: [], refreshing: false},
    {setList: () => null, onRefresh: () => null, onLoadMore: () => null},
  ];
};

export default useSocketNotifications;
