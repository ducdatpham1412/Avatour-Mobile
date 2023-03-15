import {BlurView} from '@react-native-community/blur';
import {GROUP_BUYING_STATUS, RELATIONSHIP} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE, ratioImageGroupBuying} from 'asset/standardValue';
import Theme, {TypeTheme} from 'asset/theme/Theme';
import {
  StyleIcon,
  StyleImage,
  StyleText,
  StyleTouchable,
} from 'components/base';
import StyleVideo from 'components/base/StyleVideo';
import IconLiked from 'components/common/IconLiked';
import IconNotLiked from 'components/common/IconNotLiked';
import Redux from 'hook/useRedux';
import React, {memo, useEffect, useState} from 'react';
import isEqual from 'react-fast-compare';
import {Platform, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ScaledSheet} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import {SharedElement} from 'react-navigation-shared-element';
import {chosenBlurType, isIOS, onGoToProfile} from 'utility/assistant';
import {formatLocaleNumber} from 'utility/format';
import {checkIsVideo} from 'utility/validate';

export interface ParamsLikeGB {
  isLiked: boolean;
  setIsLiked: Function;
  totalLikes: number;
  setTotalLikes: Function;
  postId: string;
}

interface Props {
  item: TypeGroupBuying;
  onGoToDetailGroupBuying(item: TypeGroupBuying): void;
  onShowMoreOption(params: TypeMoreOptionsMe): void;
  onHandleLike(params: ParamsLikeGB): void;
  onShowModalComment(
    post: TypeGroupBuying,
    type: TypeShowModalCommentOrLike,
  ): void;
  onChangePostIdFocusing(postId: string): void;
  detailGroupTarget: string;
  containerWidth?: number;
  containerStyle?: StyleProp<ViewStyle>;
  showTopView?: boolean;
  showBottomView?: boolean;
  showReactView?: boolean;
  showButtonJoined?: boolean;
}

// const onShowModalShare = async (
//     item: TypeGroupBuying,
//     setDisableShare: Function,
// ) => {
//     try {
//         setDisableShare(true);
//         const link = await dynamicLinks().buildShortLink({
//             link: `${item?.images?.[0] || LANDING_PAGE_URL}?type=${
//                 TYPE_DYNAMIC_LINK.groupBuying
//             }&post_id=${item.id}`,
//             domainUriPrefix: DYNAMIC_LINK_SHARE,
//             ios: {
//                 bundleId: DYNAMIC_LINK_IOS,
//                 appStoreId: '570060128',
//             },
//             android: {
//                 packageName: DYNAMIC_LINK_ANDROID,
//                 fallbackUrl: ANDROID_APP_LINK,
//             },
//             analytics: {
//                 campaign: 'banner',
//             },
//         });

//         // const imagePath: any = null;
//         // let base64Data = '';
//         // if (isIOS) {
//         //     const resp = await RNFetchBlob.config({
//         //         fileCache: true,
//         //     }).fetch('GET', item.images[0]);
//         //     base64Data = await resp.readFile('base64');
//         // } else {
//         //     base64Data = await RNFetchBlob.fs.readFile(
//         //         item.images[0],
//         //         'base64',
//         //     );
//         // }
//         // const base64Image = `data:image/png;base64,${base64Data}`;
//         // await Share.open({
//         //     title: 'Title',
//         //     url: base64Image,
//         //     message: link,
//         //     subject: 'Subject',
//         // });
//         // return RNFetchBlob.fs.unlink(imagePath);

//         Share.open({
//             message: 'Doffy share',
//             url: link,
//         });
//     } catch (err) {
//         appAlert(err);
//     } finally {
//         setDisableShare(false);
//     }
// };

const {width} = Metrics;

const CustomBlurView = () => {
  if (isIOS) {
    return (
      <BlurView
        style={styles.blurView}
        blurType={chosenBlurType}
        blurAmount={0}
        blurRadius={1}
        reducedTransparencyFallbackColor="white"
      />
    );
  }
  return (
    <View
      style={[
        styles.blurView,
        {backgroundColor: Theme.darkTheme.backgroundOpacity(0.6)},
      ]}
    />
  );
};

