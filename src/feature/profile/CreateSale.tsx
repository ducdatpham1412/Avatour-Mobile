import {apiCreateGroupBuying, apiEditGroupBooking} from 'api/discovery';
import {useAppSelector} from 'app-redux/store';
import {STATUS} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import ViewSafeTopPadding from 'components/ViewSafeTopPadding';
import {
  StyleContainer,
  StyleIcon,
  StyleText,
  StyleTouchable,
} from 'components/base';
import ScrollSyncSizeImage from 'components/common/ScrollSyncSizeImage';
import UpdatePriceStatus from 'feature/common/components/UpdatePriceStatus';
import {useTheme} from 'hook';
import Redux from 'hook/useRedux';
import {goBack, navigate} from 'navigation/NavigationService';
import {AppParamsList} from 'navigation/config';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {ModalAlert} from 'navigation/screen/modals';
import React, {useMemo, useRef, useState} from 'react';
import isEqual from 'react-fast-compare';
import {useTranslation} from 'react-i18next';
import {TextInput, Vibration, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {I18Normalize} from 'utility/I18Next';
import ImageUploader from 'utility/ImageUploader';
import {borderWidthTiny, onGoToSignUp} from 'utility/assistant';
import {formatLocaleNumber} from 'utility/format';
import AddInfoButton from './components/AddInfoButton';
import PreviewVideo from './components/PreviewVideo';
import ModalAddPrice from './post/ModalAddPrice';

interface Props {
  route: {
    params: AppParamsList[PROFILE_ROUTE.createSale];
  };
}

const {width, safeBottomPadding} = Metrics;

const CreateSale = ({route}: Props) => {
  const itemNew = useRef(route.params?.itemNew);
  const itemEdit = useRef(route.params?.itemEdit);
  const itemError = useRef(route.params?.itemError).current;

  const theme = useTheme();
  const {
    accountSlice: {
      modeExp,
      passport: {
        profile: {location},
      },
    },
  } = useAppSelector(state => state);
  const {t} = useTranslation();

  const initValue = useRef({
    content: itemEdit.current?.content || itemError?.content || '',
    images:
      itemEdit.current?.images ||
      itemError?.images ||
      itemNew.current?.images ||
      [],
    prices: itemEdit.current?.prices || itemError?.prices || [],
  }).current;

  const [content, setContent] = useState(initValue.content);
  const [images] = useState(initValue.images);
  const [prices, setPrices] = useState(initValue.prices);

  const modalPriceRef = useRef<ModalAddPrice>(null);
  const scrollRef = useRef<KeyboardAwareScrollView>(null);

  const buttonAddPriceRef = useRef<AddInfoButton>(null);

  const onConfirmPost = async () => {
    if (!prices?.length) {
      Vibration.vibrate();
      buttonAddPriceRef.current?.slug();
      return;
    }

    if (!modeExp) {
      const newGroupBuying: TypeCreateGroupBuying = {
        content,
        images,
        prices,
      };
      try {
        navigate(ROOT_SCREEN.mainScreen);
        const listNameImages = await ImageUploader.upLoadManyImg(
          newGroupBuying.images,
          1000,
        );
        // const listNameImages = ['21666863951481.jpeg'];
        const res = await apiCreateGroupBuying({
          ...newGroupBuying,
          images: listNameImages,
        });
      } catch (err) {
        ModalAlert.error({
          content: err,
        });
      }
    } else {
      ModalAlert.options({
        i18Content: 'discovery.bubble.goToSignUp',
        onContinue: onGoToSignUp,
      });
    }
  };

  const onEditPost = async () => {
    if (itemEdit.current) {
      try {
        const dataEdit: TypeEditGroupBooking = {
          postId: itemEdit.current.id,
          data: {},
        };
        if (content !== initValue.content) {
          dataEdit.data.content = content;
        }
        if (!isEqual(images, initValue.images)) {
          dataEdit.data.images = images;
        }
        if (!isEqual(prices, initValue.prices)) {
          dataEdit.data.prices = prices;
        }
        await apiEditGroupBooking(dataEdit);
      } catch (err) {
        ModalAlert.error({
          content: err,
        });
      } finally {
        Redux.setIsLoading(false);
      }
    }
  };

  const onGoBack = () => {
    const temp: typeof initValue = {
      content,
      images,
      prices,
    };
    if (!isEqual(temp, initValue)) {
      ModalAlert.options({
        i18Content: 'common.wantToDiscard',
        onContinue: goBack,
      });
    } else {
      goBack();
    }
  };

  /**
   * Render views
   */
  const Header = () => {
    let disableButtonEdit = true;
    if (itemEdit.current) {
      const temp: typeof initValue = {
        content,
        images,
        prices,
      };
      disableButtonEdit = isEqual(temp, initValue);
    }

    return (
      <View
        style={[
          styles.headerView,
          {
            borderBottomColor: theme.borderColor,
            backgroundColor: theme.backgroundColor,
          },
        ]}>
        <StyleTouchable customStyle={styles.iconCloseView} onPress={onGoBack}>
          <Ionicons
            name="chevron-back"
            style={[styles.iconClose, {color: theme.textColor}]}
          />
        </StyleTouchable>

        {(itemNew || itemError) && (
          <StyleTouchable
            customStyle={[
              styles.postBox,
              {
                backgroundColor: theme.highlightColor,
              },
            ]}
            onPress={onConfirmPost}>
            <StyleText
              i18Text="profile.post.post"
              customStyle={[styles.textPost, {color: theme.backgroundColor}]}
            />
          </StyleTouchable>
        )}

        {(itemNew || itemError) && (
          <StyleTouchable
            customStyle={[
              styles.draftBox,
              {
                backgroundColor: theme.borderColor,
              },
            ]}
            onPress={onConfirmPost}>
            <StyleText
              i18Text="profile.post.draft"
              customStyle={[styles.textDraft, {color: theme.backgroundColor}]}
            />
          </StyleTouchable>
        )}

        {itemEdit.current && (
          <StyleTouchable
            customStyle={[
              styles.postBox,
              {backgroundColor: theme.highlightColor},
            ]}
            onPress={() => onEditPost()}
            disable={disableButtonEdit}>
            <StyleText
              i18Text="profile.post.edit"
              customStyle={[styles.textPost, {color: theme.backgroundColor}]}
            />
          </StyleTouchable>
        )}
      </View>
    );
  };

  const ImagePreview = useMemo(() => {
    if (itemNew.current?.isVideo) {
      return <PreviewVideo uri={images[0]} />;
    }
    return <ScrollSyncSizeImage images={images} syncWidth={width} />;
  }, []);

  //   const Topic = () => {
  //     const disableChooseTopic =
  //       itemEdit.current && itemEdit.current.postStatus === STATUS.requestingDelete;

  //     if (topics.length === 0) {
  //       return (
  //         <AddInfoButton
  //           ref={buttonTopicRef}
  //           borderColor={theme.borderColor}
  //           titleColor={theme.textHightLight}
  //           title="profile.post.topic"
  //           onPress={() => modalTopicRef.current?.open()}
  //         />
  //       );
  //     }

  //     return (
  //       <StyleTouchable
  //         customStyle={styles.topicView}
  //         onPress={() => modalTopicRef.current?.open()}
  //         disable={disableChooseTopic}>
  //         {topics.map(id => {
  //           const chosenTopic = chooseIconTopic(id);
  //           return (
  //             <StyleIcon
  //               key={id}
  //               source={chosenTopic}
  //               size={25}
  //               customStyle={styles.iconTopicView}
  //             />
  //           );
  //         })}
  //       </StyleTouchable>
  //     );
  //   };

  const renderInfoBox = () => {
    let textStatus: I18Normalize = 'discovery.available';
    let textButton: I18Normalize = 'discovery.temporarilyClosed';
    let textButtonColor = theme.borderColor;

    // const isClosingOrRequestingDelete =
    //   postStatus === STATUS.temporarilyClose ||
    //   postStatus === STATUS.requestingDelete;
    // if (isClosingOrRequestingDelete) {
    //   textStatus = 'discovery.temporarilyClosed';
    //   textButton = 'discovery.openAvailable';
    //   textButtonColor = theme.highlightColor;
    // }

    return (
      <>
        <View style={styles.topicView}>
          <View style={[styles.infoBox, {borderColor: theme.borderColor}]}>
            <Ionicons name="md-location-sharp" style={styles.iconLocation} />
            <StyleText
              originValue={location}
              customStyle={[styles.textLocation, {color: theme.textHightLight}]}
              numberOfLines={1}
            />
          </View>
        </View>

        <View style={styles.topicView}>
          <View style={[styles.infoBox, {borderColor: theme.borderColor}]}>
            <StyleIcon source={Images.icons.calendar} size={13} />
            <StyleText
              i18Text={textStatus}
              customStyle={[styles.textLocation, {color: theme.textHightLight}]}
            />
          </View>
          {!!itemEdit.current && (
            <StyleTouchable
              customStyle={styles.editStatusBox}
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
                customStyle={[styles.textEditStatus, {color: textButtonColor}]}
              />
            </StyleTouchable>
          )}
        </View>
      </>
    );
  };

  const renderPrices = () => {
    const onDeletePrice = (valuePrice: number) => {
      setPrices(pre => pre.filter(item => item.price !== valuePrice));
    };

    const ButtonPrice = () => {
      if (!itemEdit.current) {
        return (
          <AddInfoButton
            ref={buttonAddPriceRef}
            title="profile.addPrice"
            titleColor={theme.textHightLight}
            borderColor={theme.borderColor}
            onPress={() => modalPriceRef.current?.show()}
          />
        );
      }

      if (itemEdit.current.status === STATUS.requestingDelete) {
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

    return (
      <View style={[styles.priceView, {borderTopColor: theme.holderColor}]}>
        <View style={styles.titlePriceView}>
          <StyleIcon source={Images.icons.dollar} size={18} />
          <StyleText
            i18Text="discovery.groupBuyingPrice"
            customStyle={[styles.textTitlePrice, {color: theme.textHightLight}]}
          />
        </View>

        {prices.map((price, index) => {
          return (
            <StyleTouchable
              key={price.number_people}
              customStyle={styles.priceBox}
              onPress={() => {
                modalPriceRef.current?.show({
                  numberPeople: price.number_people,
                  price: price.price,
                  indexEdit: index,
                });
              }}
              disable={!!itemEdit.current}
              disableOpacity={1}>
              <View
                style={[
                  styles.priceNumberPeople,
                  {borderColor: theme.borderColor},
                ]}>
                <StyleText
                  originValue={price.number_people}
                  customStyle={[
                    styles.textNumberPeople,
                    {color: theme.textColor},
                  ]}
                />
              </View>
              <StyleText
                originValue="-"
                customStyle={[styles.textMiddle, {color: theme.borderColor}]}
              />
              <View
                style={[
                  styles.priceValue,
                  {borderColor: theme.highlightColor},
                ]}>
                <StyleText
                  originValue={`${formatLocaleNumber(price.price)} vnd`}
                  customStyle={[
                    styles.textNumberPeople,
                    {
                      color: theme.highlightColor,
                      fontWeight: 'bold',
                    },
                  ]}
                />
              </View>
              {!itemEdit.current && (
                <StyleTouchable
                  customStyle={styles.deleteBox}
                  hitSlop={10}
                  onPress={() => onDeletePrice(price.price)}>
                  <Feather
                    name="x"
                    style={[styles.iconDelete, {color: theme.borderColor}]}
                  />
                </StyleTouchable>
              )}
            </StyleTouchable>
          );
        })}

        {ButtonPrice()}
      </View>
    );
  };

  const Content = () => {
    const disableEditCaption =
      !!itemEdit.current && itemEdit.current.status === STATUS.requestingDelete;

    return (
      <View style={[styles.priceView, {borderTopColor: theme.holderColor}]}>
        <TextInput
          onChangeText={text => {
            scrollRef.current?.scrollToEnd();
            setContent(text);
          }}
          multiline
          placeholder={t('common.writeSomething')}
          placeholderTextColor={theme.borderColor}
          style={[styles.inputContent, {color: theme.textHightLight}]}
          defaultValue={initValue.content}
          editable={!disableEditCaption}
        />
      </View>
    );
  };

  return (
    <>
      <ViewSafeTopPadding />
      {Header()}

      <StyleContainer
        ref={scrollRef}
        containerStyle={styles.container}
        scrollEnabled
        customStyle={styles.contentContainer}
        extraHeight={80}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">
        {ImagePreview}
        <View style={styles.contentView}>
          {renderInfoBox()}
          {renderPrices()}
          {Content()}
        </View>
      </StyleContainer>

      <ModalAddPrice
        ref={modalPriceRef}
        theme={theme}
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
    </>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: safeBottomPadding + 30,
  },
  // header
  headerView: {
    width: '100%',
    paddingVertical: '5@vs',
    paddingHorizontal: '15@s',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: borderWidthTiny,
  },
  iconCloseView: {
    position: 'absolute',
    right: '10@s',
  },
  iconClose: {
    fontSize: '25@ms',
  },
  postBox: {
    paddingHorizontal: '25@s',
    paddingVertical: '3@vs',
    borderRadius: '8@ms',
  },
  textPost: {
    fontSize: '14@ms',
    fontWeight: 'bold',
  },
  draftBox: {
    paddingHorizontal: '15@s',
    paddingVertical: '3@vs',
    borderRadius: '8@ms',
    marginRight: '10@s',
  },
  textDraft: {
    fontSize: '14@ms',
  },
  contentView: {
    width: '100%',
    paddingHorizontal: '15@s',
  },
  topicView: {
    flexDirection: 'row',
    marginTop: '10@vs',
  },
  iconTopicView: {
    marginRight: '20@s',
  },
  chooseTopicView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: borderWidthTiny,
    paddingHorizontal: '13@s',
    paddingVertical: '5@vs',
    borderRadius: '5@ms',
  },
  iconTopic: {
    fontSize: '15@ms',
  },
  // titlePrice
  priceView: {
    marginTop: '15@vs',
    paddingTop: '5@vs',
    borderTopWidth: borderWidthTiny,
    paddingHorizontal: '10@s',
  },
  inputContent: {
    fontSize: FONT_SIZE.normal,
  },
  titlePriceView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textTitlePrice: {
    fontSize: FONT_SIZE.normal,
    fontWeight: 'bold',
    marginLeft: '5@s',
  },
  priceBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '10@vs',
  },
  priceNumberPeople: {
    flex: 1,
    paddingVertical: '7@vs',
    borderWidth: borderWidthTiny,
    borderRadius: '5@ms',
    alignItems: 'center',
  },
  textMiddle: {
    fontSize: FONT_SIZE.normal,
    marginHorizontal: '10@s',
  },
  priceValue: {
    flex: 2,
    paddingVertical: '7@vs',
    borderWidth: borderWidthTiny,
    borderRadius: '5@ms',
    paddingHorizontal: '20@s',
  },
  deleteBox: {
    marginLeft: '10@s',
  },
  iconDelete: {
    fontSize: '20@ms',
  },
  textNumberPeople: {
    fontSize: FONT_SIZE.small,
  },
  buttonEditRetail: {
    marginLeft: '10@s',
  },
  textEditRetail: {
    fontSize: FONT_SIZE.small,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  infoBox: {
    borderWidth: borderWidthTiny,
    borderRadius: '5@ms',
    paddingHorizontal: '10@s',
    paddingVertical: '5@vs',
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLocation: {
    fontSize: '15@ms',
    color: Theme.common.commentGreen,
  },
  textLocation: {
    fontSize: FONT_SIZE.small,
    marginLeft: '3@s',
  },
  editStatusBox: {
    alignSelf: 'center',
    marginLeft: '10@s',
  },
  textEditStatus: {
    fontSize: FONT_SIZE.small,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  editPriceBox: {
    paddingTop: '15@vs',
  },
  textEditPrice: {
    fontSize: FONT_SIZE.small,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default CreateSale;
