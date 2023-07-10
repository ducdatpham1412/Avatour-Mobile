import {useAppSelector} from 'app-redux/store';
import {BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {safePaddingNotZero} from 'asset/metrics';
import {BoxInformation, TextCountDown} from 'components';
import {
  StyleButton,
  StyleContainer,
  StyleText,
  StyleTouchable,
} from 'components/base';
import dayjs from 'dayjs';
import {useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {TextStyle, View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {borderWidthTiny, copy} from 'utility/assistant';
import {formatMoney} from 'utility/format';
import {scale, verticalScale} from 'utility/scale';

const GoToDeposit = ({
  route: {
    params: {joinEstimate},
  },
}: RouteParams<AppParamsList[ROOT_SCREEN.goToDeposit]>) => {
  const {bottom} = useSafeAreaInsets();
  const theme = useTheme();
  const {
    t,
    i18n: {language},
  } = useTranslation();
  const {deposit_bank} = useAppSelector(state => state.logicSlice.resource);

  const bankName = `${deposit_bank.code} (${
    language === 'vi' ? deposit_bank.name.vi : deposit_bank.name.en
  })`;
  const transactionContent = `Dat coc ${joinEstimate.hash}`;

  return (
    <StyleContainer
      headerProps={{title: 'discovery.goToDeposit'}}
      BottomComponent={
        <StyleButton
          containerStyle={{
            marginBottom: bottom || safePaddingNotZero,
            width: '80%',
          }}
          onPress={() => navigate(ROOT_SCREEN.mainScreen)}
          title="discovery.backToHome"
        />
      }
      scrollEnabled
      customStyle={{paddingBottom: verticalScale(8)}}>
      <StyleText
        i18Text="discovery.yourTransactionHash"
        i18Params={{
          value: joinEstimate.hash,
        }}
        customStyle={$textHash}
      />

      <BoxInformation
        listInformation={[
          {
            title: 'profile.accountNumber',
            content: deposit_bank.account_number,
            iconRight: (
              <StyleTouchable onPress={() => copy(deposit_bank.account_number)}>
                <StyleText
                  i18Text="common.copy"
                  customStyle={[$textCopy, {color: theme.blue}]}
                />
              </StyleTouchable>
            ),
          },
          {
            title: 'profile.bankName',
            content: bankName,
            contentStyle: {flex: 2.3, fontWeight: 'normal'},
          },
          {
            title: 'profile.accountHolder',
            content: deposit_bank.account_holder,
            contentStyle: {fontWeight: 'normal'},
          },
          {
            title: 'discovery.transactionMoney',
            content: formatMoney(joinEstimate.deposit),
            contentStyle: {color: theme.red},
          },
          <>
            <StyleText
              i18Text="discovery.transactionContent"
              customStyle={$textNotifyContent}>
              <StyleText originValue=":" customStyle={$textNotifyContent} />
            </StyleText>
            <View
              style={[
                $transactionContent,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.gray_300,
                },
              ]}>
              <StyleText
                originValue={transactionContent}
                customStyle={$textContent}
              />
              <StyleTouchable onPress={() => copy(transactionContent)}>
                <StyleText
                  i18Text="common.copy"
                  customStyle={[$textCopy, {color: theme.blue}]}
                />
              </StyleTouchable>
            </View>
          </>,
          <View style={$countdownView}>
            <StyleText
              i18Text="discovery.remainingTime"
              customStyle={{color: theme.gray_600}}>
              <StyleText
                originValue=":"
                customStyle={{color: theme.gray_600}}
              />
            </StyleText>
            <TextCountDown
              initSeconds={dayjs(joinEstimate.expired).diff(dayjs(), 'seconds')}
            />
          </View>,
        ]}
        containerStyle={$informationView}
      />

      <View style={[$textEndView, {borderColor: theme.gray_600}]}>
        <StyleText
          i18Text="discovery.ifHaveAnyCase"
          customStyle={[$textEnd, {color: theme.gray_600}]}
        />
      </View>
    </StyleContainer>
  );
};

const $textHash: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
  fontSize: FONT_SIZE.f3,
  marginTop: verticalScale(4),
};
const $informationView: ViewStyle = {
  marginTop: verticalScale(8),
};
const $textEndView: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(8),
  paddingHorizontal: scale(8),
  paddingVertical: verticalScale(4),
  borderWidth: borderWidthTiny,
  borderRadius: BORDER_RADIUS.f3,
};
const $textEnd: TextStyle = {
  fontSize: FONT_SIZE.f3,
};
const $textCopy: TextStyle = {
  fontSize: FONT_SIZE.f4,
  textDecorationLine: 'underline',
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $transactionContent: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(12),
  paddingHorizontal: scale(8),
  paddingVertical: verticalScale(12),
  borderRadius: BORDER_RADIUS.f3,
  borderWidth: borderWidthTiny,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};
const $textContent: TextStyle = {
  flex: 1,
  paddingRight: scale(4),
};
const $countdownView: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
};
const $textNotifyContent: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
};

export default GoToDeposit;
