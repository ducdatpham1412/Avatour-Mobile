import {SafeView, StyleButton} from 'components/base';
import React from 'react';
import {Text, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {verticalScale} from 'utility/scale';

interface Props {
  title?: I18Normalize;
  onPress: () => void;
  loading?: boolean;
}

const ErrorScreen = ({title, onPress, loading}: Props) => {
  return (
    <SafeView center>
      <Text>Opp!</Text>
      <Text>There're some error</Text>
      <StyleButton
        title={title ?? 'common.null'}
        containerStyle={$error}
        onPress={onPress}
        isLoading={loading}
      />
    </SafeView>
  );
};

const $error: ViewStyle = {
  marginTop: verticalScale(20),
};

export default ErrorScreen;
