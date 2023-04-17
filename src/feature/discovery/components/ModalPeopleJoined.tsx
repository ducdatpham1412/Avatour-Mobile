import {apiConfirmUserBought} from 'api/discovery';
import {apiFollowUser} from 'api/profile';
import {GROUP_BUYING_STATUS, RELATIONSHIP} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import StyleList from 'components/base/StyleList';
import StyleTabView from 'components/StyleTabView';
import Redux from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Platform, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Modalize} from 'react-native-modalize';
import {ScaledSheet} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import {borderWidthTiny, onGoToProfile} from 'utility/assistant';
import {
  formatDayGroupBuying,
  formatFromNow,
  formatLocaleNumber,
} from 'utility/format';
import {fakeDataListGroupJoinedForSupplier} from 'utility/staticData';

const {width, height} = Metrics;
const modalJoinHeight = (height * 2) / 3.3;
const modalJoinHeightAdmin = (height * 2) / 2.5;

interface Props {
  postId: string;
  listPaging: any;
  isMyBubble: boolean;
  totalGroups: number;
}

const ModalPeopleJoined = (props: Props, ref: any) => {
  const {listPaging, isMyBubble, totalGroups} = props;
  const theme = Redux.getTheme();
  const myId = Redux.getPassport().profile.id;

  const tabViewRef = useRef<StyleTabView>(null);
  const groupIdFocusing = useRef('');

  const [tabIndex, setTabIndex] = useState(0);
  const [listPeopleJoin, setListPeopleJoin] = useState<
    Array<TypePeopleJoinedResponse>
  >([]);

  useEffect(() => {
    const temp = listPaging.list.find(
      (joinGroup: TypeGroupJoin) => joinGroup.id === groupIdFocusing.current,
    );
    if (temp) {
      setListPeopleJoin(temp.listPeople);
    }
  }, [listPaging.list]);

  const onPressButton = async (item: TypePeopleJoinedResponse) => {
    const oldList = [...listPaging.list];
    try {
      if (!isMyBubble) {
        if (item.relationship === RELATIONSHIP.notFollowing) {
          listPaging.setList((preValue: Array<TypeGroupJoin>) => {
            return preValue.map(value => {
              if (value.id !== groupIdFocusing.current) {
                return value;
              }
              return {
                ...value,
                listPeople: value.listPeople.map(people => {
                  if (people.creator !== item.creator) {
                    return people;
                  }
                  return {
                    ...people,
                    relationship: RELATIONSHIP.following,
                  };
                }),
              };
            });
          });
          await apiFollowUser(item.creator);
        }
      }
      if (isMyBubble) {
        if (item.status === GROUP_BUYING_STATUS.joinedNotBought) {
          listPaging.setList((preValue: Array<TypeGroupJoin>) => {
            return preValue.map(value => {
              if (value.id !== groupIdFocusing.current) {
                return value;
              }
              return {
                ...value,
                listPeople: value.listPeople.map(people => {
                  if (people.id !== item.id) {
                    return people;
                  }
                  return {
                    ...people,
                    status: GROUP_BUYING_STATUS.bought,
                  };
                }),
              };
            });
          });
          await apiConfirmUserBought(item.id);
        }
      }
    } catch (err) {
      appAlert(err);
      listPaging.setList(oldList);
    }
  };

  const RenderItemJoined = useCallback(
    (itemJoined: TypePeopleJoinedResponse) => {
      const name =
        itemJoined.creator === myId
          ? `(Bạn) ${itemJoined.creatorName}`
          : itemJoined.creatorName;

      const CheckButtonJoined = () => {
        if (isMyBubble) {
          if (itemJoined.status === GROUP_BUYING_STATUS.joinedNotBought) {
            return (
              <StyleTouchable
                customStyle={[
                  styles.buttonCheckJoined,
                  {
                    backgroundColor: theme.backgroundButtonColor,
                  },
                ]}
                onPress={() => onPressButton(itemJoined)}>
                <StyleText
                  i18Text="discovery.confirmBought"
                  customStyle={[styles.textButton, {color: theme.textColor}]}
                />
              </StyleTouchable>
            );
          }
          if (itemJoined.status === GROUP_BUYING_STATUS.bought) {
            return (
              <LinearGradient
                style={styles.boughtBox}
                colors={[
                  Theme.common.commentGreen,
                  Theme.common.gradientTabBar2,
                ]}>
                <Entypo name="check" style={styles.iconBought} />
                <StyleText
                  i18Text="discovery.bought"
                  customStyle={styles.textBought}
                />
              </LinearGradient>
            );
          }
        }

        if (itemJoined.relationship === RELATIONSHIP.notFollowing) {
          <StyleTouchable
            customStyle={[
              styles.buttonCheckJoined,
              {
                backgroundColor: theme.backgroundButtonColor,
              },
            ]}
            onPress={() => onPressButton(itemJoined)}>
            <StyleText
              i18Text="profile.screen.follow"
              customStyle={[styles.textButton, {color: theme.textColor}]}
            />
          </StyleTouchable>;
        }

        return null;
      };

      return (
        <View
          style={[
            styles.itemJoinedView,
            {borderBottomColor: theme.holderColorLighter},
          ]}>
          <View
            style={[
              styles.itemJoinedUp,
              {borderBottomColor: theme.holderColorLighter},
            ]}>
            <StyleTouchable onPress={() => onGoToProfile(itemJoined.creator)}>
              <View style={styles.avatarBox}>
                <StyleImage
                  source={{uri: itemJoined.creatorAvatar}}
                  customStyle={[styles.creatorAvatar, {marginLeft: 0}]}
                />
              </View>
            </StyleTouchable>
            <View style={styles.nameTimeJoinedView}>
              <StyleText
                originValue={name}
                customStyle={[
                  styles.nameJoined,
                  {
                    color: theme.textHightLight,
                  },
                ]}
                numberOfLines={1}
                onPress={() => onGoToProfile(itemJoined.creator)}
              />
              <StyleText
                originValue={formatFromNow(itemJoined.created)}
                customStyle={[styles.timeJoined, {color: theme.borderColor}]}
              />
            </View>
            {CheckButtonJoined()}
          </View>
          {!!itemJoined.amount && !!itemJoined.deposit && (
            <View style={styles.infoBox}>
              <StyleText
                i18Text="discovery.amountBookGb"
                i18Params={{
                  value: itemJoined.amount,
                }}
                customStyle={[styles.textInfo, {color: theme.textColor}]}
              />
              <StyleText
                i18Text="discovery.depositAmount"
                i18Params={{
                  value: formatLocaleNumber(itemJoined.deposit),
                }}
                customStyle={[styles.textInfo, {color: theme.textColor}]}
              />
            </View>
          )}

          {!!itemJoined.timeWillBuy && (
            <StyleText
              i18Text="discovery.arrivalTime"
              customStyle={[styles.timeJoined, {color: theme.textColor}]}>
              <StyleText
                originValue={` ${formatDayGroupBuying(itemJoined.timeWillBuy)}`}
                customStyle={[
                  styles.textInfo,
                  {
                    color: theme.textColor,
                  },
                ]}
              />
            </StyleText>
          )}

          {!!itemJoined.creatorPhone && (
            <StyleText
              i18Text="login.signUp.type.phone"
              customStyle={[styles.timeJoined, {color: theme.textColor}]}>
              <StyleText
                originValue={`: ${itemJoined.creatorPhone}`}
                customStyle={[
                  styles.textInfo,
                  {
                    color: theme.textColor,
                  },
                ]}
              />
            </StyleText>
          )}

          {!!itemJoined.note && (
            <StyleText
              i18Text="discovery.note"
              customStyle={[
                styles.timeJoined,
                {color: theme.textColor, fontWeight: 'bold'},
              ]}>
              <StyleText
                originValue={itemJoined.note}
                customStyle={[
                  styles.timeJoined,
                  {
                    color: theme.textColor,
                    fontWeight: 'normal',
                  },
                ]}
              />
            </StyleText>
          )}
        </View>
      );
    },
    [theme.backgroundColor, isMyBubble, myId],
  );

  const RenderItemGroup = useCallback(
    (item: TypeGroupJoin) => {
      const isBiggerThanSix = item.listPeople.length > 6;
      const displayPeople = isBiggerThanSix
        ? item.listPeople.slice(0, 6)
        : item.listPeople;
      return (
        <StyleTouchable
          customStyle={[
            styles.itemGroupView,
            {borderBottomColor: theme.holderColorLighter},
          ]}
          onPress={() => {
            setListPeopleJoin(item.listPeople);
            groupIdFocusing.current = item.id;
            setTabIndex(1);
            tabViewRef.current?.navigateToIndex(1);
          }}>
          {displayPeople.map((person, index) => {
            return (
              <View key={person.id} style={styles.avatarGroupBox}>
                <View style={styles.avatarBox}>
                  <StyleImage
                    source={{uri: person.creatorAvatar}}
                    customStyle={styles.creatorAvatar}
                  />
                </View>
                {index === 5 && isBiggerThanSix && (
                  <View style={styles.morePeopleBox}>
                    <StyleText
                      originValue={`+${item.listPeople.length - 6}`}
                      customStyle={styles.textMore}
                    />
                  </View>
                )}
              </View>
            );
          })}
        </StyleTouchable>
      );
    },
    [theme.backgroundColor],
  );

  return (
    <Modalize
      ref={ref}
      withHandle={false}
      adjustToContentHeight
      modalStyle={{
        backgroundColor: 'transparent',
      }}
      overlayStyle={{
        backgroundColor: theme.backgroundOpacity(0.3),
      }}>
      <View
        style={[
          styles.headerView,
          {backgroundColor: theme.backgroundColorSecond},
        ]}>
        {tabIndex === 1 && (
          <StyleTouchable
            customStyle={styles.touchIconBack}
            onPress={() => {
              setTabIndex(0);
              tabViewRef.current?.navigateToIndex(0);
            }}
            hitSlop={15}>
            <Feather
              name="arrow-left"
              style={[styles.iconBack, {color: theme.textColor}]}
            />
          </StyleTouchable>
        )}
        <StyleText
          i18Text={
            tabIndex === 0
              ? 'discovery.numberGroupJoined'
              : 'discovery.numberPeople'
          }
          i18Params={{
            value: 3,
          }}
          customStyle={[styles.textHeader, {color: theme.textHightLight}]}
        />
        {tabIndex === 0 && (
          <StyleTouchable
            customStyle={styles.iconTurnOffTouch}
            onPress={() => ref.current?.close()}
            hitSlop={15}>
            <Feather
              name="x"
              style={[styles.iconTurnOff, {color: theme.textColor}]}
            />
          </StyleTouchable>
        )}
      </View>

      <StyleTabView
        ref={tabViewRef}
        containerStyle={[
          styles.container,
          {
            backgroundColor: theme.backgroundColorSecond,
            height: isMyBubble ? modalJoinHeightAdmin : modalJoinHeight,
          },
        ]}
        enableScroll={false}>
        <View style={styles.elementContainer}>
          <StyleList
            data={fakeDataListGroupJoinedForSupplier}
            renderItem={({item}) => RenderItemGroup(item)}
            keyExtractor={item => item.id}
            onLoadMore={listPaging.onLoadMore}
            refreshing={listPaging.refreshing}
            onRefresh={listPaging.onRefresh}
          />
        </View>

        <View style={styles.elementContainer}>
          {tabIndex === 1 && (
            <StyleList
              data={listPeopleJoin}
              renderItem={({item}) => RenderItemJoined(item)}
              keyExtractor={item => item.id}
              onLoadMore={listPaging.onLoadMore}
              refreshing={listPaging.refreshing}
              onRefresh={listPaging.onRefresh}
            />
          )}
        </View>
      </StyleTabView>
    </Modalize>
  );
};

