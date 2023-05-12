import Haptic from 'react-native-haptic-feedback';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const impactLight = () => {
  Haptic.trigger('impactLight', options);
};

export const impactMedium = () => {
  Haptic.trigger('impactMedium', options);
};
