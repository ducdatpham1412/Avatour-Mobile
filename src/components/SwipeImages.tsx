import {Metrics, horizontalPadding} from 'asset/metrics';
import {goBack} from 'navigation/NavigationService';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import React from 'react';
import {ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {verticalScale} from 'react-native-size-matters';
import PanZoomImage from './PanZoomImage';
import StyleTabView from './StyleTabView';
import {ButtonX} from './common';

type Props = RouteParams<AppParamsList[ROOT_SCREEN.swipeImages]>;

const SwipeImages = ({route}: Props) => {
  const {listImages, initIndex = 0} = route.params;
  const {top} = useSafeAreaInsets();

  return (
    <>
      <StyleTabView
        containerStyle={{
          height: Metrics.height,
        }}
        initIndex={initIndex}>
        {listImages.map((item, index) => (
          <PanZoomImage key={index} uri={item.url} />
        ))}
      </StyleTabView>

      <ButtonX
        containerStyle={[$buttonX, {top: top + verticalScale(4)}]}
        size={20}
        onPress={goBack}
      />
    </>
  );
};

const $buttonX: ViewStyle = {
  right: horizontalPadding,
};

export default SwipeImages;
