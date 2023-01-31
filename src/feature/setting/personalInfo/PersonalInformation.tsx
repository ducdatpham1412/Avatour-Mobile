/* eslint-disable no-underscore-dangle */
import {apiChangeInformation} from 'api/module';
import {StyleContainer, StyleText} from 'components/base';
import ClassDateTimePicker from 'components/base/picker/ClassDateTimePicker';
import Redux from 'hook/useRedux';
import StyleHeader from 'navigation/components/StyleHeader';
import {SETTING_ROUTE} from 'navigation/config/routes';
import {
    appAlertYesNo,
    goBack,
    navigate,
    popUpPicker,
} from 'navigation/NavigationService';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {chooseTextFromIdGender, renderListGender} from 'utility/assistant';
import {
    formatDateDayMonthYear,
    formatUTCDate,
    isTimeEqual,
} from 'utility/format';
import ModalChangeEmail from './components/ModalChangeEmail';
import ModalChangePhone from './components/ModalChangePhone';
import ItemInfo from './ItemInfo';

const PersonalInformation = () => {
    const {t} = useTranslation();
    const {information} = Redux.getPassport();
    const theme = Redux.getTheme();

    const emailRef = useRef<ModalChangeEmail>(null);
    const phoneRef = useRef<ModalChangePhone>(null);
    const birthdayRef = useRef<ClassDateTimePicker>(null);
    const informationValueRef = useRef<any>(information);

    const [email, setEmail] = useState(information.email);
    const [phone, setPhone] = useState(information.phone);
    const [gender, setGender] = useState(information.gender);
    const [birthday, setBirthday] = useState(
        formatUTCDate(information.birthday),
    );

    const refuseChange = () => {
        setEmail(informationValueRef.current.email);
        setPhone(informationValueRef.current.phone);
        setGender(informationValueRef.current.gender);
        setBirthday(informationValueRef.current.birthday);
    };

    const agreeChange = async (newInfo: any) => {
        try {
            if (newInfo.gender !== undefined) {
                await apiChangeInformation({
                    gender: newInfo.gender,
                });
                Redux.updatePassport({
                    information: newInfo,
                });
                goBack();
                return;
            }
            if (newInfo.birthday) {
                await apiChangeInformation({
                    birthday: newInfo.birthday,
                });
                Redux.updatePassport({
                    information: newInfo,
                });
                goBack();
                return;
            }
            if (newInfo.email) {
                navigate(SETTING_ROUTE.enterPassword, {
                    newInfo,
                });
                return;
            }
            if (newInfo.phone) {
                navigate(SETTING_ROUTE.enterPassword, {
                    newInfo,
                });
            }
        } catch (err) {
            refuseChange();
        }
    };

    const openConfirmChange = async (newInfo: any) => {
        appAlertYesNo({
            i18Title: 'setting.personalInfo.alertCfChange',
            agreeChange: () => agreeChange(newInfo),
            refuseChange: () => {
                refuseChange();
                goBack();
            },
            touchOutBack: false,
        });
    };

    useEffect(() => {
        if (email !== informationValueRef.current.email) {
            openConfirmChange({email});
            return;
        }
        if (phone !== informationValueRef.current.phone) {
            openConfirmChange({phone});
            return;
        }
        if (gender !== informationValueRef.current.gender) {
            openConfirmChange({gender});
        }
        if (!isTimeEqual(birthday, informationValueRef.current.birthday)) {
            openConfirmChange({birthday});
        }
    }, [email, phone, gender, birthday]);

    useEffect(() => {
        informationValueRef.current = information;
    }, [information]);

    const onNavigateGenderPicker = () => {
        popUpPicker({
            data: renderListGender,
            renderItem: (item: any) => (
                <View style={styles.elementPicker}>
                    <StyleText
                        i18Text={item.name}
                        customStyle={[
                            styles.textPicker,
                            {color: theme.textColor},
                        ]}
                    />
                </View>
            ),
            itemHeight: verticalScale(50),
            onSetItemSelected: (value: any) => {
                setGender(value.id);
            },
            initIndex:
                renderListGender.findIndex(item => item.id === gender) || 0,
        });
    };

    return (
        <>
            <StyleHeader title="setting.personalInfo.headerTitle" />

            <StyleContainer customStyle={styles.container}>
                <ItemInfo
                    value={email}
                    icon={
                        <Entypo
                            name="email"
                            style={[styles.icon, {color: theme.borderColor}]}
                        />
                    }
                    onPressEdit={() => emailRef.current?.show()}
                />

                <ItemInfo
                    value={phone}
                    icon={
                        <Feather
                            name="phone"
                            style={[styles.icon, {color: theme.borderColor}]}
                        />
                    }
                    onPressEdit={() => phoneRef.current?.show()}
                />

                <ItemInfo
                    value={t(chooseTextFromIdGender(gender))}
                    icon={
                        <Feather
                            name="user"
                            style={[styles.icon, {color: theme.borderColor}]}
                        />
                    }
                    onPressEdit={onNavigateGenderPicker}
                />

                <ItemInfo
                    value={formatDateDayMonthYear(birthday)}
                    icon={
                        <FontAwesome
                            name="birthday-cake"
                            style={[
                                styles.iconBirthday,
                                {color: theme.borderColor},
                            ]}
                        />
                    }
                    onPressEdit={() => birthdayRef.current?.show()}
                />
            </StyleContainer>

            <ModalChangeEmail
                ref={emailRef}
                email={email}
                onChangeEmail={value => setEmail(value)}
                theme={theme}
            />

            <ModalChangePhone
                ref={phoneRef}
                phone={phone}
                onChangePhone={value => setPhone(value)}
                theme={theme}
            />

            <ClassDateTimePicker
                ref={birthdayRef}
                initDate={new Date(birthday)}
                onChangeDateTime={value => setBirthday(formatUTCDate(value))}
                theme={theme}
            />
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        paddingHorizontal: '10@vs',
    },
    icon: {
        fontSize: '18@ms',
    },
    iconBirthday: {
        fontSize: '15@ms',
    },
    elementPicker: {
        height: '50@vs',
        justifyContent: 'center',
    },
    textPicker: {
        fontWeight: 'bold',
        fontSize: '20@ms',
    },
});

export default PersonalInformation;