const styles = ScaledSheet.create({
  container: {
    height: modalJoinHeight,
    marginTop: '-1@ms',
  },
  elementContainer: {
    width,
    height: '100%',
  },
  // header
  headerView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '5@vs',
    borderTopLeftRadius: '10@ms',
    borderTopRightRadius: '10@ms',
  },
  touchIconBack: {
    position: 'absolute',
    left: '10@s',
  },
  iconBack: {
    fontSize: '20@ms',
  },
  textHeader: {
    fontSize: FONT_SIZE.normal,
  },
  iconTurnOffTouch: {
    position: 'absolute',
    right: '10@s',
  },
  iconTurnOff: {
    fontSize: '20@ms',
  },
  // item group join
  itemGroupView: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: Platform.select({
      ios: '0.25@ms',
      android: '0.5@ms',
    }),
    paddingVertical: '7.5@vs',
    paddingHorizontal: '10%',
  },
  avatarGroupBox: {
    marginHorizontal: '2@s',
  },
  avatarBox: {
    width: '35@ms',
    height: '35@ms',
    borderRadius: '20@ms',
    overflow: 'hidden',
  },
  creatorAvatar: {
    width: '100%',
    height: '100%',
  },
  morePeopleBox: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: Theme.darkTheme.backgroundOpacity(0.5),
    borderRadius: '20@ms',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textMore: {
    fontSize: FONT_SIZE.normal,
    color: Theme.common.white,
  },
  // item joined
  itemJoinedView: {
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: '10@s',
    borderBottomWidth: borderWidthTiny,
    paddingVertical: '7.5@vs',
  },
  itemJoinedUp: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameTimeJoinedView: {
    flex: 1,
    paddingHorizontal: '10@s',
  },
  nameJoined: {
    fontSize: FONT_SIZE.normal,
    fontWeight: 'bold',
  },
  timeJoined: {
    fontSize: FONT_SIZE.small,
    marginTop: '3@vs',
  },
  infoBox: {
    width: '100%',
    flexDirection: 'row',
    marginTop: '5@vs',
  },
  textInfo: {
    fontSize: FONT_SIZE.small,
    flex: 1,
  },
  buttonCheckJoined: {
    paddingVertical: '4@vs',
    paddingHorizontal: '15@s',
    borderRadius: '5@ms',
    alignItems: 'center',
  },
  textButton: {
    fontSize: FONT_SIZE.small,
    fontWeight: 'bold',
  },
  boughtBox: {
    paddingVertical: '4@vs',
    paddingHorizontal: '15@s',
    borderRadius: '20@ms',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBought: {
    fontSize: '13@ms',
    color: Theme.common.white,
  },
  textBought: {
    fontSize: FONT_SIZE.small,
    fontWeight: 'bold',
    color: Theme.common.white,
    marginLeft: '5@s',
  },
});

export default forwardRef(ModalPeopleJoined);
