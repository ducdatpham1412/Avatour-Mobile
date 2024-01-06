import {useAppSelector} from 'app-redux/store';
import {BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {APP_EVENT, JOIN_STATUS} from 'asset/enum';
import Images from 'asset/img/images';
import {verticalMargin} from 'asset/metrics';
import {BoxInformation, TextCountDown} from 'components';
import {
  StyleContainer,
  StyleImage,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {Avatar, ButtonBottom} from 'components/common';
import dayjs from 'dayjs';
import {useSaleJoins} from 'feature/discovery/hooks';
import {CallBackCheckIn} from 'feature/profile/hooks';
import {
  emitAppEvent,
  useAppEvent,
  useEstimatesAndJoinings,
  useSafeArea,
  useTheme,
} from 'hook';
import LottieView from 'lottie-react-native';
import {
  getCurrentRoute,
  goBack,
  navigate,
  push,
  replace,
} from 'navigation/NavigationService';
import {AppParamsList, PROFILE_ROUTE, ROOT_SCREEN} from 'navigation/config';
import {ModalAlert} from 'navigation/screen/modals';
import React, {ElementRef, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ImageStyle,
  RefreshControl,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {KeyedMutator} from 'swr';
import {I18Normalize} from 'utility/I18Next';
import {
  randomAvt,
  renderListAvtInGroup,
  takePriceRange,
} from 'utility/assistant';
import {
  checkIsToday,
  formatLocaleNumber,
  formatMoney,
  formathhmmddddDDMMYYYY,
} from 'utility/format';
import {impactMedium} from 'utility/haptic';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {canSupplierConfirmBought} from 'utility/validate';
import {ModalGroup} from './components';
import {useDetailSale, useJoinEstimate} from './hooks';

interface CountDownProps {
  estimate: TypeJoinEstimate;
}

interface ButtonConfirmArrivedProps {
  estimate: TypeJoinEstimate;
  isGoFromScan: boolean;
}

interface ButtonConfirmBoughtProps {
  estimate: TypeJoinEstimate;
}

interface BannerCheckInProps {
  sale: TypeGroupBuying;
  join: TypeJoinEstimate;
  mutate: KeyedMutator<TypeJoinEstimate>;
}

const goToCheckIn = (sale: TypeGroupBuying, join: TypeJoinEstimate) => {
  const curRoute = getCurrentRoute();
  CallBackCheckIn.set(() => {
    navigate(curRoute.name, {
      key: curRoute.key,
      ...curRoute.params,
    });
  });
  navigate(PROFILE_ROUTE.createPostPickImg, {
    mode: 'check-in',
    user: {
      id: sale?.creator,
      name: sale?.creator_name,
      avatar: sale?.creator_avatar,
    },
    joinId: join.id,
  });
};

const CountDown = ({estimate}: CountDownProps) => {
  const theme = useTheme();
  const {mutate: mutateEstimateAndJoinings} = useEstimatesAndJoinings();

  const [expired, setExpired] = useState(
    dayjs(estimate.expired).isBefore(dayjs()),
  );

  if (expired) {
    return (
      <View style={$countdownView}>
        <StyleText i18Text="discovery.remainingTime">
          <StyleText originValue=":" customStyle={{color: theme.gray_600}} />
        </StyleText>
        <StyleText
          i18Text="discovery.expired"
          customStyle={{fontWeight: 'bold', color: theme.red}}
        />
      </View>
    );
  }

  return (
    <View style={$countdownView}>
      <StyleText i18Text="discovery.remainingTime">
        <StyleText originValue=":" customStyle={{color: theme.gray_600}} />
      </StyleText>
      <TextCountDown
        initSeconds={dayjs(estimate.expired).diff(dayjs(), 'seconds')}
        onFinished={async () => {
          setExpired(true);
          await mutateEstimateAndJoinings(
            pre => {
              if (pre) {
                return {
                  estimates: pre.estimates.filter(
                    item => item.id !== estimate.id,
                  ),
                  joinings: pre.joinings,
                };
              }
            },
            {revalidate: false},
          );
        }}
      />
    </View>
  );
};

const ButtonConfirmArrived = ({
  estimate,
  isGoFromScan,
}: ButtonConfirmArrivedProps) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const {mutate: mutateEstimateAndJoinings} = useEstimatesAndJoinings();
  const [{loadingConfirmArrived, priceDeposit}, {confirmArrived}] =
    useJoinEstimate(estimate.id, {
      initValue: estimate,
    });

  const onConfirmArrived = async () => {
    const isToday = checkIsToday(estimate.time_will_buy);

    if (isToday) {
      const agree = async () => {
        try {
          await confirmArrived([estimate.id]);
          /**
           * @Tag: Logic when confirm arrived
           */
          await mutateEstimateAndJoinings(
            pre => {
              if (pre) {
                return {
                  estimates: pre.estimates,
                  joinings: pre.joinings.filter(
                    item => item.id !== estimate.id,
                  ),
                };
              }
            },
            {revalidate: false},
          );
          emitAppEvent(APP_EVENT.refreshNotification);
          ModalAlert.success({
            i18Content: 'profile.joinedSuccess',
          });
        } catch (err) {
          ModalAlert.error({
            content: err,
          });
        }
      };

      ModalAlert.options({
        i18Content: 'alert.beSureConfirmWhenInStore',
        onContinue: agree,
      });

      return;
    }

    ModalAlert.notification({
      title: 'Opps' as I18Normalize,
      content: t('alert.timeBuyNotToday', {
        time: formathhmmddddDDMMYYYY(estimate.time_will_buy),
      }),
    });
  };

  return (
    <ButtonBottom
      action={{
        title: 'discovery.confirmArrived',
        onPress: onConfirmArrived,
        loading: loadingConfirmArrived,
      }}
      topComponent={
        isGoFromScan ? (
          <StyleText customStyle={{marginBottom: verticalMargin}}>
            <StyleText originValue={`${t('discovery.moneyToPay')}: `} />
            <StyleText
              originValue={formatMoney(
                priceDeposit.price - priceDeposit.deposit,
              )}
              customStyle={{fontWeight: 'bold', color: theme.red}}
            />
          </StyleText>
        ) : null
      }
    />
  );
};

const ButtonConfirmBought = ({estimate}: ButtonConfirmBoughtProps) => {
  const [
    {loadingConfirmBought, loadingApproveOrder, loadingRejectOrder},
    {confirmBought, rejectOrder, approveOrder},
  ] = useSaleJoins(estimate?.sale?.id);
  const [{data}, {mutate}] = useJoinEstimate(estimate.id, {
    initValue: estimate,
  });

  if (!data) {
    return null;
  }

  if (data.status === JOIN_STATUS.adminConfirm) {
    const isOverTimeUserCome = dayjs(data.time_will_buy).isBefore(dayjs());

    const onApprove = async () => {
      try {
        await approveOrder(estimate.id);
        ModalAlert.success({
          i18Content: 'profile.confirmSuccess',
          title: 'discovery.thankyou',
          icon: 'nice',
        });
        await mutate(
          () => {
            if (data) {
              return {
                ...data,
                status: JOIN_STATUS.supplierConfirm,
              };
            }
          },
          {revalidate: false},
        );
        emitAppEvent(APP_EVENT.refreshNotification);
      } catch (err) {
        ModalAlert.error({
          content: err,
        });
      }
    };

    const onReject = () => {
      ModalAlert.options({
        i18Content: 'profile.post.sureDeletePost',
        onContinue: async () => {
          try {
            await rejectOrder(estimate.id);
            await mutate(
              () => {
                if (data) {
                  return {
                    ...data,
                    status: JOIN_STATUS.supplierRejected,
                  };
                }
              },
              {revalidate: false},
            );
            emitAppEvent(APP_EVENT.refreshNotification);
          } catch (err) {
            ModalAlert.error({
              content: err,
            });
          }
        },
      });
    };

    return (
      <ButtonBottom
        action={{
          left: {
            title: 'common.cancel',
            onPress: onReject,
            loading: loadingRejectOrder,
            disable: isOverTimeUserCome || loadingApproveOrder,
          },
          right: {
            title: 'discovery.confirmOrder',
            onPress: onApprove,
            loading: loadingApproveOrder,
            disable: isOverTimeUserCome || loadingRejectOrder,
          },
        }}
        title={isOverTimeUserCome ? 'discovery.confirmOvertime' : undefined}
      />
    );
  }

  if (
    [
      JOIN_STATUS.supplierConfirm,
      JOIN_STATUS.overtime,
      JOIN_STATUS.consumerConfirmed,
      JOIN_STATUS.checkedIn,
    ].includes(data.status)
  ) {
    const canConfirm = canSupplierConfirmBought(estimate.status);

    const onConfirmBought = async () => {
      try {
        await confirmBought({
          list_join_id: [estimate?.id],
        });
        impactMedium();
        await mutate(
          () => {
            // Not use "pre" in here because we use fallback data, so sometime pre is undefined
            if (data) {
              return {
                ...data,
                status: JOIN_STATUS.supplierConfirmBought,
              };
            }
          },
          {revalidate: false},
        );
        emitAppEvent(APP_EVENT.refreshNotification);
      } catch (err) {
        ModalAlert.error({
          content: err,
        });
      }
    };

    return (
      <ButtonBottom
        title={canConfirm ? undefined : 'discovery.canNotConfirmNow'}
        action={{
          title: 'discovery.confirmBought',
          onPress: onConfirmBought,
          loading: loadingConfirmBought,
          disable: !canConfirm,
        }}
      />
    );
  }

  return null;
};

const BannerCheckIn = ({sale, join, mutate}: BannerCheckInProps) => {
  const {t} = useTranslation();

  useAppEvent(APP_EVENT.checkInSuccess, e => {
    if (e.joinId === join.id) {
      mutate(
        pre => {
          if (pre) {
            return {
              ...pre,
              status:
                pre.status === JOIN_STATUS.supplierConfirmBought
                  ? JOIN_STATUS.checkedInAndConfirmedBought
                  : JOIN_STATUS.checkedIn,
            };
          }
        },
        {revalidate: false},
      );
    }
  });

  useAppEvent(APP_EVENT.joinSuccess, e => {
    if (e.joinId === join.id) {
      mutate(
        pre => {
          if (pre) {
            return {
              ...pre,
              status: JOIN_STATUS.supplierConfirm,
            };
          }
        },
        {revalidate: false},
      );
    }
  });

  return (
    <>
      <LottieView
        source={Images.images.checkIn}
        autoPlay
        loop
        style={$iconCheckIn}
      />
      <StyleText style={$textCheckIn}>
        <StyleText
          i18Text="profile.goToCheckIn"
          customStyle={[
            $textCheckIn,
            {textDecorationLine: 'underline', fontWeight: 'bold'},
          ]}
          onPress={() => {
            goToCheckIn(sale, join);
          }}
        />
        <StyleText
          originValue={` ${t('profile.toSaveTheBestMoments')}`}
          customStyle={$textCheckIn}
        />
      </StyleText>
    </>
  );
};

const DetailMeJoin = ({
  route: {params},
}: RouteParams<AppParamsList[ROOT_SCREEN.detailMeJoin]>) => {
  const {estimateId, initValue, mode} = params;
  const theme = useTheme();
  const {paddingBottom} = useSafeArea();
  const {t} = useTranslation();
  const {avatar, id: myId} = useAppSelector(
    state => state.accountSlice.passport.profile,
  );

  const {mutate: mutateEstimateAndJoin} = useEstimatesAndJoinings();
  const [
    {data, priceDeposit, loading, validating, loadingDeleteEstimate},
    {mutate, deleteEstimate},
  ] = useJoinEstimate(estimateId, {
    initValue,
    revalidateAll: true,
  });
  const [{data: sale}] = useDetailSale(data?.sale.id, {revalidateAll: false});

  const modalGroup = useRef<ElementRef<typeof ModalGroup>>(null);

  const maximumMember =
    sale?.prices[sale?.prices.length - 1].number_people ?? 0;
  const isEstimate =
    data?.status === JOIN_STATUS.active ||
    data?.status === JOIN_STATUS.adminConfirm;
  const isMySale = data?.sale?.creator === myId;
  const canCheckIn =
    !isMySale &&
    (data?.status === JOIN_STATUS.supplierConfirmBought ||
      data?.status === JOIN_STATUS.consumerConfirmed) &&
    dayjs().diff(data?.time_will_buy, 'minutes') < 3 * 24 * 60 - 10; //10 minutes is time user do actions like select images and check-in

  /**
   * Functions
   */
  const onPressSale = () => {
    switch (mode) {
      case 'see-detail-from-sale':
        goBack();
        break;
      case 'see-detail':
        if (sale) {
          push(ROOT_SCREEN.detailSale, {
            saleId: sale?.id,
          });
        }
        break;
      case 'go-from-scan':
        if (sale) {
          push(ROOT_SCREEN.detailSale, {
            saleId: sale?.id,
          });
        }
        break;
      default:
        break;
    }
  };

  /**
   * Render views
   */
  const renderStatus = () => {
    if (isEstimate) {
      if (isMySale) {
        return null;
      }
      return (
        <StyleText
          i18Text="discovery.goToDepositToConfirm"
          customStyle={[$textAlert, {marginTop: verticalScale(12)}]}
        />
      );
    }

    if (data?.status === JOIN_STATUS.supplierConfirm) {
      const isToday = dayjs(data?.time_will_buy).isToday();

      if (isMySale) {
        if (isToday) {
          return (
            <StyleText
              i18Text="discovery.todayIsTimeWillBuy"
              i18Params={{value: sale?.creator_name}}
              customStyle={[
                $textAlert,
                {marginTop: verticalScale(12), color: theme.gray_600},
              ]}
              mode="html"
              htmlTextBoldColor={theme.black}
            />
          );
        }

        return null;
      }

      if (isToday) {
        return (
          <>
            <StyleText
              i18Text="discovery.todayIsTimeWillBuy"
              i18Params={{value: sale?.creator_name}}
              customStyle={[
                $textAlert,
                {marginTop: verticalScale(12), color: theme.gray_600},
              ]}
              mode="html"
              htmlTextBoldColor={theme.black}
            />
            <StyleText
              i18Text="profile.scanWhenGoToShop"
              customStyle={[$textAlert, {color: theme.gray_600}]}
            />
          </>
        );
      }

      return (
        <StyleText
          i18Text="profile.scanWhenGoToShop"
          customStyle={[
            $textAlert,
            {color: theme.gray_600, marginTop: verticalScale(12)},
          ]}
        />
      );
    }

    if (data?.status === JOIN_STATUS.supplierRejected) {
      return (
        <StyleText
          i18Text={
            isMySale
              ? 'discovery.notReceiveThisOrder'
              : 'discovery.shopNotReceiveOrderNow'
          }
          customStyle={[
            $textAlert,
            {
              marginTop: verticalScale(12),
              color: theme.red,
              fontWeight: FONT_WEIGHT_MEDIUM,
            },
          ]}
        />
      );
    }

    if (data?.status === JOIN_STATUS.overtime) {
      if (isMySale) {
        return (
          <StyleText
            i18Text="discovery.arrivalTimePassed"
            customStyle={[
              $textAlert,
              {marginTop: verticalScale(12), color: theme.gray_600},
            ]}
          />
        );
      }

      return (
        <>
          <StyleText
            i18Text="discovery.arrivalTimePassed"
            customStyle={[
              $textAlert,
              {marginTop: verticalScale(12), color: theme.gray_600},
            ]}
          />
          <StyleText
            i18Text="discovery.pleaseConfirmWithVendor"
            customStyle={[$textAlert, {color: theme.gray_600}]}
            mode="html"
            htmlTextBoldColor={theme.red}
          />
        </>
      );
    }

    if (
      data?.status === JOIN_STATUS.consumerConfirmed ||
      data?.status === JOIN_STATUS.checkedIn
    ) {
      return (
        <>
          <StyleText
            i18Text="profile.waitingConfirm"
            customStyle={[
              $textAlert,
              {
                marginTop: verticalScale(12),
                color: theme.p_800,
                fontWeight: FONT_WEIGHT_MEDIUM,
              },
            ]}
          />
          {canCheckIn && !!sale && (
            <BannerCheckIn sale={sale} join={data} mutate={mutate} />
          )}
          {data?.status === JOIN_STATUS.checkedIn && (
            <StyleText
              i18Text="profile.checkedIn"
              customStyle={[
                $textAlert,
                {
                  marginTop: verticalScale(4),
                  color: theme.green,
                  fontWeight: FONT_WEIGHT_MEDIUM,
                },
              ]}
            />
          )}
        </>
      );
    }

    if (
      data?.status === JOIN_STATUS.supplierConfirmBought ||
      data?.status === JOIN_STATUS.checkedInAndConfirmedBought
    ) {
      return (
        <>
          <StyleText
            i18Text="profile.joinedSuccess"
            customStyle={[
              $textAlert,
              {
                marginTop: verticalScale(12),
                color: theme.green,
                fontWeight: FONT_WEIGHT_MEDIUM,
              },
            ]}
          />
          {canCheckIn && !!sale && (
            <BannerCheckIn sale={sale} join={data} mutate={mutate} />
          )}
          {data?.status === JOIN_STATUS.checkedInAndConfirmedBought && (
            <StyleText
              i18Text="profile.checkedIn"
              customStyle={[
                $textAlert,
                {
                  marginTop: verticalScale(4),
                  color: theme.green,
                  fontWeight: FONT_WEIGHT_MEDIUM,
                },
              ]}
            />
          )}
        </>
      );
    }

    return null;
  };

  const renderInfo = () => {
    if (!data || !sale) {
      return null;
    }

    const priceRange = takePriceRange(sale?.prices, data.amount);
    const moneyCanSavedMore = priceDeposit.price - priceRange.min;

    if (isEstimate) {
      return (
        <>
          <BoxInformation
            listInformation={[
              <StyleTouchable customStyle={$saleView} onPress={onPressSale}>
                <StyleImage
                  source={{uri: sale?.images?.[0]}}
                  customStyle={$imageSale}
                />
                <View style={$saleInformation}>
                  <StyleText
                    originValue={sale.name}
                    customStyle={$saleName}
                    numberOfLines={1}
                  />
                  <StyleText
                    originValue={sale.content}
                    numberOfLines={2}
                    customStyle={[$saleContent, {color: theme.gray_500}]}
                  />
                </View>
                <StyleText
                  originValue={`x${data.amount}`}
                  customStyle={$textAmount}
                />
              </StyleTouchable>,
              {
                title: 'discovery.arrivalTime',
                content: formathhmmddddDDMMYYYY(data?.time_will_buy),
                contentStyle: $textNormal,
              },
              {
                title: 'discovery.estimatedPrice',
                content: `${formatLocaleNumber(priceRange.min)} - ${formatMoney(
                  priceRange.max,
                )}`,
                contentStyle: $textNormal,
                noteProps: {
                  i18Text: 'discovery.priceCanBeChange',
                  mode: 'html',
                  htmlTextBoldColor: theme.gray_700,
                },
              },
              {
                title: 'discovery.nowPrice',
                content: formatMoney(priceDeposit.price),
                contentStyle: {color: theme.green},
                noteProps: moneyCanSavedMore
                  ? {
                      i18Text: 'common.null',
                      children: (
                        <StyleText
                          i18Text="discovery.atAvatourWillBeDecrease"
                          mode="html"
                          i18Params={{
                            value: formatMoney(moneyCanSavedMore),
                          }}
                          customStyle={{
                            fontSize: FONT_SIZE.f4,
                            color: theme.gray_500,
                          }}
                          htmlTextBoldColor={theme.blue}
                        />
                      ),
                    }
                  : null,
              },
              {
                title: `${t('discovery.deposit')} (~20%)`,
                content: formatMoney(priceDeposit.deposit),
                contentStyle: {color: theme.red},
              },
            ]}
            containerStyle={$infoView}
          />

          <BoxInformation
            listInformation={[
              <View style={{width: '100%'}}>
                <StyleText i18Text="discovery.note" />
                {!!data?.note && (
                  <StyleText
                    originValue={data.note}
                    customStyle={[$contentNote, {color: theme.gray_600}]}
                  />
                )}
              </View>,
              <CountDown estimate={data} />,
            ]}
            containerStyle={$infoView}
          />
        </>
      );
    }

    if (
      data.status === JOIN_STATUS.supplierConfirm ||
      data.status === JOIN_STATUS.supplierRejected
    ) {
      return (
        <>
          <BoxInformation
            listInformation={[
              <StyleTouchable customStyle={$saleView} onPress={onPressSale}>
                <StyleImage
                  source={{uri: sale?.images?.[0]}}
                  customStyle={$imageSale}
                />
                <View style={$saleInformation}>
                  <StyleText
                    originValue={sale.name}
                    customStyle={$saleName}
                    numberOfLines={1}
                  />
                  <StyleText
                    originValue={sale.content}
                    numberOfLines={2}
                    customStyle={[$saleContent, {color: theme.gray_500}]}
                  />
                </View>
                <StyleText
                  originValue={`x${data.amount}`}
                  customStyle={$textAmount}
                />
              </StyleTouchable>,
              {
                title: 'discovery.arrivalTime',
                content: formathhmmddddDDMMYYYY(data?.time_will_buy),
                contentStyle: $textNormal,
              },
              {
                title: 'discovery.estimatedPrice',
                content: `${formatLocaleNumber(priceRange.min)} - ${formatMoney(
                  priceRange.max,
                )}`,
                contentStyle: $textNormal,
              },
              {
                title: 'discovery.nowPrice',
                content: formatMoney(priceDeposit.price),
                contentStyle: $textNormal,
                noteProps: moneyCanSavedMore
                  ? {
                      i18Text: 'common.null',
                      children: (
                        <StyleText
                          i18Text="discovery.atAvatourWillBeDecrease"
                          mode="html"
                          i18Params={{
                            value: formatMoney(moneyCanSavedMore),
                          }}
                          customStyle={{
                            fontSize: FONT_SIZE.f4,
                            color: theme.gray_500,
                          }}
                          htmlTextBoldColor={theme.blue}
                        />
                      ),
                    }
                  : null,
              },
              {
                title: t('discovery.deposited'),
                content: formatMoney(priceDeposit.deposit),
                contentStyle: $textNormal,
              },
              {
                title: 'discovery.moneyToPay',
                content: formatMoney(priceDeposit.price - priceDeposit.deposit),
                contentStyle: {color: theme.red},
              },
            ]}
            containerStyle={$infoView}
          />

          <BoxInformation
            listInformation={[
              {
                title: 'discovery.transactionHash',
                content: data.hash,
                contentStyle: [$textNormal, {flex: 1.7}],
              },
              <View style={{width: '100%'}}>
                <StyleText i18Text="discovery.note" />
                {!!data?.note && (
                  <StyleText
                    originValue={data.note}
                    customStyle={[$contentNote, {color: theme.gray_600}]}
                  />
                )}
              </View>,
            ]}
            containerStyle={$infoView}
          />
        </>
      );
    }

    if (
      [
        JOIN_STATUS.overtime,
        JOIN_STATUS.consumerConfirmed,
        JOIN_STATUS.checkedIn,
        JOIN_STATUS.supplierConfirmBought,
        JOIN_STATUS.checkedInAndConfirmedBought,
      ].includes(data.status)
    ) {
      return (
        <>
          <BoxInformation
            listInformation={[
              <StyleTouchable customStyle={$saleView} onPress={onPressSale}>
                <StyleImage
                  source={{uri: sale?.images?.[0]}}
                  customStyle={$imageSale}
                />
                <View style={$saleInformation}>
                  <StyleText
                    originValue={sale.name}
                    customStyle={$saleName}
                    numberOfLines={1}
                  />
                  <StyleText
                    originValue={sale.content}
                    numberOfLines={2}
                    customStyle={[$saleContent, {color: theme.gray_500}]}
                  />
                </View>
                <StyleText
                  originValue={`x${data.amount}`}
                  customStyle={$textAmount}
                />
              </StyleTouchable>,
              {
                title: 'discovery.arrivalTime',
                content: formathhmmddddDDMMYYYY(data?.time_will_buy),
                contentStyle: $textNormal,
              },
              {
                title: 'discovery.allPrice',
                content: formatMoney(priceDeposit.price),
                contentStyle: $textNormal,
              },
              {
                title: t('discovery.deposited'),
                content: formatMoney(priceDeposit.deposit),
                contentStyle: $textNormal,
              },
              {
                title: 'discovery.moneyToPay',
                content: formatMoney(priceDeposit.price - priceDeposit.deposit),
                contentStyle: {color: theme.red},
              },
            ]}
            containerStyle={$infoView}
          />

          <BoxInformation
            listInformation={[
              {
                title: 'discovery.transactionHash',
                content: data.hash,
                contentStyle: [$textNormal, {flex: 1.7}],
              },
              <View style={{width: '100%'}}>
                <StyleText i18Text="discovery.note" />
                {!!data?.note && (
                  <StyleText
                    originValue={data.note}
                    customStyle={[$contentNote, {color: theme.gray_600}]}
                  />
                )}
              </View>,
              isEstimate ? <CountDown estimate={data} /> : null,
            ]}
            containerStyle={$infoView}
          />
        </>
      );
    }
  };

  const renderListPersonal = () => {
    if (!data) {
      return null;
    }

    const renderPersonal = (join: TypeJoinPersonal, index: number) => {
      const {listAvatars} = renderListAvtInGroup({
        join,
        indexInGroup: index,
        isEstimate,
        maxMembers: maximumMember,
      });

      return (
        <View style={$rowMembers}>
          <View style={$membersBox}>
            {listAvatars.map((avt, i) => {
              if (avt === 'me') {
                return (
                  <Avatar
                    key={i}
                    source={{uri: avatar}}
                    size={32}
                    style={{
                      borderWidth: moderateScale(2),
                      borderColor: theme.orange,
                    }}
                  />
                );
              }

              if (avt === 'other') {
                return (
                  <Avatar
                    key={i}
                    source={randomAvt()}
                    size={32}
                    style={{opacity: 0.7}}
                  />
                );
              }

              return (
                <View
                  key={i}
                  style={[
                    $avtNull,
                    {
                      borderColor: theme.gray_300,
                    },
                  ]}
                />
              );
            })}
          </View>
          <StyleText
            i18Text="discovery.groupDay"
            i18Params={{
              value: isEstimate
                ? `(${t('discovery.estimate')})`
                : join.group?.name,
            }}
            customStyle={[
              $textGroupName,
              {
                color: theme.blue,
              },
            ]}
            onPress={() => {
              modalGroup.current?.show({
                join,
                info: {
                  maxMembers: maximumMember,
                  isEstimate,
                  indexGroup: index,
                },
              });
            }}
          />
        </View>
      );
    };

    const textPx = isEstimate
      ? `${t('discovery.appliedPrice')} (${t('discovery.estimate')})`
      : t('discovery.appliedPrice');

    return (
      <>
        <StyleText originValue={textPx} customStyle={$textApplied} />
        {!isMySale && (
          <StyleText
            i18Text={
              isEstimate ? 'discovery.beInGroupEstimate' : 'discovery.beInGroup'
            }
            customStyle={$textClassified}
          />
        )}
        <BoxInformation
          listInformation={data.list_personals.map((j, i) =>
            renderPersonal(j, i),
          )}
          containerStyle={$groupView}
        />
      </>
    );
  };

  const renderBottomComponent = () => {
    if (loading || !data || !sale) {
      return null;
    }

    if (isMySale) {
      return <ButtonConfirmBought estimate={data} />;
    }

    if (isEstimate) {
      const onDeleteEstimate = () => {
        ModalAlert.options({
          onContinue: async () => {
            try {
              await deleteEstimate();
              await mutateEstimateAndJoin(
                pre => {
                  if (pre) {
                    return {
                      estimates: pre.estimates.filter(
                        item => item.id !== estimateId,
                      ),
                      joinings: pre.joinings,
                    };
                  }
                },
                {revalidate: false},
              );
              goBack();
            } catch (err) {
              ModalAlert.error({
                content: err,
              });
            }
          },
          i18Content: 'alert.sureToDeleteJoin',
        });
      };

      const onGoToDeposit = () => {
        if (data) {
          if (dayjs(data.expired).isBefore(dayjs())) {
            ModalAlert.error({
              title: 'discovery.expired',
              i18Content: 'discovery.orderExpired',
              onClose: async () => {
                if (mode === 'see-detail-from-sale') {
                  goBack();
                } else {
                  replace(ROOT_SCREEN.detailSale, {
                    saleId: data.sale.id,
                  });
                }
              },
            });
          } else {
            navigate(ROOT_SCREEN.goToDeposit, {
              joinEstimate: data,
            });
          }
        }
      };

      return (
        <ButtonBottom
          action={{
            left: {
              title: 'common.cancel',
              onPress: onDeleteEstimate,
              loading: loadingDeleteEstimate,
            },
            right: {
              title: 'discovery.goToDeposit',
              onPress: onGoToDeposit,
            },
          }}
        />
      );
    }

    if (data?.status === JOIN_STATUS.supplierConfirm) {
      return (
        <ButtonConfirmArrived
          estimate={data}
          isGoFromScan={mode === 'go-from-scan'}
        />
      );
    }

    if (canCheckIn) {
      return (
        <ButtonBottom
          action={{
            title: 'profile.checkIn',
            onPress: () => goToCheckIn(sale, data),
          }}
        />
      );
    }

    return null;
  };

  return (
    <>
      <StyleContainer
        BottomComponent={renderBottomComponent()}
        headerProps={{
          title: data?.sale?.name as I18Normalize,
        }}
        backgroundColor={theme.background}
        scrollEnabled
        initLoading={loading}
        refreshControl={
          <RefreshControl
            refreshing={validating}
            onRefresh={() => {
              mutate();
              if (isEstimate || data?.status === JOIN_STATUS.supplierConfirm) {
                mutateEstimateAndJoin();
              }
            }}
            tintColor={theme.p_600}
            colors={[theme.p_600]}
          />
        }
        customStyle={{paddingBottom}}>
        {renderStatus()}
        {renderInfo()}
        {renderListPersonal()}
      </StyleContainer>

      <ModalGroup ref={modalGroup} />
    </>
  );
};

const $infoView: ViewStyle = {
  marginTop: verticalMargin,
};
const $contentNote: TextStyle = {
  marginTop: verticalScale(5),
};
const $saleView: ViewStyle = {
  flexDirection: 'row',
};
const $imageSale: ImageStyle = {
  width: moderateScale(64),
  height: moderateScale(64),
  borderRadius: BORDER_RADIUS.f3,
};
const $saleInformation: ViewStyle = {
  flex: 1,
  paddingHorizontal: scale(12),
};
const $saleName: TextStyle = {
  fontWeight: 'bold',
};
const $saleContent: TextStyle = {
  marginTop: verticalScale(2),
  fontSize: FONT_SIZE.f3,
};
const $textAmount: TextStyle = {
  fontWeight: 'bold',
};
const $textAlert: TextStyle = {
  fontSize: FONT_SIZE.f3,
  textAlign: 'center',
};
const $groupView: ViewStyle = {
  marginTop: verticalMargin,
};
const $textApplied: TextStyle = {
  marginTop: verticalScale(24),
  fontWeight: 'bold',
  fontSize: FONT_SIZE.f1,
};
const $textClassified: TextStyle = {
  marginTop: verticalScale(2),
  fontSize: FONT_SIZE.f3,
};
const $countdownView: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
};
const $textNormal: TextStyle = {
  fontWeight: 'normal',
};
const $iconCheckIn: ViewStyle = {
  width: scale(200),
  height: scale(200),
  alignSelf: 'center',
};
const $textCheckIn: TextStyle = {
  fontSize: FONT_SIZE.f3,
  textAlign: 'center',
  alignSelf: 'center',
};
const $avtNull: ViewStyle = {
  width: moderateScale(32),
  height: moderateScale(32),
  borderRadius: 50,
  borderWidth: moderateScale(1),
};
const $rowMembers: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};
const $membersBox: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  gap: scale(4),
};
const $textGroupName: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
  textDecorationLine: 'underline',
  fontSize: FONT_SIZE.f3,
};

export default DetailMeJoin;
