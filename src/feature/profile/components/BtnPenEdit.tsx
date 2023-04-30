import {StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import React from 'react';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {ScaledSheet, moderateScale} from 'react-native-size-matters';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {borderWidthTiny} from 'utility/assistant';

interface BtnPenEditProps {
  containerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<TextStyle>;
  onPress(): void;
}

const BtnPenEdit = (props: BtnPenEditProps) => {
  const {containerStyle, iconStyle, onPress} = props;
  const theme = useTheme();

  return (
    <StyleTouchable
      onPress={onPress}
      customStyle={[styles.touch, containerStyle]}>
      <View
        style={[
          styles.blurBackground,
          {
            backgroundColor: theme.white,
            borderColor: theme.gray_500,
          },
        ]}
      />

      <EvilIcons
        name="camera"
        style={[
          {
            fontSize: moderateScale(23),
            color: theme.black,
          },
          iconStyle,
        ]}
      />
    </StyleTouchable>
  );
};

const styles = ScaledSheet.create({
  touch: {
    position: 'absolute',
    width: '30@s',
    height: '30@s',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: '50@s',
    borderWidth: borderWidthTiny,
  },
});

export default BtnPenEdit;
