import {View, Text, StyleProp, ViewStyle, TextStyle} from 'react-native';
import React from 'react';
import {I18Normalize} from 'utility/I18Next';
import {StyleText, StyleTouchable} from 'components/base';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useTheme} from 'hook';

export type OptionTickBox = {
  id: number;
  text: I18Normalize;
};

interface Props {
  title: I18Normalize;
  listOptions: Array<OptionTickBox>;
  listChosen: Array<OptionTickBox>;
  onPressOption?: (value: OptionTickBox) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const TickBox = ({
  title,
  listOptions,
  listChosen,
  onPressOption,
  containerStyle,
}: Props) => {
  const theme = useTheme();

  return (
    <View style={[$container, containerStyle]}>
      <StyleText i18Text={title} customStyle={$title} />

      <View style={$optionsView}>
        {listOptions.map((option, index) => {
          const isChosen = !!listChosen.find(item => item.id === option.id);

          return (
            <View style={$itemOptionView}>
              <StyleTouchable
                customStyle={[
                  $itemOptionBox,
                  index > 0 && {marginTop: verticalScale(8)},
                ]}
                onPress={() => onPressOption?.(option)}>
                <View style={[$checkBox, {borderColor: theme.gray_500}]}>
                  {isChosen && (
                    <AntDesign
                      name="check"
                      style={[$iconCheck, {color: theme.p_800}]}
                    />
                  )}
                </View>
                <StyleText i18Text={option.text} customStyle={$textTopic} />
              </StyleTouchable>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const $container: ViewStyle = {
  width: '100%',
};
const $title: TextStyle = {
  fontWeight: 'bold',
};
const $optionsView: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(8),
};
const $itemOptionView: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
};
const $itemOptionBox: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};
const $checkBox: ViewStyle = {
  width: moderateScale(20),
  height: moderateScale(20),
  borderWidth: moderateScale(1),
  borderRadius: moderateScale(5),
  alignItems: 'center',
  justifyContent: 'center',
};
const $textTopic: TextStyle = {
  marginLeft: scale(8),
};
const $iconCheck: TextStyle = {
  fontSize: moderateScale(17),
};

export default TickBox;
