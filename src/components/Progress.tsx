import {FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {useTheme} from 'hook';
import React from 'react';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {moderateScale, verticalScale} from 'utility/scale';
import {StyleText} from './base';

interface Props {
  progress: {
    text: I18Normalize;
    focusColor?: string;
  }[];
  indexFocusing: number;
  containerStyle?: StyleProp<ViewStyle>;
}

const Progress = ({progress, indexFocusing, containerStyle}: Props) => {
  const theme = useTheme();

  return (
    <View style={[$container, containerStyle]}>
      {progress.map((step, index) => {
        const isFirst = index === 0;
        const isLast = index === progress.length - 1;

        let color = step.focusColor ?? theme.blue;
        if (index < indexFocusing) {
          color = theme.gray_400;
        } else if (index > indexFocusing) {
          color = theme.gray_600;
        }

        return (
          <View key={index} style={$row}>
            <View style={$dotView}>
              <View
                style={[
                  $line,
                  {
                    width: isFirst ? 0 : moderateScale(1.5),
                    backgroundColor: theme.gray_200,
                  },
                ]}
              />
              <View style={[$dot, {backgroundColor: color}]} />
              <View
                style={[
                  $line,
                  {
                    width: isLast ? 0 : moderateScale(1.5),
                    backgroundColor: theme.gray_200,
                  },
                ]}
              />
            </View>
            <StyleText i18Text={step.text} customStyle={[$text, {color}]} />
          </View>
        );
      })}
    </View>
  );
};

const $container: ViewStyle = {
  width: '100%',
};
const $row: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
};
const $dotView: ViewStyle = {
  width: moderateScale(16),
  justifyContent: 'center',
  alignItems: 'center',
};
const $dot: ViewStyle = {
  width: moderateScale(4),
  height: moderateScale(4),
  borderRadius: 10,
};
const $line: ViewStyle = {
  width: moderateScale(1.5),
  height: verticalScale(8),
  backgroundColor: 'blue',
};
const $text: TextStyle = {
  fontSize: FONT_SIZE.f4,
  fontWeight: FONT_WEIGHT_MEDIUM,
};

export default Progress;
