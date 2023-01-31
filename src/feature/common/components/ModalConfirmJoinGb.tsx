import {TypeJoinGroupBookingRequest, TypePrice} from 'api/interface/discovery';
import {TypePurchaseResource} from 'app-redux/account/logicSlice';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import {
    StyleButton,
    StyleIcon,
    StyleText,
    StyleTouchable,
} from 'components/base';
import AppInput from 'components/base/AppInput';
import ClassDateTimePicker from 'components/base/picker/ClassDateTimePicker';
import Redux from 'hook/useRedux';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {borderWidthTiny} from 'utility/assistant';
import {
    addDate,
    formatDayGroupBuying,
    formatLocaleNumber,
    formatUTCDate,
} from 'utility/format';
import AddPhone from './AddPhone';

interface Props {
    onConfirm(params: TypeJoinGroupBookingRequest): void;
    retailPrice: string;
    prices: Array<TypePrice>;
}

const ModalConfirmJoinGb = (props: Props) => {
    const {onConfirm, retailPrice, prices} = props;
    const {t} = useTranslation();
    const theme = Redux.getTheme();
    const {phone} = Redux.getPassport().information;
    const {listPurchases} = Redux.getResource();

    const modalizeRef = useRef<Modalize>(null);
    const modalTimeRef = useRef<Modalize>(null);
    const modalAddPhoneRef = useRef<Modalize>(null);
    const datetimeRef = useRef<ClassDateTimePicker>(null);
    const moneyStandard = useRef(listPurchases[0].value);

    const [amount, setAmount] = useState(1);
    const [timeWillJoin, setTimeWillJoin] = useState(
        addDate(new Date(), {
            value: 1,
            unit: 'day',
        }),
    );
    const [note, setNote] = useState('');

    const [isRetail, setIsRetail] = useState(false);
    const [chosenDeposit, setChosenDeposit] = useState<TypePurchaseResource>();

    useEffect(() => {
        if (prices.length && retailPrice) {
            moneyStandard.current = isRetail
                ? Number(retailPrice) * 0.2
                : Number(prices[prices.length - 1].value) * 0.2;
            const temp =
                listPurchases.find(
                    item => item.value > moneyStandard.current,
                ) || listPurchases[listPurchases.length - 1];
            setChosenDeposit(temp);
            setAmount(1);
        }
    }, [isRetail, prices, retailPrice]);

    const onChangeAmount = (value: number) => {
        const nextAmount = amount + value;
        if (nextAmount === 0) {
            return;
        }
        setAmount(nextAmount);
        const nextMoney = moneyStandard.current * nextAmount;
        const temp =
            listPurchases.find(item => item.value > nextMoney) ||
            listPurchases[listPurchases.length - 1];
        setChosenDeposit(temp);
    };

    const showModal = (params: {isRetail: boolean}) => {
        setIsRetail(params.isRetail);
        modalizeRef.current?.open();
    };

    const hideModal = () => {
        modalizeRef.current?.close();
    };

    const jsx = () => {
        return (
            <>
                <Modalize
                    ref={modalizeRef}
                    adjustToContentHeight
                    withHandle={false}
                    modalStyle={{
                        backgroundColor: theme.backgroundColor,
                    }}
                    childrenStyle={styles.childrenContainer}>
                    <StyleText
                        i18Text={
                            isRetail
                                ? 'discovery.buySeparately'
                                : 'discovery.joinGroupBuying'
                        }
                        customStyle={[
                            styles.textHeader,
                            {
                                color: theme.textColor,
                            },
                        ]}
                    />
                    <StyleIcon
                        source={Images.images.squirrelLogin}
                        size={50}
                        customStyle={styles.icon}
                    />
                    <StyleText
                        i18Text="discovery.titleDeposit"
                        customStyle={[
                            styles.textTitle,
                            {color: theme.textColor},
                        ]}
                    />
                    <StyleText
                        i18Text="discovery.theMoneyIs"
                        customStyle={[
                            styles.textTitle,
                            {color: theme.textColor},
                        ]}>
                        {!!chosenDeposit && (
                            <StyleText
                                originValue={`${formatLocaleNumber(
                                    String(chosenDeposit.value),
                                )}vnd`}
                                customStyle={[
                                    styles.textMoney,
                                    {color: theme.highlightColor},
                                ]}
                            />
                        )}
                    </StyleText>

                    <View style={styles.enterInfoView}>
                        <StyleText
                            i18Text="discovery.amount"
                            customStyle={[
                                styles.textTitleEnterInfo,
                                {color: theme.textHightLight},
                            ]}
                        />
                        <View style={styles.minusPlusBox}>
                            <StyleTouchable
                                onPress={() => onChangeAmount(-1)}
                                hitSlop={10}>
                                <AntDesign
                                    name="minussquareo"
                                    style={[
                                        styles.iconMinusPlus,
                                        {color: theme.borderColor},
                                    ]}
                                />
                            </StyleTouchable>
                            <StyleText
                                originValue={amount}
                                customStyle={[
                                    styles.textAmount,
                                    {color: theme.borderColor},
                                ]}
                            />
                            <StyleTouchable
                                onPress={() => onChangeAmount(1)}
                                hitSlop={10}>
                                <AntDesign
                                    name="plussquareo"
                                    style={[
                                        styles.iconMinusPlus,
                                        {color: theme.borderColor},
                                    ]}
                                />
                            </StyleTouchable>
                        </View>
                    </View>

                    <View style={styles.enterInfoView}>
                        <StyleText
                            i18Text="discovery.arrivalTime"
                            customStyle={[
                                styles.textTitleEnterInfo,
                                {color: theme.textHightLight},
                            ]}
                        />
                        <View style={styles.minusPlusBox}>
                            <StyleTouchable
                                onPress={() => {
                                    modalTimeRef.current?.open();
                                    setTimeout(() => {
                                        datetimeRef.current?.show();
                                    }, 500);
                                }}
                                hitSlop={{
                                    top: 10,
                                    bottom: 10,
                                }}>
                                <StyleText
                                    originValue={`${formatDayGroupBuying(
                                        timeWillJoin,
                                    )}`}
                                    customStyle={[
                                        styles.textJoinDate,
                                        {
                                            color: theme.borderColor,
                                        },
                                    ]}
                                />
                            </StyleTouchable>
                        </View>
                    </View>

                    <View style={styles.enterInfoView}>
                        <StyleText
                            i18Text="login.signUp.type.phone"
                            customStyle={[
                                styles.textTitleEnterInfo,
                                {color: theme.textHightLight},
                            ]}>
                            <StyleText
                                originValue=":"
                                customStyle={[
                                    styles.textTitleEnterInfo,
                                    {color: theme.textHightLight},
                                ]}
                            />
                        </StyleText>
                        <View style={styles.minusPlusBox}>
                            <StyleTouchable
                                onPress={() => {
                                    modalAddPhoneRef.current?.open();
                                }}
                                disable={!!phone}
                                disableOpacity={1}
                                hitSlop={{
                                    top: 10,
                                    bottom: 10,
                                }}>
                                {phone ? (
                                    <StyleText
                                        originValue={phone}
                                        customStyle={[
                                            styles.textJoinDate,
                                            {
                                                color: theme.borderColor,
                                                textDecorationLine: 'none',
                                            },
                                        ]}
                                    />
                                ) : (
                                    <StyleText
                                        i18Text="discovery.addPhoneNumber"
                                        customStyle={[
                                            styles.textJoinDate,
                                            {
                                                color: theme.highlightColor,
                                            },
                                        ]}
                                    />
                                )}
                            </StyleTouchable>
                        </View>
                    </View>

                    <AppInput
                        value={note}
                        onChangeText={text => setNote(text)}
                        style={[
                            styles.inputNote,
                            {
                                borderColor: theme.borderColor,
                                color: theme.textHightLight,
                            },
                        ]}
                        placeholder={t('discovery.noteForMerchant')}
                        placeholderTextColor={theme.holderColorLighter}
                        textAlignVertical="top"
                        multiline
                    />

                    <StyleButton
                        title="discovery.goToDeposit"
                        containerStyle={styles.button}
                        onPress={() => {
                            if (chosenDeposit) {
                                onConfirm({
                                    postId: '',
                                    money: String(chosenDeposit.value),
                                    amount,
                                    time_will_buy: formatUTCDate(timeWillJoin),
                                    note,
                                    is_retail: isRetail,
                                    productId: chosenDeposit.product_id,
                                });
                            }
                        }}
                        disable={!phone}
                    />
                </Modalize>

                <Modalize
                    ref={modalTimeRef}
                    withHandle={false}
                    modalStyle={{
                        backgroundColor: 'transparent',
                    }}>
                    <ClassDateTimePicker
                        ref={datetimeRef}
                        initDate={new Date(timeWillJoin)}
                        minimumDate={new Date()}
                        onChangeDateTime={value => {
                            setTimeWillJoin(String(value));
                            modalTimeRef.current?.close();
                        }}
                        onCancel={() => modalTimeRef.current?.close()}
                        theme={theme}
                    />
                </Modalize>

                <Modalize
                    ref={modalAddPhoneRef}
                    adjustToContentHeight
                    withHandle={false}
                    modalStyle={{
                        backgroundColor: 'transparent',
                    }}>
                    <AddPhone
                        onCloseModal={() => modalAddPhoneRef.current?.close()}
                    />
                </Modalize>
            </>
        );
    };

    return {
        jsx,
        showModal,
        hideModal,
    };
};

