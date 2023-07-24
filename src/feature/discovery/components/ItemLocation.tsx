import {BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {ACCOUNT} from 'asset/enum';
import Images from 'asset/img/images';
import {
  StyleIcon,
  StyleImage,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {ButtonX} from 'components/common';
import {useTheme} from 'hook';
import React, {memo} from 'react';
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {borderWidthTiny, onGoToProfile} from 'utility/assistant';
import {formatLocaleNumber} from 'utility/format';
import {impactLight} from 'utility/haptic';
import {moderateScale, scale, verticalScale} from 'utility/scale';

export interface ItemLocationProps {
  item: TypeGetProfileResponse;
  onDrag: () => void;
  isActive: boolean;
  getIndex: () => number | undefined;
  isEditMode: boolean;
  onAddLocation: () => void;
  onDeleteLocation: () => void;
}

type InfoProps = {
  icon: ImageSourcePropType;
  content: any;
  contentStyle?: StyleProp<TextStyle>;
};

type AddLocationProps = {
  isActive: boolean;
  onPress: () => void;
};

type DragProps = {
  onDrag: () => void;
};

const Info = ({icon, content, contentStyle}: InfoProps) => {
  const theme = useTheme();
  return (
    <View style={$infoView}>
      <StyleIcon
        source={icon}
        size={10}
        customStyle={{tintColor: theme.gray_500}}
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

export const ButtonAddLocation = ({isActive, onPress}: AddLocationProps) => {
  const theme = useTheme();
  return (
    <StyleTouchable
      customStyle={[$addLocation, {borderColor: theme.gray_700}]}
      disable={isActive}
      disableOpacity={0.1}
      onPress={onPress}>
      <AntDesign name="plus" color={theme.black} />
      <StyleText
        i18Text="discovery.addLocation"
        customStyle={$textAddLocation}
      />
    </StyleTouchable>
  );
};

const ItemLocation = ({
  onDrag,
  isActive,
  getIndex,
  item,
  isEditMode,
  onAddLocation,
  onDeleteLocation,
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
                originValue={`${(getIndex() ?? 0) + 1}. `}
                numberOfLines={1}
                customStyle={$textNameLocation}>
                <StyleText originValue={item?.name} />
              </StyleText>
              {renderPrice()}
              <Info icon={Images.icons.location} content={item?.location} />
              <Info
                icon={Images.icons.clock}
                content={t('discovery.timeHere')
                  .concat(': ')
                  .concat(`${item?.duration}h`)}
              />
              <StyleText
                originValue={item?.description}
                numberOfLines={1}
                customStyle={[$textDescription, {color: theme.gray_500}]}
              />
            </View>

            {isEditMode && (
              <>
                <ButtonDrag
                  onDrag={() => {
                    impactLight();
                    onDrag();
                  }}
                />
                <ButtonX
                  size={15}
                  containerStyle={$iconX}
                  onPress={onDeleteLocation}
                />
              </>
            )}
          </View>

          {item.account_type === ACCOUNT.shop && (
            <View
              style={[
                $joinGroupBuying,
                {borderColor: theme.p_700, backgroundColor: theme.p_300},
              ]}>
              <StyleIcon
                source={Images.icons.createGroup}
                size={17}
                customStyle={{tintColor: theme.p_900}}
              />
              <StyleText
                i18Text="discovery.joinGroupBuying"
                customStyle={[$textJoin, {color: theme.p_900}]}
              />
            </View>
          )}
        </StyleTouchable>

        {isEditMode && (
          <ButtonAddLocation isActive={isActive} onPress={onAddLocation} />
        )}
      </ScaleDecorator>
    </ShadowDecorator>
  );
};

const $container: ViewStyle = {
  width: '100%',
  padding: scale(8),
  marginBottom: verticalScale(12),
  borderRadius: moderateScale(8),
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
const $textNameLocation: TextStyle = {
  fontSize: FONT_SIZE.f3,
  fontWeight: FONT_WEIGHT_MEDIUM,
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
const $addLocation: ViewStyle = {
  width: '70%',
  paddingVertical: verticalScale(4),
  borderWidth: borderWidthTiny,
  borderRadius: BORDER_RADIUS.f2,
  marginBottom: verticalScale(12),
  alignSelf: 'center',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
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
const $textAddLocation: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
  marginLeft: scale(8),
};
const $iconX: ViewStyle = {
  position: 'absolute',
  left: -5,
  top: -5,
  right: undefined,
};
const $joinGroupBuying: ViewStyle = {
  width: '80%',
  paddingVertical: verticalScale(4),
  borderRadius: BORDER_RADIUS.f2,
  borderWidth: 0,
  marginTop: verticalScale(8),
  alignSelf: 'center',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
};
const $textJoin: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
  fontSize: FONT_SIZE.f3,
  marginLeft: scale(4),
};
const $textDescription: TextStyle = {
  fontSize: FONT_SIZE.f3,
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
