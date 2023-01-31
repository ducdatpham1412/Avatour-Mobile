import {apiConfirmUserBought} from 'api/discovery';
import {
    TypeGroupPeopleJoined,
    TypePeopleJoinedResponse,
} from 'api/interface/discovery';
import {GROUP_BUYING_STATUS} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {StyleIcon, StyleText, StyleTouchable} from 'components/base';
import StyleList from 'components/base/StyleList';
import Redux from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';
import React, {forwardRef, useCallback, useRef} from 'react';
import {View} from 'react-native';
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

const {height} = Metrics;
const modalJoinHeightAdmin = (height * 2) / 2.5;

interface Props {
    postId: string;
    listPaging: any;
    totalRetailTurns: number;
}

const ModalPeopleRetail = (props: Props, ref: any) => {
    const {listPaging, totalRetailTurns} = props;
    const theme = Redux.getTheme();
    const myId = Redux.getPassport().profile.id;
    const hadLoaded = useRef(false);

    const onPressButton = async (item: TypePeopleJoinedResponse) => {
        const oldList = [...listPaging.list];
        try {
            if (item.status === GROUP_BUYING_STATUS.joinedNotBought) {
                listPaging.setList((preValue: Array<TypeGroupPeopleJoined>) => {
                    return preValue.map(value => {
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
                if (itemJoined.status === GROUP_BUYING_STATUS.joinedNotBought) {
                    return (
                        <StyleTouchable
                            customStyle={[
                                styles.buttonCheckJoined,
                                {
                                    backgroundColor:
                                        theme.backgroundButtonColor,
                                },
                            ]}
                            onPress={() => onPressButton(itemJoined)}>
                            <StyleText
                                i18Text="discovery.confirmBought"
                                customStyle={[
                                    styles.textButton,
                                    {color: theme.textColor},
                                ]}
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
                        <StyleTouchable
                            onPress={() => onGoToProfile(itemJoined.creator)}>
                            <StyleIcon
                                source={{uri: itemJoined.creatorAvatar}}
                                size={40}
                                customStyle={styles.creatorAvatar}
                            />
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
                                onPress={() =>
                                    onGoToProfile(itemJoined.creator)
                                }
                            />
                            <StyleText
                                originValue={formatFromNow(itemJoined.created)}
                                customStyle={[
                                    styles.timeJoined,
                                    {color: theme.borderColor},
                                ]}
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
                                customStyle={[
                                    styles.textInfo,
                                    {color: theme.textColor},
                                ]}
                            />
                            <StyleText
                                i18Text="discovery.depositAmount"
                                i18Params={{
                                    value: formatLocaleNumber(
                                        itemJoined.deposit,
                                    ),
                                }}
                                customStyle={[
                                    styles.textInfo,
                                    {color: theme.textColor},
                                ]}
                            />
                        </View>
                    )}

                    {!!itemJoined.timeWillBuy && (
                        <StyleText
                            i18Text="discovery.arrivalTime"
                            customStyle={[
                                styles.timeJoined,
                                {color: theme.textColor},
                            ]}>
                            <StyleText
                                originValue={` ${formatDayGroupBuying(
                                    itemJoined.timeWillBuy,
                                )}`}
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
                            customStyle={[
                                styles.timeJoined,
                                {color: theme.textColor},
                            ]}>
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
                                    styles.textInfo,
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
        [theme.backgroundColor, myId],
    );

    const onOpen = () => {
        if (!hadLoaded.current) {
            listPaging.onLoadMore();
            hadLoaded.current = true;
        }
    };

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
            }}
            onOpen={() => onOpen()}>
            <View
                style={[
                    styles.container,
                    {
                        backgroundColor: theme.backgroundColorSecond,
                    },
                ]}>
                <View style={styles.headerView}>
                    <StyleText
                        i18Text="discovery.numberRetailTurns"
                        i18Params={{
                            value: totalRetailTurns,
                        }}
                        customStyle={[
                            styles.textHeader,
                            {color: theme.textHightLight},
                        ]}
                    />
                    <StyleTouchable
                        customStyle={styles.iconTurnOffTouch}
                        onPress={() => ref.current?.close()}
                        hitSlop={15}>
                        <Feather
                            name="x"
                            style={[
                                styles.iconTurnOff,
                                {color: theme.textColor},
                            ]}
                        />
                    </StyleTouchable>
                </View>

                <StyleList
                    data={listPaging.list}
                    renderItem={({item}) => RenderItemJoined(item)}
                    keyExtractor={item => item.id}
                    onLoadMore={listPaging.onLoadMore}
                    refreshing={listPaging.refreshing}
                    onRefresh={listPaging.onRefresh}
                />
            </View>
        </Modalize>
    );
};

const styles = ScaledSheet.create({
    container: {
        height: modalJoinHeightAdmin,
        borderTopLeftRadius: '10@ms',
        borderTopRightRadius: '10@ms',
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
    creatorAvatar: {
        borderRadius: '20@ms',
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
        flex: 1,
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

export default forwardRef(ModalPeopleRetail);
