import {useTheme} from 'hook';
import StyleHeader, {StyleHeaderProps} from 'navigation/components/StyleHeader';
import React, {forwardRef, ReactNode} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {verticalScale} from 'react-native-size-matters';
import {scale} from 'utility/scale';

interface ScrollContainerProps extends KeyboardAwareScrollViewProps {
  children?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  customStyle?: StyleProp<ViewStyle>;
  extraHeight?: number;
  isEffectTabBar?: boolean;
  headerProps?: StyleHeaderProps;
  TopComponent?: ReactNode;
  BottomComponent?: ReactNode;
}

// let offsetY = 0;

const StyleContainer = (props: ScrollContainerProps, ref: any) => {
  const {
    children,
    containerStyle,
    customStyle,
    extraHeight = verticalScale(120),
    headerProps,
    TopComponent,
    BottomComponent,
  } = props;
  const theme = useTheme();
  const {top} = useSafeAreaInsets();

  return (
    <View
      style={[
        {flex: 1, paddingTop: top, backgroundColor: theme.background},
        containerStyle,
      ]}>
      {headerProps && <StyleHeader {...headerProps} />}
      {TopComponent}
      <KeyboardAwareScrollView
        ref={ref}
        contentContainerStyle={[$contentContainer, customStyle]}
        scrollEnabled={false}
        extraHeight={extraHeight}
        extraScrollHeight={extraHeight}
        enableOnAndroid
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        {...props}>
        {children}
      </KeyboardAwareScrollView>
      {BottomComponent}
    </View>
  );
};

const $contentContainer: ViewStyle = {
  width: '100%',
  minHeight: '100%',
  paddingHorizontal: scale(12),
};

export default forwardRef(StyleContainer);
