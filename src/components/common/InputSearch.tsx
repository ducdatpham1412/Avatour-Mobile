import {AppInput} from 'components/base';
import {useTheme} from 'hook';
import React, {ForwardedRef, forwardRef, ReactNode} from 'react';
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {borderWidthTiny} from 'utility/assistant';
import {scale} from 'utility/scale';

interface Props extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  icon?: ReactNode;
}

const InputSearch = (
  {containerStyle, icon, ...rest}: Props,
  ref: ForwardedRef<TextInput>,
) => {
  const theme = useTheme();

  return (
    <View
      style={[
        $container,
        {
          backgroundColor: theme.white,
          borderColor: theme.gray_500,
        },
        containerStyle,
      ]}>
      {icon !== undefined ? (
        <View style={$iconSearch}>{icon}</View>
      ) : (
        <AntDesign
          name="search1"
          style={[$iconSearch, {color: theme.gray_500}]}
        />
      )}

      <AppInput ref={ref} {...rest} style={$input} />
    </View>
  );
};

const $container: ViewStyle = {
  width: '100%',
  height: moderateScale(40),
  borderRadius: 100,
  borderWidth: borderWidthTiny,
  flexDirection: 'row',
  alignItems: 'center',
};
const $iconSearch: TextStyle = {
  fontSize: moderateScale(23),
  marginLeft: scale(12),
  marginRight: scale(4),
};
const $input: TextStyle = {
  flex: 1,
  paddingRight: scale(12),
};

export default forwardRef(InputSearch);
