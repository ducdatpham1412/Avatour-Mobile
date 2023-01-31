import Config from 'asset/env';
import {Alert} from 'react-native';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import {isIOS, logger} from 'utility/assistant';
import I18Next from 'utility/I18Next';

const messages: any = {
  camera: I18Next.t('alert.permissionCamera'),
  micro: I18Next.t('alert.permissionMicro'),
  photo: I18Next.t('alert.permissionPhoto'),
};
const messagesUnable: any = {
  camera: I18Next.t('alert.permissionCamera'),
  micro: I18Next.t('alert.permissionMicro'),
  photo: I18Next.t('alert.permissionPhoto'),
};

const showRequestPermission = (type: string) => {
  Alert.alert(
    Config.APP_NAME,
    messages[type],
    [
      {
        text: I18Next.t('common.no') || 'No',
        onPress: () => null,
        style: 'default',
      },
      {
        text: I18Next.t('common.yes') || 'Yes',
        onPress: () =>
          openSettings().catch(() => logger('Can not open setting')),
      },
    ],
    {cancelable: false},
  );
};
const showPermissionUnable = (type: string) => {
  Alert.alert(Config.APP_NAME, messagesUnable[type]);
};

/** ----------------------
 *  BOSSES HERE
 */
export const checkCamera = async () => {
  try {
    const checkPermission = await check(
      isIOS ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
    );
    // first time come to app, DENIED
    if (checkPermission === RESULTS.DENIED) {
      const result = await request(
        isIOS ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
      );
      return result === RESULTS.GRANTED;
    }

    // user haven't allowed before, BLOCKED
    if (checkPermission === RESULTS.BLOCKED) {
      showRequestPermission('camera');
      return false;
    }

    // camera is broken
    if (checkPermission === RESULTS.UNAVAILABLE) {
      showPermissionUnable('camera');
      return false;
    }

    return true;
  } catch (err) {
    logger(err);
    return false;
  }
};

export const checkPhoto = async () => {
  try {
    const checkPermission = await check(
      isIOS
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    );
    // first time come to app, DENIED
    if (checkPermission === RESULTS.DENIED) {
      const result = await request(
        isIOS
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      return result === RESULTS.GRANTED;
    }

    // user haven't allowed before, BLOCKED
    if (checkPermission === RESULTS.BLOCKED) {
      showRequestPermission('photo');
      return false;
    }

    // can not access photo library
    if (checkPermission === RESULTS.UNAVAILABLE) {
      showPermissionUnable('photo');
      return false;
    }

    return true;
  } catch (err) {
    logger(err);
    return false;
  }
};

export const checkAudio = async () => {
  try {
    const checkPermission = await check(
      isIOS ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO,
    );
    // first time open app, DENY
    if (checkPermission === RESULTS.DENIED) {
      const result = await request(
        isIOS ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO,
      );
      return result === RESULTS.GRANTED;
    }

    // user haven't allowed before, BLOCKED
    if (checkPermission === RESULTS.BLOCKED) {
      showRequestPermission('audio');
      return false;
    }

    // can not access photo library
    if (checkPermission === RESULTS.UNAVAILABLE) {
      showPermissionUnable('audio');
      return false;
    }

    return true;
  } catch (err) {
    logger(err);
    return false;
  }
};

export const checkSaveImage = async () => {
  try {
    const checkPermission = await check(
      isIOS
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    );
    // first time come to app, DENIED
    if (checkPermission === RESULTS.DENIED) {
      const result = await request(
        isIOS
          ? PERMISSIONS.IOS.PHOTO_LIBRARY
          : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      );
      return result === RESULTS.GRANTED;
    }

    // user haven't allowed before, BLOCKED
    if (checkPermission === RESULTS.BLOCKED) {
      showRequestPermission('photo');
      return false;
    }

    // can not access photo library
    if (checkPermission === RESULTS.UNAVAILABLE) {
      showPermissionUnable('photo');
      return false;
    }

    return true;
  } catch (err) {
    logger(err);
    return false;
  }
};
