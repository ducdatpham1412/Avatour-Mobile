import {useAppSelector} from 'app-redux/store';
import {STATUS} from 'asset/enum';
import {IconPrice} from 'asset/icons';
import Images from 'asset/img/images';
import {
  Metrics,
  horizontalPadding,
  safePaddingNotZero,
  verticalMargin,
} from 'asset/metrics';
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
import {useSafeArea, useTheme} from 'hook';
import {goBack} from 'navigation/NavigationService';
import HeaderLeftIcon from 'navigation/components/HeaderLeftIcon';
import {AppParamsList} from 'navigation/config';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import {ModalAlert} from 'navigation/screen/modals';
import React, {useRef} from 'react';
import isEqual from 'react-fast-compare';
import {useTranslation} from 'react-i18next';
import {StyleProp, TextInput, TextStyle, View, ViewStyle} from 'react-native';
import {impactMedium} from 'utility/haptic';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {PricesEdit, ScrollCropImages, TitleAndInput} from './components';
import ButtonIconTitle from './components/ButtonIconTitle';
import {UseCreateSaleParams, useCreateSale} from './hooks';

interface Props {
  route: {
    params: AppParamsList[PROFILE_ROUTE.createSale];
  };
}

const {width} = Metrics;

const CreateSale = ({route}: Props) => {
  const {t} = useTranslation();
  const {paddingBottom} = useSafeArea();
  const {itemNew, itemEdit, itemError} = route.params ?? {};

  const theme = useTheme();
  const {avatar, name: myName} = useAppSelector(
    state => state.accountSlice.passport.profile,
  );

  const initValue = useRef<UseCreateSaleParams>({
    postId: itemEdit?.id,
    name: itemEdit?.name || itemError?.name || '',
    content: itemEdit?.content || itemError?.content || '',
    images: itemEdit?.images || itemError?.images || itemNew?.images || [],
    prices: itemEdit?.prices || itemError?.prices || [],
  });
  const inputDescriptionRef = useRef<TextInput>(null);

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

  const disableEditCaption = !!itemEdit && itemEdit.status === STATUS.notActive;

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
      const temp: typeof initValue.current = {
        postId: itemEdit.id,
        name,
        content,
        images,
        prices,
      };
      const disableButtonEdit = isEqual(temp, initValue.current);

      return (
        <View style={$header}>
          <StyleButton
            title="common.update"
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
            title="common.create"
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
      customStyle={[$container, {paddingBottom}]}>
      <ScrollCropImages
        images={images}
        width={width}
        height={width * ratioImageSale}
        enableRemoveImage={false}
      />
      <View style={[$body, {backgroundColor: theme.background}]}>
        <TitleAndInput
          containerStyle={$inputName}
          title="profile.groupBuyingName"
          textInputProps={{
            placeholder: t('profile.foodName'),
            onChangeText: text => setName(text),
            maxLength: 40,
            defaultValue: name,
          }}
        />
        {renderInfoBox()}

        <View style={$priceView}>
          <View style={$titleView}>
            <IconPrice tintColor={theme.black} size={18} />
            <StyleText
              i18Text="discovery.salePriceAndExplain"
              customStyle={[$textTitle, {color: theme.black}]}
            />
          </View>

          {renderPrices()}
        </View>

        <TitleAndInput
          title="profile.description"
          mandatory={false}
          containerStyle={$description}>
          <StyleTouchable
            customStyle={[$inputDescriptionBox, {borderColor: theme.gray_300}]}
            onPress={() => inputDescriptionRef.current?.focus()}>
            <AppInput
              ref={inputDescriptionRef}
              onChangeText={setContent}
              multiline
              placeholder={t('common.writeSomething')}
              defaultValue={initValue.current.content}
              editable={!disableEditCaption}
            />
          </StyleTouchable>
        </TitleAndInput>
      </View>
    </StyleContainer>
  );
};

const $container: ViewStyle = {
  paddingHorizontal: 0,
};
const $body: ViewStyle = {
  paddingHorizontal: horizontalPadding,
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
  marginTop: verticalMargin,
};
const $location: StyleProp<ViewStyle> = [
  $buttonInfo,
  {
    flexDirection: 'row',
    alignItems: 'center',
  },
];
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
  marginTop: verticalMargin,
};
const $titleView: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};
const $textTitle: TextStyle = {
  fontWeight: 'bold',
  marginLeft: scale(4),
  fontSize: FONT_SIZE.f3,
};
const $inputName: ViewStyle = {
  marginTop: verticalMargin,
};
const $description: ViewStyle = {
  marginTop: verticalMargin,
};
const $inputDescriptionBox: ViewStyle = {
  width: '100%',
  height: verticalScale(120),
  marginTop: verticalScale(12),
  borderWidth: moderateScale(1),
  borderRadius: BORDER_RADIUS.f3,
  paddingHorizontal: scale(12),
  paddingTop: verticalScale(12),
};

export default CreateSale;
