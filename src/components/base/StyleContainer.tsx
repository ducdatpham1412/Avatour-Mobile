import {newHorizontalPadding} from 'asset/metrics';
import {ErrorScreen} from 'feature/common';
import {LoadingScreen} from 'feature/profile/screens';
import {useTheme} from 'hook';
import StyleHeader, {StyleHeaderProps} from 'navigation/components/StyleHeader';
import React, {ReactNode, forwardRef} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {verticalScale} from 'react-native-size-matters';
import {isIOS} from 'utility/assistant';

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
  error?: Error;
  onPressError?: () => void;
  layOut?: 'view' | 'scroll';
}

const StyleContainer = (props: ScrollContainerProps, ref: any) => {
  const {
    children,
    containerStyle,
    customStyle,
    extraHeight = isIOS ? verticalScale(60) : verticalScale(120),
    headerProps,
    TopComponent,
    BottomComponent,
    backgroundColor,
    initLoading = false,
    error,
    onPressError,
    layOut = 'scroll',
  } = props;
  const theme = useTheme();
  const {top} = useSafeAreaInsets();

  const renderContent = () => {
    if (initLoading) {
      return (
        <LoadingScreen
          containerStyle={{
            backgroundColor: backgroundColor ?? theme.background,
          }}
        />
      );
    }

    if (error) {
      return (
        <ErrorScreen title="common.retry" onPress={() => onPressError?.()} />
      );
    }

    return children;
  };

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
          {renderContent()}
        </KeyboardAwareScrollView>
      ) : (
        <View style={[$body, customStyle]}>{renderContent()}</View>
      )}
      {BottomComponent}
    </View>
  );
};

const $contentContainer: ViewStyle = {
  flexGrow: 1,
  width: '100%',
  paddingHorizontal: newHorizontalPadding,
};
const $body: ViewStyle = {
  flex: 1,
  paddingHorizontal: newHorizontalPadding,
};

export default forwardRef(StyleContainer);
