import Images from 'asset/img/images';
import {verticalMargin} from 'asset/metrics';
import {AppModalize} from 'components';
import {StyleButton, StyleContainer, StyleIcon} from 'components/base';
import {InputBox, TypeDetailSetting} from 'components/common';
import {useSafeArea, useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {PROFILE_ROUTE} from 'navigation/config';
import React, {ElementRef, useRef, useState} from 'react';
import {TextStyle, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {formatInputNumber, formatLocaleNumber} from 'utility/format';

const AdminScreen = () => {
  const theme = useTheme();
  const {paddingBottom} = useSafeArea();

  const modalUserSale = useRef<ElementRef<typeof AppModalize>>(null);

  const [shopId, setShopId] = useState('');

  return (
    <>
      <StyleContainer
        headerProps={{
          title: 'Admin' as I18Normalize,
        }}>
        <TypeDetailSetting
          title="profile.postGroupBuying"
          icon={<StyleIcon source={Images.icons.shop} size={20} />}
          onPress={() => {
            modalUserSale.current?.show();
          }}
        />
      </StyleContainer>

      <AppModalize ref={modalUserSale} title="profile.postGroupBuying">
        <InputBox
          style={[
            $input,
            {
              backgroundColor: theme.gray_100,
            },
          ]}
          placeholder="Enter shop's id"
          keyboardType="numeric"
          value={formatLocaleNumber(shopId)}
          onChangeText={v => {
            const temp = formatInputNumber(v, {isDecimal: false});
            if (temp !== null) {
              setShopId(temp);
            }
          }}
        />

        <StyleButton
          title="common.ok"
          containerStyle={[
            $btn,
            {
              marginBottom: paddingBottom,
            },
          ]}
          disable={!shopId}
          onPress={() => {
            navigate(PROFILE_ROUTE.createPostPickImg, {
              mode: 'sale',
              userId: Number(shopId),
            });
            modalUserSale.current?.hide();
          }}
        />
      </AppModalize>
    </>
  );
};

const $input: TextStyle = {
  alignSelf: 'center',
  marginTop: verticalMargin,
};
const $btn: ViewStyle = {
  width: '90%',
  marginTop: 3 * verticalMargin,
};

export default AdminScreen;
