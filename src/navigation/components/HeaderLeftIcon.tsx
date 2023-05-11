import {useTheme} from 'hook';
import React from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';

interface Props extends TouchableOpacityProps {
  iconStyle?: StyleProp<TextStyle>;
  onPress?(): void;
  [key: string]: any;
}

const HeaderLeftIcon = (props: Props) => {
  const theme = useTheme();

  return (
    <TouchableOpacity {...props}>
      <Entypo
        name="chevron-small-left"
        style={[styles.icon, {color: theme.black}, props.iconStyle]}
      />
    </TouchableOpacity>
  );
};

const styles = ScaledSheet.create({
  icon: {
    fontSize: '35@ms',
  },
});

export default HeaderLeftIcon;
