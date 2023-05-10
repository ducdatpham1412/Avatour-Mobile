import {GROUP_BUYING_STATUS} from 'asset/enum';
import {BoxInformation} from 'components';
import {
  StyleButton,
  StyleIcon,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {useTheme} from 'hook';
import React from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {onGoToProfile} from 'utility/assistant';
import {formatMoney, formatddddDDMMYYYY} from 'utility/format';
import {verticalScale} from 'utility/scale';

interface Props {
  item: TypePersonalJoinOfAdmin;
}

const ItemPersonalJoinOfAdmin = ({item}: Props) => {
  const {gray_600} = useTheme();
  return (
    <BoxInformation
      listInformation={[
        {
          icon: (
            <StyleTouchable onPress={() => onGoToProfile(item?.creator)}>
              <StyleIcon source={{uri: item?.creator_avatar}} size={22} />
            </StyleTouchable>
          ),
          title: item?.creator_name,
          content: '',
        },
        {
          title: 'discovery.arrivalTime',
          content: formatddddDDMMYYYY(item?.time_will_buy),
        },
        {
          title: 'discovery.deposit',
          content: formatMoney(item?.deposit),
        },
        <View style={$note}>
          <StyleText i18Text="discovery.note" style={{color: gray_600}} />
          <StyleText originValue={item?.note} style={$contentNote} />
        </View>,
        item?.status === GROUP_BUYING_STATUS.requestBought ? (
          <StyleButton title="discovery.confirmBought" />
        ) : (
          <View style={$notRequest}>
            <StyleText
              i18Text="discovery.notRequestConfirm"
              customStyle={{color: gray_600}}
            />
          </View>
        ),
      ]}
    />
  );
};

const $contentNote: TextStyle = {
  marginTop: verticalScale(5),
};
const $note: ViewStyle = {
  width: '100%',
};
const $notRequest: ViewStyle = {
  width: '100%',
  alignItems: 'center',
};

export default ItemPersonalJoinOfAdmin;
