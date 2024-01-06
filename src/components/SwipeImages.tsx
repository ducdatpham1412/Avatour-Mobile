import {Metrics, horizontalPadding} from 'asset/metrics';
import {useTheme} from 'hook';
import {goBack} from 'navigation/NavigationService';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import React from 'react';
import {ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {verticalScale} from 'react-native-size-matters';
import PanZoomImage from './PanZoomImage';
import TabView from './TabView';
import {ButtonX} from './common';

type Props = RouteParams<AppParamsList[ROOT_SCREEN.swipeImages]>;

const renderElement = (item: {url: string}) => {
  return () => <PanZoomImage uri={item.url} onPressBackground={goBack} />;
};

const SwipeImages = ({route}: Props) => {
  const {listImages, initIndex = 0} = route.params;
  const {top} = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <>
      <TabView
        style={{
          height: Metrics.height,
          backgroundColor: theme.black_opacity(0.2),
        }}
        initialIndex={initIndex}
        lazy={false}
        listElements={listImages.map(img => renderElement(img))}
        tabBarType="none"
      />

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
