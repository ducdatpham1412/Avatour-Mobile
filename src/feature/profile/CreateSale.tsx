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
  StyleContainer,
  StyleIcon,
  StyleText,
  StyleTouchable,
} from 'components/base';
import UpdatePriceStatus from 'feature/common/components/UpdatePriceStatus';
import {useTheme} from 'hook';
import {AppParamsList} from 'navigation/config';
import {PROFILE_ROUTE} from 'navigation/config/routes';
import React, {ElementRef, useRef} from 'react';
import isEqual from 'react-fast-compare';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {I18Normalize} from 'utility/I18Next';
import {borderWidthTiny} from 'utility/assistant';
import {formatLocaleNumber} from 'utility/format';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {ScrollCropImages} from './components';
import ButtonIconTitle from './components/ButtonIconTitle';
import {UseCreateSaleParams, useCreateSale} from './hooks';
import ModalAddPrice from './post/ModalAddPrice';
import HeaderLeftIcon from 'navigation/components/HeaderLeftIcon';
import {goBack} from 'navigation/NavigationService';
import {Avatar} from 'components/common';

interface Props {
  route: {
    params: AppParamsList[PROFILE_ROUTE.createSale];
  };
}

const {width} = Metrics;

const CreateSale = ({route}: Props) => {
  const {t} = useTranslation();
  const {bottom} = useSafeAreaInsets();
  const itemNew = useRef(route.params?.itemNew);
  const itemEdit = useRef<TypeGroupBuying | undefined>(route.params?.itemEdit);
  const itemError = useRef(route.params?.itemError);

  const theme = useTheme();
  const {
    location,
    avatar,
    name: myName,
  } = useAppSelector(state => state.accountSlice.passport.profile);

  const initValue = useRef<UseCreateSaleParams['initValue']>({
    postId: itemEdit.current?.id,
    name: itemEdit.current?.name || itemError.current?.name || '',
    content: itemEdit.current?.content || itemError.current?.content || '',
    images:
      itemEdit.current?.images ||
      itemError?.current?.images ||
      itemNew.current?.images ||
      [],
    prices: itemEdit.current?.prices || itemError.current?.prices || [],
  });

  const [
    {content, name, images, prices, loadingCreate},
    {
      onConfirmPost,
      onEditPost,
      onGoBack,
      onDeletePrice,
      setContent,
      setPrices,
      setName,
    },
  ] = useCreateSale({
    initValue: initValue.current,
  });

  const modalPriceRef = useRef<ElementRef<typeof ModalAddPrice>>(null);
  const scrollRef = useRef<KeyboardAwareScrollView>(null);
  const buttonAddPriceRef = useRef<ElementRef<typeof ButtonIconTitle>>(null);

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
    let disableButtonEdit = true;
    if (itemEdit.current) {
      const temp: typeof initValue.current = {
        name,
        content,
        images,
        prices,
      };
      disableButtonEdit = isEqual(temp, initValue);
    }

    return (
      <View style={$header}>
        {(itemNew.current || itemError.current) && (
          <StyleTouchable
            customStyle={[
              $postBox,
              {
                backgroundColor: theme.p_700,
              },
            ]}
            onPress={onConfirmPost}
            disable={!prices.length}>
            {loadingCreate ? (
              <ActivityIndicator size="small" color={theme.white} />
            ) : (
              <StyleText
                i18Text="profile.post.post"
                customStyle={[$textPost, {color: theme.backgroundColor}]}
              />
            )}
          </StyleTouchable>
        )}

        {/* {(itemNew || itemError) && (
          <StyleTouchable
            customStyle={[
              $draftBox,
              {
                borderColor: theme.gray_700,
              },
            ]}
            onPress={onConfirmPost}>
            <StyleText
              i18Text="profile.post.draft"
              customStyle={[$textDraft, {color: theme.black}]}
            />
          </StyleTouchable>
        )} */}

        {itemEdit.current && (
          <StyleTouchable
            customStyle={[$postBox, {backgroundColor: theme.highlightColor}]}
            onPress={() => onEditPost()}
            disable={disableButtonEdit}>
            <StyleText
              i18Text="profile.post.edit"
              customStyle={[$textPost, {color: theme.backgroundColor}]}
            />
          </StyleTouchable>
        )}
      </View>
    );
  };

  const renderInfoBox = () => {
    let textStatus: I18Normalize = 'discovery.available';
    let textButton: I18Normalize = 'discovery.temporarilyClosed';

    return (
      <>
        <ButtonIconTitle
          icon={<Ionicons name="md-location-sharp" style={$iconLocation} />}
          title={location as I18Normalize}
          containerStyle={$buttonInfo}
        />

        <View style={$location}>
          <ButtonIconTitle
            icon={<StyleIcon source={Images.icons.calendar} size={13} />}
            title={textStatus}
          />
          {!!itemEdit.current && (
            <StyleTouchable
              customStyle={$editStatusBox}
              onPress={() => {
                // onChangePostStatus(
                //   isClosingOrRequestingDelete
                //     ? STATUS.active
                //     : STATUS.temporarilyClose,
                //   itemEdit.current.id,
                // );
              }}>
              <StyleText
                i18Text={textButton}
                customStyle={[$textEditStatus, {color: theme.blue}]}
              />
            </StyleTouchable>
          )}
        </View>
      </>
    );
  };

  const renderPrices = () => {
    const buttonPrice = () => {
      if (!itemEdit.current) {
        return (
          <ButtonIconTitle
            ref={buttonAddPriceRef}
            title="profile.addPrice"
            onPress={() => modalPriceRef.current?.show()}
            containerStyle={[$buttonInfo, {marginLeft: '5%'}]}
            titleFontWeight="bold"
            buttonStyle={{borderColor: theme.black}}
          />
        );
      }

      if (itemEdit.current?.status === STATUS.requestingDelete) {
        return null;
      }

      //   if (!requestUpdatePrice) {
      //     return (
      //       <View style={styles.titlePriceView}>
      //         <StyleTouchable
      //           customStyle={styles.editPriceBox}
      //           hitSlop={{
      //             right: 15,
      //             bottom: 15,
      //           }}
      //           onPress={() =>
      //             navigate(PROFILE_ROUTE.updatePrices, {
      //               item: itemEdit.current,
      //               onUpdatePrice: (value: TypeGroupBuying) => {
      //                 setRequestUpdatePrice({
      //                   retailPrice: value.retailPrice,
      //                   prices: value.prices,
      //                 });
      //               },
      //             })
      //           }>
      //           <StyleText
      //             i18Text="profile.editPrice"
      //             customStyle={[styles.textEditPrice, {color: theme.borderColor}]}
      //           />
      //         </StyleTouchable>
      //       </View>
      //     );
      //   }

      return (
        <UpdatePriceStatus
          postId={itemEdit.current.id}
          prices={itemEdit.current.prices}
        />
      );
    };

    const buttonDelete = (price: TypePrice) => {
      if (itemEdit.current) {
        return null;
      }
      if (price.number_people === 1) {
        return <View style={$deleteBox} />;
      }
      return (
        <StyleTouchable
          customStyle={$deleteBox}
          onPress={() => onDeletePrice(price.price)}>
          <Feather name="x" style={[$iconDelete, {color: theme.gray_500}]} />
        </StyleTouchable>
      );
    };

    return (
      <View style={[$priceView, {borderTopColor: theme.gray_300}]}>
        <View style={$titleView}>
          <StyleIcon source={Images.icons.dollar} size={18} />
          <StyleText
            i18Text="discovery.salePriceAndExplain"
            customStyle={[$textTitle, {color: theme.black}]}
          />
        </View>

        {prices.map((price, index) => {
          return (
            <View
              key={price.number_people}
              style={$priceBox}
              //   onPress={() => {
              //     modalPriceRef.current?.show({
              //       numberPeople: price.number_people,
              //       price: price.price,
              //       indexEdit: index,
              //     });
              //   }}
            >
              <View style={[$numberPeopleBox, {borderColor: theme.gray_500}]}>
                <StyleText
                  originValue={price.number_people}
                  customStyle={[$textNumberPeople, {color: theme.black}]}
                />
              </View>
              <StyleText
                originValue="-"
                customStyle={[$textMiddle, {color: theme.black}]}
              />
              <View style={[$priceValue, {borderColor: theme.p_800}]}>
                <StyleText
                  originValue={`${formatLocaleNumber(price.price)} vnd`}
                  customStyle={{
                    fontWeight: FONT_WEIGHT_MEDIUM,
                    color: theme.p_800,
                  }}
                />
              </View>
              {!itemEdit.current && (
                <StyleTouchable
                  customStyle={$editBox}
                  onPress={() => {
                    modalPriceRef.current?.show({
                      numberPeople: price.number_people,
                      price: price.price,
                      indexEdit: index,
                    });
                  }}>
                  <Feather
                    name="edit-2"
                    style={[$iconEdit, {color: theme.gray_500}]}
                  />
                </StyleTouchable>
              )}
              {buttonDelete(price)}
            </View>
          );
        })}

        {buttonPrice()}
      </View>
    );
  };

  const renderContent = () => {
    const disableEditCaption =
      !!itemEdit.current && itemEdit.current.status === STATUS.requestingDelete;

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
      <View style={$body}>
        <AppInput
          onChangeText={text => setName(text)}
          multiline
          placeholder={t('profile.groupBuyingName')}
          defaultValue={initValue.current.name}
          style={[$inputName, {borderColor: theme.gray_500}]}
          maxLength={40}
        />
        {renderInfoBox()}
        {renderPrices()}
        {renderContent()}
      </View>

      <ModalAddPrice
        ref={modalPriceRef}
        prices={prices}
        onAddPrice={value => setPrices(pre => pre.concat(value))}
        onChangePrice={e => {
          setPrices(pre =>
            pre.map((item, index) => {
              if (index !== e.indexEdit) {
                return item;
              }
              return {
                ...item,
                number_people: e.value.number_people,
                price: e.value.price,
              };
            }),
          );
        }}
      />

      {/* <ModalTopic
        ref={modalTopicRef}
        topics={topics}
        onChangeListTopics={value => {
          setTopics(value);
        }}
      /> */}

      {/* <ModalRetailPrice
        ref={modalRetailPriceRef}
        theme={theme}
        price={retailPrice}
        onChangePrice={value => setRetailPrice(value)}
      /> */}
    </StyleContainer>
  );
};

