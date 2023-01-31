import {TYPE_NOTIFICATION} from 'asset/enum';
import Config from 'asset/env';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {MAIN_SCREEN} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import {useEffect} from 'react';
import OneSignal from 'react-native-onesignal';
import {isIOS, logger} from 'utility/assistant';

const pushTagMember = (userId: number) => {
  OneSignal.sendTag('userId', String(userId));
};
const deleteTagMember = () => {
  OneSignal.deleteTag('userId');
};

const onMoveNavigation = (data: any) => {
  switch (data.type) {
    // case TYPE_NOTIFICATION.newChatTag:
    //     if (data.conversationId) {
    //         Redux.setChatTagFromNotification(data.conversationId);
    //     }
    //     break;
    case TYPE_NOTIFICATION.message:
      if (data.conversationId) {
        Redux.setChatTagFromNotification(data.conversationId);
      }
      break;
    case TYPE_NOTIFICATION.likePost:
      navigate(ROOT_SCREEN.detailBubble, {
        bubbleId: data.bubbleId,
      });
      break;
    case TYPE_NOTIFICATION.follow:
      navigate(MAIN_SCREEN.profileRoute);
      break;
    case TYPE_NOTIFICATION.comment:
      navigate(ROOT_SCREEN.detailBubble, {
        bubbleId: data.bubbleId,
        displayComment: true,
      });
      break;
    default:
      break;
  }
};

export const useNotification = () => {
  const myId = Redux.getPassport().profile.id;

  useEffect(() => {
    try {
      OneSignal.setAppId(Config.ONESIGNAL_KEY);

      OneSignal.addSubscriptionObserver(event => {
        logger('mission sub: ', event);
      });

      // Prompt for push on iOS
      if (isIOS) {
        OneSignal.promptForPushNotificationsWithUserResponse(response => {
          logger('Prompt response:', response);
        });
      }

      // Send tag
      if (myId) {
        pushTagMember(myId);
      } else {
        deleteTagMember();
      }

      // Receive notification
      OneSignal.setNotificationWillShowInForegroundHandler(event => {
        const notification = event.getNotification();
        // const data = notification.additionalData;
        // console.log('additionalData: ', data);
        // Complete with null means don't show a notification.
        event.complete(notification);
      });

      // Handle navigate
      OneSignal.setNotificationOpenedHandler(event => {
        const data: any = event.notification.additionalData;
        onMoveNavigation(data);
      });
    } catch (err) {
      logger(err);
    }

    return () => OneSignal.clearHandlers();
  }, [myId]);
};
