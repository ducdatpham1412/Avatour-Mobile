import {useAppSelector} from 'app-redux/store';
import {APP_EVENT, SOCKET_EVENT, TYPE_EVENT_DL} from 'asset/enum';
import {emitAppEvent} from 'hook/useAppEvent';
import useEstimatesAndJoinings from 'hook/useEstimatesAndJoinings';
import {showLocalNotification} from 'hook/useNotifications';
import {Fragment, createElement, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {logger, renderDeepLink} from 'utility/assistant';
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
    /**
     * @Tag Config handle notification
     */
    socketOn(SOCKET_EVENT.joinSuccess, async e => {
      mutate().catch(logger);
      emitAppEvent(APP_EVENT.refreshNotification);
      showLocalNotification({
        title: t('profile.joinedSuccess'),
        content: t('profile.goToSeeJoins'),
        data: {
          link: renderDeepLink(TYPE_EVENT_DL.join_success, {
            join_id: e.join_id,
          }),
        },
      });
    });

    socketOn(SOCKET_EVENT.joinRejected, async e => {
      mutate().catch(logger);
      emitAppEvent(APP_EVENT.refreshNotification);
      showLocalNotification({
        title: t('notification.title'),
        content: t('discovery.shopNotReceiveOrderNow'),
        data: {
          link: renderDeepLink(TYPE_EVENT_DL.join_rejected, {
            join_id: e.join_id,
          }),
        },
      });
    });

    socketOn(SOCKET_EVENT.haveNewJoin, async e => {
      emitAppEvent(APP_EVENT.refreshNotification);
      showLocalNotification({
        title: t('notification.title'),
        content: t('notification.haveNewOrder'),
        data: {
          link: renderDeepLink(TYPE_EVENT_DL.has_new_join, {
            join_id: e.join_id,
          }),
        },
      });
    });

    return () => {
      if (!__DEV__) {
        // Only close in release to avoid close when running debug each time refreshing code
        close();
      }
      socketOff(SOCKET_EVENT.joinSuccess);
      socketOff(SOCKET_EVENT.haveNewJoin);
    };
  }, []);

  return null;
};

const SocketProvider = () => {
  const {modeExp} = useAppSelector(state => state.accountSlice);

  return createElement(modeExp ? Fragment : SocketUser);
};

export default SocketProvider;
