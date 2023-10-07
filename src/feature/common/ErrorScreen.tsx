import {FONT_SIZE} from 'asset';
import {ImageEmptyWithDesk} from 'asset/icons';
import {verticalMargin} from 'asset/metrics';
import {StyleButton, StyleText} from 'components/base';
import {useTheme} from 'hook';
import React from 'react';
import {View, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {verticalScale} from 'utility/scale';

interface Props {
  title?: I18Normalize;
  onPress: () => void;
  loading?: boolean;
}

const ErrorScreen = ({title, onPress, loading}: Props) => {
  const theme = useTheme();

  return (
    <View style={[$container, {backgroundColor: theme.white}]}>
      <ImageEmptyWithDesk size={300} />
      <StyleText
        originValue="Opp!"
        customStyle={{
          fontSize: FONT_SIZE.f1,
          marginTop: verticalMargin,
          fontWeight: 'bold',
        }}
      />
      <StyleText
        i18Text="alert.someError"
        customStyle={{
          fontSize: FONT_SIZE.f3,
          marginTop: verticalMargin,
          textAlign: 'center',
        }}
        mode="html"
      />
      {!!title && (
        <StyleButton
          title={title ?? 'common.null'}
          containerStyle={$error}
          onPress={onPress}
          isLoading={loading}
        />
      )}
    </View>
  );
};

const $container: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
};
const $error: ViewStyle = {
  marginTop: verticalScale(40),
};

export default ErrorScreen;