const ButtonCheckJoined = (item: TypeGroupBuying, theme: TypeTheme) => {
  if (item.relationship === RELATIONSHIP.self) {
    return <View />;
  }
  if (item.status === GROUP_BUYING_STATUS.bought) {
    return (
      <LinearGradient
        style={styles.boughtBox}
        colors={[Theme.common.commentGreen, Theme.common.gradientTabBar2]}>
        <Entypo name="check" style={styles.iconBought} />
        <StyleText i18Text="discovery.bought" customStyle={styles.textBought} />
      </LinearGradient>
    );
  }
  if (
    [
      GROUP_BUYING_STATUS.notJoined,
      GROUP_BUYING_STATUS.joinedNotBought,
    ].includes(item.status)
  ) {
    const isJoined = item.status === GROUP_BUYING_STATUS.joinedNotBought;
    return (
      <View
        style={[
          styles.joinGroupBuyingBox,
          {
            backgroundColor: isJoined
              ? theme.highlightColor
              : theme.backgroundButtonColor,
          },
        ]}>
        <StyleText
          i18Text={isJoined ? 'discovery.joined' : 'discovery.joinNow'}
          customStyle={[
            styles.textTellJoin,
            {
              color: isJoined ? theme.backgroundColor : theme.textHightLight,
              fontWeight: isJoined ? 'bold' : 'normal',
            },
          ]}
        />
      </View>
    );
  }

  return <View />;
};

