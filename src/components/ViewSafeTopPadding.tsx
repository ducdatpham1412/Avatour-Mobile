import {useTheme} from 'hook';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const ViewSafeTopPadding = () => {
  const theme = useTheme();
  const {top} = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: theme.background, height: top},
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default ViewSafeTopPadding;
