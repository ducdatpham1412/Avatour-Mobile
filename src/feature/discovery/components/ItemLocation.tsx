import {BORDER_RADIUS, FONT_SIZE} from 'asset';
import {ACCOUNT, STATUS} from 'asset/enum';
import {IconTagStars} from 'asset/icons';
import Images from 'asset/img/images';
import {
  StyleIcon,
  StyleImage,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {ButtonX} from 'components/common';
import {useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {PROFILE_ROUTE} from 'navigation/config';
import {ModalAlert, ToolTip} from 'navigation/screen/modals';
import React, {memo, useRef} from 'react';
import isEqual from 'react-fast-compare';
import {useTranslation} from 'react-i18next';
import {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {ScaleDecorator, ShadowDecorator} from 'react-native-draggable-flatlist';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {detectFromStyle, onGoToProfile} from 'utility/assistant';
import {formatLocaleNumber} from 'utility/format';
import {impactLight} from 'utility/haptic';
import {moderateScale, scale, verticalScale} from 'utility/scale';

export interface ItemLocationProps {
  item: TypeGetProfileResponse;
  onDrag: () => void;
  isActive: boolean;
  getIndex: () => number | undefined;
  isEditMode: boolean;
  onDeleteLocation: () => void;
  onSuggestLocation: (value: TypeGetProfileResponse) => Promise<void>;
}

type InfoProps = {
  icon: ImageSourcePropType;
  content: any;
  contentStyle?: StyleProp<TextStyle>;
};

type DragProps = {
  onDrag: () => void;
};

type SuggestProps = Pick<ItemLocationProps, 'item' | 'onSuggestLocation'>;

/**
 * Components
 */
const Info = ({icon, content, contentStyle}: InfoProps) => {
  const theme = useTheme();
  const color = detectFromStyle(contentStyle, 'color');
  return (
    <View style={$infoView}>
      <StyleIcon
        source={icon}
        size={14}
        customStyle={{tintColor: (color as string) ?? theme.gray_500}}
      />
      <StyleText
        numberOfLines={1}
        originValue={content}
        customStyle={[$infoContent, {color: theme.gray_500}, contentStyle]}
      />
    </View>
  );
};

const ButtonDrag = ({onDrag}: DragProps) => {
  const theme = useTheme();
  return (
    <StyleTouchable
      customStyle={$dragView}
      onLongPress={onDrag}
      delayLongPress={100}>
      <MaterialIcons
        name="drag-indicator"
        style={[$iconDrag, {color: theme.p_900}]}
      />
    </StyleTouchable>
  );
};

const Suggest = ({item, onSuggestLocation}: SuggestProps) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const viewRef = useRef<View>(null);

  const onPress = () => {
    viewRef.current?.measure((x, y, width, height, pageX, pageY) => {
      if (item.status === STATUS.draft) {
        ToolTip.show({
          content: t('discovery.newLocation', {
            value: item.name,
          }),
          button: {
            title: 'common.suggest',
            onPress: async () => {
              try {
                await onSuggestLocation(item);
                ModalAlert.success({
                  title: 'discovery.thankyou',
                  i18Content: 'discovery.suggestHaveBeenAcknowledged',
                  icon: <StyleIcon source={Images.icons.nice} size={80} />,
                });
                return 'success';
              } catch (err) {
                ModalAlert.error({
                  content: err,
                });
                return 'error';
              }
            },
          },
        });
        return;
      }

      if (item.status === STATUS.suggesting) {
        ToolTip.show({
          content: t('discovery.newLocationHaveAdded', {
            value: item.name,
          }),
          button: {
            title: 'discovery.seeSuggest',
            onPress: () => {
              navigate(PROFILE_ROUTE.listMyRequests);
            },
          },
        });
      }
    });
  };

  return (
    <View ref={viewRef} style={$stars}>
      <StyleTouchable onPress={onPress}>
        <IconTagStars
          tintColor={item.status === STATUS.draft ? theme.p_600 : theme.blue}
        />
      </StyleTouchable>
    </View>
  );
};

/**
 * Main
 */
const ItemLocation = ({
  onDrag,
  isActive,
  getIndex,
  item,
  isEditMode,
  onDeleteLocation,
  onSuggestLocation,
}: ItemLocationProps) => {
  const theme = useTheme();
  const {t} = useTranslation();

  const renderPrice = () => {
    if (item?.min_cost === 0 && item?.max_cost === 0) {
      return (
        <Info
          icon={Images.icons.price}
          content={t('discovery.free')}
          contentStyle={{color: theme.black}}
        />
      );
    }
    let price = '';
    if (item?.min_cost > 0) {
      price = price.concat(`${formatLocaleNumber(String(item?.min_cost))} - `);
    }
    price = price.concat(`${formatLocaleNumber(String(item?.max_cost))} vnd`);
    return (
      <Info
        icon={Images.icons.price}
        content={price}
        contentStyle={{color: theme.black}}
      />
    );
  };

  return (
    <ShadowDecorator>
      <ScaleDecorator>
        <StyleTouchable
          style={[$container, {backgroundColor: theme.white}]}
          onPress={() => onGoToProfile(item?.id)}
          disable={isActive}
          disableOpacity={1}>
          <View style={$body}>
            <StyleImage
              source={{uri: item?.avatar}}
              customStyle={$avatar}
              defaultImageSource="image"
            />
            <View style={$content}>
              <StyleText
                originValue={`${(getIndex() ?? 0) + 1}. ${item.name}`}
                numberOfLines={1}
                customStyle={$textName}
              />
              <Info icon={Images.icons.location} content={item?.location} />
              {renderPrice()}
              <Info
                icon={Images.icons.clock}
                content={`${item?.duration}h`}
                contentStyle={{color: theme.black}}
              />
            </View>

            {isEditMode && (
              <ButtonDrag
                onDrag={() => {
                  impactLight();
                  onDrag();
                }}
              />
            )}
          </View>

          {isEditMode && (
            <ButtonX
              size={15}
              containerStyle={$iconX}
              onPress={onDeleteLocation}
            />
          )}

          {item.account_type === ACCOUNT.shop && (
            <View style={[$joinGroupBuying, {backgroundColor: theme.p_200}]}>
              <StyleIcon
                source={Images.icons.createGroup}
                size={17}
                customStyle={{tintColor: theme.brown}}
              />
              <StyleText
                i18Text="discovery.joinGroupBuying"
                customStyle={[$textJoin, {color: theme.brown}]}
              />
            </View>
          )}

          {[STATUS.draft, STATUS.suggesting].includes(item.status) && (
            <Suggest item={item} onSuggestLocation={onSuggestLocation} />
          )}
        </StyleTouchable>
      </ScaleDecorator>
    </ShadowDecorator>
  );
};

const $container: ViewStyle = {
  width: '100%',
  padding: scale(12),
  marginBottom: verticalScale(12),
  borderRadius: BORDER_RADIUS.f3,
};
const $body: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
};
const $avatar: ImageStyle = {
  width: scale(100),
  height: scale(100),
  borderRadius: moderateScale(8),
};
const $content: ViewStyle = {
  flex: 1,
  paddingLeft: scale(8),
  justifyContent: 'space-between',
};
const $textName: TextStyle = {
  fontWeight: 'bold',
  maxWidth: '80%',
};
const $infoView: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
};
const $infoContent: TextStyle = {
  marginLeft: scale(4),
  fontSize: FONT_SIZE.f3,
};
const $dragView: ViewStyle = {
  width: scale(50),
  height: verticalScale(100),
  alignItems: 'flex-end',
  justifyContent: 'center',
};
const $iconDrag: TextStyle = {
  fontSize: moderateScale(40),
};
const $iconX: ViewStyle = {
  position: 'absolute',
  left: 2,
  top: 2,
  right: undefined,
};
const $joinGroupBuying: ViewStyle = {
  width: '80%',
  height: verticalScale(36),
  borderRadius: 100,
  borderWidth: 0,
  marginTop: verticalScale(12),
  alignSelf: 'center',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
};
const $textJoin: TextStyle = {
  fontWeight: 'bold',
  marginLeft: scale(4),
};
const $stars: ViewStyle = {
  position: 'absolute',
  top: scale(4),
  right: scale(12),
};

export default memo(
  ItemLocation,
  (pre: ItemLocationProps, next: ItemLocationProps) => {
    if (!isEqual(pre.item, next.item)) {
      return false;
    }
    if (pre.isActive !== next.isActive) {
      return false;
    }
    if (pre.isEditMode !== next.isEditMode) {
      return false;
    }
    return true;
  },
);
