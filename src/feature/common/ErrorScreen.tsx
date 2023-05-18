import {SafeView, StyleButton} from 'components/base';
import React from 'react';
import {Text, ViewStyle} from 'react-native';
import {verticalScale} from 'utility/scale';

interface Props {
  onPress: () => void;
}

const ErrorScreen = ({onPress}: Props) => {
  return (
    <SafeView center>
      <Text>Opp!</Text>
      <Text>There're some error</Text>
      <StyleButton
        title="setting.component.typeMainSetting.logOut"
        containerStyle={$error}
        onPress={onPress}
      />
    </SafeView>
  );
};

const $error: ViewStyle = {
  marginTop: verticalScale(20),
};

export default ErrorScreen;
