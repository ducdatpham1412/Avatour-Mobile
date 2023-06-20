/* eslint-disable react-hooks/rules-of-hooks */
import {apiEditSale} from 'api/discovery';
import {FONT_SIZE} from 'asset/standardValue';
import {StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import {ModalAlert} from 'navigation/screen/modals';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {borderWidthTiny} from 'utility/assistant';
import {formatLocaleNumber} from 'utility/format';

interface Props {
  postId: number;
  prices: Array<TypePrice>;
}

const UpdatePriceStatus = (props: Props) => {
  const {postId, prices} = props;
  const theme = useTheme();

  const onCancelRequesting = async () => {
    try {
      await apiEditSale({
        postId,
        data: {},
      });
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    }
  };

  return (
    <View
      style={[styles.requestUpdatePriceView, {borderColor: theme.borderColor}]}>
      <StyleText
        i18Text="discovery.reviewUpdatePrice"
        customStyle={[styles.textReviewingPrice, {color: theme.borderColor}]}
      />
      {/* <StyleText
        i18Text="discovery.retailPrice"
        customStyle={[styles.textUpdatePrice, {color: theme.borderColor}]}>
        <StyleText
          originValue={`: ${retailPrice}`}
          customStyle={[styles.textUpdatePrice, {color: theme.borderColor}]}
        />
      </StyleText> */}

      <StyleText
        i18Text="discovery.groupBuyingPrice"
        customStyle={[styles.textUpdatePrice, {color: theme.borderColor}]}>
        <StyleText
          originValue=":"
          customStyle={[styles.textUpdatePrice, {color: theme.borderColor}]}
        />
      </StyleText>
      {prices.map(p => (
        <View key={p.price} style={styles.updatePriceBox}>
          <StyleText
            i18Text="discovery.numberPeople"
            i18Params={{
              value: p.number_people,
            }}
            customStyle={[
              styles.peoplePriceText,
              {
                width: '32%',
                color: theme.borderColor,
              },
            ]}
          />
          <StyleText
            originValue="-"
            customStyle={[
              styles.peoplePriceText,
              {
                color: theme.borderColor,
                marginRight: '12%',
              },
            ]}
          />
          <StyleText
            originValue={`${formatLocaleNumber(String(p.price))} vnd`}
            style={[styles.peoplePriceText, {color: theme.borderColor}]}
          />
        </View>
      ))}

      <StyleTouchable
        customStyle={[
          styles.buttonBox,
          {borderColor: theme.holderColorLighter},
        ]}
        onPress={() => onCancelRequesting()}>
        <StyleText
          i18Text="discovery.cancelRequest"
          customStyle={[styles.textCancel, {color: theme.borderColor}]}
        />
      </StyleTouchable>
    </View>
  );
};

const styles = ScaledSheet.create({
  requestUpdatePriceView: {
    width: '80%',
    paddingHorizontal: '15@s',
    paddingVertical: '5@vs',
    borderWidth: borderWidthTiny,
    marginTop: '10@vs',
    alignSelf: 'center',
    borderRadius: '5@ms',
  },
  textReviewingPrice: {
    fontSize: FONT_SIZE.small,
    fontWeight: 'bold',
  },
  textUpdatePrice: {
    fontSize: FONT_SIZE.small,
  },
  updatePriceBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  peoplePriceText: {
    fontSize: FONT_SIZE.small,
  },
  buttonBox: {
    marginTop: '10@vs',
    borderWidth: borderWidthTiny,
    alignItems: 'center',
    paddingVertical: '5@vs',
    borderRadius: '5@ms',
  },
  textCancel: {
    fontSize: FONT_SIZE.normal,
    fontWeight: 'bold',
  },
});

export default UpdatePriceStatus;
