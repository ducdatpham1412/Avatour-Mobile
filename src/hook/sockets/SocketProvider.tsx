import {useAppSelector} from 'app-redux/store';
import {SOCKET_EVENT, TYPE_NOTIFICATION} from 'asset/enum';
import {showLocalNotification} from 'hook/notifications';
import useEstimatesAndJoinings from 'hook/useEstimatesAndJoinings';
import {ReactNode, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import SocketManager from './SocketManager';

interface Props {
  children: ReactNode;
}

const SocketUser = ({children}: Props) => {
  const {t} = useTranslation();
  const {token} = useAppSelector(state => state.logicSlice);
  const {socketOn, socketOff, authenticate, close} =
    SocketManager.getInstance();
  const {mutate} = useEstimatesAndJoinings();
  const oldToken = useRef<string>('');

  useEffect(() => {
    if (token) {
      if (__DEV__) {
        if (oldToken.current !== token) {
          oldToken.current = token;
          authenticate(token);
        }
      } else {
        authenticate(token);
      }
    }
  }, [token]);

  useEffect(() => {
    socketOn(SOCKET_EVENT.joinSuccess, async ({sale_id}) => {
      await mutate();
      showLocalNotification(TYPE_NOTIFICATION.joinSuccess, {
        title: t('profile.joinedSuccess'),
        content: t('profile.goToSeeJoins'),
        data: {
          saleId: sale_id,
        },
      });
    });
    socketOn(SOCKET_EVENT.haveNewJoin, async () => {
      /**
       * TO DO: Handle when have new join
       */
    });

    return () => {
      if (!__DEV__) {
        // Only close in release to avoid close when running debug each time refreshing code
        close();
      }
      socketOff(SOCKET_EVENT.joinSuccess);
    };
  }, []);

  return <>{children}</>;
};

const SocketProvider = ({children}: Props) => {
  const {modeExp} = useAppSelector(state => state.accountSlice);

  if (modeExp) {
    return <>{children}</>;
  }

  return <SocketUser>{children}</SocketUser>;
};

export default SocketProvider;
