import {Dimensions} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import DeviceInfo from 'react-native-device-info';
import {isIOS} from 'utility/assistant';

const {width, height} = Dimensions.get('screen');
const safeTopAndroid = DeviceInfo.hasNotch()
    ? StaticSafeAreaInsets.safeAreaInsetsTop
    : 0;
const safeTopiOS = StaticSafeAreaInsets.safeAreaInsetsTop;
const safeTopPadding = isIOS ? safeTopiOS : safeTopAndroid;
const safeBottomPadding = isIOS ? StaticSafeAreaInsets.safeAreaInsetsBottom : 0;
const safeLeftPadding = StaticSafeAreaInsets.safeAreaInsetsLeft;
const safeRightPadding = StaticSafeAreaInsets.safeAreaInsetsRight;
const contentSafeTop = safeTopPadding + moderateScale(45); // 45 is height of tab bar up
const tabBarUp = moderateScale(45);

export const Metrics = {
    width,
    height,
    safeTopPadding,
    safeBottomPadding,
    safeLeftPadding,
    safeRightPadding,
    contentSafeTop,
    tabBarUp,
};
