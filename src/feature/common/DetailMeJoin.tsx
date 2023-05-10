import {useAppSelector} from 'app-redux/store';
import {FONT_SIZE} from 'asset';
import {APP_EVENT, GROUP_BUYING_STATUS} from 'asset/enum';
import Images from 'asset/img/images';
import {safePaddingNotZero} from 'asset/metrics';
import {AppModalize, BoxInformation, BoxView} from 'components';
import {
  StyleButton,
  StyleContainer,
  StyleIcon,
  StyleImage,
  StyleText,
} from 'components/base';
import {RightIcon} from 'components/common';
import {useAppEvent, useTheme} from 'hook';
import {goBack, push} from 'navigation/NavigationService';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import React, {ElementRef, useMemo, useRef, useState} from 'react';
import {ImageStyle, TextStyle, View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {I18Normalize} from 'utility/I18Next';
import {renderPersonalJoinsFromGroups} from 'utility/assistant';
import {formatMoney, formatddddDDMMYYYY} from 'utility/format';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {ModalGroup} from './components';
import {useDetailSale} from './hooks';

const DetailMeJoin = ({
  route: {
    params: {saleId, itemJoinRequest, itemJoin, mode, onSuccess},
  },
}: RouteParams<AppParamsList[ROOT_SCREEN.detailMeJoin]>) => {
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();
  const modalJoinedRef = useRef<ElementRef<typeof AppModalize>>(null);
  const {id: myId} = useAppSelector(
    state => state.accountSlice.passport.profile,
  );

  const [{loadingJoin, data, loading}, {onJoin, onRequestBought, onRefresh}] =
    useDetailSale({
      saleId,
    });

  const [statusItemJoin, setStatusItemJoin] = useState(itemJoin?.status);

  useAppEvent(APP_EVENT.requestBoughtJoin, data => {
    if (itemJoin && data?.joinId === itemJoin?.id) {
      setStatusItemJoin(GROUP_BUYING_STATUS.requestBought);
    }
  });

  const title = useMemo((): I18Normalize => {
    if (mode === 'confirm-join') {
      return 'discovery.confirmJoining';
    }
    if (statusItemJoin === GROUP_BUYING_STATUS.bought) {
      return 'profile.joinedSuccess';
    }
    if (statusItemJoin === GROUP_BUYING_STATUS.requestBought) {
      return 'profile.waitingConfirm';
    }
    return 'profile.confirmWithVendor';
  }, [statusItemJoin]);

  const renderBottomComponent = () => {
    if (mode === 'confirm-join' && itemJoinRequest) {
      return (
        <StyleButton
          title="common.confirm"
          containerStyle={{
            marginBottom: bottom || safePaddingNotZero,
            width: '70%',
          }}
          onPress={() => onJoin(itemJoinRequest, {onSuccess})}
          isLoading={loadingJoin}
        />
      );
    }
    if (
      statusItemJoin === GROUP_BUYING_STATUS.notBought ||
      statusItemJoin === GROUP_BUYING_STATUS.notBoughtButOvertime
    ) {
      return (
        <StyleButton
          title="profile.confirmWithVendor"
          containerStyle={{
            marginBottom: bottom || safePaddingNotZero,
            width: '70%',
          }}
          onPress={() => {
            if (itemJoin) {
              onRequestBought(itemJoin?.id);
            }
          }}
          isLoading={loadingJoin}
        />
      );
    }
    return null;
  };

  const renderListPeopleJoined = () => {
    if (!data?.groups?.length) {
      return null;
    }
    const listPersonalJoins = renderPersonalJoinsFromGroups(
      data?.groups || [],
      {maxNumber: 10},
    );
    return (
      <BoxView
        containerStyle={$joinView}
        onPress={() => modalJoinedRef.current?.show()}>
        <StyleText
          i18Text="discovery.numberGroupJoined"
          i18Params={{
            value: data?.total_members ?? 0,
          }}
        />
        <View style={$listPeopleJoin}>
          {listPersonalJoins.map(join => {
            return (
              <StyleIcon
                key={join.id}
                source={{uri: join.creator_avatar}}
                size={30}
              />
            );
          })}
        </View>
      </BoxView>
    );
  };

  return (
    <>
      <StyleContainer
        BottomComponent={renderBottomComponent()}
        headerProps={{
          title: title,
        }}
        scrollEnabled>
        <View style={$topView}>
          {itemJoin?.status === GROUP_BUYING_STATUS.bought ? (
            <StyleIcon source={Images.images.successful} size={70} />
          ) : (
            <StyleIcon source={Images.images.squirrelLogin} size={70} />
          )}
        </View>

        <BoxInformation
          listInformation={[
            {
              title: 'discovery.amount',
              content: String(
                itemJoin?.amount || itemJoinRequest?.amount || '0',
              ),
            },
            {
              title: 'discovery.arrivalTime',
              content: formatddddDDMMYYYY(
                itemJoin?.time_will_buy || itemJoinRequest?.time_will_buy || '',
              ),
            },
            {
              title: 'discovery.deposit',
              content: formatMoney(
                itemJoin?.deposit || itemJoinRequest?.deposit || 0,
              ),
            },
            <View style={{width: '100%'}}>
              <StyleText
                i18Text="discovery.note"
                style={{color: theme.gray_600}}
              />
              <StyleText
                originValue={itemJoin?.note || itemJoinRequest?.note}
                style={[$contentNote, {color: theme.black}]}
              />
            </View>,
          ]}
          containerStyle={$depositView}
        />

        <BoxView
          containerStyle={$saleView}
          onPress={() => {
            if (mode === 'confirm-join' || mode === 'see-detail-from-sale') {
              goBack();
            } else if (mode === 'see-detail') {
              push(ROOT_SCREEN.detailSale, {
                sale: data,
              });
            }
          }}>
          <StyleImage
            source={{uri: data?.images?.[0]}}
            customStyle={$imageSale}
            defaultImageSource="image"
          />
          <View style={$saleInformation}>
            <StyleText
              originValue={data?.creator_name}
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

        {renderListPeopleJoined()}

        {statusItemJoin === GROUP_BUYING_STATUS.notBoughtButOvertime && (
          <StyleText
            i18Text="discovery.arrivalTimePassed"
            customStyle={[
              $textAlert,
              {marginTop: verticalScale(12), color: theme.gray_600},
            ]}>
            <StyleText
              i18Text="discovery.please"
              customStyle={[$textAlert, {color: theme.gray_600}]}
            />
            <StyleText
              i18Text="profile.confirmWithVendor"
              customStyle={[$textAlert, {fontWeight: 'bold', color: theme.red}]}
            />
            <StyleText
              i18Text="discovery.confirmJoinSuccess"
              customStyle={[$textAlert, {color: theme.gray_600}]}
            />
          </StyleText>
        )}
      </StyleContainer>

      <ModalGroup
        ref={modalJoinedRef}
        groups={data?.groups || []}
        refreshing={loading}
        onRefresh={onRefresh}
        isMySale={data?.creator === myId}
      />
    </>
  );
};

const $topView: ViewStyle = {
  width: '100%',
  alignItems: 'center',
  marginTop: verticalScale(10),
};
const $depositView: ViewStyle = {
  marginTop: verticalScale(20),
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
  marginTop: verticalScale(12),
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
};

export default DetailMeJoin;
