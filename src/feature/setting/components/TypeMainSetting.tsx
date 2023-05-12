import {FONT_WEIGHT_MEDIUM} from 'asset';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {I18Normalize} from 'utility/I18Next';
import {moderateScale} from 'utility/scale';

interface TypeMainSettingProps {
  icon: any;
  title: I18Normalize;
  onPress(): void;
}

const TypeMainSetting = (props: TypeMainSettingProps) => {
  const {icon, title, onPress} = props;
  const theme = useTheme();

  return (
    <StyleTouchable customStyle={styles.container} onPress={onPress}>
      <View style={[styles.blurBackground, {backgroundColor: theme.white}]} />

      <View
        style={[
          styles.iconBox,
          {
            borderColor: theme.p_700,
          },
        ]}>
        <StyleImage source={icon} customStyle={{width: '70%', height: '70%'}} />
      </View>

      <View style={[styles.cordBox, {borderColor: theme.p_700}]} />

      <StyleText i18Text={title} customStyle={styles.text} />
    </StyleTouchable>
  );
};

const styles = ScaledSheet.create({
  container: {
    width: '100%',
    height: '55@vs',
    marginVertical: '8@vs',
    flexDirection: 'row',
    alignItems: 'center',
  },
  blurBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '100@vs',
  },
  iconBox: {
    width: '45@vs',
    height: '45@vs',
    borderRadius: '30@s',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginLeft: '10@s',
  },
  cordBox: {
    width: '10@s',
    borderWidth: moderateScale(1),
    marginRight: '10@s',
  },
  text: {
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
});

export default TypeMainSetting;
