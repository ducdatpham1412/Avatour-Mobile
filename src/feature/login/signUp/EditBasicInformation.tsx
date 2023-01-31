import {apiChangeInformation} from 'api/module';
import {GENDER_TYPE} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {
    StyleButton,
    StyleContainer,
    StyleText,
    StyleTouchable,
} from 'components/base';
import ClassDateTimePicker from 'components/base/picker/ClassDateTimePicker';
import InputBox from 'components/common/InputBox';
import Redux from 'hook/useRedux';
import {appAlert, appAlertYesNo, goBack} from 'navigation/NavigationService';
import React, {useRef, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import FindmeAsyncStorage from 'utility/FindmeAsyncStorage';
import {formatDateDayMonthYear, formatUTCDate} from 'utility/format';
import AuthenticateService, {
    TypeItemLoginSuccess,
} from 'utility/login/loginService';
import BackgroundAuthen from '../components/BackgroundAuthen';
import GenderSwipe from '../components/GenderSwipe';

interface Props {
    route: {
        params: {
            itemLoginSuccess: TypeItemLoginSuccess;
            isLoginSocial?: boolean;
        };
    };
}

export const scrollItemHeight = verticalScale(140);
const defaultDate = new Date(2000, 0, 1);

const EditBasicInformation = ({route}: Props) => {
    const {isLoginSocial = false, itemLoginSuccess} = route.params;

    const scrollPickerRef = useRef<ScrollView>(null);
    const dateTimeRef = useRef<ClassDateTimePicker>(null);

    const [gender, setGender] = useState(GENDER_TYPE.woman);
    const [name, setName] = useState('');
    const [birthday, setBirthday] = useState<Date | undefined>(undefined);

    const [index, setIndex] = useState(0);

    const onPressButton = () => {
        if (index < 2) {
            scrollPickerRef.current?.scrollTo({
                y: scrollItemHeight * (index + 1),
                animated: true,
            });
        } else if (birthday && name) {
            const onEditProfileAndGo = async (isKeep: boolean) => {
                goBack();
                try {
                    Redux.setIsLoading(true);
                    await FindmeAsyncStorage.updateActiveUser(itemLoginSuccess);
                    const updateObject = {
                        gender,
                        name,
                        birthday: formatUTCDate(birthday),
                    };

                    await apiChangeInformation(updateObject);
                    AuthenticateService.loginSuccess({
                        itemLoginSuccess,
                        isKeepSign: isKeep,
                        isLoginSocial,
                    });
                } catch (err) {
                    appAlert(err);
                } finally {
                    Redux.setIsLoading(false);
                }
            };

            if (isLoginSocial) {
                onEditProfileAndGo(true);
            } else {
                appAlertYesNo({
                    i18Title: 'alert.wantToSave',
                    agreeChange: () => onEditProfileAndGo(true),
                    refuseChange: () => onEditProfileAndGo(false),
                    agreeButtonOpacity: 1,
                });
            }
        }
    };

    /**
     * Render views
     */
    const HeaderAndBackground = () => {
        return (
            <>
                <BackgroundAuthen />
                <View style={styles.spaceBackground} />
                <StyleText
                    i18Text="login.detailInformation.title"
                    customStyle={styles.titleText}
                />
            </>
        );
    };

    // const InformationPreview = () => {
    //     return (
    //         <View style={styles.previewView}>
    //             <View style={styles.genderNameBox}>
    //                 <View style={styles.genderTouch}>
    //                     <StyleImage
    //                         source={renderIconGender(gender)}
    //                         customStyle={styles.iconGender}
    //                     />
    //                 </View>
    //                 <View style={styles.nameTouch}>
    //                     <StyleText
    //                         originValue={name}
    //                         customStyle={styles.nameText}
    //                     />
    //                 </View>
    //             </View>

    //             <View
    //                 style={[
    //                     styles.genderNameBox,
    //                     {marginTop: verticalScale(10)},
    //                 ]}>
    //                 <View style={styles.genderTouch}>
    //                     <StyleText
    //                         originValue={birthday.getDate()}
    //                         customStyle={styles.textBirthday}
    //                     />
    //                 </View>
    //                 <View style={styles.genderTouch}>
    //                     <StyleText
    //                         originValue={birthday.getMonth() + 1}
    //                         customStyle={styles.textBirthday}
    //                     />
    //                 </View>
    //                 <View style={[styles.nameTouch, {flex: 0.85}]}>
    //                     <StyleText
    //                         originValue={birthday.getFullYear()}
    //                         customStyle={styles.textBirthday}
    //                     />
    //                 </View>
    //             </View>
    //         </View>
    //     );
    // };

    const RenderPicker = () => {
        const textBirthday = birthday
            ? formatDateDayMonthYear(birthday)
            : 'login.detailInformation.chooseBirthday';
        const titleButton = index === 2 ? 'common.done' : 'common.next';
        let disableButton = false;
        if (index === 1) {
            disableButton = !name;
        } else if (index === 2) {
            disableButton = !birthday;
        }

        return (
            <StyleContainer containerStyle={styles.pickerPart} extraHeight={50}>
                <View style={styles.pickerView}>
                    <ScrollView
                        ref={scrollPickerRef}
                        snapToInterval={scrollItemHeight}
                        indicatorStyle="white"
                        onMomentumScrollEnd={e => {
                            const offSet = e.nativeEvent.contentOffset.y;
                            setIndex(Math.round(offSet / scrollItemHeight));
                        }}>
                        {/* Gender */}
                        <GenderSwipe gender={gender} setGender={setGender} />

                        {/* Name */}
                        <View style={styles.pickerBox}>
                            <StyleText
                                i18Text="login.detailInformation.enterYourName"
                                customStyle={styles.title}
                            />
                            <InputBox
                                value={name}
                                onChangeText={text => setName(text)}
                                containerStyle={{marginTop: verticalScale(30)}}
                                i18Placeholder="profile.edit.name"
                                onSubmitEditing={onPressButton}
                                selectionColor={Theme.darkTheme.textHightLight}
                            />
                        </View>

                        {/* Birthday */}
                        <View style={styles.pickerBox}>
                            <StyleTouchable
                                hitSlop={20}
                                onPress={() => dateTimeRef.current?.show()}>
                                <StyleText
                                    i18Text={textBirthday}
                                    customStyle={
                                        birthday
                                            ? styles.textBirthday
                                            : styles.textChooseBirthday
                                    }
                                />
                            </StyleTouchable>
                        </View>
                    </ScrollView>
                </View>

                <StyleButton
                    title={titleButton}
                    onPress={onPressButton}
                    containerStyle={{marginTop: verticalScale(80)}}
                    disable={disableButton}
                />
            </StyleContainer>
        );
    };

    return (
        <View style={styles.container}>
            {HeaderAndBackground()}
            {/* {InformationPreview()} */}
            {RenderPicker()}

            <ClassDateTimePicker
                ref={dateTimeRef}
                initDate={birthday || defaultDate}
                onChangeDateTime={value => setBirthday(value)}
                theme={Theme.lightTheme}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.darkTheme.backgroundColor,
    },
    spaceBackground: {
        width: '100%',
        height: Metrics.safeTopPadding + verticalScale(10),
    },
    titleText: {
        fontSize: FONT_SIZE.big,
        color: Theme.common.white,
        alignSelf: 'center',
    },
    // preview
    previewView: {
        width: '100%',
        paddingHorizontal: '20@s',
        marginTop: '10@vs',
    },
    genderNameBox: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    genderTouch: {
        width: '55@s',
        height: '55@s',
        backgroundColor: Theme.common.blueInput,
        borderRadius: '8@ms',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconGender: {
        width: '80%',
        height: '80%',
    },
    nameTouch: {
        flex: 0.95,
        backgroundColor: Theme.common.blueInput,
        borderRadius: '8@ms',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // picker
    pickerPart: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    pickerView: {
        width: '80%',
        height: scrollItemHeight,
        alignSelf: 'center',
        marginTop: '70@vs',
    },
    pickerBox: {
        width: '100%',
        height: scrollItemHeight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: '15@ms',
        color: Theme.common.white,
    },
    nameText: {
        color: Theme.common.white,
    },
    textChooseBirthday: {
        textDecorationLine: 'underline',
        color: Theme.common.white,
    },
    textBirthday: {
        fontSize: '40@ms',
        fontWeight: 'bold',
        color: Theme.common.white,
    },
});

export default EditBasicInformation;
