import {StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import React from 'react';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<TextStyle>;
  onPress?(): void;
}

const ButtonBack = ({containerStyle, onPress, iconStyle}: Props) => {
  const {white, black} = useTheme();

  return (
    <StyleTouchable
      customStyle={[styles.container, {backgroundColor: white}, containerStyle]}
      onPress={onPress}>
      <MaterialIcons
        name="arrow-back"
        style={[styles.iconX, {color: black}, iconStyle]}
      />
    </StyleTouchable>
  );
};

const styles = ScaledSheet.create({
  container: {
    position: 'absolute',
    padding: '5@ms',
    borderRadius: '30@s',
  },
  iconX: {
    fontSize: '17@ms',
  },
});

export default ButtonBack;