const styles = ScaledSheet.create({
    childrenContainer: {
        paddingHorizontal: '20@s',
        paddingBottom: Metrics.safeBottomPadding,
    },
    textHeader: {
        fontSize: FONT_SIZE.normal,
        marginTop: '5@vs',
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    icon: {
        marginTop: '10@vs',
        alignSelf: 'center',
    },
    textTitle: {
        fontSize: FONT_SIZE.normal,
        marginTop: '10@vs',
    },
    textMoney: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: '10@vs',
        alignSelf: 'center',
    },
    button: {
        marginTop: '20@vs',
        marginBottom: '5@vs',
        paddingVertical: '5@vs',
    },
    enterInfoView: {
        flexDirection: 'row',
        marginTop: '20@vs',
        alignItems: 'center',
    },
    textTitleEnterInfo: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
    },
    minusPlusBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: '20@s',
    },
    iconMinusPlus: {
        fontSize: '20@ms',
    },
    textAmount: {
        fontSize: FONT_SIZE.big,
        fontWeight: 'bold',
        width: '50@ms',
        textAlign: 'center',
    },
    textJoinDate: {
        fontSize: FONT_SIZE.normal,
        textDecorationLine: 'underline',
    },
    inputNote: {
        width: '100%',
        height: '100@vs',
        borderWidth: borderWidthTiny,
        borderRadius: '10@ms',
        marginTop: '20@vs',
        paddingHorizontal: '7@ms',
        paddingTop: '7@ms',
        paddingBottom: '7@ms',
        fontSize: FONT_SIZE.normal,
    },
});

export default ModalConfirmJoinGb;
