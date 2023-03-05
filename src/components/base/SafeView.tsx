import {useTheme} from 'hook';
import React from 'react';
import {Text, View, ViewProps, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = ViewProps & {
  safeTop?: boolean;
  safeBottom?: boolean;
  center?: boolean;
};

const SafeView = (props: Props) => {
  const {style, safeTop = true, safeBottom = false, center, children} = props;
  const {top, bottom} = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <View
      style={[
        $container,
        {backgroundColor: theme.background},
        center && {
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}>
      {!!safeTop && <View style={{height: top}} />}
      {children}
      {!!safeBottom && <View style={{height: bottom}} />}
    </View>
  );
};

const $container: ViewStyle = {
  flex: 1,
};

export default SafeView;
