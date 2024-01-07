import {verticalMargin} from 'asset/metrics';
import {BORDER_RADIUS, FONT_WEIGHT_MEDIUM} from 'asset/standardValue';
import {StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import React, {ReactNode} from 'react';
import {View, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {verticalScale} from 'utility/scale';

interface BoxInfoProps {
  icon: ReactNode;
  value: string;
  onPressEdit(): void;
}

const ItemInfo = (props: BoxInfoProps) => {
  const {icon, value, onPressEdit} = props;
  const theme = useTheme();

  return (
    <View style={[$container, {backgroundColor: theme.gray_100}]}>
      <View style={styles.iconModule}>{icon}</View>
      <View style={styles.contentBox}>
        <StyleText
          originValue={value}
          numberOfLines={1}
          customStyle={styles.textContent}
        />
      </View>
      <StyleTouchable customStyle={styles.iconModule} onPress={onPressEdit}>
        <AntDesign
          name="edit"
          style={[styles.ic_edit_check, {color: theme.gray_500}]}
        />
      </StyleTouchable>
    </View>
  );
};

const $container: ViewStyle = {
  width: '100%',
  height: verticalScale(48),
  borderRadius: BORDER_RADIUS.f3,
  flexDirection: 'row',
  marginTop: verticalMargin,
};

const styles = ScaledSheet.create({
  iconModule: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentBox: {
    flex: 6,
    justifyContent: 'center',
  },
  ic_edit_check: {
    fontSize: '20@ms',
  },
  textContent: {
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
});

export default ItemInfo;
