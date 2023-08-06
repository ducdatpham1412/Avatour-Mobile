import {useAppSelector} from 'app-redux/store';
import {BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {GROUP_BUYING_STATUS} from 'asset/enum';
import {safePaddingNotZero} from 'asset/metrics';
import {AppModalize, BoxInformation, TextCountDown} from 'components';
import {
  StyleButton,
  StyleContainer,
  StyleImage,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {Avatar} from 'components/common';
import dayjs from 'dayjs';
import {useTheme} from 'hook';
import {goBack, navigate, push} from 'navigation/NavigationService';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import {ModalAlert, ModalScanQr} from 'navigation/screen/modals';
import React, {ElementRef, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ImageStyle,
  RefreshControl,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {I18Normalize} from 'utility/I18Next';
import {borderWidthTiny, logger, takePriceRange} from 'utility/assistant';
import {
  formatLocaleNumber,
  formatMoney,
  formatddddDDMMYYYY,
} from 'utility/format';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {ModalConfirmJoinGb, ModalGroup, ModalPeopleInGroup} from './components';
import {useDetailSale, useJoinPersonal} from './hooks';

const textDown = '\n';

const DetailMeJoin = ({
  route: {params},
}: RouteParams<AppParamsList[ROOT_SCREEN.detailMeJoin]>) => {
  const {saleId, joinId, mode} = params;
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();
  const {t} = useTranslation();
  const {id: myId, avatar} = useAppSelector(
    state => state.accountSlice.passport.profile,
  );

  const [
    {
      loadingJoin,
      data,
      refreshing,
      meJoins,
      loadingDeleteEstimate,
      loadingEditEstimate,
      loadingEstimate,
      initLoading,
    },
    {onRefresh, estimate, deleteEstimate, editEstimate},
  ] = useDetailSale(saleId, {
    revalidateAll: false,
  });
  const {
    data: joinPersonal,
    loading,
    mutate,
    validating,
  } = useJoinPersonal(joinId ?? params.joinPersonal?.id ?? null, {
    initValue: params.joinPersonal,
  });

  const loadingAll = initLoading || loadingEstimate || loading;

  const {estimate: joinEstimate} = meJoins ?? {};
  const maximumMember = data?.prices[data?.prices.length - 1].number_people;

  const modalJoinedRef = useRef<ElementRef<typeof AppModalize>>(null);
  const modalPeopleInGroup =
    useRef<ElementRef<typeof ModalPeopleInGroup>>(null);
  const modalConfirmJoinRef = useRef<ElementRef<typeof AppModalize>>(null);
  const isGoToDeposit = useRef(
    mode === 'go-to-deposit' || mode === 'go-to-deposit-from-profile',
  );

  useEffect(() => {
    // Call estimate if go to from ItemDeposit not have list personal
    if (isGoToDeposit.current && !joinEstimate?.list_personals?.length) {
      estimate();
    }
  }, [joinEstimate?.list_personals?.length]);

  /**
   * Functions
   */
  const onDeleteEstimate = () => {
    ModalAlert.options({
      onContinue: async () => {
        try {
          await deleteEstimate();
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

  const onEditEstimate = async (value: Omit<TypeJoinRequest, 'saleId'>) => {
    try {
      await editEstimate(value);
      modalConfirmJoinRef.current?.hide();
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    }
  };

  const onShowModalQR = async () => {
    try {
      if (data) {
        const res = await ModalScanQr.show();
        if (res) {
          const dataQR: QrData = JSON.parse(res.data);

          if (dataQR.user_id === data.creator) {
            ModalScanQr.hide();
            navigate(ROOT_SCREEN.scanResult, {
              mode: 'join-result',
              shop_id: data.creator,
            });
            return;
          }

          ModalScanQr.loading();
          // get profile shop here
          await ModalScanQr.hide();
          // show modal ask want to come to other shop
        }
      }
    } catch (err) {
      logger(err);
    }
  };

  const onPressSale = () => {
    switch (mode) {
      case 'see-detail-from-sale':
        goBack();
        break;
      case 'see-detail':
        push(ROOT_SCREEN.detailSale, {
          sale: data,
        });
        break;
      case 'go-to-deposit':
        goBack();
        break;
      case 'go-to-deposit-from-profile':
        push(ROOT_SCREEN.detailSale, {
          sale: data,
        });
        break;
      case 'go-from-scan':
        push(ROOT_SCREEN.detailSale, {
          sale: data,
        });
        break;
      default:
        break;
    }
  };

  /**
   * Render views
   */

  const renderStatus = () => {
    if (mode === 'go-to-deposit' || mode === 'go-to-deposit-from-profile') {
      return (
        <StyleText
          i18Text="discovery.goToDepositToConfirm"
          customStyle={[$textAlert, {marginTop: verticalScale(12)}]}
        />
      );
    }

    if (
      mode === 'see-detail' ||
      mode === 'see-detail-from-sale' ||
      mode === 'go-from-scan'
    ) {
      if (joinPersonal?.status === GROUP_BUYING_STATUS.notBoughtButOvertime) {
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

      if (joinPersonal?.status === GROUP_BUYING_STATUS.notBought) {
        const isToday = dayjs(joinPersonal?.time_will_buy).isToday();

        if (isToday) {
          return (
            <>
              <StyleText
                i18Text="discovery.todayIsTimeWillBuy"
                i18Params={{value: data?.creator_name}}
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

      if (joinPersonal?.status === GROUP_BUYING_STATUS.requestBought) {
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

      if (joinPersonal?.status === GROUP_BUYING_STATUS.bought) {
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
    }
  };

  const renderJoins = () => {
    if (!data) {
      return null;
    }

    if (joinPersonal) {
      const priceRange = takePriceRange(data?.prices, joinPersonal.amount);
      const moneyCanSavedMore = joinPersonal.price - priceRange.min;
      const isNotBought =
        joinPersonal.status === GROUP_BUYING_STATUS.notBought &&
        mode !== 'go-from-scan';
      const textPrice: I18Normalize = isNotBought
        ? 'discovery.nowPrice'
        : 'discovery.price';

      const groupFind = data?.groups.find(
        group => group.id === joinPersonal.group_id,
      );

      const renderMembers = () => {
        if (groupFind) {
          const totalBought = groupFind?.members
            ?.map(mem => mem.amount)
            .reduce((pre, next) => pre + next);

          return (
            <View style={$viewInfo}>
              <StyleText i18Text="discovery.numberJoinsWithYou">
                <StyleText originValue={` (${totalBought})`} />
              </StyleText>
              <View style={$listMembers}>
                <StyleTouchable
                  customStyle={$touchListMembers}
                  onPress={() =>
                    modalPeopleInGroup.current?.show({
                      group: groupFind,
                      isMySale: false,
                    })
                  }>
                  {groupFind?.members?.map((mem, index) => (
                    <View
                      key={index}
                      style={[$avatarMember, {borderColor: theme.gray_100}]}>
                      <Avatar source={{uri: mem.creator_avatar}} size={30} />
                      {mem.amount > 1 && (
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
                </StyleTouchable>
              </View>
            </View>
          );
        }

        return null;
      };

      return (
        <>
          <BoxInformation
            listInformation={[
              <StyleTouchable customStyle={$saleView} onPress={onPressSale}>
                <StyleImage
                  source={{uri: data?.images?.[0]}}
                  customStyle={$imageSale}
                />
                <View
                  style={[$saleInformation, {justifyContent: 'flex-start'}]}>
                  <StyleText
                    originValue={data?.name}
                    customStyle={$saleName}
                    numberOfLines={1}
                  />
                  <StyleText originValue={data?.content} numberOfLines={2} />
                </View>
                <StyleText
                  originValue={`x${joinPersonal.amount}`}
                  customStyle={$textAmount}
                />
              </StyleTouchable>,
              {
                title: 'discovery.arrivalTime',
                content: formatddddDDMMYYYY(joinPersonal.time_will_buy),
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
                title: textPrice,
                content: formatMoney(joinPersonal.price),
                noteProps: isNotBought
                  ? {
                      i18Text: 'discovery.priceCanBeDecrease',
                      i18Params: {
                        value: formatMoney(priceRange.min),
                      },
                      mode: 'html',
                      htmlTextBoldColor: theme.gray_700,
                      children: !!moneyCanSavedMore ? (
                        <>
                          <StyleText originValue={textDown} />
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
                        </>
                      ) : null,
                    }
                  : null,
              },
              {
                title: 'discovery.deposited',
                content: formatMoney(joinPersonal.deposit),
              },
              {
                title: 'discovery.moneyToPay',
                content: formatMoney(joinPersonal.price - joinPersonal.deposit),
                contentStyle: {color: theme.red},
              },
            ]}
            containerStyle={$depositView}
          />

          <BoxInformation
            containerStyle={$depositView}
            listInformation={[
              <View style={{width: '100%'}}>
                <StyleText i18Text="discovery.note" />
                <StyleText
                  originValue={joinPersonal.note}
                  customStyle={[$contentNote, {color: theme.gray_600}]}
                />
              </View>,
              <View style={$viewInfo}>
                <StyleText
                  i18Text="discovery.groupDay"
                  i18Params={{
                    value: groupFind?.name ?? '',
                  }}
                  customStyle={{fontWeight: FONT_WEIGHT_MEDIUM}}
                />
                <StyleText i18Text="discovery.maximumMembers">
                  <StyleText originValue={`: ${maximumMember}`} />
                </StyleText>
              </View>,
              renderMembers(),
            ]}
          />
        </>
      );
    }

    if (joinEstimate) {
      const priceRange = takePriceRange(data?.prices, joinEstimate.amount);
      const moneyCanSavedMore = joinEstimate.price - priceRange.min;

      return (
        <>
          <BoxInformation
            listInformation={[
              <StyleTouchable customStyle={$saleView} onPress={onPressSale}>
                <StyleImage
                  source={{uri: data?.images?.[0]}}
                  customStyle={$imageSale}
                />
                <View style={$saleInformation}>
                  <StyleText
                    originValue={data?.name}
                    customStyle={$saleName}
                    numberOfLines={1}
                  />
                  <StyleText originValue={data?.content} numberOfLines={1} />
                  {isGoToDeposit.current && (
                    <StyleTouchable
                      onPress={() => modalConfirmJoinRef.current?.show()}>
                      <StyleText
                        i18Text="common.edit"
                        customStyle={{
                          color: theme.blue,
                          fontWeight: FONT_WEIGHT_MEDIUM,
                        }}
                      />
                    </StyleTouchable>
                  )}
                </View>
                <StyleText
                  originValue={`x${joinEstimate.amount}`}
                  customStyle={$textAmount}
                />
              </StyleTouchable>,
              {
                title: 'discovery.arrivalTime',
                content: formatddddDDMMYYYY(joinEstimate?.time_will_buy),
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
                content: formatMoney(joinEstimate.price),
                contentStyle: {color: theme.red},
                noteProps: {
                  i18Text: 'discovery.priceCanBeChange',
                  mode: 'html',
                  htmlTextBoldColor: theme.gray_700,
                  children: !!moneyCanSavedMore ? (
                    <>
                      <StyleText originValue={textDown} />
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
                    </>
                  ) : null,
                },
              },
              {
                title: `${t('discovery.deposit')} (20%)`,
                content: formatMoney(joinEstimate.deposit),
                contentStyle: {color: theme.red},
              },
            ]}
            containerStyle={$depositView}
          />

          <BoxInformation
            listInformation={[
              {
                title: 'discovery.transactionHash',
                content: joinEstimate.hash,
                contentStyle: {flex: 1.7, fontWeight: 'normal'},
              },
              <View style={{width: '100%'}}>
                <StyleText i18Text="discovery.note" />
                <StyleText
                  originValue={joinEstimate.note}
                  customStyle={[$contentNote, {color: theme.gray_600}]}
                />
              </View>,
              <View style={$countdownView}>
                <StyleText i18Text="discovery.remainingTime">
                  <StyleText
                    originValue=":"
                    customStyle={{color: theme.gray_600}}
                  />
                </StyleText>
                <TextCountDown
                  initSeconds={dayjs(joinEstimate.expired).diff(
                    dayjs(),
                    'seconds',
                  )}
                />
              </View>,
            ]}
            containerStyle={$depositView}
          />
        </>
      );
    }

    return null;
  };

  const renderListPersonal = () => {
    if (isGoToDeposit.current && joinEstimate) {
      const renderMembers = (
        join: TypeJoinPersonal,
        groupFind: TypeGroupJoin | undefined,
      ) => {
        if (groupFind) {
          const totalBought = groupFind?.members
            ?.map(mem => mem.amount)
            .reduce((pre, next) => pre + next);

          return (
            <View style={$viewInfo}>
              <StyleText i18Text="discovery.numberJoinsWithYou">
                <StyleText originValue={` (${totalBought})`} />
              </StyleText>
              <View style={$listMembers}>
                <StyleTouchable
                  customStyle={$touchListMembers}
                  onPress={() =>
                    modalPeopleInGroup.current?.show({
                      group: groupFind,
                      isMySale: false,
                    })
                  }>
                  {groupFind?.members?.map((mem, index) => (
                    <View
                      key={index}
                      style={[$avatarMember, {borderColor: theme.gray_100}]}>
                      <Avatar source={{uri: mem.creator_avatar}} size={30} />
                      {mem.amount > 1 && (
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
                </StyleTouchable>
              </View>
            </View>
          );
        }

        return (
          <View style={$viewInfo}>
            <StyleText
              i18Text="discovery.newGroup"
              customStyle={{
                color: theme.blue,
                fontWeight: FONT_WEIGHT_MEDIUM,
              }}
            />
            <View style={$listMembers}>
              <StyleTouchable
                customStyle={$touchListMembers}
                onPress={() => {
                  modalPeopleInGroup.current?.show({
                    group: {
                      id: null,
                      name: t('discovery.estimate'),
                      total_members: join.amount,
                      created: joinEstimate?.created,
                      members: [join],
                    },
                    isMySale: false,
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
          </View>
        );
      };

      return (
        <>
          <StyleText
            i18Text="discovery.appliedPrice"
            customStyle={$textApplied}>
            <StyleText
              originValue={` (${t('discovery.estimate')})`}
              customStyle={$textApplied}
            />
          </StyleText>
          <StyleText
            i18Text="discovery.beInGroup"
            customStyle={$textClassified}
          />
          {joinEstimate?.list_personals?.map((join, index) => {
            const groupFind = data?.groups.find(
              group => group.id === join.group_id,
            );
            return (
              <BoxInformation
                key={index}
                listInformation={[
                  <View style={$viewInfo}>
                    <StyleText
                      i18Text="discovery.groupDay"
                      i18Params={{
                        value: groupFind
                          ? groupFind.name
                          : `(${t('discovery.estimate')})`,
                      }}
                      customStyle={{fontWeight: FONT_WEIGHT_MEDIUM}}
                    />
                    <StyleText i18Text="discovery.maximumMembers">
                      <StyleText originValue={`: ${maximumMember}`} />
                    </StyleText>
                  </View>,
                  renderMembers(join, groupFind),
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
                    title: `${t('discovery.deposit')} (20%)`,
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
  };

  const renderBottomComponent = () => {
    if (loadingAll) {
      return null;
    }

    if (mode === 'go-to-deposit' || mode === 'go-to-deposit-from-profile') {
      return (
        <View
          style={[
            $buttonView,
            {
              paddingBottom: bottom || safePaddingNotZero,
              backgroundColor: theme.background,
              shadowColor: theme.black,
            },
          ]}>
          <StyleButton
            title="common.cancel"
            containerStyle={[$buttonCancel, {borderColor: theme.black}]}
            titleStyle={{color: theme.black}}
            onPress={onDeleteEstimate}
            isLoading={loadingDeleteEstimate}
          />
          <StyleButton
            title="discovery.goToDeposit"
            containerStyle={{width: '70%'}}
            onPress={() => {
              if (joinEstimate) {
                navigate(ROOT_SCREEN.goToDeposit, {
                  joinEstimate,
                });
              }
            }}
            isLoading={loadingJoin}
          />
        </View>
      );
    }

    if (mode === 'see-detail' || mode === 'see-detail-from-sale') {
      if (joinPersonal?.status === GROUP_BUYING_STATUS.notBought) {
        return (
          <StyleButton
            title="profile.goToScan"
            containerStyle={{
              marginBottom: bottom || safePaddingNotZero,
              width: '90%',
            }}
            onPress={() => {
              if (data) {
                onShowModalQR();
              }
            }}
            isLoading={loadingJoin}
          />
        );
      }
      return null;
    }
  };

  return (
    <>
      <StyleContainer
        BottomComponent={renderBottomComponent()}
        headerProps={{
          title: data?.name as I18Normalize,
        }}
        scrollEnabled
        customStyle={{paddingBottom: bottom || safePaddingNotZero}}
        initLoading={loadingAll}
        refreshControl={
          <RefreshControl
            refreshing={loading || validating}
            onRefresh={mutate}
            tintColor={theme.p_600}
            colors={[theme.p_600]}
          />
        }>
        {renderStatus()}
        {renderJoins()}
        {renderListPersonal()}
      </StyleContainer>

      <ModalGroup
        ref={modalJoinedRef}
        groups={data?.groups || []}
        refreshing={refreshing}
        onRefresh={onRefresh}
        isMySale={data?.creator === myId}
      />

      <ModalPeopleInGroup ref={modalPeopleInGroup} />

      {!!joinEstimate && (
        <ModalConfirmJoinGb
          ref={modalConfirmJoinRef}
          onConfirm={onEditEstimate}
          loadingJoin={loadingEditEstimate}
          initValue={{
            amount: joinEstimate?.amount,
            time_will_buy: joinEstimate?.time_will_buy,
            note: joinEstimate?.note,
          }}
          titleButton="common.change"
        />
      )}
    </>
  );
};

const $depositView: ViewStyle = {
  marginTop: verticalScale(12),
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
  justifyContent: 'space-between',
};
const $joinView: ViewStyle = {
  width: '100%',
};
const $saleName: TextStyle = {
  fontWeight: 'bold',
};
const $textAmount: TextStyle = {
  fontWeight: 'bold',
};
const $listPeopleJoin: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(4),
  flexDirection: 'row',
  alignItems: 'center',
};
const $textAlert: TextStyle = {
  fontSize: FONT_SIZE.f2,
  textAlign: 'center',
};
const $groupView: ViewStyle = {
  marginTop: verticalScale(10),
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
const $buttonView: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingTop: verticalScale(8),
  shadowOpacity: 0.1,
  shadowOffset: {
    width: 0,
    height: -4,
  },
  paddingHorizontal: scale(12),
};
const $buttonCancel: ViewStyle = {
  width: '28%',
  backgroundColor: 'transparent',
  borderWidth: borderWidthTiny,
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
const $listMembers: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
};
const $touchListMembers: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: moderateScale(5),
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