const BubbleGroupBuying = (props: Props) => {
  const {
    item,
    onGoToDetailGroupBuying,
    onHandleLike,
    onShowModalComment,
    onChangePostIdFocusing,
    containerWidth = width * 0.93,
    showTopView = true,
    showBottomView = true,
    showReactView = true,
    showButtonJoined = true,
    containerStyle,
  } = props;
  const theme = Redux.getTheme();

  const [isLiked, setIsLiked] = useState(item.isLiked);
  const [totalLikes, setTotalLikes] = useState(item.totalLikes);
  // const [disableShare, setDisableShare] = useState(false);

  useEffect(() => {
    setIsLiked(item.isLiked);
  }, [item.isLiked]);

  useEffect(() => {
    setTotalLikes(item.totalLikes);
  }, [item.totalLikes]);

  const lastPrice = item.prices[item.prices.length - 1];
  const imageWidth = containerWidth * 0.4;
  const isVideo = checkIsVideo(item.images[0]);

  const Image = () => {
    const TopBottomView = () => {
      return (
        <>
          {showTopView && (
            <View style={styles.topView}>
              <StyleTouchable
                customStyle={styles.creatorView}
                onPress={() => onGoToProfile(item.creator)}>
                <CustomBlurView />
                <View style={styles.avatarBox}>
                  <StyleImage
                    source={{uri: item.creatorAvatar}}
                    customStyle={styles.avatar}
                  />
                </View>
                <StyleText
                  originValue={item.creatorName}
                  numberOfLines={1}
                  customStyle={styles.textName}
                />
              </StyleTouchable>
            </View>
          )}

          {showBottomView && (
            <View style={styles.bottomView}>
              <View style={styles.bottomLeft}>
                <View style={styles.numberJoinedBox}>
                  <CustomBlurView />
                  <StyleIcon
                    source={Images.icons.createGroup}
                    size={15}
                    customStyle={styles.iconNumberPeople}
                  />
                  <StyleText
                    originValue={item.totalGroups + item.totalPersonals}
                    customStyle={styles.textNumberPeople}
                  />
                </View>
              </View>

              <View style={styles.leftRight}>
                <StyleTouchable
                  customStyle={styles.contractBox}
                  onPress={() => onShowModalComment(item, 'comment')}
                  hitSlop={10}>
                  <CustomBlurView />
                  <StyleIcon
                    source={Images.icons.comment}
                    size={12}
                    customStyle={{
                      tintColor: Theme.common.white,
                    }}
                  />
                </StyleTouchable>
                {/* <StyleTouchable
                                customStyle={styles.contractBox}
                                disableOpacity={0.85}
                                onPress={() =>
                                    onShowModalShare(item, setDisableShare)
                                }
                                disable={disableShare}>
                                <CustomBlurView />
                                <StyleIcon
                                    source={Images.icons.share}
                                    size={15}
                                    customStyle={{
                                        tintColor: Theme.common.white,
                                    }}
                                />
                            </StyleTouchable> */}
              </View>
            </View>
          )}
        </>
      );
    };

    if (isVideo) {
      return (
        <View
          style={{
            width: imageWidth,
            height: imageWidth * ratioImageGroupBuying,
          }}>
          <StyleVideo
            source={{uri: item.images[0]}}
            style={[
              styles.imagePreview,
              {
                width: imageWidth,
                height: imageWidth * ratioImageGroupBuying,
              },
            ]}
            currentTime={2}
            paused
            isOverlay
            onPressOverlay={() => onGoToDetailGroupBuying(item)}
          />
          {TopBottomView()}
        </View>
      );
    }

    return (
      <SharedElement
        style={{
          width: imageWidth,
          height: imageWidth * ratioImageGroupBuying,
        }}
        id={`item.group_buying.${item.id}.false`}>
        <StyleImage
          source={{uri: item.images[0]}}
          customStyle={[
            styles.imagePreview,
            {
              width: imageWidth,
              height: imageWidth * ratioImageGroupBuying,
            },
          ]}
          defaultSource={Images.images.defaultImage}
        />
      </SharedElement>
    );

    // return (
    //     <SharedElement
    //         style={{
    //             width: imageWidth,
    //             height: imageWidth * ratioImageGroupBuying,
    //         }}
    //         id={`item.group_buying.${item.id}.false`}>
    //         {isVideo ? (
    //             <StyleVideo
    //                 source={{uri: item.images[0]}}
    //                 style={[
    //                     styles.imagePreview,
    //                     {
    //                         width: imageWidth,
    //                         height: imageWidth * ratioImageGroupBuying,
    //                     },
    //                 ]}
    //                 currentTime={2}
    //                 paused
    //                 isOverlay
    //                 onPressOverlay={() => onGoToDetailGroupBuying(item)}
    //             />
    //         ) : (
    //             <StyleImage
    //                 source={{uri: item.images[0]}}
    //                 customStyle={[
    //                     styles.imagePreview,
    //                     {
    //                         width: imageWidth,
    //                         height: imageWidth * ratioImageGroupBuying,
    //                     },
    //                 ]}
    //             />
    //         )}
    //     </SharedElement>
    // );
  };

  const Content = () => {
    return (
      <View style={styles.contentView}>
        {!!item.creatorLocation && (
          <View style={styles.infoView}>
            <Entypo
              name="location-pin"
              style={[styles.iconLocation, {color: theme.borderColor}]}
            />
            <View style={styles.textLocationTouch}>
              <StyleText
                originValue={item.creatorLocation}
                customStyle={[styles.textLocation, {color: theme.borderColor}]}
                numberOfLines={1}
              />
            </View>
          </View>
        )}

        {!!item.content && (
          <View style={styles.infoView}>
            <StyleText
              originValue={item.content}
              customStyle={[styles.textContent, {color: theme.textHightLight}]}
              numberOfLines={1}
            />
          </View>
        )}

        <View style={styles.infoView}>
          <StyleIcon
            source={Images.icons.username}
            size={13}
            customStyle={{tintColor: theme.borderColor}}
          />
          <StyleText
            originValue={`${formatLocaleNumber(item.retailPrice)}vnd`}
            customStyle={[styles.textInfo, {color: theme.borderColor}]}
          />
        </View>

        <View style={styles.infoView}>
          <StyleIcon source={Images.icons.dollar} size={13} />
          <StyleText
            i18Text="discovery.numberPeople"
            i18Params={{
              value: lastPrice.number_people,
            }}
            customStyle={[styles.textInfo, {color: theme.borderColor}]}
          />
          <StyleText
            originValue=" - "
            customStyle={[styles.textInfo, {color: theme.borderColor}]}
          />
          <StyleText
            originValue={`${formatLocaleNumber(lastPrice.value)}vnd`}
            customStyle={[
              styles.textInfo,
              {color: theme.highlightColor, fontWeight: 'bold'},
            ]}
          />
        </View>

        {/* Footer */}
        {showReactView && (
          <View style={styles.footerView}>
            {showButtonJoined && ButtonCheckJoined(item, theme)}

            {isLiked ? (
              <IconLiked
                customStyle={[styles.iconLike, {color: theme.likeHeart}]}
                onPress={() =>
                  onHandleLike({
                    isLiked,
                    setIsLiked,
                    totalLikes,
                    setTotalLikes,
                    postId: item.id,
                  })
                }
              />
            ) : (
              <IconNotLiked
                customStyle={[styles.iconLike, {color: theme.borderColor}]}
                onPress={() =>
                  onHandleLike({
                    isLiked,
                    setIsLiked,
                    totalLikes,
                    setTotalLikes,
                    postId: item.id,
                  })
                }
              />
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <StyleTouchable
      key={item.id}
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundColor,
          shadowColor: theme.textColor,
          borderColor: theme.holderColor,
        },
        containerStyle,
        {
          width: containerWidth,
          height: imageWidth * ratioImageGroupBuying,
        },
      ]}
      onPress={() => onGoToDetailGroupBuying(item)}
      onTouchEnd={() => onChangePostIdFocusing(item.id)}>
      {Image()}
      {Content()}
    </StyleTouchable>
  );
};

const styles = ScaledSheet.create({
  container: {
    alignSelf: 'center',
    shadowOpacity: 0,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderRadius: '5@ms',
    borderWidth: Platform.select({
      ios: '0.25@ms',
      android: '0.5@ms',
    }),
    flexDirection: 'row',
    marginTop: '10@vs',
  },
  imagePreview: {
    borderTopLeftRadius: '5@ms',
    borderBottomLeftRadius: '5@ms',
  },
  creatorView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: '20@ms',
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
  avatarBox: {
    width: '20@ms',
    height: '20@ms',
    borderRadius: '10@ms',
    overflow: 'hidden',
    marginLeft: '5@s',
    marginVertical: '2@s',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  textName: {
    fontSize: FONT_SIZE.small,
    fontWeight: 'bold',
    color: Theme.common.white,
    marginHorizontal: '5@s',
  },
  textCreated: {
    fontSize: FONT_SIZE.small,
    color: Theme.common.grayLight,
  },
  topView: {
    position: 'absolute',
    top: '7@s',
    paddingHorizontal: '7@s',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  bottomView: {
    position: 'absolute',
    bottom: '7@s',
    paddingHorizontal: '7@s',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  bottomLeft: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1,
  },
  numberJoinedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: '20@ms',
    overflow: 'hidden',
  },
  iconNumberPeople: {
    tintColor: Theme.common.white,
    marginLeft: '5@s',
    marginVertical: '2@s',
  },
  textNumberPeople: {
    fontSize: FONT_SIZE.small,
    fontWeight: 'bold',
    color: Theme.common.white,
    marginHorizontal: '5@s',
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '90%',
    overflow: 'hidden',
    marginBottom: '5@vs',
  },
  iconLocation: {
    fontSize: '13@ms',
    marginVertical: '2@s',
  },
  textLocationTouch: {
    justifyContent: 'center',
    paddingRight: '10@s',
    marginLeft: '3@s',
  },
  textLocation: {
    fontSize: FONT_SIZE.small,
    color: Theme.common.white,
  },
  // content
  contentView: {
    flex: 1,
    paddingHorizontal: '10@s',
    paddingVertical: '5@s',
  },
  textContent: {
    fontSize: FONT_SIZE.small,
  },
  contentBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInfo: {
    fontSize: FONT_SIZE.small,
    marginLeft: '8@s',
  },
  boughtBox: {
    marginRight: '10@s',
    padding: '5@ms',
    borderRadius: '20@ms',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBought: {
    fontSize: '10@ms',
    color: Theme.common.white,
  },
  textBought: {
    fontSize: FONT_SIZE.tiny,
    fontWeight: 'bold',
    color: Theme.common.white,
    marginHorizontal: '3@s',
  },
  joinGroupBuyingBox: {
    marginRight: '5@s',
    paddingHorizontal: '10@s',
    paddingVertical: '3@vs',
    borderRadius: '20@ms',
  },
  textTellJoin: {
    fontSize: FONT_SIZE.tiny,
  },
  leftRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contractBox: {
    width: '25@ms',
    height: '25@ms',
    borderRadius: '15@ms',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerView: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '10@vs',
  },
  iconLike: {
    fontSize: '25@ms',
  },
  likeTouch: {
    paddingLeft: '10@s',
  },
  textLike: {
    fontSize: '12@ms',
    fontWeight: 'bold',
  },
  textComment: {
    fontSize: '12@ms',
  },
  commentTouch: {
    paddingLeft: '10@s',
  },
});

export default memo(BubbleGroupBuying, (preProps: Props, nextProps: any) => {
  if (!isEqual(preProps.item, nextProps.item)) {
    return false;
  }
  return true;
});
