import {BORDER_RADIUS} from 'asset';
import {Metrics, horizontalPadding, verticalMargin} from 'asset/metrics';
import {TypeTheme} from 'asset/theme/Theme';
import {AppModalize} from 'components';
import {StyleImage, StyleTouchable} from 'components/base';
import StyleList from 'components/base/StyleList';
import {InputBox} from 'components/common';
import {useSafeArea, useTheme} from 'hook';
import React, {Ref, forwardRef, useCallback, useState} from 'react';
import {ImageStyle, TextStyle, View, ViewStyle} from 'react-native';
import {useDebounce} from 'react-use';
import {moderateScale, verticalScale} from 'utility/scale';
import {useVietQRBank} from '../hooks';

interface Props {
  bank: any;
  onChangeBank(value: TypeItemBank): void;
  theme: TypeTheme;
}

const ModalChooseBank = (
  {bank, onChangeBank}: Props,
  ref: Ref<TypeShowModalize>,
) => {
  const theme = useTheme();
  const {paddingBottom} = useSafeArea();

  const [{listBanks, loading, validating}, {mutate}] = useVietQRBank();

  const [search, setSearch] = useState('');
  const [displayBanks, setDisplayBanks] = useState<TypeItemBank[]>([]);

  useDebounce(
    () => {
      if (!search) {
        setDisplayBanks(listBanks ?? []);
      }
      const textLowerCase = search.toLocaleLowerCase();
      const temp = listBanks?.filter(item => {
        if (
          item?.name?.toLocaleLowerCase().includes(textLowerCase) ||
          item?.code?.toLocaleLowerCase().includes(textLowerCase) ||
          item?.shortName?.toLocaleLowerCase().includes(textLowerCase) ||
          item?.short_name?.toLocaleLowerCase().includes(textLowerCase)
        ) {
          return true;
        }
        return false;
      });
      setDisplayBanks(temp ?? []);
    },
    50,
    [search, listBanks],
  );

  const renderItemBank = useCallback(
    (item: TypeItemBank) => {
      const isChosen = item.id === bank?.id;

      return (
        <StyleTouchable
          customStyle={[
            $item,
            {borderColor: isChosen ? theme.red : theme.gray_100},
          ]}
          onPress={() => {
            onChangeBank(item);
          }}>
          <StyleImage
            source={{uri: item?.logo || ''}}
            customStyle={$bankLogo}
            defaultImageSource="image"
          />
        </StyleTouchable>
      );
    },
    [bank?.id],
  );

  return (
    <AppModalize
      ref={ref}
      modalHeight={Metrics.height * 0.8}
      title="profile.bank"
      adjustToContentHeight={false}>
      <InputBox
        style={[$input, {backgroundColor: theme.gray_100}]}
        i18Placeholder="common.search"
        onChangeText={setSearch}
      />

      <View style={$content}>
        <StyleList
          data={displayBanks}
          keyExtractor={item => String(item?.id)}
          renderItem={({item}) => renderItemBank(item)}
          numColumns={3}
          contentContainerStyle={{paddingBottom}}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          initLoading={loading}
          refreshing={validating}
          onRefresh={mutate}
        />
      </View>
    </AppModalize>
  );
};

const $content: ViewStyle = {
  flex: 1,
};
const $item: ViewStyle = {
  width: '33%',
  height: moderateScale(45),
  borderRadius: BORDER_RADIUS.f4,
  borderWidth: moderateScale(1),
  marginBottom: verticalScale(2),
};
const $bankLogo: ImageStyle = {
  width: '100%',
  height: '100%',
};
const $input: TextStyle = {
  width: '100%',
  alignSelf: 'center',
  flexDirection: 'row',
  marginBottom: verticalMargin,
  paddingHorizontal: horizontalPadding,
  alignItems: 'center',
};

export default forwardRef(ModalChooseBank);
