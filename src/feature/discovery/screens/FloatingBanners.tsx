import {useAppSelector} from 'app-redux/store';
import {BORDER_RADIUS, FONT_SIZE} from 'asset';
import Images from 'asset/img/images';
import {Metrics, horizontalPadding} from 'asset/metrics';
import {SquareButton, StyleIcon, StyleText} from 'components/base';
import {ButtonX} from 'components/common';
import {useTheme} from 'hook';
import React, {useEffect, useState} from 'react';
import {Linking, StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {getVersion} from 'react-native-device-info';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {$styleAllShadow, logger} from 'utility/assistant';
import {impactMedium} from 'utility/haptic';
import {moderateScale, scale, verticalScale} from 'utility/scale';

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
}

type UpdateProps = {
  onClose: () => void;
};

const Update = ({onClose}: UpdateProps) => {
  const theme = useTheme();
  const {download_link} = useAppSelector(state => state.logicSlice.resource);
  const aim = useSharedValue(0);

  const containerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(aim.value, [0, 1], [0, 1]);
    const translateY = interpolate(aim.value, [0, 1], [100, 0]);

    return {
      opacity,
      transform: [{translateY}],
    };
  }, []);

  useEffect(() => {
    aim.value = withTiming(
      1,
      {
        duration: 800,
      },
      () => {
        runOnJS(impactMedium)();
      },
    );
  }, [aim]);

  return (
    <Animated.View
      style={[
        $update,
        $styleAllShadow,
        containerStyle,
        {backgroundColor: theme.white, shadowOpacity: 0.4},
      ]}>
      <View style={$updateTop}>
        <View
          style={[
            $notification,
            {
              backgroundColor: theme.p_200,
            },
          ]}>
          <StyleIcon
            source={Images.icons.notification}
            size={20}
            customStyle={{tintColor: theme.p_700}}
          />
        </View>
        <View style={$content}>
          <StyleText i18Text="discovery.haveUpdateNow" customStyle={$title} />
          <StyleText
            i18Text="discovery.updateForBestExp"
            customStyle={$contentUpdate}
          />
        </View>
      </View>

      <SquareButton
        title="discovery.downloadLatest"
        containerStyle={[$btnDownload, {backgroundColor: theme.p_600}]}
        titleStyle={{color: theme.white, fontWeight: 'bold'}}
        onPress={() => {
          Linking.openURL(download_link).catch(logger);
        }}
      />

      <ButtonX
        size={20}
        onPress={() => {
          aim.value = withTiming(
            0,
            {
              duration: 500,
            },
            () => {
              runOnJS(onClose)();
            },
          );
        }}
      />
    </Animated.View>
  );
};

const FloatingBanners = ({containerStyle}: Props) => {
  const {latest_version} = useAppSelector(state => state.logicSlice.resource);
  const currentVersion = getVersion();
  const [show, setShow] = useState(true);

  const hasUpdate = currentVersion !== latest_version;

  if (!show) {
    return null;
  }

  return (
    <View style={[$container, containerStyle]}>
      {hasUpdate && <Update onClose={() => setShow(false)} />}
    </View>
  );
};

const $container: ViewStyle = {
  width: Metrics.width - 2 * horizontalPadding,
  alignSelf: 'center',
};
const $update: ViewStyle = {
  width: '100%',
  paddingHorizontal: scale(16),
  paddingVertical: verticalScale(16),
  borderRadius: BORDER_RADIUS.f2,
};
const $updateTop: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  paddingRight: scale(30),
  gap: scale(16),
};
const $content: ViewStyle = {
  flex: 1,
};
const $title: TextStyle = {
  fontWeight: 'bold',
};
const $contentUpdate: TextStyle = {
  fontSize: FONT_SIZE.f4,
  marginTop: verticalScale(2),
};
const $notification: ViewStyle = {
  alignSelf: 'flex-start',
  padding: moderateScale(10),
  borderRadius: 30,
};
const $btnDownload: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(12),
  alignSelf: 'center',
};

export default FloatingBanners;
