import {FONT_SIZE} from 'asset';
import {useTheme} from 'hook';
import {goBack} from 'navigation/NavigationService';
import {ModalAlert} from 'navigation/screen/modals';
import React, {ReactNode} from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {StyleText, StyleWebView} from './base';
import {ButtonX} from './common';

interface Props {
  children?: ReactNode;
}

const MapTour = ({children}: Props) => {
  const {top} = useSafeAreaInsets();
  const theme = useTheme();

  const onGoBack = () => {
    ModalAlert.options({
      i18Content: 'common.wantToDiscard',
      onContinue: goBack,
    });
  };

  return (
    <View style={$map}>
      <StyleWebView
        source={{
          uri: 'https://www.google.com/maps/@21.0228147,105.795678,13z?hl=vi-VN',
        }}
      />
      <View style={[$overlayMap, {backgroundColor: theme.black_opacity(0.6)}]}>
        <View style={[$mapNotification, {marginTop: top}]}>
          <FontAwesome
            name="map-o"
            style={[$iconMap, {color: theme.white_opacity(0.8)}]}
          />
          <StyleText
            i18Text="tour.viewTourOnMapDeveloping"
            customStyle={[$textNotification, {color: theme.white_opacity(0.8)}]}
          />
        </View>
      </View>
      <ButtonX
        containerStyle={[$iconX, {top: top || verticalScale(3)}]}
        onPress={onGoBack}
      />
      {children}
    </View>
  );
};

const $map: ViewStyle = {
  width: '100%',
  height: verticalScale(150),
};
const $overlayMap: ViewStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
};
const $iconX: ViewStyle = {
  left: scale(12),
  right: undefined,
};
const $mapNotification: ViewStyle = {
  alignItems: 'center',
};
const $iconMap: TextStyle = {
  fontSize: moderateScale(20),
};
const $textNotification: TextStyle = {
  fontSize: FONT_SIZE.f3,
  marginTop: verticalScale(4),
};

export default MapTour;
