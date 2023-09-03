import {BORDER_RADIUS, FONT_SIZE} from 'asset';
import {AppInput, StyleText} from 'components/base';
import {useTheme} from 'hook';
import React, {ReactNode} from 'react';
import {
  StyleProp,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {moderateScale, scale, verticalScale} from 'utility/scale';

interface Props {
  title: I18Normalize;
  textInputProps?: TextInputProps;
  containerStyle?: StyleProp<ViewStyle>;
  mandatory?: boolean;
  children?: ReactNode;
}

type TitleProps = Pick<Props, 'title' | 'mandatory'> & {
  style?: StyleProp<TextStyle>;
};

export const Title = ({title, style, mandatory = true}: TitleProps) => {
  const theme = useTheme();

  return (
    <StyleText i18Text={title} customStyle={[$title, style]}>
      {mandatory && (
        <StyleText
          originValue=" *"
          customStyle={[$title, {color: theme.red}, style]}
        />
      )}
    </StyleText>
  );
};

const TitleAndInput = ({
  title,
  textInputProps,
  containerStyle,
  mandatory = true,
  children,
}: Props) => {
  const theme = useTheme();

  return (
    <View style={[$container, containerStyle]}>
      <Title title={title} mandatory={mandatory} />
      {children ?? (
        <AppInput
          {...textInputProps}
          style={[$input, {borderColor: theme.gray_300}, textInputProps?.style]}
        />
      )}
    </View>
  );
};

const $container: ViewStyle = {
  width: '100%',
};
const $title: TextStyle = {
  fontSize: FONT_SIZE.f3,
  fontWeight: 'bold',
};
const $input: TextStyle = {
  width: '100%',
  marginTop: verticalScale(8),
  paddingHorizontal: scale(12),
  paddingTop: verticalScale(12),
  paddingBottom: verticalScale(12),
  borderWidth: moderateScale(1),
  borderRadius: BORDER_RADIUS.f3,
};

export default TitleAndInput;
