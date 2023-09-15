import {FONT_SIZE} from 'asset';
import {FONT_FAMILY} from 'asset/enum';
import {useTheme} from 'hook';
import React, {ForwardedRef, forwardRef} from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';

const AppInput = (props: TextInputProps, ref: ForwardedRef<TextInput>) => {
  const {p_800, black, gray_500} = useTheme();

  return (
    <TextInput
      ref={ref}
      selectionColor={p_800}
      placeholderTextColor={gray_500}
      returnKeyType={props?.keyboardType === 'numeric' ? 'done' : undefined}
      {...props}
      style={[styles.text, {color: black}, props.style]}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: FONT_FAMILY.openSans,
    fontSize: FONT_SIZE.f2,
    paddingTop: 0,
    paddingBottom: 0,
  },
});

export default forwardRef(AppInput);
