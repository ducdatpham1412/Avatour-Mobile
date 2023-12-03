import {BORDER_RADIUS, FONT_SIZE} from 'asset';
import {
  JOIN_STATUS,
  NOTIFICATION,
  STATUS_NOTIFICATION,
  STATUS_REQUEST,
  TYPE_AUTH_REQUEST,
} from 'asset/enum';
import {IconEdit, IconTagStarsBorder} from 'asset/icons';
import Images from 'asset/img/images';
import {horizontalPadding} from 'asset/metrics';
import {TypeTheme} from 'asset/theme/Theme';
import {Progress} from 'components';
import {
  SquareButton,
  StyleIcon,
  StyleImage,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {useTheme} from 'hook';
import {TFunction} from 'i18next';
import React, {ReactNode, memo} from 'react';
import isEqual from 'react-fast-compare';
import {useTranslation} from 'react-i18next';
import {ImageStyle, TextStyle, View, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {formatFromNow} from 'utility/format';
import {moderateScale, scale, verticalScale} from 'utility/scale';

interface Props {
  item: TypeNotification;
  onPress: () => void;
}

const renderContent = (
  notification: TypeNotification,
  t: TFunction,
  theme: TypeTheme,
  onPress: () => void,
) => {
  let text: string = '';
  let color: string = theme.p_100;
  let icon: ReactNode = null;
  let image: ReactNode = null;

  const status = notification.data?.status;

  if (notification.type === NOTIFICATION.request) {
    icon = <IconEdit size={24} tintColor={theme.p_800} />;
    color = theme.p_200;
    image = (
      <Progress
        progress={[
          {text: 'notification.inReview'},
          status === STATUS_REQUEST.adminReject
            ? {text: 'notification.rejected', focusColor: theme.red}
            : {text: 'notification.approved', focusColor: theme.green},
        ]}
        indexFocusing={status === STATUS_REQUEST.active ? 0 : 1}
        containerStyle={$progress}
      />
    );

    switch (notification.data.type) {
      case TYPE_AUTH_REQUEST.suggest_location:
        text = t('notification.suggestLocation', {
          name: notification.data.data.name,
        });
        icon = <IconTagStarsBorder size={24} tintColor={theme.blue} />;
        color = theme.blueA20;
        image = (
          <>
            <StyleImage
              source={{uri: notification.data.data.avatar}}
              customStyle={$imgSuggestLocation}
              defaultImageSource="image"
            />
            <Progress
              progress={[
                {text: 'notification.inReview'},
                status === STATUS_REQUEST.adminReject
                  ? {text: 'notification.rejected', focusColor: theme.red}
                  : {text: 'notification.approved', focusColor: theme.green},
              ]}
              indexFocusing={status === STATUS_REQUEST.active ? 0 : 1}
              containerStyle={$progress}
            />
          </>
        );
        break;
      case TYPE_AUTH_REQUEST.update_bank:
        text = t('notification.requestUpdateInfo');
        break;
      case TYPE_AUTH_REQUEST.update_price:
        text = t('notification.requestUpdatePrice', {
          name: notification.data.data.sale?.name,
        });
        break;
      case TYPE_AUTH_REQUEST.upgrade_to_shop:
        text = t('notification.requestUpgradeToShop');
        break;
      default:
        break;
    }
  } else if (notification.type === NOTIFICATION.joinGb) {
    color = theme.greenA20;
    icon = (
      <StyleIcon
        size={24}
        source={Images.icons.tourTabBar}
        tintColor={theme.green}
      />
    );
    text = t('notification.orderedAt', {
      name: notification.data.sale?.creator_name,
      product: notification?.data?.sale?.name,
    });

    const isOvertime = status === JOIN_STATUS.overtime;
    const isRejected = status === JOIN_STATUS.supplierRejected;

    let textApproved: I18Normalize = 'notification.approved';
    if (status === JOIN_STATUS.adminConfirm) {
      textApproved = 'notification.waitingConfirmFromShop';
    } else if (isRejected) {
      textApproved = 'discovery.shopNotReceiveOrder';
    }

    image = (
      <Progress
        progress={[
          {
            text: textApproved,
            focusColor: isRejected ? theme.red : theme.blue,
          },
          {
            text: isOvertime
              ? 'discovery.arrivalTimePassed'
              : 'notification.checkInAtShop',
            focusColor: isOvertime ? theme.red : theme.blue,
          },
          {text: 'notification.successOrder', focusColor: theme.green},
        ]}
        indexFocusing={
          status === JOIN_STATUS.consumerConfirmed
            ? 1
            : status === JOIN_STATUS.supplierConfirmBought
            ? 2
            : 0
        }
        containerStyle={$progress}
      />
    );
  } else if (notification.type === NOTIFICATION.hasNewJoin) {
    color = theme.greenA20;
    icon = (
      <StyleIcon
        size={24}
        source={Images.icons.tourTabBar}
        tintColor={theme.green}
      />
    );
    text = t('notification.orderedFrom', {
      name: notification.data.creator_name,
      product: notification.data?.sale?.name,
    });

    const isOvertime = status === JOIN_STATUS.overtime;
    const isRejected = status === JOIN_STATUS.supplierRejected;

    let textApproved: I18Normalize = 'notification.approved';
    if (status === JOIN_STATUS.adminConfirm) {
      textApproved = 'notification.waitingConfirmFromYou';
    } else if (isRejected) {
      textApproved = 'discovery.notReceiveThisOrder';
    }

    image = (
      <>
        <Progress
          progress={[
            {
              text: textApproved,
              focusColor: isRejected ? theme.red : theme.blue,
            },
            {
              text: isOvertime
                ? 'discovery.arrivalTimePassed'
                : 'notification.userComeToYourShop',
              focusColor: isOvertime ? theme.red : theme.blue,
            },
            {text: 'notification.successOrder', focusColor: theme.green},
          ]}
          indexFocusing={
            status === JOIN_STATUS.consumerConfirmed
              ? 1
              : status === JOIN_STATUS.supplierConfirmBought
              ? 2
              : 0
          }
          containerStyle={$progress}
        />
        {status === JOIN_STATUS.adminConfirm && (
          <SquareButton
            title="notification.goToConfirm"
            containerStyle={[$button, {backgroundColor: theme.p_600}]}
            titleStyle={{color: theme.white}}
            onPress={onPress}
          />
        )}
      </>
    );
  }

  const notRead = notification.status === STATUS_NOTIFICATION.notRead;

  return {
    icon,
    color,
    text,
    image,
    style: {
      fontWeight: notRead ? 'bold' : 'normal',
    } as TextStyle,
    notRead,
  };
};

const ItemNotification = ({item, onPress}: Props) => {
  const {t} = useTranslation();
  const theme = useTheme();

  const content = renderContent(item, t, theme, onPress);

  return (
    <StyleTouchable
      customStyle={[
        $container,
        {
          backgroundColor: content.notRead ? theme.p_50 : 'transparent',
        },
      ]}
      onPress={onPress}>
      <View style={[$icon, {backgroundColor: content.color}]}>
        {content.notRead && (
          <View style={[$notRead, {backgroundColor: theme.p_900}]} />
        )}
        {content.icon}
      </View>
      <View style={$content}>
        <View style={$contentUp}>
          <StyleText
            originValue={content.text}
            customStyle={[$textContent, content.style]}
            mode="html"
          />
          <StyleText
            originValue={formatFromNow(item.modified)}
            customStyle={[$time, content.style]}
          />
        </View>

        {!!content.image && <View>{content.image}</View>}
      </View>
    </StyleTouchable>
  );
};

const $container: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  gap: scale(16),
  paddingHorizontal: horizontalPadding,
  paddingVertical: verticalScale(16),
};
const $icon: ViewStyle = {
  width: moderateScale(48),
  height: moderateScale(48),
  borderRadius: 50,
  alignItems: 'center',
  justifyContent: 'center',
};
const $content: ViewStyle = {
  flex: 1,
};
const $textContent: TextStyle = {
  flex: 1,
};
const $contentUp: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  gap: scale(16),
};
const $time: TextStyle = {
  fontSize: FONT_SIZE.f4,
};
const $notRead: ViewStyle = {
  position: 'absolute',
  left: moderateScale(2),
  top: moderateScale(2),
  width: moderateScale(12),
  height: moderateScale(12),
  borderRadius: 12,
};
const $imgSuggestLocation: ImageStyle = {
  width: '100%',
  height: verticalScale(100),
  borderRadius: BORDER_RADIUS.f4,
  marginTop: verticalScale(8),
};
const $progress: ViewStyle = {
  marginTop: verticalScale(4),
};
const $button: ViewStyle = {
  marginTop: verticalScale(4),
};

export default memo(ItemNotification, (pre, next) => {
  return isEqual(pre.item, next.item);
});
