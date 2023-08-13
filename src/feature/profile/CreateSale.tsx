import {useAppSelector} from 'app-redux/store';
import {STATUS} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics, safePaddingNotZero} from 'asset/metrics';
import {
  BORDER_RADIUS,
  FONT_SIZE,
  FONT_WEIGHT_MEDIUM,
  ratioImageSale,
} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {
  AppInput,
  StyleButton,
  StyleContainer,
  StyleIcon,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {Avatar} from 'components/common';
import {UpdatePriceStatus} from 'feature/common/components';
import {useDetailSale} from 'feature/common/hooks';
import {useTheme} from 'hook';
import {goBack} from 'navigation/NavigationService';
import HeaderLeftIcon from 'navigation/components/HeaderLeftIcon';
import {AppParamsList} from 'navigation/config';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import {ModalAlert} from 'navigation/screen/modals';
import React, {useRef} from 'react';
import isEqual from 'react-fast-compare';
import {useTranslation} from 'react-i18next';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {I18Normalize} from 'utility/I18Next';
import {borderWidthTiny} from 'utility/assistant';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {PricesEdit, ScrollCropImages} from './components';
import ButtonIconTitle from './components/ButtonIconTitle';
import {UseCreateSaleParams, useCreateSale} from './hooks';
import {impactMedium} from 'utility/haptic';

interface Props {
  route: {
    params: AppParamsList[PROFILE_ROUTE.createSale];
  };
}

const {width} = Metrics;

const CreateSale = ({route}: Props) => {
  const {t} = useTranslation();
  const {bottom} = useSafeAreaInsets();
  const {itemNew, itemEdit, itemError} = route.params ?? {};

  const theme = useTheme();
  const {
    location,
    avatar,
    name: myName,
  } = useAppSelector(state => state.accountSlice.passport.profile);

  const initValue = useRef<UseCreateSaleParams>({
    postId: itemEdit?.id,
    name: itemEdit?.name || itemError?.name || '',
    content: itemEdit?.content || itemError?.content || '',
    images: itemEdit?.images || itemError?.images || itemNew?.images || [],
    prices: itemEdit?.prices || itemError?.prices || [],
  });

  const [
    {content, name, images, prices, loadingCreate},
    {
      onConfirmPost,
      onEditPost,
      onGoBack,
      setContent,
      setPrices,
      setName,
      updateStatus,
    },
  ] = useCreateSale(initValue.current);
  const [{data: dataSale}] = useDetailSale(initValue.current.postId, {
    revalidateAll: false,
  });

  const scrollRef = useRef<KeyboardAwareScrollView>(null);

  /**
   * Functions
   */
  const onUpdateStatus = async (status: number) => {
    try {
      await updateStatus(status);
      impactMedium();
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    }
  };

  /**
   * Render views
   */
  const headerLeft = () => {
    return (
      <View style={$headerLeft}>
        <HeaderLeftIcon onPress={goBack} />
        <Avatar
          source={{
            uri: avatar,
          }}
          size={25}
          style={{marginLeft: scale(4)}}
        />
        <StyleText
          originValue={myName}
          customStyle={$myName}
          numberOfLines={1}
        />
      </View>
    );
  };

  const headerRight = () => {
    if (itemEdit) {
      let disableButtonEdit = true;
      const temp: typeof initValue.current = {
        postId: itemEdit.id,
        name,
        content,
        images,
        prices,
      };
      disableButtonEdit = isEqual(temp, initValue.current);

      return (
        <View style={$header}>
          <StyleButton
            title="common.edit"
            containerStyle={$postBox}
            onPress={onEditPost}
            disable={disableButtonEdit}
            isLoading={loadingCreate}
          />
        </View>
      );
    }

    if (itemNew || itemError) {
      return (
        <View style={$header}>
          <StyleButton
            title="profile.post.post"
            containerStyle={$postBox}
            onPress={onConfirmPost}
            disable={!prices.length || !name}
            isLoading={loadingCreate}
          />
        </View>
      );
    }

    return null;
  };

  const renderInfoBox = () => {
    if (itemEdit) {
      if (dataSale?.status === STATUS.active) {
        return (
          <View style={$location}>
            <ButtonIconTitle
              icon={<StyleIcon source={Images.icons.calendar} size={13} />}
              title="discovery.available"
            />
            <StyleTouchable
              customStyle={$editStatusBox}
              onPress={() => {
                ModalAlert.options({
                  content: t('alert.afterTemporarilyClose', {
                    value: dataSale.name,
                  }),
                  onContinue: () => onUpdateStatus(STATUS.temporarilyClose),
                });
              }}>
              <StyleText
                i18Text="discovery.temporarilyClosed"
                customStyle={[$textEditStatus, {color: theme.gray_600}]}
              />
            </StyleTouchable>
          </View>
        );
      }

      return (
        <View style={$location}>
          <ButtonIconTitle
            icon={<StyleIcon source={Images.icons.calendar} size={13} />}
            title="discovery.temporarilyClosed"
            titleStyle={{color: theme.red}}
          />
          <StyleTouchable
            customStyle={$editStatusBox}
            onPress={() => {
              onUpdateStatus(STATUS.active);
            }}>
            <StyleText
              i18Text="discovery.openAvailable"
              customStyle={[$textEditStatus, {color: theme.blue}]}
            />
          </StyleTouchable>
        </View>
      );
    }

    return (
      <View style={$location}>
        <ButtonIconTitle
          icon={<StyleIcon source={Images.icons.calendar} size={13} />}
          title="discovery.available"
        />
      </View>
    );
  };

  const renderPrices = () => {
    if (itemEdit) {
      return (
        <>
          <PricesEdit prices={prices} />
          <UpdatePriceStatus saleId={itemEdit.id} />
        </>
      );
    }

    return (
      <PricesEdit
        prices={prices}
        enableEdit
        onAddPrice={value => setPrices(pre => pre.concat(value))}
        onDeletePrice={value =>
          setPrices(pre =>
            pre.filter(item => item.number_people !== value.number_people),
          )
        }
        onEditPrice={e =>
          setPrices(pre =>
            pre.map((item, index) => {
              if (index !== e.indexEdit) {
                return item;
              }
              return e.value;
            }),
          )
        }
      />
    );
  };

  const renderContent = () => {
    const disableEditCaption =
      !!itemEdit && itemEdit.status === STATUS.notActive;

    return (
      <View style={[$priceView, {borderTopColor: theme.gray_300}]}>
        <AppInput
          onChangeText={text => {
            scrollRef.current?.scrollToEnd();
            setContent(text);
          }}
          multiline
          placeholder={t('common.writeSomething')}
          defaultValue={initValue.current.content}
          editable={!disableEditCaption}
          style={$inputContent}
        />
      </View>
    );
  };

  return (
    <StyleContainer
      headerProps={{
        RightComponent: headerRight(),
        LeftComponent: headerLeft(),
        title: 'common.null',
        containerStyle: $headerContainer,
        onGoBack,
      }}
      scrollEnabled
      customStyle={[$container, {paddingBottom: bottom || safePaddingNotZero}]}>
      <ScrollCropImages
        images={images}
        width={width}
        height={width * ratioImageSale}
        enableRemoveImage={false}
      />
      <View style={[$body, {backgroundColor: theme.background}]}>
        <AppInput
          onChangeText={text => setName(text)}
          multiline
          placeholder={t('profile.groupBuyingName')}
          defaultValue={initValue.current.name}
          style={[$inputName, {borderColor: theme.gray_500}]}
          maxLength={40}
        />
        <ButtonIconTitle
          icon={<Ionicons name="md-location-sharp" style={$iconLocation} />}
          title={location as I18Normalize}
          containerStyle={$buttonInfo}
        />
        {renderInfoBox()}

        <View style={[$priceView, {borderTopColor: theme.gray_300}]}>
          <View style={$titleView}>
            <StyleIcon source={Images.icons.dollar} size={18} />
            <StyleText
              i18Text="discovery.salePriceAndExplain"
              customStyle={[$textTitle, {color: theme.black}]}
            />
          </View>

          {renderPrices()}
        </View>

        {renderContent()}
      </View>
    </StyleContainer>
  );
};

const $container: ViewStyle = {
  paddingHorizontal: 0,
};
const $body: ViewStyle = {
  paddingHorizontal: scale(12),
  shadowColor: Theme.newTheme.black,
  shadowOffset: {
    width: 0,
    height: -4,
  },
  shadowOpacity: 0.08,
};
const $headerContainer: ViewStyle = {
  paddingBottom: verticalScale(20),
};
const $headerLeft: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};
const $myName: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
  marginLeft: scale(4),
  maxWidth: scale(130),
};
const $header: ViewStyle = {
  width: '100%',
  flexDirection: 'row-reverse',
  alignItems: 'center',
  justifyContent: 'flex-start',
};
const $postBox: ViewStyle = {
  width: scale(100),
  alignItems: 'center',
  paddingVertical: verticalScale(5),
  height: undefined,
};
const $buttonInfo: ViewStyle = {
  marginTop: verticalScale(12),
};
const $location: StyleProp<ViewStyle> = [
  $buttonInfo,
  {
    flexDirection: 'row',
    alignItems: 'center',
  },
];
const $iconLocation: TextStyle = {
  fontSize: moderateScale(15),
  color: Theme.newTheme.blue,
};
const $editStatusBox: ViewStyle = {
  alignSelf: 'center',
  marginLeft: scale(12),
};
const $textEditStatus: TextStyle = {
  fontSize: FONT_SIZE.f3,
  fontWeight: FONT_WEIGHT_MEDIUM,
  textDecorationLine: 'underline',
};
const $priceView: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(12),
  borderTopWidth: borderWidthTiny,
};
const $titleView: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: verticalScale(12),
};
const $textTitle: TextStyle = {
  fontWeight: 'bold',
  marginLeft: scale(8),
};
const $inputContent: TextStyle = {
  marginTop: verticalScale(12),
};
const $inputName: TextStyle = {
  marginTop: verticalScale(12),
  borderWidth: borderWidthTiny,
  borderRadius: BORDER_RADIUS.f4,
  paddingHorizontal: scale(8),
  paddingTop: verticalScale(6),
  paddingBottom: verticalScale(6),
  fontSize: FONT_SIZE.f2,
};

export default CreateSale;
