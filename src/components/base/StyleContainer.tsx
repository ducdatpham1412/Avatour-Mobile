import {horizontalPadding, safePaddingNotZero} from 'asset/metrics';
import {ErrorScreen} from 'feature/common';
import {LoadingScreen} from 'feature/profile/screens';
import {useSafeArea, useTheme} from 'hook';
import StyleHeader, {StyleHeaderProps} from 'navigation/components/StyleHeader';
import React, {ReactNode, forwardRef, isValidElement} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';
import {verticalScale} from 'react-native-size-matters';
import {$styleTopShadow, isIOS} from 'utility/assistant';
import {StyleButton, StyleButtonProps} from '.';

interface ScrollContainerProps extends KeyboardAwareScrollViewProps {
  children?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  customStyle?: StyleProp<ViewStyle>;
  extraHeight?: number;
  isEffectTabBar?: boolean;
  headerProps?: StyleHeaderProps;
  TopComponent?: ReactNode;
  BottomComponent?: StyleButtonProps | ReactNode;
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
  const {top, bottom} = useSafeArea();

  const themeBackground = backgroundColor ?? theme.white;

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

  const renderBottom = () => {
    if (!BottomComponent) {
      return null;
    }

    if (isValidElement(BottomComponent)) {
      return BottomComponent;
    }

    return (
      <View
        style={[
          $button,
          $styleTopShadow,
          {
            marginBottom: bottom,
            backgroundColor: themeBackground,
            shadowColor: theme.black,
          },
        ]}>
        <StyleButton
          containerStyle={$postBox}
          {...(BottomComponent as StyleButtonProps)}
        />
      </View>
    );
  };

  return (
    <View
      style={[
        {
          flex: 1,
          paddingTop: top,
          backgroundColor: themeBackground,
        },
        containerStyle,
      ]}>
      {headerProps && (
        <StyleHeader
          {...headerProps}
          containerStyle={[
            {backgroundColor: themeBackground},
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
      {renderBottom()}
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
const $button: ViewStyle = {
  width: '100%',
  paddingTop: safePaddingNotZero,
  paddingHorizontal: horizontalPadding,
};
const $postBox: ViewStyle = {
  width: '100%',
  alignItems: 'center',
};

export default forwardRef(StyleContainer);
