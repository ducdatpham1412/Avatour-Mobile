import {useAppSelector} from 'app-redux/store';
import {FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {GROUP_BUYING_STATUS} from 'asset/enum';
import Images from 'asset/img/images';
import {safePaddingNotZero} from 'asset/metrics';
import {AppModalize, BoxInformation, BoxView, TextCountDown} from 'components';
import {
  StyleButton,
  StyleContainer,
  StyleIcon,
  StyleImage,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {Avatar, RightIcon} from 'components/common';
import dayjs from 'dayjs';
import {useTheme} from 'hook';
import {goBack, navigate, push} from 'navigation/NavigationService';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import {ModalAlert, ModalScanQr} from 'navigation/screen/modals';
import React, {ElementRef, useEffect, useRef} from 'react';
import {
  ImageStyle,
  RefreshControl,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {I18Normalize} from 'utility/I18Next';
import {borderWidthTiny, calculateTotalJoins, logger} from 'utility/assistant';
import {formatDDMMMMYY, formatMoney, formatddddDDMMYYYY} from 'utility/format';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {ModalConfirmJoinGb, ModalGroup, ModalPeopleInGroup} from './components';
import {useDetailSale, useJoinPersonal} from './hooks';

const DetailMeJoin = ({
  route: {params},
}: RouteParams<AppParamsList[ROOT_SCREEN.detailMeJoin]>) => {
  const {saleId, joinId, mode} = params;
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();
  const {id: myId} = useAppSelector(
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

  const {estimate: joinEstimate} = meJoins ?? {};

  const modalJoinedRef = useRef<ElementRef<typeof AppModalize>>(null);
  const modalPeopleInGroup =
    useRef<ElementRef<typeof ModalPeopleInGroup>>(null);
  const modalConfirmJoinRef = useRef<ElementRef<typeof AppModalize>>(null);
  const isGoToDeposit = useRef(
    mode === 'go-to-deposit' || mode === 'go-to-deposit-from-profile',
  );

  useEffect(() => {
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
      title: 'alert.sureToDeleteJoin',
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

  /**
   * Render views
   */
  const renderListPeopleInGroup = (groupId: number | TypeGroupJoin) => {
    const groupFind =
      typeof groupId === 'number'
        ? data?.groups?.find(item => item.id === groupId)
        : groupId;
    if (!groupFind) {
      return null;
    }

    return (
      <StyleTouchable
        customStyle={$joinView}
        onPress={() =>
          modalPeopleInGroup.current?.show({group: groupFind, isMySale: false})
        }>
        <StyleText
          i18Text="discovery.groupDay"
          i18Params={{
            value: formatDDMMMMYY(groupFind.created),
          }}
          customStyle={{fontWeight: FONT_WEIGHT_MEDIUM}}
        />
        <StyleText
          i18Text="discovery.numberJoinsWithYou"
          i18Params={{
            value: calculateTotalJoins(groupFind),
          }}
        />
        <View style={$listPeopleJoin}>
          {groupFind?.members.map((member, index) => {
            return (
              <Avatar
                source={{uri: member?.creator_avatar}}
                size={30}
                key={index}
              />
            );
          })}
        </View>
      </StyleTouchable>
    );
  };

  const renderJoins = () => {
    if (joinPersonal) {
      const moneySaved = data?.prices?.[0]
        ? data?.prices?.[0]?.price * joinPersonal?.amount - joinPersonal.price
        : 0;
      const textPrice: I18Normalize =
        joinPersonal.status === GROUP_BUYING_STATUS.notBought
          ? 'discovery.estimatedPrice'
          : 'discovery.price';

      return (
        <BoxInformation
          listInformation={[
            {
              title: 'discovery.amount',
              content: String(joinPersonal?.amount),
            },
            {
              title: 'discovery.arrivalTime',
              content: formatddddDDMMYYYY(joinPersonal.time_will_buy),
            },
            {
              title: textPrice,
              content: formatMoney(joinPersonal.price),
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
            {
              title: 'discovery.moneySaved',
              content: formatMoney(moneySaved),
              contentStyle: {color: theme.blue},
            },
            <View style={{width: '100%'}}>
              <StyleText
                i18Text="discovery.note"
                customStyle={{color: theme.gray_600}}
              />
              <StyleText
                originValue={joinPersonal.note}
                customStyle={[$contentNote, {color: theme.black}]}
              />
            </View>,
            renderListPeopleInGroup(joinPersonal.group_id),
          ]}
          containerStyle={$depositView}
        />
      );
    }

    if (joinEstimate) {
      const moneySaved = data?.prices?.[0]
        ? data?.prices?.[0]?.price * joinEstimate?.amount - joinEstimate.price
        : 0;
      return (
        <BoxInformation
          listInformation={[
            {
              title: 'discovery.amount',
              content: String(joinEstimate?.amount),
            },
            {
              title: 'discovery.arrivalTime',
              content: formatddddDDMMYYYY(joinEstimate?.time_will_buy),
            },
            {
              title: 'discovery.estimatedPrice',
              content: formatMoney(joinEstimate.price),
              contentStyle: {color: theme.red},
            },
            {
              title: 'discovery.deposit',
              content: formatMoney(joinEstimate.deposit),
              contentStyle: {color: theme.red},
            },
            {
              title: 'discovery.moneySaved',
              content: formatMoney(moneySaved),
              contentStyle: {color: theme.blue},
            },
            {
              title: 'discovery.transactionHash',
              content: joinEstimate.hash,
              contentStyle: {flex: 1.7, fontWeight: 'normal'},
            },
            <View style={{width: '100%'}}>
              <StyleText
                i18Text="discovery.note"
                customStyle={{color: theme.gray_600}}
              />
              <StyleText
                originValue={joinEstimate.note}
                customStyle={[$contentNote, {color: theme.black}]}
              />
            </View>,
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
                initSeconds={dayjs(joinEstimate.expired).diff(
                  dayjs(),
                  'seconds',
                )}
              />
            </View>,
          ]}
          containerStyle={$depositView}
        />
      );
    }

    return null;
  };

  const renderListJoinEstimate = () => {
    if (isGoToDeposit.current) {
      return (
        <>
          <StyleText
            i18Text="discovery.beInGroup"
            customStyle={$textBeInGroup}
          />
          {joinEstimate?.list_personals?.map((join, index) => {
            return (
              <BoxInformation
                key={index}
                listInformation={[
                  renderListPeopleInGroup({
                    id: null,
                    created: join.created,
                    members: [
                      {
                        id: null,
                        amount: join.amount,
                        creator: join.creator,
                        creator_avatar: join.creator_avatar,
                        creator_name: join.creator_name,
                      },
                    ],
                  }),
                  {
                    title: 'discovery.amount',
                    content: String(join.amount),
                  },
                  {
                    title: 'discovery.estimatedPrice',
                    content: formatMoney(join.price),
                  },
                  {
                    title: 'discovery.deposit',
                    content: formatMoney(join.deposit),
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

  const renderStatus = () => {
    if (mode === 'go-to-deposit' || mode === 'go-to-deposit-from-profile') {
      return (
        <StyleText
          i18Text="discovery.goToDepositToConfirm"
          customStyle={[
            $textAlert,
            {marginTop: verticalScale(12), color: theme.gray_600},
          ]}
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
            />
          </>
        );
      }

      if (joinPersonal?.status === GROUP_BUYING_STATUS.notBought) {
        return (
          <>
            <StyleText
              i18Text="discovery.todayIsTimeWillBuy"
              i18Params={{value: data?.creator_name}}
              customStyle={[
                $textAlert,
                {marginTop: verticalScale(12), color: theme.gray_600},
              ]}
            />
            <StyleText
              i18Text="profile.scanWhenGoToShop"
              customStyle={[$textAlert, {color: theme.gray_600}]}
            />
          </>
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

  const renderBottomComponent = () => {
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
          RightComponent: isGoToDeposit.current ? (
            <StyleTouchable onPress={() => modalConfirmJoinRef.current?.show()}>
              <StyleText
                i18Text="profile.post.edit"
                customStyle={{
                  color: theme.blue,
                  fontWeight: FONT_WEIGHT_MEDIUM,
                }}
              />
            </StyleTouchable>
          ) : null,
        }}
        scrollEnabled
        customStyle={{paddingBottom: bottom || safePaddingNotZero}}
        initLoading={loadingEstimate}
        refreshControl={
          <RefreshControl
            refreshing={loading || validating}
            onRefresh={mutate}
            tintColor={theme.p_600}
            colors={[theme.p_600]}
          />
        }>
        <View style={$topView}>
          <StyleIcon source={Images.images.successful} size={50} />
        </View>
        {renderStatus()}

        {renderJoins()}

        <BoxView
          containerStyle={$saleView}
          onPress={() => {
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
          }}>
          <StyleImage
            source={{uri: data?.images?.[0]}}
            customStyle={$imageSale}
            defaultImageSource="image"
          />
          <View style={$saleInformation}>
            <StyleText
              originValue={data?.name}
              customStyle={$saleName}
              numberOfLines={1}
            />
            <StyleText
              originValue={data?.content}
              numberOfLines={1}
              customStyle={{color: theme.gray_600, fontSize: FONT_SIZE.f3}}
            />
          </View>
          <RightIcon style={{color: theme.gray_500}} />
        </BoxView>

        {renderListJoinEstimate()}
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

const $topView: ViewStyle = {
  width: '100%',
  alignItems: 'center',
  marginTop: verticalScale(12),
};
const $depositView: ViewStyle = {
  marginTop: verticalScale(12),
};
const $contentNote: TextStyle = {
  marginTop: verticalScale(5),
};
const $saleView: ViewStyle = {
  marginTop: verticalScale(12),
  flexDirection: 'row',
  alignItems: 'center',
};
const $imageSale: ImageStyle = {
  width: moderateScale(40),
  height: moderateScale(40),
  borderRadius: 50,
};
const $saleInformation: ViewStyle = {
  flex: 1,
  paddingLeft: scale(12),
  justifyContent: 'center',
};
const $joinView: ViewStyle = {
  width: '100%',
};
const $saleName: TextStyle = {
  fontWeight: 'bold',
};
const $listPeopleJoin: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(4),
  flexDirection: 'row',
  alignItems: 'center',
};
const $textAlert: TextStyle = {
  fontSize: FONT_SIZE.f3,
  textAlign: 'center',
};
const $groupView: ViewStyle = {
  marginTop: verticalScale(10),
};
const $textBeInGroup: TextStyle = {
  marginTop: verticalScale(12),
  fontWeight: FONT_WEIGHT_MEDIUM,
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

export default DetailMeJoin;
