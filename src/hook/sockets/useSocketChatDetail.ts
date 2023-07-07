import {apiDeleteMessage} from 'api/conversation';
import {MESSAGE_TYPE} from 'asset/enum';
import {ModalAlert} from 'navigation/screen/modals';

const listMessageEvents = [
  MESSAGE_TYPE.changeColor,
  MESSAGE_TYPE.changeName,
  MESSAGE_TYPE.joinCommunity,
];

const deleteMessage = async (idMessage: string) => {
  try {
    await apiDeleteMessage(idMessage);
  } catch (err) {
    ModalAlert.error({
      content: err,
    });
  }
};

const useSocketChatDetail = () => {
  //   const chatTagFocusing = Redux.getChatTagFocusing();
  //   const myId = Redux.getPassport().profile.id;
  //   const {list, setList, refreshing, onRefresh, onLoadMore} = usePaging({
  //     request: apiGetListMessages,
  //     params: {
  //       chatTagId: chatTagFocusing,
  //       take: 30,
  //     },
  //   });
  //   const hearingSocket = () => {
  //     socket?.off(SOCKET_EVENT.message);
  //     socket.on(SOCKET_EVENT.message, (data: TypeChatMessageResponse) => {
  //       const isFocusingThisChatTag = data.conversationId === chatTagFocusing;
  //       if (isFocusingThisChatTag) {
  //         if (data.creator === myId) {
  //           setList((previousMessages: Array<TypeChatMessageResponse>) => {
  //             if (listMessageEvents.includes(data.type)) {
  //               const temp: TypeChatMessageResponse = {
  //                 ...data,
  //                 tag: undefined,
  //                 relationship: RELATIONSHIP.self,
  //               };
  //               return [temp].concat(previousMessages);
  //             }
  //             return previousMessages.map(item => {
  //               if (item?.tag !== data?.tag) {
  //                 return item;
  //               }
  //               return {
  //                 ...data,
  //                 tag: undefined,
  //                 relationship: RELATIONSHIP.self,
  //               };
  //             });
  //           });
  //           // We'll take after this problem
  //           // Because if sender is me, not need to send socket "seenMessage" any more, only need set userData in local
  //           // if (params.isMyChatTag) {
  //           //     socket?.emit(SOCKET_EVENT.seenMessage, {
  //           //         myId,
  //           //         conversationId: data.conversationId,
  //           //     });
  //           // }
  //         }
  //         // if senderId not me, set messages
  //         else if (data.creator !== myId) {
  //           setList((previousMessages: Array<TypeChatMessageResponse>) => {
  //             const temp: TypeChatMessageResponse = {
  //               ...data,
  //               tag: undefined,
  //               relationship: RELATIONSHIP.notKnow,
  //             };
  //             return [temp].concat(previousMessages);
  //           });
  //         }
  //       }
  //       // reorder list chat tag, set it to first
  //       params.setListChatTags((previousChatTags: Array<TypeChatTagResponse>) => {
  //         let indexNeedToReorder = 0;
  //         const temp = previousChatTags.map((item, index) => {
  //           if (item.id !== data.conversationId) {
  //             return item;
  //           }
  //           const latestMessage =
  //             typeof data.content === 'string' ? data.content : 'Image';
  //           indexNeedToReorder = index;
  //           return {
  //             ...item,
  //             modified: data.created,
  //             latestMessage,
  //           };
  //         });
  //         if (indexNeedToReorder > 0) {
  //           return reorderListChatTag(temp, indexNeedToReorder);
  //         }
  //         return temp;
  //       });
  //       if (isFocusingThisChatTag) {
  //         socket?.emit(SOCKET_EVENT.seenMessage, {
  //           myId,
  //           conversationId: data.conversationId,
  //         });
  //       }
  //     });
  //     socket?.off(SOCKET_EVENT.deleteMessage);
  //     socket.on(SOCKET_EVENT.deleteMessage, (data: TypeDeleteMessageResponse) => {
  //       if (data.conversationId === chatTagFocusing) {
  //         setList((previousMessages: Array<TypeChatMessageResponse>) => {
  //           return previousMessages.filter(item => item.id !== data.messageId);
  //         });
  //       }
  //     });
  //   };
  //   useEffect(() => {
  //     hearingSocket();
  //   }, [chatTagFocusing, myId]);
  //   const sendMessage = async (_params: TypeChatMessageSend) => {
  //     const newMessage: TypeChatMessageResponse = {
  //       id: _params.tag,
  //       conversationId: _params.conversationId,
  //       type: _params.type,
  //       content: _params.content,
  //       creator: _params.creator,
  //       creatorName: _params.creatorName,
  //       creatorAvatar: _params.creatorAvatar,
  //       created: undefined,
  //       tag: _params.tag,
  //       relationship: RELATIONSHIP.self,
  //     };
  //     setList((previousMessages: Array<TypeChatMessageResponse>) => {
  //       return [newMessage].concat(previousMessages);
  //     });
  //     if (_params.type === MESSAGE_TYPE.image) {
  //       const arrayImages: any = _params.content;
  //       try {
  //         const messImages = await ImageUploader.upLoadManyImg(arrayImages, 1080);
  //         _params.content = messImages;
  //         socket?.emit(SOCKET_EVENT.message, _params);
  //       } catch (err) {
  //         ModalAlert.error({
  //           content: err,
  //         });
  //       }
  //     } else {
  //       socket?.emit(SOCKET_EVENT.message, _params);
  //     }
  //   };
  //   return {
  //     messages: list,
  //     sendMessage,
  //     deleteMessage,
  //     refreshing,
  //     onRefresh,
  //     onLoadMore,
  //   };
};

export default useSocketChatDetail;
