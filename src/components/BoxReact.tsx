import {useTheme} from 'hook';
import React from 'react';
import {View, ViewStyle} from 'react-native';
import {moderateScale, scale} from 'utility/scale';
import {IconLiked, IconNotLiked} from './common';

interface Props {
  isReacted: boolean;
  onPress?: () => void;
}

const BoxReact = ({isReacted, onPress}: Props) => {
  const theme = useTheme();

  return (
    <View style={[$heartBox, {backgroundColor: theme.white_opacity(0.9)}]}>
      {isReacted ? (
        <IconLiked size={22} onPress={() => onPress?.()} />
      ) : (
        <IconNotLiked size={22} onPress={() => onPress?.()} />
      )}
    </View>
  );
};

const $heartBox: ViewStyle = {
  position: 'absolute',
  width: moderateScale(30),
  height: moderateScale(30),
  alignItems: 'center',
  justifyContent: 'center',
  right: scale(8),
  top: scale(8),
  borderRadius: 100,
};

export default BoxReact;
