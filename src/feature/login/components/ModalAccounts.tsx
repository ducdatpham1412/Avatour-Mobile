import {BORDER_RADIUS} from 'asset';
import {safePaddingNotZero} from 'asset/metrics';
import {AppModalize} from 'components';
import {StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import React, {ForwardedRef, forwardRef} from 'react';
import {ScrollView, TextStyle, View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {moderateScale, scale, verticalScale} from 'utility/scale';

interface Props {
  listAccounts: TypeAccount[];
  onSelect?: (value: TypeAccount) => void;
  onDelete?: (value: TypeAccount) => void;
}

const ModalAccounts = (
  {listAccounts, onSelect, onDelete}: Props,
  ref: ForwardedRef<TypeShowModalize>,
) => {
  const {bottom} = useSafeAreaInsets();
  const theme = useTheme();
  const isOverFlow8Items = listAccounts.length > 8;

  const renderContent = () => {
    if (isOverFlow8Items) {
      return (
        <ScrollView style={$scroll}>
          {listAccounts.map(account => {
            return (
              <View key={account.username} style={$item}>
                <StyleTouchable
                  customStyle={[$content, {backgroundColor: theme.white}]}
                  onPress={() => onSelect?.(account)}>
                  <StyleText originValue={account.username} />
                </StyleTouchable>
                <StyleTouchable
                  customStyle={$buttonX}
                  onPress={() => onDelete?.(account)}>
                  <AntDesign
                    name="close"
                    style={[$iconX, {color: theme.gray_600}]}
                  />
                </StyleTouchable>
              </View>
            );
          })}
        </ScrollView>
      );
    }

    return (
      <>
        {listAccounts.map(account => {
          return (
            <View key={account.username} style={$item}>
              <StyleTouchable
                customStyle={[$content, {backgroundColor: theme.white}]}
                onPress={() => onSelect?.(account)}>
                <StyleText originValue={account.username} />
              </StyleTouchable>
              <StyleTouchable
                customStyle={$buttonX}
                onPress={() => onDelete?.(account)}>
                <AntDesign
                  name="close"
                  style={[$iconX, {color: theme.gray_600}]}
                />
              </StyleTouchable>
            </View>
          );
        })}
      </>
    );
  };

  return (
    <AppModalize
      ref={ref}
      containerStyle={{
        paddingBottom: bottom || safePaddingNotZero,
        backgroundColor: theme.background,
      }}>
      {renderContent()}
    </AppModalize>
  );
};

const $scroll: ViewStyle = {
  width: '100%',
  height: verticalScale(44 + 12) * 8 + verticalScale(10),
};
const $item: ViewStyle = {
  width: '90%',
  height: verticalScale(44),
  alignSelf: 'center',
  marginTop: verticalScale(12),
  flexDirection: 'row',
};
const $content: ViewStyle = {
  flex: 1,
  borderRadius: BORDER_RADIUS.f2,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: scale(8),
};
const $buttonX: ViewStyle = {
  alignSelf: 'center',
  marginLeft: scale(10),
};
const $iconX: TextStyle = {
  fontSize: moderateScale(20),
};

export default forwardRef(ModalAccounts);
