import {GROUP_BUYING_STATUS} from 'asset/enum';
import {BoxInformation} from 'components';
import {
  StyleButton,
  StyleIcon,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {useLoading, useTheme} from 'hook';
import React, {Dispatch, SetStateAction} from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {onGoToProfile} from 'utility/assistant';
import {formatMoney, formatddddDDMMYYYY} from 'utility/format';
import {verticalScale} from 'utility/scale';

export type TypeConfirmBought = (
  list_joins_id: number[],
  options: {
    setLoading: Dispatch<SetStateAction<boolean>>;
  },
) => Promise<void>;

interface Props {
  item: TypePersonalJoinOfAdmin;
  onConfirmBought: TypeConfirmBought;
}

const ItemPersonalJoinOfAdmin = ({item, onConfirmBought}: Props) => {
  const theme = useTheme();
  const {loading, setLoading} = useLoading();

  const renderStatus = () => {
    if (item?.status === GROUP_BUYING_STATUS.requestBought) {
      return (
        <StyleButton
          title="discovery.confirmBought"
          onPress={() => onConfirmBought([item?.id], {setLoading})}
          isLoading={loading}
        />
      );
    }
    if (
      item?.status === GROUP_BUYING_STATUS.notBought ||
      item?.status === GROUP_BUYING_STATUS.notBoughtButOvertime
    ) {
      return (
        <View style={$notRequest}>
          <StyleText
            i18Text="discovery.notRequestConfirm"
            customStyle={{color: theme.gray_600}}
          />
        </View>
      );
    }
    if (item?.status === GROUP_BUYING_STATUS.bought) {
      return (
        <View style={$notRequest}>
          <StyleText
            i18Text="discovery.bought"
            customStyle={{color: theme.blue, fontWeight: 'bold'}}
          />
        </View>
      );
    }
    return null;
  };

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
          <StyleText i18Text="discovery.note" style={{color: theme.gray_600}} />
          <StyleText originValue={item?.note} style={$contentNote} />
        </View>,
        renderStatus(),
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
