import {FONT_WEIGHT_MEDIUM} from 'asset/standardValue';
import {StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import React, {ReactNode} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface BoxInfoProps {
  icon: ReactNode;
  value: string;
  onPressEdit(): void;
}

const ItemInfo = (props: BoxInfoProps) => {
  const {icon, value, onPressEdit} = props;
  const theme = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: theme.white}]}>
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

const styles = ScaledSheet.create({
  container: {
    width: '100%',
    height: '45@vs',
    borderRadius: '10@vs',
    flexDirection: 'row',
    marginTop: '16@vs',
  },
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
