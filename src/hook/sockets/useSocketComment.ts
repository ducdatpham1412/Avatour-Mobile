interface ParamSocketComment {
  bubbleFocusingId: string;
  setTotalComments(value: any): void;
  increaseTotalComments(value: number): void;
  myId: number;
  scrollToIndex(value: number): void;
  scrollToEnd(): void;
  clearText(): void;
}

const useSocketComment = () => {
  // const {
  //     bubbleFocusingId,
  //     // setTotalComments,
  //     increaseTotalComments,
  //     myId,
  //     scrollToIndex,
  //     clearText,
  //     scrollToEnd,
  //   } = params;
  //   const {list, setList, refreshing, onRefresh, onLoadMore} = usePaging({
  //     request: apiGetListComments,
  //     params: {
  //       postId: bubbleFocusingId,
  //     },
  //   });
  //   const hearingSocket = () => {
  //     socket?.off(SOCKET_EVENT.addComment);
  //     socket.on(SOCKET_EVENT.addComment, (data: TypeSocketCommentResponse) => {
  //       if (data.commentReplied) {
  //         // setList(preValue =>
  //         //     preValue.map((item, index) => {
  //         //         if (item.id !== data.commentReplied) {
  //         //             return item;
  //         //         }
  //         //         if (data.data.creator === myId) {
  //         //             scrollToIndex(index);
  //         //             clearText();
  //         //         }
  //         //         return {
  //         //             ...item,
  //         //             listCommentsReply:
  //         //                 item.listCommentsReply?.concat(data.data),
  //         //         };
  //         //     }),
  //         // );
  //         Redux.setBubblePalaceAction({
  //           action: TYPE_BUBBLE_PALACE_ACTION.addReplyComment,
  //           payload: data,
  //         });
  //         if (data.data.creator === myId) {
  //           const indexScroll = list.findIndex(
  //             item => item.id === data.commentReplied,
  //           );
  //           if (indexScroll >= 0) {
  //             scrollToIndex(indexScroll);
  //           }
  //           clearText();
  //         }
  //       } else {
  //         setList(preValue => preValue.concat(data.data));
  //         if (data.data.creator === myId) {
  //           scrollToEnd();
  //           clearText();
  //         }
  //       }
  //       increaseTotalComments(1);
  //     });
  //   };
  //   useEffect(() => {
  //     // if (bubbleFocusingId) {
  //     //     if (bubbleFocusingId !== oldBubbleFocusingId.current) {
  //     //         setParams({
  //     //             postId: bubbleFocusingId,
  //     //         });
  //     //         socket?.emit(SOCKET_EVENT.joinRoom, bubbleFocusingId);
  //     //         hearingSocket();
  //     //         if (oldBubbleFocusingId.current) {
  //     //             socket?.emit(
  //     //                 SOCKET_EVENT.leaveRoom,
  //     //                 oldBubbleFocusingId.current,
  //     //             );
  //     //         }
  //     //         oldBubbleFocusingId.current = bubbleFocusingId;
  //     //     } else {
  //     //         socket?.emit(SOCKET_EVENT.leaveRoom, bubbleFocusingId);
  //     //         socket?.emit(SOCKET_EVENT.joinRoom, bubbleFocusingId);
  //     //         hearingSocket();
  //     //         setList(cachedListComments.current);
  //     //     }
  //     // }
  //     socket?.emit(SOCKET_EVENT.joinRoom, bubbleFocusingId);
  //     hearingSocket();
  //     return () => {
  //       socket?.emit(SOCKET_EVENT.leaveRoom, bubbleFocusingId);
  //     };
  //   }, [myId, bubbleFocusingId]);
  //   return {
  //     list,
  //     refreshing,
  //     onRefresh,
  //     onLoadMore,
  //   };
};

export default useSocketComment;
