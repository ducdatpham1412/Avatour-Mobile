import {useAppSelector} from 'app-redux/store';
import {
  BORDER_RADIUS,
  FONT_SIZE,
  FONT_WEIGHT_MEDIUM,
  ratioImageSale,
} from 'asset';
import {ERROR_MESSAGE, STATUS} from 'asset/enum';
import {IconPrice} from 'asset/icons';
import Images from 'asset/img/images';
import {
  Metrics,
  horizontalMargin,
  horizontalPadding,
  verticalMargin,
} from 'asset/metrics';
import {AppModalize, LoadingScreen, TextCountDown} from 'components';
import {
  RefreshControl,
  StyleContainer,
  StyleIcon,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {Avatar, IconLiked, IconNotLiked} from 'components/common';
import dayjs from 'dayjs';
import {ScrollCropImages} from 'feature/profile/components';
import {useEstimatesAndJoinings, useSafeArea, useTheme} from 'hook';
import {goBack, navigate, push} from 'navigation/NavigationService';
import {AppParamsList, PROFILE_ROUTE, ROOT_SCREEN} from 'navigation/config';
import {checkAuthenticated} from 'navigation/screen/AppModal';
import {ModalActionSheet, ModalAlert} from 'navigation/screen/modals';
import React, {ElementRef, ReactNode, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ImageSourcePropType,
  ScrollView,
  TextStyle,
  Vibration,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Share from 'react-native-share';
import {I18Normalize} from 'utility/I18Next';
import {
  borderWidthTiny,
  calculatePriceDeposit,
  onGoToProfile,
} from 'utility/assistant';
import {formatMoney, formatddddDDMMYYYY} from 'utility/format';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {
  ItemMeJoin,
  ModalConfirmJoinGb,
  ModalStillHavePeopleJoin,
} from './components';
import {useDetailSale} from './hooks';

interface ButtonReactionProps {
  icon?: ImageSourcePropType;
  children?: ReactNode;
  title: I18Normalize;
  titleParams?: Record<string, any>;
  onPress: () => void;
}

const {width} = Metrics;

const ButtonReaction = ({
  icon,
  children,
  title,
  titleParams,
  onPress,
}: ButtonReactionProps) => {
  const theme = useTheme();
  const renderContent = () => {
    if (children) {
      return children;
    }
    if (icon) {
      return (
        <StyleIcon
          source={icon}
          size={20}
          customStyle={{tintColor: theme.gray_800}}
        />
      );
    }
    return null;
  };

  return (
    <View style={$reactionBox}>
      <StyleTouchable
        customStyle={[$reaction, {backgroundColor: theme.gray_100}]}
        onPress={onPress}>
        {renderContent()}
      </StyleTouchable>
      <StyleText
        i18Text={title}
        i18Params={titleParams}
        customStyle={[$textReaction, {color: theme.black}]}
        onPress={onPress}
        numberOfLines={1}
      />
    </View>
  );
};

const DetailSale = ({
  route: {
    params: {saleId},
  },
}: RouteParams<AppParamsList[ROOT_SCREEN.detailSale]>) => {
  const theme = useTheme();
  const {id: myId} = useAppSelector(
    state => state.accountSlice.passport.profile,
  );
  const {bottom, paddingBottom} = useSafeArea();
  const {t} = useTranslation();

  const [
    {data, initLoading, loadingJoin, refreshing, loadingDelete},
    {onReaction, mutate, onJoin, deleteSale},
  ] = useDetailSale(saleId, {
    revalidateAll: true,
  });
  const {data: estimateAndJoinings, mutate: mutateEstimateAndJoinings} =
    useEstimatesAndJoinings();

  const modalConfirmJoinRef = useRef<ElementRef<typeof AppModalize>>(null);
  const modalStillHavePeopleJoin = useRef<ElementRef<typeof AppModalize>>(null);

  const estimating = estimateAndJoinings.estimates.find(
    item => item.sale.id === data?.id,
  );
  const joinings = estimateAndJoinings.joinings.filter(
    item => item.sale.id === data?.id,
  );
  const isMySale = data?.creator === myId;

  /**
   * Function
   */
  const onConfirmJoin = async (value: Omit<TypeJoinRequest, 'saleId'>) => {
    try {
      if (data) {
        const res = await onJoin(value);
        if (res) {
          push(ROOT_SCREEN.detailMeJoin, {
            estimateId: res.id,
            initValue: res,
            mode: 'see-detail-from-sale',
          });
        }
        modalConfirmJoinRef.current?.hide();
      }
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    }
  };

  const onShowOptions = () => {
    if (data && data.status !== STATUS.notActive) {
      if (isMySale) {
        const agree = async () => {
          try {
            await deleteSale();
            goBack();
          } catch (err) {
            if (err === ERROR_MESSAGE.still_having_people_join) {
              Vibration.vibrate();
              modalStillHavePeopleJoin.current?.show();
            } else {
              ModalAlert.error({
                content: err,
              });
            }
          }
        };

        ModalActionSheet.show({
          options: [
            {
              title: 'common.edit',
              onPress: () => {
                navigate(PROFILE_ROUTE.createSale, {
                  itemEdit: data,
                });
              },
            },
            {
              title: 'common.delete',
              onPress: () => {
                ModalAlert.options({
                  i18Content: 'profile.post.sureDeletePost',
                  onContinue: agree,
                });
              },
            },
          ],
        });
        return;
      }

      ModalActionSheet.show({
        options: [
          {
            title: 'discovery.buyingHistory',
            onPress: () => {
              navigate(ROOT_SCREEN.joinsHistory, {
                saleId: data.id,
                mode: 'go-from-sale',
              });
            },
          },
          {
            title: 'discovery.report.title',
            onPress: () => {
              navigate(ROOT_SCREEN.reportUser, {
                idUser: data?.creator,
                nameUser: data?.creator_name,
              });
            },
          },
        ],
      });
    }
  };

  const onDeleteEstimate = async () => {
    if (estimating) {
      await mutateEstimateAndJoinings(pre => {
        if (pre) {
          return {
            estimates: pre.estimates.filter(item => item.id !== estimating.id),
            joinings: pre.joinings,
          };
        }
      });
    }
  };

  /**
   * Render
   */
  const renderInformation = () => {
    let textStatus: I18Normalize = 'common.null';
    let colorStatus = theme.green;
    if (data?.status === STATUS.active) {
      textStatus = 'discovery.available';
    } else if (data?.status === STATUS.temporarilyClose) {
      textStatus = 'discovery.temporarilyClosed';
      colorStatus = theme.red;
    } else if (data?.status === STATUS.notActive) {
      textStatus = 'discovery.closed';
      colorStatus = theme.gray_500;
    }

    return (
      <View style={$informationView}>
        {!!data?.name && (
          <StyleText originValue={data?.name} customStyle={$textNameSale} />
        )}

        <StyleText
          originValue={data?.content || ''}
          customStyle={[$contentView, {color: theme.gray_500}]}
        />

        <StyleText
          i18Text={textStatus}
          customStyle={[$textStatus, {color: colorStatus}]}
        />

        <View style={$saleCreator}>
          <StyleTouchable
            customStyle={$creatorBox}
            onPress={() => {
              if (data?.creator) {
                onGoToProfile(data.creator);
              }
            }}>
            <Avatar source={{uri: data?.creator_avatar}} size={25} />
            <StyleText
              originValue={data?.creator_name}
              customStyle={$nameShop}
            />
          </StyleTouchable>
        </View>

        <View style={$price}>
          <IconPrice size={20} tintColor={theme.black} />
          <StyleText
            i18Text="discovery.groupBuyingPrice"
            customStyle={$textTitlePrice}
          />
        </View>
        <StyleText
          i18Text="discovery.buyMorePriceLess"
          customStyle={[$textBuyMore, {color: theme.gray_500}]}
        />

        <View style={$listPrices}>
          <ScrollView horizontal contentContainerStyle={$scrollPrice}>
            {data?.prices?.map((item, index) => {
              const isLast = index === data?.prices?.length - 1;
              return (
                <View
                  style={[
                    $pricePart,
                    {
                      backgroundColor: theme.p_100,
                      marginRight: isLast ? 0 : horizontalMargin,
                    },
                  ]}
                  key={item?.number_people}>
                  <StyleText
                    originValue={`${item.number_people} ${t(
                      'discovery.servings',
                    )}`}
                  />
                  <StyleText
                    originValue={formatMoney(item.price)}
                    customStyle={$textNumberPeople}
                  />
                </View>
              );
            })}
          </ScrollView>
        </View>
        <View style={[$divider, {borderTopColor: theme.gray_100}]} />
      </View>
    );
  };

  const renderReaction = () => {
    return (
      <>
        <View style={$reactionView}>
          <ButtonReaction
            onPress={onReaction}
            title={
              data?.total_likes ? 'discovery.numberLike' : 'discovery.like'
            }
            titleParams={{
              value: data?.total_likes,
            }}>
            {data?.is_liked ? (
              <IconLiked customStyle={$likeIcon} onPress={onReaction} />
            ) : (
              <IconNotLiked
                customStyle={[$likeIcon, {color: theme.gray_800}]}
                onPress={onReaction}
              />
            )}
          </ButtonReaction>

          {/* <ButtonReaction
            icon={Images.icons.comment}
            onPress={() => console.log('show modal comment')}
            title={
              data?.total_comments
                ? 'discovery.numberComments'
                : 'discovery.comment'
            }
            titleParams={{
              value: data?.total_comments,
            }}
          /> */}

          <ButtonReaction
            icon={Images.icons.reputation}
            onPress={() => {
              if (data) {
                push(ROOT_SCREEN.otherProfile, {
                  id: data.creator,
                  tab: 'check-in',
                });
              }
            }}
            title="profile.post.seeRating"
          />

          <ButtonReaction
            icon={Images.icons.share}
            onPress={() =>
              Share.open({
                title: 'Avatour',
                message: 'Avatour',
              })
            }
            title="discovery.share"
          />
        </View>
      </>
    );
  };

  const renderJoins = () => {
    const button = () => {
      if (estimating) {
        const seconds = dayjs(estimating.expired).diff(dayjs(), 'seconds');
        const priceDeposit = calculatePriceDeposit(estimating);

        return (
          <View style={[$depositView, {borderColor: theme.gray_400}]}>
            <StyleText i18Text="discovery.youHaveGroupBuying" />

            <StyleText customStyle={{marginTop: verticalScale(8)}}>
              <StyleText
                i18Text="discovery.amount"
                customStyle={$titleEstimate}
              />
              <StyleText originValue={`: ${estimating.amount}`} />
            </StyleText>
            <StyleText>
              <StyleText
                i18Text="discovery.arrivalTime"
                customStyle={$titleEstimate}
              />
              <StyleText
                originValue={`: ${formatddddDDMMYYYY(
                  estimating.time_will_buy,
                )}`}
              />
            </StyleText>
            <StyleText>
              <StyleText
                i18Text="discovery.note"
                customStyle={$titleEstimate}
              />
              <StyleText originValue={estimating.note} />
            </StyleText>

            <StyleText customStyle={{marginTop: verticalScale(8)}}>
              <StyleText
                i18Text="discovery.estimatedPrice"
                customStyle={$titleEstimate}
              />
              <StyleText originValue={`: ${formatMoney(priceDeposit.price)}`} />
            </StyleText>

            <StyleText>
              <StyleText
                i18Text="discovery.deposit"
                customStyle={$titleEstimate}
              />
              <StyleText
                originValue={`: ${formatMoney(priceDeposit.deposit)}vnd`}
              />
            </StyleText>

            <StyleText
              i18Text="discovery.remainingTime"
              customStyle={{marginTop: verticalScale(8)}}>
              <StyleText originValue=": " />
              <TextCountDown
                initSeconds={seconds}
                onFinished={onDeleteEstimate}
              />
            </StyleText>

            <LinearGradient
              colors={[theme.blue, theme.blue_800]}
              style={$interactView}>
              <StyleTouchable
                customStyle={$buttonInteract}
                onPress={() => {
                  if (estimating) {
                    push(ROOT_SCREEN.detailMeJoin, {
                      estimateId: estimating.id,
                      initValue: estimating,
                      mode: 'see-detail-from-sale',
                    });
                  }
                }}>
                <StyleIcon source={Images.icons.dollar} size={15} />
                <StyleText
                  i18Text="discovery.goToDeposit"
                  customStyle={[$textJoin, {color: theme.white}]}
                />
              </StyleTouchable>
            </LinearGradient>
          </View>
        );
      }

      return null;
    };

    return (
      <View style={$joinView}>
        {!!joinings.length && (
          <View style={$meJoinView}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={$contentMeJoin}>
              {joinings?.map(join => {
                return (
                  <ItemMeJoin
                    item={join}
                    key={join?.id}
                    onPress={() => {
                      if (data) {
                        push(ROOT_SCREEN.detailMeJoin, {
                          estimateId: join.id,
                          initValue: join,
                          mode: 'see-detail-from-sale',
                        });
                      }
                    }}
                    containerStyle={{marginRight: horizontalMargin}}
                  />
                );
              })}
            </ScrollView>
          </View>
        )}

        {button()}

        {!!data?.total_members && (
          <>
            <StyleText
              i18Text="discovery.numberJoins"
              i18Params={{
                value: data?.total_members ?? 0,
              }}
              customStyle={$textNumberPeopleJoined}
            />
            <StyleTouchable
              customStyle={$listPeopleView}
              onPress={() => {
                if (isMySale) {
                  navigate(ROOT_SCREEN.myListJoins, {
                    saleId,
                  });
                }
              }}
              disable={!isMySale}
              disableOpacity={1}>
              {[
                Images.images.avatar01,
                Images.images.avatar02,
                Images.images.avatar03,
                Images.images.avatar04,
              ].map((source, index) => {
                return <Avatar key={index} source={source} size={36} />;
              })}
              {isMySale && (
                <StyleText
                  i18Text="discovery.manageJoins"
                  customStyle={[$textManageJoins, {color: theme.blue}]}
                />
              )}
            </StyleTouchable>
          </>
        )}
      </View>
    );
  };

  const bottomComponent = () => {
    if (isMySale || estimating || !(data?.status === STATUS.active)) {
      return null;
    }

    return (
      <LinearGradient
        colors={[theme.p_600, theme.p_600]}
        style={[$interactView, {marginBottom: bottom}]}>
        <StyleTouchable
          customStyle={$buttonInteract}
          onPress={() => {
            checkAuthenticated({
              onAuthenticated: () => modalConfirmJoinRef.current?.show(),
            });
          }}>
          <StyleIcon
            source={Images.icons.createGroup}
            size={15}
            customStyle={{tintColor: theme.white}}
          />
          <StyleText
            i18Text="discovery.joinGroupBuying"
            customStyle={[$textJoin, {color: theme.white}]}
          />
        </StyleTouchable>
      </LinearGradient>
    );
  };

  return (
    <>
      <StyleContainer
        initLoading={initLoading}
        headerProps={{
          title: 'common.null',
          RightComponent: (
            <StyleTouchable
              customStyle={$iconOptionView}
              onPress={onShowOptions}>
              <StyleIcon
                source={Images.icons.more}
                size={20}
                customStyle={{tintColor: theme.black}}
              />
            </StyleTouchable>
          ),
        }}
        customStyle={[$container, {paddingBottom}]}
        backgroundColor={theme.white}
        scrollEnabled
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={mutate} />
        }
        BottomComponent={bottomComponent()}>
        <ScrollCropImages
          images={data?.images || []}
          width={width}
          height={width * ratioImageSale}
          enableRemoveImage={false}
        />
        {renderInformation()}
        {renderReaction()}
        {renderJoins()}
      </StyleContainer>

      <ModalConfirmJoinGb
        ref={modalConfirmJoinRef}
        onConfirm={onConfirmJoin}
        loadingJoin={loadingJoin}
      />
      {isMySale && (
        <ModalStillHavePeopleJoin ref={modalStillHavePeopleJoin} sale={data} />
      )}
      {loadingDelete && <LoadingScreen />}
    </>
  );
};

const $container: ViewStyle = {
  paddingHorizontal: 0,
};
const $iconOptionView: ViewStyle = {
  width: moderateScale(30),
  height: moderateScale(30),
  alignItems: 'center',
  justifyContent: 'center',
};
const $informationView: ViewStyle = {
  paddingHorizontal: horizontalPadding,
  marginTop: verticalMargin,
};
const $joinView: ViewStyle = {
  width: '100%',
  marginTop: verticalMargin,
};
const $textNameSale: TextStyle = {
  fontSize: FONT_SIZE.h2,
  fontWeight: 'bold',
};
const $textStatus: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
  marginTop: verticalMargin,
};
const $saleCreator: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(4),
  flexDirection: 'row',
};
const $creatorBox: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};
const $nameShop: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
  marginLeft: scale(8),
};
const $price: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: verticalMargin,
};
const $textTitlePrice: TextStyle = {
  fontWeight: 'bold',
  marginLeft: scale(2),
  fontSize: FONT_SIZE.f1,
};
const $textBuyMore: TextStyle = {
  marginTop: verticalScale(2),
};
const $listPrices: ViewStyle = {
  width: Metrics.width,
  left: -horizontalPadding,
  marginTop: verticalScale(12),
};
const $scrollPrice: ViewStyle = {
  paddingLeft: horizontalPadding,
  paddingRight: horizontalPadding,
};
const $pricePart: ViewStyle = {
  paddingVertical: moderateScale(8),
  paddingHorizontal: horizontalPadding,
  borderRadius: BORDER_RADIUS.f4,
};
const $textNumberPeople: TextStyle = {
  marginTop: verticalScale(4),
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $divider: ViewStyle = {
  marginTop: verticalScale(20),
  borderTopWidth: moderateScale(0.5),
  width: '100%',
};
const $reactionView: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: verticalScale(16),
};
const $reactionBox: ViewStyle = {
  marginHorizontal: scale(20),
  alignItems: 'center',
};
const $reaction: ViewStyle = {
  width: moderateScale(45),
  height: moderateScale(45),
  borderRadius: 60,
  alignItems: 'center',
  justifyContent: 'center',
};
const $likeIcon: TextStyle = {
  fontSize: moderateScale(25),
};
const $textReaction: TextStyle = {
  marginTop: verticalScale(10),
};
const $depositView: ViewStyle = {
  width: '90%',
  paddingVertical: verticalScale(12),
  paddingHorizontal: scale(12),
  borderWidth: borderWidthTiny,
  alignSelf: 'center',
  borderRadius: BORDER_RADIUS.f2,
  marginBottom: verticalMargin,
};
const $interactView: ViewStyle = {
  width: '90%',
  height: moderateScale(46),
  alignSelf: 'center',
  borderRadius: 100,
  marginTop: verticalMargin,
};
const $buttonInteract: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
};
const $textJoin: TextStyle = {
  marginLeft: scale(4),
  fontWeight: 'bold',
};
const $textNumberPeopleJoined: TextStyle = {
  alignSelf: 'center',
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $textManageJoins: TextStyle = {
  alignSelf: 'center',
  fontWeight: FONT_WEIGHT_MEDIUM,
  marginLeft: verticalScale(4),
  textDecorationLine: 'underline',
};
const $listPeopleView: ViewStyle = {
  alignSelf: 'center',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: verticalScale(4),
};
const $contentView: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(4),
};
const $meJoinView: ViewStyle = {
  width: Metrics.width,
  marginBottom: verticalMargin,
};
const $contentMeJoin: ViewStyle = {
  paddingLeft: horizontalPadding,
};
const $titleEstimate: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
};

export default DetailSale;
