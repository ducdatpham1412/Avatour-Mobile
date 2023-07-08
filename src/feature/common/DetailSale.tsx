import {useAppSelector} from 'app-redux/store';
import {
  BORDER_RADIUS,
  FONT_SIZE,
  FONT_WEIGHT_MEDIUM,
  ratioImageSale,
} from 'asset';
import {STATUS} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics, safePaddingNotZero} from 'asset/metrics';
import {AppModalize, TextCountDown} from 'components';
import {
  StyleContainer,
  StyleIcon,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {Avatar, IconLiked, IconNotLiked} from 'components/common';
import dayjs from 'dayjs';
import {ScrollCropImages} from 'feature/profile/components';
import {useTheme} from 'hook';
import {goBack, navigate, push} from 'navigation/NavigationService';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import {ModalActionSheet, ModalAlert} from 'navigation/screen/modals';
import React, {ElementRef, ReactNode, useRef} from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  RefreshControl,
  ScrollView,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {I18Normalize} from 'utility/I18Next';
import {
  borderWidthTiny,
  onGoToProfile,
  renderPersonalJoinsFromGroups,
} from 'utility/assistant';
import {formatLocaleNumber, formatddddDDMMYYYY} from 'utility/format';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {ItemMeJoin, ModalConfirmJoinGb, ModalGroup} from './components';
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
    if (children) return children;
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
    params: {saleId, sale},
  },
}: RouteParams<AppParamsList[ROOT_SCREEN.detailSale]>) => {
  const {top, bottom} = useSafeAreaInsets();
  const theme = useTheme();
  const {id: myId} = useAppSelector(
    state => state.accountSlice.passport.profile,
  );

  const [
    {data, initLoading, meJoins, loadingJoin, refreshing},
    {onReaction, onRefresh, onJoin, deleteEstimate},
  ] = useDetailSale(saleId ?? sale?.id, {
    revalidateAll: true,
  });

  const isMySale = data?.creator === myId;

  const modalJoinedRef = useRef<ElementRef<typeof AppModalize>>(null);
  const modalConfirmJoinRef = useRef<ElementRef<typeof AppModalize>>(null);

  const onConfirmJoin = async (value: Omit<TypeJoinRequest, 'saleId'>) => {
    try {
      if (data) {
        const res = await onJoin(value);
        if (res) {
          push(ROOT_SCREEN.detailMeJoin, {
            saleId: data?.id,
            mode: 'go-to-deposit',
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

  const renderInformation = () => {
    let textStatus: I18Normalize = 'common.null';
    let colorStatus = theme.blue;
    if (data?.status === STATUS.active) {
      textStatus = 'discovery.available';
    } else if (
      data?.status === STATUS.temporarilyClose ||
      data?.status === STATUS.requestingDelete
    ) {
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

        <View style={$informationBox}>
          <StyleTouchable
            customStyle={$buttonName}
            onPress={() => {
              if (data?.creator) {
                onGoToProfile(data?.creator);
              }
            }}>
            <Avatar source={{uri: data?.creator_avatar}} size={25} />
            <StyleText
              originValue={data?.creator_name}
              customStyle={$textName}
            />
          </StyleTouchable>
        </View>

        <View style={$informationBox}>
          <StyleIcon source={Images.icons.calendar} size={16} />
          <StyleText
            i18Text={textStatus}
            customStyle={[$textStatus, {color: colorStatus}]}
          />
        </View>

        <View style={$informationBox}>
          <StyleIcon source={Images.icons.dollar} size={18} />
          <StyleText
            i18Text="discovery.groupBuyingPrice"
            customStyle={$textStatus}
          />
        </View>
        {data?.prices?.map(item => {
          return (
            <View style={$pricePart} key={item?.number_people}>
              <StyleText
                i18Text="discovery.numberPeople"
                i18Params={{value: item?.number_people}}
                customStyle={[$textNumberPeople, {textAlign: 'right'}]}
              />
              <StyleText originValue="-" customStyle={$numberPeopleDivider} />
              <StyleText
                originValue={`${formatLocaleNumber(String(item?.price))} vnd`}
                customStyle={$textNumberPeople}
              />
            </View>
          );
        })}

        <View style={$informationBox}>
          <StyleIcon
            source={Images.icons.location}
            size={18}
            customStyle={{tintColor: theme.blue}}
          />
          <StyleText
            originValue={data?.creator_location}
            customStyle={$textStatus}
          />
        </View>

        <View style={[$divider, {backgroundColor: theme.gray_200}]} />
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
            {!!data?.is_liked ? (
              <IconLiked customStyle={$likeIcon} onPress={onReaction} />
            ) : (
              <IconNotLiked
                customStyle={[$likeIcon, {color: theme.gray_800}]}
                onPress={onReaction}
              />
            )}
          </ButtonReaction>

          <ButtonReaction
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
          />

          <ButtonReaction
            icon={Images.icons.share}
            onPress={() => console.log('Share')}
            title="discovery.share.title"
          />

          <ButtonReaction
            icon={Images.icons.reputation}
            onPress={() => console.log('Go to review')}
            title="profile.rating"
          />
        </View>
      </>
    );
  };

  const renderJoins = () => {
    const listPersonalJoins = renderPersonalJoinsFromGroups(
      data?.groups || [],
      {maxNumber: 6},
    );

    const button = () => {
      if (isMySale) {
        return null;
      }
      if (meJoins?.estimate) {
        const estimate = meJoins.estimate;
        const seconds = dayjs(estimate.expired).diff(dayjs(), 'seconds');

        return (
          <View style={[$depositView, {borderColor: theme.gray_400}]}>
            <StyleText i18Text="discovery.youHaveGroupBuying" />

            <StyleText customStyle={{marginTop: verticalScale(8)}}>
              <StyleText
                i18Text="discovery.amount"
                customStyle={$titleEstimate}
              />
              <StyleText originValue={`: ${estimate.amount}`} />
            </StyleText>
            <StyleText>
              <StyleText
                i18Text="discovery.arrivalTime"
                customStyle={$titleEstimate}
              />
              <StyleText
                originValue={`: ${formatddddDDMMYYYY(estimate.time_will_buy)}`}
              />
            </StyleText>
            <StyleText>
              <StyleText
                i18Text="discovery.note"
                customStyle={$titleEstimate}
              />
              <StyleText originValue={estimate.note} />
            </StyleText>

            <StyleText customStyle={{marginTop: verticalScale(8)}}>
              <StyleText
                i18Text="discovery.estimatedPrice"
                customStyle={$titleEstimate}
              />
              <StyleText
                originValue={`: ${formatLocaleNumber(estimate.price)}vnd`}
              />
            </StyleText>
            <StyleText>
              <StyleText
                i18Text="discovery.deposit"
                customStyle={$titleEstimate}
              />
              <StyleText
                originValue={`: ${formatLocaleNumber(estimate.deposit)}vnd`}
              />
            </StyleText>

            <StyleText
              i18Text="discovery.remainingTime"
              customStyle={{marginTop: verticalScale(8)}}>
              <StyleText originValue=": " />
              <TextCountDown
                initSeconds={seconds}
                onFinished={deleteEstimate}
              />
            </StyleText>

            <LinearGradient
              colors={[theme.blue, theme.blue_800]}
              style={$interactView}>
              <StyleTouchable
                customStyle={$buttonInteract}
                onPress={() => {
                  if (data) {
                    push(ROOT_SCREEN.detailMeJoin, {
                      saleId: data?.id,
                      mode: 'go-to-deposit',
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
      return (
        <LinearGradient
          colors={[theme.p_800, theme.p_600]}
          style={$interactView}>
          <StyleTouchable
            customStyle={$buttonInteract}
            onPress={() => modalConfirmJoinRef.current?.show()}>
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
      <View style={$informationView}>
        {!!meJoins?.joinings?.length && (
          <View style={$meJoinView}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {meJoins?.joinings?.map(join => {
                return (
                  <ItemMeJoin
                    item={join}
                    key={join?.id}
                    onPress={() => {
                      if (data) {
                        push(ROOT_SCREEN.detailMeJoin, {
                          saleId: data?.id,
                          joinPersonal: join,
                          mode: 'see-detail-from-sale',
                        });
                      }
                    }}
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
              i18Text="discovery.numberGroupJoined"
              i18Params={{
                value: data?.total_members ?? 0,
              }}
              customStyle={[$textNumberPeopleJoined, {color: theme.gray_600}]}
            />
            <StyleTouchable
              customStyle={$listPeopleView}
              onPress={() => modalJoinedRef.current?.show()}>
              {listPersonalJoins.map((member, index) => {
                return (
                  <StyleIcon
                    key={index}
                    source={{uri: member?.creator_avatar}}
                    size={30}
                    customStyle={$avatarJoin}
                  />
                );
              })}
            </StyleTouchable>
          </>
        )}

        <View style={[$divider, {backgroundColor: theme.gray_200}]} />
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={$contentView}>
        <StyleText originValue={data?.content || ''} />
      </View>
    );
  };

  return (
    <>
      {initLoading ? (
        <StyleContainer initLoading />
      ) : (
        <ScrollView
          style={{
            backgroundColor: theme.white,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.p_600}
              colors={[theme.p_600]}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: bottom + safePaddingNotZero}}>
          <ScrollCropImages
            images={data?.images || []}
            width={width}
            height={width * ratioImageSale}
            enableRemoveImage={false}
          />

          {renderInformation()}
          {renderReaction()}
          {renderJoins()}
          {renderContent()}
        </ScrollView>
      )}

      <StyleTouchable
        customStyle={[
          $iconBackView,
          {
            top: top + verticalScale(5),
            backgroundColor: theme.white_opacity(0.8),
          },
        ]}
        onPress={goBack}>
        <Ionicons
          name="arrow-back"
          style={$iconBack}
          customStyle={{tintColor: theme.black}}
        />
      </StyleTouchable>

      <StyleTouchable
        customStyle={[
          $iconOptionView,
          {
            top: top + verticalScale(5),
            backgroundColor: theme.white_opacity(0.8),
          },
        ]}
        onPress={() =>
          ModalActionSheet.show({
            options: [
              {
                title: 'discovery.buyingHistory',
                onPress: () => {
                  if (data) {
                    navigate(ROOT_SCREEN.joinsHistory, {
                      saleId: data.id,
                    });
                  }
                },
              },
              {
                title: 'discovery.report.title',
                onPress: () => {
                  if (data) {
                    navigate(ROOT_SCREEN.reportUser, {
                      idUser: data?.creator,
                      nameUser: data?.creator_name,
                    });
                  }
                },
              },
            ],
          })
        }>
        <StyleIcon
          source={Images.icons.more}
          size={15}
          customStyle={{tintColor: theme.black}}
        />
      </StyleTouchable>

      <ModalGroup
        ref={modalJoinedRef}
        groups={data?.groups || []}
        refreshing={refreshing}
        onRefresh={onRefresh}
        isMySale={isMySale}
      />

      <ModalConfirmJoinGb
        ref={modalConfirmJoinRef}
        onConfirm={onConfirmJoin}
        loadingJoin={loadingJoin}
      />
    </>
  );
};

const $iconBackView: ViewStyle = {
  position: 'absolute',
  left: scale(10),
  padding: moderateScale(5),
  borderRadius: 30,
};
const $iconOptionView: ViewStyle = {
  position: 'absolute',
  right: scale(10),
  padding: moderateScale(5),
  borderRadius: 30,
};
const $iconBack: TextStyle = {
  fontSize: moderateScale(20),
};
const $informationView: ViewStyle = {
  paddingHorizontal: scale(16),
};
const $textNameSale: TextStyle = {
  fontSize: FONT_SIZE.h2,
  marginTop: verticalScale(12),
  fontWeight: 'bold',
};
const $informationBox: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: verticalScale(12),
};
const $buttonName: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};
const $textName: TextStyle = {
  marginLeft: scale(8),
  fontWeight: 'bold',
  fontSize: FONT_SIZE.f1,
};
const $textStatus: TextStyle = {
  marginLeft: scale(8),
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $pricePart: ViewStyle = {
  width: '100%',
  paddingHorizontal: scale(16),
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: verticalScale(8),
};
const $textNumberPeople: TextStyle = {
  flex: 1,
};
const $numberPeopleDivider: TextStyle = {
  marginHorizontal: scale(10),
};
const $divider: ViewStyle = {
  marginTop: verticalScale(12),
  height: moderateScale(0.5),
  width: '100%',
};
const $reactionView: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: verticalScale(12),
};
const $reactionBox: ViewStyle = {
  width: moderateScale(65),
  marginHorizontal: scale(8),
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
  fontSize: FONT_SIZE.f4,
  marginTop: verticalScale(10),
};
const $depositView: ViewStyle = {
  width: '90%',
  paddingVertical: verticalScale(12),
  paddingHorizontal: scale(12),
  borderWidth: borderWidthTiny,
  marginTop: verticalScale(16),
  alignSelf: 'center',
  borderRadius: BORDER_RADIUS.f4,
};
const $interactView: ViewStyle = {
  width: '75%',
  paddingVertical: verticalScale(10),
  alignSelf: 'center',
  borderRadius: BORDER_RADIUS.f2,
  marginTop: verticalScale(16),
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
  marginTop: verticalScale(16),
};
const $listPeopleView: ViewStyle = {
  alignSelf: 'center',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: verticalScale(4),
};
const $avatarJoin: ImageStyle = {
  borderRadius: 50,
};
const $contentView: ViewStyle = {
  width: '100%',
  paddingHorizontal: scale(16),
  marginTop: verticalScale(12),
};
const $meJoinView: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(16),
};
const $titleEstimate: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
};

export default DetailSale;