const $container: ViewStyle = {
  paddingHorizontal: 0,
};
const $body: ViewStyle = {
  paddingHorizontal: scale(12),
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
  borderRadius: BORDER_RADIUS.f2,
};
const $draftBox: ViewStyle = {
  paddingHorizontal: scale(15),
  paddingVertical: verticalScale(5),
  borderRadius: BORDER_RADIUS.f2,
  marginRight: scale(8),
  borderWidth: moderateScale(1),
};
const $textPost: TextStyle = {
  fontWeight: 'bold',
};
const $textDraft: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
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
const $priceBox: ViewStyle = {
  width: '90%',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: verticalScale(8),
  alignSelf: 'center',
};
const $numberPeopleBox: ViewStyle = {
  flex: 1,
  paddingVertical: verticalScale(4),
  borderWidth: borderWidthTiny,
  borderRadius: BORDER_RADIUS.f4,
  alignItems: 'center',
};
const $textNumberPeople: TextStyle = {
  fontSize: FONT_SIZE.f2,
};
const $textMiddle: TextStyle = {
  marginHorizontal: scale(12),
  fontWeight: 'bold',
};
const $priceValue: ViewStyle = {
  flex: 2,
  paddingVertical: verticalScale(4),
  borderWidth: borderWidthTiny,
  borderRadius: BORDER_RADIUS.f4,
  paddingHorizontal: scale(20),
};
const $editBox: ViewStyle = {
  marginLeft: scale(13),
};
const $iconEdit: TextStyle = {
  fontSize: moderateScale(20),
};
const $deleteBox: ViewStyle = {
  marginLeft: scale(20),
  width: moderateScale(15),
};
const $iconDelete: TextStyle = {
  fontSize: moderateScale(15),
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
