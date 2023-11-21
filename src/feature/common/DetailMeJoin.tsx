import {useAppSelector} from 'app-redux/store';
import {BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {JOIN_STATUS} from 'asset/enum';
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
import {useEstimatesAndJoinings, useSafeArea, useTheme} from 'hook';
import {goBack, navigate, push, replace} from 'navigation/NavigationService';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
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
import {I18Normalize} from 'utility/I18Next';
import {takePriceRange} from 'utility/assistant';
import {
  checkIsToday,
  formatLocaleNumber,
  formatMoney,
  formatddddDDMMYYYY,
} from 'utility/format';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {canSupplierConfirmBought} from 'utility/validate';
import {ModalPeopleInGroup} from './components';
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
        time: formatddddDDMMYYYY(estimate.time_will_buy),
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
        await mutate(
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
              pre => {
                if (pre) {
                  return {
                    ...pre,
                    status: JOIN_STATUS.supplierRejected,
                  };
                }
              },
              {revalidate: false},
            );
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
            loading: loadingRejectOrder,
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
    ].includes(data.status)
  ) {
    const canConfirm = canSupplierConfirmBought(estimate.status);

    const onConfirmBought = async () => {
      try {
        await confirmBought({
          list_join_id: [estimate?.id],
        });
        await mutate(
          () => {
            if (data) {
              return {
                ...data,
                status: JOIN_STATUS.supplierConfirmBought,
              };
            }
          },
          {revalidate: false},
        );
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
  });
  const [{data: sale}] = useDetailSale(data?.sale.id, {revalidateAll: false});

  const modalPeopleInGroup =
    useRef<ElementRef<typeof ModalPeopleInGroup>>(null);

  const maximumMember = sale?.prices[sale?.prices.length - 1].number_people;
  const isEstimate =
    data?.status === JOIN_STATUS.active ||
    data?.status === JOIN_STATUS.adminConfirm;
  const isMySale = data?.sale?.creator === myId;

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

    if (data?.status === JOIN_STATUS.consumerConfirmed) {
      return (
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
      );
    }

    if (data?.status === JOIN_STATUS.supplierConfirmBought) {
      return (
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
                content: formatddddDDMMYYYY(data?.time_will_buy),
                contentStyle: {fontWeight: 'normal'},
              },
              {
                title: 'discovery.estimatedPrice',
                content: `${formatLocaleNumber(priceRange.min)} - ${formatMoney(
                  priceRange.max,
                )}`,
                contentStyle: {
                  fontWeight: 'normal',
                },
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
                            fontSize: FONT_SIZE.f3,
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

    if (data.status === JOIN_STATUS.supplierConfirm) {
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
                content: formatddddDDMMYYYY(data?.time_will_buy),
                contentStyle: {fontWeight: 'normal'},
              },
              {
                title: 'discovery.estimatedPrice',
                content: `${formatLocaleNumber(priceRange.min)} - ${formatMoney(
                  priceRange.max,
                )}`,
                contentStyle: {
                  fontWeight: 'normal',
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
                            fontSize: FONT_SIZE.f3,
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
                contentStyle: {fontWeight: 'normal'},
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
                contentStyle: {flex: 1.7, fontWeight: 'normal'},
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
        JOIN_STATUS.supplierConfirmBought,
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
                content: formatddddDDMMYYYY(data?.time_will_buy),
                contentStyle: {fontWeight: 'normal'},
              },
              {
                title: 'discovery.price',
                content: formatMoney(priceDeposit.price),
                contentStyle: {color: theme.green},
              },
              {
                title: `${t('discovery.deposit')} (~20%)`,
                content: formatMoney(priceDeposit.deposit),
                contentStyle: {fontWeight: 'normal'},
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
                contentStyle: {flex: 1.7, fontWeight: 'normal'},
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

    if (isEstimate) {
      const renderMembers = (join: TypeJoinPersonal) => {
        const isNewGroup = join.amount === join.group.total_members;

        if (isNewGroup) {
          return (
            <View style={$viewInfo}>
              <View style={$infoGroup}>
                <StyleText
                  i18Text="discovery.newGroup"
                  customStyle={{
                    fontWeight: FONT_WEIGHT_MEDIUM,
                  }}
                />
              </View>
              <StyleTouchable
                customStyle={$touchListMembers}
                onPress={() => {
                  modalPeopleInGroup.current?.show({
                    groupId: null,
                    initData: {
                      id: null,
                      name: t('discovery.estimate'),
                      total_members: join.amount,
                      created: data?.created,
                      members: [join],
                    },
                  });
                }}>
                <View style={[$avatarMember, {borderColor: theme.gray_100}]}>
                  <Avatar source={{uri: avatar}} size={30} />
                  {join.amount > 1 && (
                    <View
                      style={[
                        $amountAvatarMember,
                        {
                          backgroundColor: theme.gray_100,
                        },
                      ]}>
                      <StyleText
                        originValue={`x${join.amount}`}
                        customStyle={{fontSize: moderateScale(9)}}
                      />
                    </View>
                  )}
                </View>
              </StyleTouchable>
            </View>
          );
        }

        return (
          <View style={$viewInfo}>
            <View style={$infoGroup}>
              <StyleText
                i18Text="discovery.numberJoinsNow"
                i18Params={{
                  value: join.group.total_members - join.amount,
                }}
              />
              <StyleText
                i18Text="discovery.whenYouComeGroupHave"
                i18Params={{
                  value: join.group.total_members,
                }}
                customStyle={[$textWhenJoined, {color: theme.gray_600}]}
              />
            </View>
            <View style={$touchListMembers}>
              {[
                Images.images.avatar01,
                Images.images.avatar02,
                Images.images.avatar03,
              ].map((source, index) => (
                <View
                  key={index}
                  style={[$avatarMember, {borderColor: theme.gray_100}]}>
                  <Avatar source={source} size={30} />
                </View>
              ))}
            </View>
          </View>
        );
      };

      return (
        <>
          <StyleText
            originValue={`${t('discovery.appliedPrice')} (${t(
              'discovery.estimate',
            )})`}
            customStyle={$textApplied}
          />
          <StyleText
            i18Text="discovery.beInGroupEstimate"
            customStyle={$textClassified}
          />
          {data?.list_personals?.map((join, index) => {
            return (
              <BoxInformation
                key={index}
                listInformation={[
                  <View style={$groupDay}>
                    <StyleText
                      i18Text="discovery.groupDay"
                      i18Params={{
                        value: join.group.id
                          ? `${join.group.name} (${t('discovery.estimate')})`
                          : `(${t('discovery.estimate')})`,
                      }}
                      customStyle={{fontWeight: FONT_WEIGHT_MEDIUM}}
                    />
                    <StyleText
                      i18Text="discovery.maximumMembers"
                      customStyle={$textMaximum}>
                      <StyleText originValue={`: ${maximumMember}`} />
                    </StyleText>
                  </View>,
                  renderMembers(join),
                  {
                    title: 'discovery.unitPrice',
                    content: formatMoney(join.price / join.amount),
                    contentStyle: {fontWeight: 'normal'},
                  },
                  {
                    title: 'discovery.amount',
                    content: join.amount,
                  },
                  {
                    title: 'discovery.allPrice',
                    content: formatMoney(join.price),
                  },
                  {
                    title: `${t('discovery.deposit')} (~20%)`,
                    content: formatMoney(join.deposit),
                    contentStyle: {fontWeight: 'normal'},
                  },
                ]}
                containerStyle={$groupView}
              />
            );
          })}
        </>
      );
    }

    const renderMembers = (join: TypeJoinPersonal) => {
      return (
        <View style={$viewInfo}>
          <View style={$infoGroup}>
            <StyleText
              i18Text="discovery.numberJoinsNow"
              i18Params={{
                value: join.group.total_members,
              }}
            />
          </View>
          <StyleTouchable
            customStyle={{alignItems: 'flex-end'}}
            onPress={() => {
              modalPeopleInGroup.current?.show({
                groupId: join.group.id,
              });
            }}>
            <View style={$touchListMembers}>
              {[
                Images.images.avatar01,
                Images.images.avatar02,
                Images.images.avatar03,
              ].map((source, index) => (
                <View
                  key={index}
                  style={[$avatarMember, {borderColor: theme.gray_100}]}>
                  <Avatar source={source} size={30} />
                </View>
              ))}
            </View>
            <StyleText
              i18Text="discovery.seeMembers"
              customStyle={[$textSeeMember, {color: theme.blue}]}
            />
          </StyleTouchable>
        </View>
      );
    };

    return (
      <>
        <StyleText
          i18Text="discovery.appliedPrice"
          customStyle={$textApplied}
        />
        <StyleText
          i18Text={
            isEstimate ? 'discovery.beInGroupEstimate' : 'discovery.beInGroup'
          }
          customStyle={$textClassified}
        />
        {data?.list_personals?.map((join, index) => {
          return (
            <BoxInformation
              key={index}
              listInformation={[
                <View style={$groupDay}>
                  <StyleText
                    i18Text="discovery.groupDay"
                    i18Params={{
                      value: isEstimate
                        ? `(${t('discovery.estimate')})`
                        : join.group.name,
                    }}
                    customStyle={{fontWeight: FONT_WEIGHT_MEDIUM}}
                  />
                  <StyleText
                    i18Text="discovery.maximumMembers"
                    customStyle={$textMaximum}>
                    <StyleText originValue={`: ${maximumMember}`} />
                  </StyleText>
                </View>,
                renderMembers(join),
                {
                  title: 'discovery.unitPrice',
                  content: formatMoney(join.price / join.amount),
                  contentStyle: {fontWeight: 'normal'},
                },
                {
                  title: 'discovery.amount',
                  content: join.amount,
                  contentStyle: {fontWeight: 'normal'},
                },
                {
                  title: 'discovery.allPrice',
                  content: formatMoney(join.price),
                },
                {
                  title: `${t('discovery.deposit')} (~20%)`,
                  content: formatMoney(join.deposit),
                  contentStyle: {fontWeight: 'normal'},
                },
              ]}
              containerStyle={$groupView}
            />
          );
        })}
      </>
    );
  };

  const renderBottomComponent = () => {
    if (loading || !data) {
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

    return null;
  };

  return (
    <>
      <StyleContainer
        BottomComponent={renderBottomComponent()}
        headerProps={{
          title: data?.sale?.name as I18Normalize,
        }}
        scrollEnabled
        initLoading={loading}
        refreshControl={
          <RefreshControl
            refreshing={validating}
            onRefresh={() => {
              mutate();
              if (isEstimate || data?.status === JOIN_STATUS.adminConfirm) {
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

      <ModalPeopleInGroup ref={modalPeopleInGroup} />
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
const $viewInfo: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};
const $groupDay: ViewStyle = {
  width: '100%',
};
const $textMaximum: TextStyle = {
  marginTop: verticalScale(4),
};
const $infoGroup: ViewStyle = {
  flex: 1,
  paddingRight: scale(4),
};
const $textWhenJoined: TextStyle = {
  fontSize: FONT_SIZE.f4,
};
const $textSeeMember: TextStyle = {
  fontSize: FONT_SIZE.f4,
  textDecorationLine: 'underline',
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $touchListMembers: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};
const $avatarMember: ViewStyle = {
  borderWidth: moderateScale(1),
  borderRadius: 100,
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

export default DetailMeJoin;
