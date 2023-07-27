import {horizontalPadding} from 'asset/metrics';
import {LoadingScreen} from 'feature/profile/screens';
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

interface ScrollContainerProps extends KeyboardAwareScrollViewProps {
  children?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  customStyle?: StyleProp<ViewStyle>;
  extraHeight?: number;
  isEffectTabBar?: boolean;
  headerProps?: StyleHeaderProps;
  TopComponent?: ReactNode;
  BottomComponent?: ReactNode;
  backgroundColor?: string;
  initLoading?: boolean;
  layOut?: 'view' | 'scroll';
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
    backgroundColor,
    initLoading = false,
    layOut = 'scroll',
  } = props;
  const theme = useTheme();
  const {top} = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          flex: 1,
          paddingTop: top,
          backgroundColor: backgroundColor ?? theme.background,
        },
        containerStyle,
      ]}>
      {headerProps && (
        <StyleHeader
          {...headerProps}
          containerStyle={[
            {backgroundColor: backgroundColor ?? theme.background},
            headerProps?.containerStyle,
          ]}
        />
      )}
      {TopComponent}
      {layOut === 'scroll' ? (
        <KeyboardAwareScrollView
          ref={ref}
          scrollEnabled={false}
          extraHeight={extraHeight}
          extraScrollHeight={extraHeight}
          enableOnAndroid
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          {...props}
          contentContainerStyle={[$contentContainer, customStyle]}>
          {initLoading ? (
            <LoadingScreen
              containerStyle={{
                backgroundColor: backgroundColor ?? theme.background,
              }}
            />
          ) : (
            children
          )}
        </KeyboardAwareScrollView>
      ) : (
        <View style={[$body, customStyle]}>
          {initLoading ? (
            <LoadingScreen
              containerStyle={{
                backgroundColor: backgroundColor ?? theme.background,
              }}
            />
          ) : (
            children
          )}
        </View>
      )}
      {BottomComponent}
    </View>
  );
};

const $contentContainer: ViewStyle = {
  flexGrow: 1,
  width: '100%',
  paddingHorizontal: horizontalPadding,
};
const $body: ViewStyle = {
  flex: 1,
  paddingHorizontal: horizontalPadding,
};

export default forwardRef(StyleContainer);
