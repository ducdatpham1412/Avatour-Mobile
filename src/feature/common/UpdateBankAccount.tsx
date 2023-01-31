import {apiEditProfile} from 'api/module';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import {
    StyleButton,
    StyleImage,
    StyleText,
    StyleTouchable,
} from 'components/base';
import Redux from 'hook/useRedux';
import StyleHeader from 'navigation/components/StyleHeader';
import {appAlert, appAlertYesNo, goBack} from 'navigation/NavigationService';
import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {scale, ScaledSheet} from 'react-native-size-matters';
import {borderWidthTiny, logger} from 'utility/assistant';
import ModalBankAccount from './components/ModalBankAccount';
import ModalChooseBank from './components/ModalChooseBank';

const UpdateBankAccount = () => {
    const theme = Redux.getTheme();
    const {setting} = Redux.getPassport();

    const modalChooseBankRef = useRef<ModalChooseBank>(null);
    const modalBankAccountRef = useRef<ModalBankAccount>(null);

    const [chosenBank, setChosenBank] = useState<any>();
    const [bankAccount, setBankAccount] = useState(setting.bank_account);

    const disableButton =
        !chosenBank ||
        !bankAccount ||
        (chosenBank?.code === setting.bank_code &&
            bankAccount === setting.bank_account);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await fetch('https://api.vietqr.io/v2/banks');
                const {data} = await res.json();
                const temp = data.find(
                    (item: any) => item?.code === setting.bank_code,
                );
                if (temp) {
                    setChosenBank(temp);
                }
            } catch (err) {
                logger(err);
            }
        };
        if (setting.bank_code && chosenBank === undefined) {
            getData();
        }
    }, [setting.bank_code, chosenBank]);

    const onSave = async () => {
        if (chosenBank.code) {
            const agreeChange = async () => {
                try {
                    Redux.setIsLoading(true);
                    await apiEditProfile({
                        bank_code: chosenBank?.code || chosenBank?.short_name,
                        bank_account: bankAccount,
                    });
                    Redux.updatePassport({
                        setting: {
                            bank_code:
                                chosenBank?.code || chosenBank?.short_name,
                            bank_account: bankAccount,
                        },
                    });
                    goBack();
                    goBack();
                } catch (err) {
                    appAlert(err);
                } finally {
                    Redux.setIsLoading(false);
                }
            };

            appAlertYesNo({
                i18Title: 'alert.sureUpdateBankAccount',
                agreeChange: () => agreeChange(),
                refuseChange: goBack,
            });
        }
    };

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            <StyleHeader
                title="profile.updateBankAccount"
                titleStyle={styles.title}
            />

            <StyleText
                i18Text="profile.bank"
                customStyle={[
                    styles.titleChooseBank,
                    {color: theme.textHightLight},
                ]}
            />
            <View style={styles.infoView}>
                <View
                    style={[styles.infoBox, {borderColor: theme.borderColor}]}>
                    {chosenBank ? (
                        <StyleImage
                            source={{uri: chosenBank.logo}}
                            customStyle={styles.logoBank}
                        />
                    ) : (
                        <StyleText
                            i18Text="setting.personalInfo.notYet"
                            customStyle={[
                                styles.textNotYet,
                                {color: theme.holderColorLighter},
                            ]}
                        />
                    )}
                </View>
                <StyleTouchable
                    onPress={() => modalChooseBankRef.current?.show()}>
                    <StyleText
                        i18Text="profile.post.edit"
                        customStyle={[
                            styles.textEdit,
                            {color: theme.borderColor},
                        ]}
                    />
                </StyleTouchable>
            </View>

            <StyleText
                i18Text="profile.accountNumber"
                customStyle={[
                    styles.titleAccountNumber,
                    {color: theme.textHightLight},
                ]}
            />
            <View style={styles.infoView}>
                <View
                    style={[styles.infoBox, {borderColor: theme.borderColor}]}>
                    {bankAccount ? (
                        <StyleText
                            originValue={bankAccount}
                            customStyle={[
                                styles.textNotYet,
                                {color: theme.borderColor},
                            ]}
                        />
                    ) : (
                        <StyleText
                            i18Text="setting.personalInfo.notYet"
                            customStyle={[
                                styles.textNotYet,
                                {color: theme.holderColorLighter},
                            ]}
                        />
                    )}
                </View>
                <StyleTouchable
                    onPress={() => modalBankAccountRef.current?.show()}>
                    <StyleText
                        i18Text="profile.post.edit"
                        customStyle={[
                            styles.textEdit,
                            {color: theme.borderColor},
                        ]}
                    />
                </StyleTouchable>
            </View>

            <StyleButton
                title="common.save"
                containerStyle={styles.buttonView}
                disable={disableButton}
                onPress={onSave}
            />

            <ModalChooseBank
                ref={modalChooseBankRef}
                bank={chosenBank}
                onChangeBank={value => {
                    setChosenBank(value);
                    setBankAccount('');
                }}
                theme={theme}
            />
            <ModalBankAccount
                ref={modalBankAccountRef}
                value={bankAccount}
                onChangeValue={value => setBankAccount(value)}
                theme={theme}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingTop: Metrics.safeTopPadding,
        paddingHorizontal: '15@s',
    },
    title: {
        fontSize: FONT_SIZE.normal,
    },
    titleChooseBank: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
        marginTop: '10@vs',
    },
    titleAccountNumber: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
        marginTop: '20@vs',
    },
    infoView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '10@vs',
    },
    infoBox: {
        minWidth: '100@s',
        maxWidth: '70%',
        paddingVertical: '5@vs',
        borderWidth: borderWidthTiny,
        borderRadius: '5@ms',
        alignItems: 'center',
        paddingHorizontal: '5@s',
    },
    textEdit: {
        fontSize: FONT_SIZE.small,
        marginLeft: '10@s',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        marginVertical: '10@vs',
    },
    logoBank: {
        width: '100@s',
        height: scale((311 / 831) * 100),
    },
    textNotYet: {
        fontSize: FONT_SIZE.normal,
    },
    buttonView: {
        paddingVertical: '7@vs',
        marginTop: '30@vs',
    },
});

export default UpdateBankAccount;
