import {Metrics} from 'asset/metrics';
import {useTheme} from 'hook';
import {goBack} from 'navigation/NavigationService';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import React from 'react';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import PanZoomImage from './PanZoomImage';
import StyleTabView from './StyleTabView';
import {StyleTouchable} from './base';

type Props = RouteParams<AppParamsList[ROOT_SCREEN.swipeImages]>;

const SwipeImages = ({route}: Props) => {
  const {listImages, initIndex = 0} = route.params;
  const theme = useTheme();

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

      <StyleTouchable
        customStyle={[styles.comebackView, {backgroundColor: theme.background}]}
        onPress={goBack}
        hitSlop={15}>
        <Feather name="x" style={[styles.iconComeBack, {color: theme.black}]} />
      </StyleTouchable>
    </>
  );
};

const styles = ScaledSheet.create({
  elementView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comebackView: {
    position: 'absolute',
    padding: '4@ms',
    right: '20@s',
    top: Metrics.safeTopPadding + verticalScale(10),
    borderRadius: '20@ms',
  },
  iconComeBack: {
    fontSize: '14@ms',
  },
});

export default SwipeImages;
