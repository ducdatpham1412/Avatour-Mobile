import {horizontalPadding} from 'asset/metrics';
import {levelModalScheduleHeight} from 'feature/discovery/DetailTour';
import {LoadingScreen} from 'feature/profile/screens';
import {useTheme} from 'hook';
import {goBack} from 'navigation/NavigationService';
import React, {ReactNode} from 'react';
import {View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {verticalScale} from 'utility/scale';
import {StyleWebView} from './base';
import ButtonBack from './common/ButtonBack';

interface Props {
  children?: ReactNode;
  onGoBack?: () => void;
  onChangeModalHeight?: (value: number) => void;
  onTouchEnd?: () => void;
}

const MapTour = ({
  children,
  onGoBack,
  onChangeModalHeight,
  onTouchEnd,
}: Props) => {
  const {top} = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <View style={[$container, {backgroundColor: theme.white}]}>
      <StyleWebView
        source={{
          html: `
         <body style="padding: 0px" >
         <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.894616730539!2d105.83005863970548!3d21.036902244819093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135aba15ec15d17%3A0x620e85c2cfe14d4c!2zTMSDbmcgQ2jhu6cgdOG7i2NoIEjhu5MgQ2jDrSBNaW5o!5e0!3m2!1svi!2s!4v1690533548766!5m2!1svi!2s" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
         </body>
          `,
        }}
        pullToRefreshEnabled={false}
        onTouchMove={e => {
          if (e.nativeEvent.touches.length === 2) {
            onChangeModalHeight?.(levelModalScheduleHeight.low);
          }
        }}
        onTouchEnd={onTouchEnd}
        renderLoading={() => (
          <LoadingScreen
            containerStyle={{
              paddingTop: top + verticalScale(100),
              justifyContent: 'flex-start',
            }}
          />
        )}
      />

      <ButtonBack
        containerStyle={[
          $iconX,
          {
            top: top || verticalScale(3),
            backgroundColor: theme.white,
            shadowColor: theme.black,
          },
        ]}
        onPress={onGoBack ?? goBack}
      />
      {children}
    </View>
  );
};

const $container: ViewStyle = {
  flex: 1,
};
const $iconX: ViewStyle = {
  left: horizontalPadding,
  right: undefined,
};

export default MapTour;
