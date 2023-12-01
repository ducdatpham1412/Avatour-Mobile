import {SOCKET_EVENT} from 'asset/enum';
import Config from 'asset/env';
import {SocketEmitList, SocketOnList} from 'navigation/config';
import io, {Socket} from 'socket.io-client';
import {logger} from 'utility/assistant';

// const socketDev = isIOS ? Config.API_SOCKET : 'http://10.0.2.2:3000';
const socketDev = Config.API_SOCKET;
const socketProduction = Config.API_SOCKET;
const socketUrl = __DEV__ ? socketDev : socketProduction;

class SocketManager {
  static instance: SocketManager | undefined;

  private socket: Socket | undefined;

  private checkInstance = () => {
    const instance = SocketManager.instance;
    if (!instance?.socket) {
      throw new Error('Socket not init');
    }
    return SocketManager.instance;
  };

  static getInstance = () => {
    if (SocketManager.instance) {
      return SocketManager.instance;
    }
    SocketManager.instance = new SocketManager();
    SocketManager.instance.socket = io(socketUrl, {
      transports: ['websocket'],
      timeout: 2000,
    });
    SocketManager.instance.socket?.on('connect', () => {
      logger('Socket connected');
    });
    return SocketManager.instance;
  };

  public close = () => {
    const instance = this.checkInstance();
    instance?.socket?.close();
    SocketManager.instance = undefined;
  };

  public authenticate = (token: string) => {
    const instance = this.checkInstance();
    instance?.socket?.emit(SOCKET_EVENT.authenticate, {
      token,
    });
  };

  public socketOn = <T extends SOCKET_EVENT>(
    event: T,
    callBack: (
      data: T extends keyof SocketOnList ? SocketOnList[T] : undefined,
    ) => void,
  ) => {
    const instance = this.checkInstance();
    instance?.socket?.on(event, callBack as any);
  };

  public socketOff = <T extends SOCKET_EVENT>(event: T) => {
    const instance = this.checkInstance();
    instance?.socket?.off(event);
  };

  public socketEmit = <T extends SOCKET_EVENT>(
    event: T,
    data: T extends keyof SocketEmitList ? SocketEmitList[T] : undefined,
  ) => {
    const instance = this.checkInstance();
    instance?.socket?.emit(event, data);
  };
}

export default SocketManager;

// const useSocketManager = () => {
//   const socket = SocketManager.getInstance();

//   const {trigger: authenticate} = useSWRMutation(
//     'socket.restart',
//     (_, {arg}: {arg: string}) => {
//       socket.authenticate(arg);
//     },
//   );

//   const {trigger: close} = useSWRMutation('socket.restart', () => {
//     socket.close();
//   });

//   const emit = (event: string, data?: any) => {
//     socket.emit(event, data);

//   };

//   const on = (event: string, data?: any) => {
//     socket.
//   }

//   return {
//     authenticate,
//     close,
//     emit,
//   };
// };

// export default useSocketManager;

/** ----------------------------------
 * HELPER FUNCTION
 * -----------------------------------
 */
// export const startChatTag = (conversation: TypeConversationRequest) => {
//   const {token} = FindmeStore.getState().logicSlice;
//   socket?.emit(SOCKET_EVENT.createChatTag, {
//     token,
//     conversation,
//   });
// };

// export const socketTyping = (params: TypingResponse) => {
//   socket?.emit(SOCKET_EVENT.typing, params);
// };
// export const socketUnTyping = (params: TypingResponse) => {
//   socket?.emit(SOCKET_EVENT.unTyping, params);
// };

// export const socketAddComment = (params: TypeSocketCommentRequest) => {
//   socket?.emit(SOCKET_EVENT.addComment, params);
// };

// export const socketJoinRoom = (roomId: string) => {
//   socket?.emit(SOCKET_EVENT.joinRoom, roomId);
// };

// export const socketLeaveRoom = (roomId: string) => {
//   socket?.emit(SOCKET_EVENT.leaveRoom, roomId);
// };

// export const closeSocket = () => {
//   SocketClass.close();
// };
