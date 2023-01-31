import {apiUpgradeAccount} from 'api/authentication';
import {TypeUpgradeAccount} from 'api/interface/authentication';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import AutoHeightImage from 'components/AutoHeightImage';
import {
    StyleButton,
    StyleImage,
    StyleText,
    StyleTouchable,
} from 'components/base';
import ButtonBack from 'components/common/ButtonBack';
import InputBox from 'components/common/InputBox';
import LoadingScreen from 'components/LoadingScreen';
import StyleKeyboardAwareView from 'components/StyleKeyboardAwareView';
import Redux from 'hook/useRedux';
import {appAlert, goBack} from 'navigation/NavigationService';
import React, {useRef, useState} from 'react';
import {Platform, ScrollView, TextInput, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {validateIsPhone} from 'utility/validate';
import ModalBankAccount from './components/ModalBankAccount';
import ModalChooseBank from './components/ModalChooseBank';

const {width, height, safeTopPadding} = Metrics;

const onConfirm = async (params: TypeUpgradeAccount) => {
    try {
        Redux.setIsLoading(true);
        await apiUpgradeAccount(params);
        appAlert('profile.requestUpgradeSuccess', {
            actionClickOk: () => {
                goBack();
                goBack();
            },
        });
    } catch (err) {
        appAlert(err);
    } finally {
        Redux.setIsLoading(false);
    }
};

const UpgradeAccount = () => {
    const {imageBackground} = Redux.getResource();
    const theme = Redux.getTheme();
    const {email} = Redux.getPassport().information;
    const isLoading = Redux.getIsLoading();

    const scrollRef = useRef<ScrollView>(null);
    const locationInputRef = useRef<TextInput>(null);
    const phoneNumberRef = useRef<TextInput>(null);
    const modalChooseBankRef = useRef<ModalChooseBank>(null);
    const modalBankAccountRef = useRef<ModalBankAccount>(null);

    const [location, setLocation] = useState('');
    const [phone, setPhone] = useState('');
    const [chosenBank, setChosenBank] = useState<any>();
    const [bankAccount, setBankAccount] = useState('');

    const Header = () => {
        return (
            <View style={styles.elementView}>
                <StyleText
                    i18Text="profile.toBecomeShopAccount"
                    customStyle={styles.titleBecome}
                />
                <StyleButton
                    title="common.next"
                    onPress={() => {
                        scrollRef.current?.scrollTo({
                            y: height,
                            animated: true,
                        });
                        if (!location) {
                            locationInputRef.current?.focus();
                        }
                    }}
                    containerStyle={styles.buttonView}
                />
            </View>
        );
    };

    const EnterLocation = () => {
        return (
            <View style={styles.elementView}>
                <StyleKeyboardAwareView innerStyle={{justifyContent: 'center'}}>
                    <StyleText
                        i18Text="profile.firstEnterLocation"
                        customStyle={styles.titleBecome}
                    />
                    <InputBox
                        ref={locationInputRef}
                        containerStyle={styles.inputContainer}
                        selectionColor={Theme.common.white}
                        i18Placeholder="profile.location"
                        defaultValue={location}
                        onChangeText={text => setLocation(text)}
                    />
                    <StyleButton
                        title="common.next"
                        onPress={() => {
                            scrollRef.current?.scrollTo({
                                y: height * 2,
                                animated: true,
                            });
                            if (!phone) {
                                phoneNumberRef.current?.focus();
                            }
                        }}
                        containerStyle={styles.buttonView}
                        disable={!location}
                    />
                </StyleKeyboardAwareView>
            </View>
        );
    };

    const EnterPhoneNumber = () => {
        return (
            <View style={styles.elementView}>
                <StyleKeyboardAwareView innerStyle={{justifyContent: 'center'}}>
                    <StyleText
                        i18Text="profile.phoneNumber"
                        customStyle={styles.titleBecome}
                    />
                    <InputBox
                        ref={phoneNumberRef}
                        containerStyle={styles.inputContainer}
                        selectionColor={Theme.common.white}
                        i18Placeholder="profile.phoneNumber"
                        defaultValue={phone}
                        onChangeText={text => setPhone(text)}
                        keyboardType="numeric"
                    />
                    <StyleButton
                        title="common.next"
                        onPress={() => {
                            scrollRef.current?.scrollTo({
                                y: height * 3,
                                animated: true,
                            });
                        }}
                        containerStyle={styles.buttonView}
                        disable={!validateIsPhone(phone)}
                    />
                </StyleKeyboardAwareView>
            </View>
        );
    };

    const ChooseBanking = () => {
        return (
            <View style={styles.elementView}>
                {!chosenBank ? (
                    <StyleTouchable
                        customStyle={styles.chooseBankBox}
                        onPress={() => modalChooseBankRef.current?.show()}>
                        <StyleText
                            i18Text="profile.bank"
                            customStyle={styles.textBank}
                        />
                    </StyleTouchable>
                ) : (
                    <StyleTouchable
                        onPress={() => modalChooseBankRef.current?.show()}>
                        <AutoHeightImage
                            uri={chosenBank?.logo || ''}
                            customStyle={styles.iconChosenBank}
                        />
                    </StyleTouchable>
                )}

                <View style={styles.accountNumberView}>
                    <StyleTouchable
                        customStyle={styles.chooseBankBox}
                        onPress={() => modalBankAccountRef.current?.show()}>
                        {!bankAccount ? (
                            <StyleText
                                i18Text="profile.accountNumber"
                                customStyle={styles.textBank}
                            />
                        ) : (
                            <StyleText
                                originValue={bankAccount}
                                customStyle={styles.textBank}
                            />
                        )}
                    </StyleTouchable>
                </View>

                <StyleButton
                    title="common.done"
                    onPress={() => {
                        scrollRef.current?.scrollTo({
                            y: height * 4,
                            animated: true,
                        });
                    }}
                    containerStyle={styles.buttonView}
                    disable={!chosenBank || !bankAccount}
                />
            </View>
        );
    };

    const ConfirmAll = () => {
        return (
            <View style={styles.elementView}>
                <StyleText
                    i18Text="profile.byTapping"
                    customStyle={styles.titleConfirm}>
                    <StyleText
                        i18Text="setting.personalInfo.confirm"
                        customStyle={[
                            styles.titleConfirm,
                            {fontWeight: 'bold'},
                        ]}
                    />
                    <StyleText
                        i18Text="profile.agreeSendTheseInformation"
                        customStyle={styles.titleConfirm}
                    />
                    <StyleText
                        originValue={email}
                        customStyle={[
                            styles.titleConfirm,
                            {fontWeight: 'bold'},
                        ]}
                    />
                </StyleText>
                <StyleButton
                    title="setting.personalInfo.confirm"
                    onPress={() => {
                        onConfirm({
                            location,
                            phone,
                            bankCode:
                                chosenBank?.code || chosenBank?.shortName || '',
                            bankAccount,
                        });
                    }}
                    containerStyle={styles.buttonView}
                    disable={!location || !phone || !chosenBank || !bankAccount}
                />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StyleImage
                source={{uri: imageBackground}}
                customStyle={styles.imageBackground}
            />
            <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={height}
                decelerationRate="fast">
                {Header()}
                {EnterLocation()}
                {EnterPhoneNumber()}
                {ChooseBanking()}
                {ConfirmAll()}
            </ScrollView>

            <ButtonBack containerStyle={styles.buttonBack} onPress={goBack} />

            <ModalChooseBank
                ref={modalChooseBankRef}
                bank={chosenBank}
                onChangeBank={value => setChosenBank(value)}
                theme={theme}
            />
            <ModalBankAccount
                ref={modalBankAccountRef}
                value={bankAccount}
                onChangeValue={value => setBankAccount(value)}
                theme={theme}
            />

            {isLoading && <LoadingScreen />}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.darkTheme.backgroundColor,
    },
    buttonBack: {
        position: 'absolute',
        left: '10@s',
        top: safeTopPadding + 7,
    },
    imageBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    elementView: {
        width,
        height,
        justifyContent: 'center',
        paddingHorizontal: '20@s',
    },
    titleBecome: {
        fontSize: FONT_SIZE.normal,
        color: Theme.common.white,
        lineHeight: '20@ms',
        fontWeight: 'bold',
    },
    buttonView: {
        marginTop: '30@vs',
    },
    inputContainer: {
        width: '100%',
        marginTop: '30@vs',
    },
    chooseBankBox: {
        paddingVertical: '10@vs',
        borderWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        borderColor: Theme.common.textMe,
        alignItems: 'center',
        width: '70%',
        alignSelf: 'center',
        borderRadius: '10@ms',
    },
    textBank: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
        color: Theme.common.textMe,
    },
    iconChosenBank: {
        width: '30%',
        borderRadius: '10@ms',
        backgroundColor: Theme.common.white,
        alignSelf: 'center',
    },
    accountNumberView: {
        width: '100%',
        alignItems: 'center',
        marginTop: '20@vs',
    },
    titleConfirm: {
        fontSize: FONT_SIZE.small,
        color: Theme.common.white,
        lineHeight: '20@ms',
    },
});

export default UpgradeAccount;
