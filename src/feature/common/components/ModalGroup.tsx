import {Metrics, safePaddingNotZero} from 'asset/metrics';
import {AppModalize} from 'components';
import {StyleIcon, StyleList, StyleText, StyleTouchable} from 'components/base';
import React, {
  ElementRef,
  ForwardedRef,
  forwardRef,
  useCallback,
  useRef,
} from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {formatDDMMMMYY} from 'utility/format';
import {verticalScale} from 'utility/scale';
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
            i18Params={{value: formatDDMMMMYY(item?.created)}}
            customStyle={$titleGroup}
          />
          <View style={$listPeople}>
            {item?.members?.map((mem, index) => (
              <StyleIcon
                key={index}
                source={{uri: mem?.creator_avatar}}
                size={40}
              />
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

export default forwardRef(ModalGroup);
