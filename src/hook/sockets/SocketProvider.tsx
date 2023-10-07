import {useAppSelector} from 'app-redux/store';
import {SOCKET_EVENT, TYPE_EVENT_DL} from 'asset/enum';
import useEstimatesAndJoinings from 'hook/useEstimatesAndJoinings';
import {showLocalNotification} from 'hook/useNotifications';
import {Fragment, createElement, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {renderDeepLink} from 'utility/assistant';
import SocketManager from './SocketManager';

const SocketUser = () => {
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
      showLocalNotification({
        title: t('profile.joinedSuccess'),
        content: t('profile.goToSeeJoins'),
        data: {
          link: renderDeepLink({
            event: TYPE_EVENT_DL.join_success,
            params: {
              sale_id,
            },
          }),
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

  return null;
};

const SocketProvider = () => {
  const {modeExp} = useAppSelector(state => state.accountSlice);

  return createElement(modeExp ? Fragment : SocketUser);
};

export default SocketProvider;
