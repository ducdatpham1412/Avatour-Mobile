import {useSafeArea, useTheme} from 'hook';
import React from 'react';
import {View, ViewProps, ViewStyle} from 'react-native';

type Props = ViewProps & {
  safeTop?: boolean;
  safeBottom?: boolean;
  center?: boolean;
};

const SafeView = (props: Props) => {
  const {style, safeTop = true, safeBottom = false, center, children} = props;
  const {top, bottom} = useSafeArea();
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
