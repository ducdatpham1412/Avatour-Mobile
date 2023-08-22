import {StyleText, StyleTouchable} from 'components/base';
import {Title} from 'feature/profile/components';
import {useTheme} from 'hook';
import React from 'react';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import Entypo from 'react-native-vector-icons/Entypo';

export type OptionTickBox = {
  id: number | string;
  text: I18Normalize;
};

interface Props {
  title: I18Normalize;
  listOptions: Array<OptionTickBox>;
  listChosen: Array<OptionTickBox>;
  onPressOption?: (value: OptionTickBox) => void;
  containerStyle?: StyleProp<ViewStyle>;
  disable?: boolean;
  layOut?: 'vertical' | 'grid';
  pick?: 'radio-button' | 'check-box';
  mandatory?: boolean;
}

type ChosenProps = Pick<Props, 'pick'>;

const Chosen = ({pick = 'radio-button'}: ChosenProps) => {
  const theme = useTheme();
  return (
    <View
      style={[
        $checkBox,
        {
          borderColor: theme.p_600,
          borderRadius: pick === 'check-box' ? moderateScale(4) : 50,
        },
      ]}>
      {pick === 'check-box' ? (
        <Entypo
          name="check"
          style={{fontSize: moderateScale(15), color: theme.p_600}}
        />
      ) : (
        <View style={[$dot, {backgroundColor: theme.p_600}]} />
      )}
    </View>
  );
};

const NotChosen = ({pick = 'radio-button'}: ChosenProps) => {
  const theme = useTheme();
  return (
    <View
      style={[
        $checkBox,
        {
          borderColor: theme.gray_500,
          borderRadius: pick === 'check-box' ? moderateScale(4) : 50,
        },
      ]}
    />
  );
};

const TickBox = ({
  title,
  listOptions,
  listChosen,
  onPressOption,
  containerStyle,
  disable = false,
  layOut = 'vertical',
  mandatory = false,
  pick,
}: Props) => {
  const vertical = layOut === 'vertical';

  return (
    <View style={[$container, containerStyle]}>
      <Title title={title} mandatory={mandatory} />

      <View style={vertical ? $optionsVertical : $optionGrid}>
        {listOptions.map((option, index) => {
          const isChosen = !!listChosen.find(item => item.id === option.id);

          return (
            <View key={index} style={vertical ? $itemVertical : $itemGrid}>
              <StyleTouchable
                customStyle={[
                  $itemOptionBox,
                  index > 0 && {marginTop: verticalScale(8)},
                ]}
                onPress={() => onPressOption?.(option)}
                disable={disable}
                disableOpacity={1}>
                {isChosen ? <Chosen pick={pick} /> : <NotChosen pick={pick} />}
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
const $optionsVertical: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(8),
};
const $optionGrid: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(8),
  flexDirection: 'row',
  flexWrap: 'wrap',
};
const $itemVertical: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
};
const $itemGrid: ViewStyle = {
  width: '50%',
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
  alignItems: 'center',
  justifyContent: 'center',
};
const $textTopic: TextStyle = {
  marginLeft: scale(8),
};
const $dot: ViewStyle = {
  width: moderateScale(12),
  height: moderateScale(12),
  borderRadius: 12,
};

export default TickBox;
