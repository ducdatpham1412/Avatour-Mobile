const useSocketConversations = () => {
  //   const listChatTags = Redux.getListChatTag();
  //   const myId = Redux.getPassport().profile.id;
  //   const token = Redux.getToken();

  //   const {list, setList, refreshing, onRefresh, onLoadMore} = usePaging({
  //     request: apiGetListConversations,
  //     params: {
  //       take: 20,
  //     },
  //   });

  //   const hearingSocket = () => {
  //     socket?.off(SOCKET_EVENT.createChatTag);
  //     socket?.on(SOCKET_EVENT.createChatTag, (data: TypeChatTagResponse) => {
  //       setList((previousChatTags: Array<TypeChatTagResponse>) => {
  //         return [data].concat(previousChatTags);
  //       });
  //       socket?.emit(SOCKET_EVENT.joinRoom, data.id);
  //     });

  //     socket?.off(SOCKET_EVENT.seenMessage);
  //     socket.on(SOCKET_EVENT.seenMessage, (data: TypeSeenMessageResponse) => {
  //       setList((previousChatTags: Array<TypeChatTagResponse>) => {
  //         return previousChatTags.map(item => {
  //           if (item.id !== data.conversationId) {
  //             return item;
  //           }
  //           return {
  //             ...item,
  //             userData: {
  //               ...item.userData,
  //               ...data.data,
  //             },
  //           };
  //         });
  //       });
  //     });

  //     socket?.off(SOCKET_EVENT.changeChatName);
  //     socket.on(
  //       SOCKET_EVENT.changeChatName,
  //       (data: TypeChangeGroupNameResponse) => {
  //         let indexNeedToReorder = -1;
  //         setList((previousChatTags: Array<TypeChatTagResponse>) => {
  //           const temp = previousChatTags.map((item, index) => {
  //             if (item.id !== data.conversationId) {
  //               return item;
  //             }
  //             indexNeedToReorder = index;
  //             return {
  //               ...item,
  //               conversationName: data.name,
  //             };
  //           });

  //           if (indexNeedToReorder > 0) {
  //             const updateList = reorderListChatTag(temp, indexNeedToReorder);
  //             return updateList;
  //           }
  //           return temp;
  //         });

  //         // if not found chat tag in list, call api get that
  //         if (indexNeedToReorder === -1) {
  //           try {
  //             // call api get chat tag with id
  //           } catch (err) {
  //             ModalAlert.error({
  //               content: err,
  //             });
  //           }
  //         }
  //       },
  //     );

  //     socket?.off(SOCKET_EVENT.changeChatColor);
  //     socket.on(SOCKET_EVENT.changeChatColor, (data: TypeChangeChatColor) => {
  //       let indexNeedToReorder = -1;
  //       setList((previousChatTags: Array<TypeChatTagResponse>) => {
  //         const temp = previousChatTags.map((item, index) => {
  //           if (item.id !== data.conversationId) {
  //             return item;
  //           }
  //           indexNeedToReorder = index;
  //           return {
  //             ...item,
  //             color: data.color,
  //           };
  //         });

  //         if (indexNeedToReorder > 0) {
  //           const updateList = reorderListChatTag(temp, indexNeedToReorder);
  //           return updateList;
  //         }
  //         return temp;
  //       });

  //       // if not found chat tag in list, call api get that
  //       if (indexNeedToReorder === -1) {
  //         try {
  //           // call api get chat tag with id
  //         } catch (err) {
  //           ModalAlert.error({
  //             content: err,
  //           });
  //         }
  //       }
  //     });

  //     // block, stop chat
  //     socket?.off(SOCKET_EVENT.isBlocked);
  //     socket.on(SOCKET_EVENT.isBlocked, (data: Array<string>) => {
  //       setList((previousChatTags: Array<TypeChatTagResponse>) => {
  //         return previousChatTags.map(item => {
  //           if (!data.includes(item.id)) {
  //             return item;
  //           }
  //           return {
  //             ...item,
  //             isBlocked: true,
  //           };
  //         });
  //       });
  //     });
  //     socket?.off(SOCKET_EVENT.unBlocked);
  //     socket.on(SOCKET_EVENT.unBlocked, (data: Array<string>) => {
  //       setList((previousChatTags: Array<TypeChatTagResponse>) => {
  //         return previousChatTags.map(item => {
  //           if (!data.includes(item.id)) {
  //             return item;
  //           }
  //           return {
  //             ...item,
  //             isBlocked: false,
  //           };
  //         });
  //       });
  //     });

  //     socket?.off(SOCKET_EVENT.stopConversation);
  //     socket.on(SOCKET_EVENT.stopConversation, (chatTagId: string) => {
  //       setList((previousChatTags: Array<TypeChatTagResponse>) => {
  //         return previousChatTags.map(item => {
  //           if (item.id !== chatTagId) {
  //             return item;
  //           }
  //           return {
  //             ...item,
  //             status: CONVERSATION_STATUS.stop,
  //           };
  //         });
  //       });
  //     });

  //     socket?.off(SOCKET_EVENT.openConversation);
  //     socket.on(SOCKET_EVENT.openConversation, (chatTagId: string) => {
  //       setList((previousChatTags: Array<TypeChatTagResponse>) => {
  //         return previousChatTags.map(item => {
  //           if (item.id !== chatTagId) {
  //             return item;
  //           }
  //           return {
  //             ...item,
  //             status: CONVERSATION_STATUS.active,
  //           };
  //         });
  //       });
  //     });

  //     socket?.off(SOCKET_EVENT.typing);
  //     socket.on(SOCKET_EVENT.typing, (data: TypingResponse) => {
  //       setList((previousChatTags: Array<TypeChatTagResponse>) => {
  //         return previousChatTags.map(item => {
  //           if (item.id !== data.conversationId) {
  //             return item;
  //           }
  //           let userTyping: Array<number> = [];
  //           if (item.userTyping) {
  //             // check user had is list or not
  //             const index = item.userTyping.findIndex(
  //               typing => typing === data.userId,
  //             );
  //             if (index >= 0) {
  //               userTyping = item.userTyping;
  //             } else {
  //               userTyping = item.userTyping.concat(data.userId);
  //             }
  //           } else {
  //             userTyping = [data.userId];
  //           }
  //           return {
  //             ...item,
  //             userTyping,
  //           };
  //         });
  //       });
  //     });

  //     socket?.off(SOCKET_EVENT.unTyping);
  //     socket.on(SOCKET_EVENT.unTyping, (data: TypingResponse) => {
  //       setList((previousChatTags: Array<TypeChatTagResponse>) => {
  //         return previousChatTags.map(item => {
  //           if (item.id !== data.conversationId || !item.userTyping) {
  //             return item;
  //           }
  //           const userTyping = item.userTyping.filter(
  //             typingId => typingId !== data.userId,
  //           );
  //           return {
  //             ...item,
  //             userTyping,
  //           };
  //         });
  //       });
  //     });

  //     // message, when have not yet to chat detail
  //     socket?.off(SOCKET_EVENT.message);
  //     socket?.on(SOCKET_EVENT.message, (data: TypeChatMessageResponse) => {
  //       setList((previousChatTag: Array<TypeChatTagResponse>) => {
  //         let indexNeedToReorder = 0;

  //         const temp = previousChatTag.map((item, index) => {
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
  //           const updateList = reorderListChatTag(temp, indexNeedToReorder);
  //           return updateList;
  //         }
  //         return temp;
  //       });
  //     });
  //   };

  //   const checkDisplayNotification = () => {
  //     let newNumber = 0;
  //     for (let i = 0; i < listChatTags.length; i++) {
  //       if (
  //         isTimeBefore(
  //           listChatTags[i].userData[String(myId)].modified,
  //           listChatTags[i].modified,
  //         )
  //       ) {
  //         newNumber += 1;
  //       }
  //     }
  //     Redux.setNumberNewMessage(newNumber);
  //   };

  //   useEffect(() => {
  //     if (token && socket) {
  //       hearingSocket();
  //     }
  //   }, [token, socket]);

  //   useEffect(() => {
  //     Redux.updateListChatTag(list);
  //   }, [list]);

  //   useEffect(() => {
  //     checkDisplayNotification();
  //   }, [listChatTags, myId]);

  //   const seenMessage = (conversationId: string) => {
  //     socket?.emit(SOCKET_EVENT.seenMessage, {myId, conversationId});
  //   };

  return [{}, {}];
};

export default useSocketConversations;
