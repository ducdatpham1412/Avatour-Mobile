import {Metrics, safePaddingNotZero} from 'asset/metrics';
import {AppModalize} from 'components';
import {StyleList, StyleText, StyleTouchable} from 'components/base';
import {Avatar} from 'components/common';
import {useTheme} from 'hook';
import React, {
  ElementRef,
  ForwardedRef,
  forwardRef,
  useCallback,
  useRef,
} from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {moderateScale, verticalScale} from 'utility/scale';
import ModalPeopleInGroup from './ModalPeopleInGroup';

interface Props {
  groups: TypeGroupJoin[];
  isMySale: boolean;
  refreshing: boolean;
  onRefresh: () => void;
}

const ModalGroup = (
  {groups, onRefresh, refreshing, isMySale}: Props,
  ref: ForwardedRef<ElementRef<typeof AppModalize>>,
) => {
  const {bottom} = useSafeAreaInsets();
  const theme = useTheme();
  const modalPeopleInGroup =
    useRef<ElementRef<typeof ModalPeopleInGroup>>(null);

  const renderItemGroup = useCallback(
    (item: TypeGroupJoin) => {
      return (
        <StyleTouchable
          style={$itemGroupContainer}
          onPress={() => {
            modalPeopleInGroup.current?.show({group: item, isMySale});
          }}>
          <StyleText
            i18Text="discovery.groupDay"
            i18Params={{value: item.name}}
            customStyle={$titleGroup}
          />
          <View style={$listPeople}>
            {item?.members?.map((mem, index) => (
              <View key={index}>
                <Avatar source={{uri: mem?.creator_avatar}} size={40} />
                {mem?.amount > 1 && (
                  <View
                    style={[
                      $amountAvatarMember,
                      {
                        backgroundColor: theme.gray_100,
                      },
                    ]}>
                    <StyleText
                      originValue={`x${mem.amount}`}
                      customStyle={{fontSize: moderateScale(9)}}
                    />
                  </View>
                )}
              </View>
            ))}
          </View>
        </StyleTouchable>
      );
    },
    [isMySale],
  );

  return (
    <>
      <AppModalize ref={ref} modalHeight={Metrics.height * 0.6}>
        <StyleList
          data={groups}
          renderItem={({item}) => renderItemGroup(item)}
          contentContainerStyle={{paddingBottom: bottom || safePaddingNotZero}}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </AppModalize>

      <ModalPeopleInGroup ref={modalPeopleInGroup} />
    </>
  );
};

const $itemGroupContainer: ViewStyle = {
  width: '100%',
  marginBottom: verticalScale(16),
  alignItems: 'center',
};
const $titleGroup: TextStyle = {
  fontWeight: 'bold',
};
const $listPeople: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: verticalScale(4),
};
const $amountAvatarMember: ViewStyle = {
  position: 'absolute',
  bottom: -moderateScale(5),
  right: 0,
  width: moderateScale(15),
  height: moderateScale(15),
  borderRadius: 30,
  alignItems: 'center',
  justifyContent: 'center',
};

export default forwardRef(ModalGroup);
