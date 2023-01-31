import {apiEditProfile} from 'api/module';
import FindmeStore from 'app-redux/store';
import {ACCOUNT} from 'asset/enum';
import {AVATAR_SIZE, FONT_SIZE} from 'asset/standardValue';
import {
    StyleButton,
    StyleContainer,
    StyleImage,
    StyleInput,
    StyleText,
    StyleTouchable,
} from 'components/base';
import StyleActionSheet from 'components/common/StyleActionSheet';
import LoadingScreen from 'components/LoadingScreen';
import ViewSafeTopPadding from 'components/ViewSafeTopPadding';
import Redux from 'hook/useRedux';
import StyleHeader from 'navigation/components/StyleHeader';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useMemo, useRef, useState} from 'react';
import {Platform, TextInput, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {SharedElement} from 'react-navigation-shared-element';
import {
    borderWidthTiny,
    chooseImageFromCamera,
    chooseImageFromLibrary,
    seeDetailImage,
} from 'utility/assistant';
import {I18Normalize} from 'utility/I18Next';
import ImageUploader from 'utility/ImageUploader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BtnPenEdit from './components/BtnPenEdit';

const EditProfile = () => {
    const {profile, setting} = Redux.getPassport();
    const theme = Redux.getTheme();
    const isLoading = Redux.getIsLoading();
    const {t} = useTranslation();

    const inputDescriptionRef = useRef<TextInput>(null);
    const actionRef = useRef<any>(null);
    const modalUpdateBank = useRef<any>(null);

    const [avatar, setAvatar] = useState(profile?.avatar);
    const [name, setName] = useState(profile?.name);
    const [location, setLocation] = useState(profile?.location);
    const [description, setDescription] = useState(profile?.description);

    const isShopAccount = profile.account_type === ACCOUNT.shop;
    let disableButton = true;
    if (isShopAccount) {
        disableButton =
            !name ||
            !location ||
            (name === profile.name &&
                location === profile.location &&
                description === profile.description);
    } else {
        disableButton =
            !name ||
            (name === profile.name && description === profile.description);
    }

    const listTextAndOption: Array<{
        text: I18Normalize;
        action(): void;
    }> = useMemo(() => {
        return [
            {
                text: 'common.chooseFromCamera',
                action: async () =>
                    chooseImageFromCamera((path: string) => setAvatar(path), {
                        maxWidth: AVATAR_SIZE.width,
                        maxHeight: AVATAR_SIZE.height,
                    }),
            },
            {
                text: 'common.chooseFromLibrary',
                action: async () =>
                    chooseImageFromLibrary(
                        (path: string) => {
                            setAvatar(path);
                        },
                        {
                            maxWidth: AVATAR_SIZE.width,
                            maxHeight: AVATAR_SIZE.height,
                        },
                    ),
            },
            {
                text: 'profile.removeAvatar',
                action: () => setAvatar(''),
            },
            {
                text: 'common.cancel',
                action: () => null,
            },
        ];
    }, []);

    const onSaveChange = async () => {
        try {
            Redux.setIsLoading(true);
            const {modeExp} = FindmeStore.getState().accountSlice;
            const {token} = FindmeStore.getState().logicSlice;

            if (!modeExp && token) {
                let newAvatar;
                if (avatar !== profile.avatar) {
                    if (avatar === '') {
                        newAvatar = '';
                    } else {
                        newAvatar = await ImageUploader.upLoad(avatar, 1000);
                    }
                }

                const newName = name === profile.name ? undefined : name;
                const newDescription =
                    description === profile.description
                        ? undefined
                        : description;
                const newLocation =
                    location === profile.location ? undefined : location;

                await apiEditProfile({
                    avatar: newAvatar,
                    name: newName,
                    description: newDescription,
                    location: newLocation,
                });
            }

            Redux.updatePassport({
                profile: {avatar: avatar || '', name, description, location},
            });

            appAlert('alert.successUpdatePro', {
                actionClickOk: () => navigate(PROFILE_ROUTE.myProfile),
            });
        } catch (err) {
            appAlert(err);
        } finally {
            Redux.setIsLoading(false);
        }
    };

    return (
        <>
            <ViewSafeTopPadding />
            <StyleHeader title="profile.component.infoProfile.editProfile" />

            <StyleContainer scrollEnabled customStyle={styles.container}>
                <View style={styles.avatarBox}>
                    <StyleTouchable
                        customStyle={[
                            styles.avatar,
                            {
                                borderColor: theme.borderColor,
                                backgroundColor: theme.backgroundColor,
                            },
                        ]}
                        onPress={() => {
                            if (avatar) {
                                seeDetailImage({
                                    images: [avatar],
                                });
                            }
                        }}
                        onLongPress={() => actionRef.current.show()}>
                        <SharedElement
                            id="avatar_share"
                            style={styles.avatarImg}>
                            <StyleImage
                                source={{uri: avatar}}
                                customStyle={styles.avatarImg}
                            />
                        </SharedElement>
                    </StyleTouchable>

                    <BtnPenEdit
                        btnStyle={styles.btnEditAvatar}
                        onPress={() => actionRef.current.show()}
                    />

                    <StyleActionSheet
                        ref={actionRef}
                        listTextAndAction={listTextAndOption}
                    />
                </View>

                <View
                    style={[
                        styles.nameBox,
                        {borderColor: theme.borderColor, width: '70%'},
                    ]}>
                    <AntDesign
                        name="user"
                        style={[
                            styles.iconLocation,
                            {color: theme.borderColor},
                        ]}
                    />
                    <TextInput
                        defaultValue={name || ''}
                        onChangeText={text => setName(text)}
                        placeholder={t('profile.edit.name')}
                        placeholderTextColor={theme.holderColorLighter}
                        style={[
                            styles.inputName,
                            {color: theme.textHightLight},
                        ]}
                        maxLength={100}
                    />
                </View>

                {isShopAccount && (
                    <View
                        style={[
                            styles.nameBox,
                            {borderColor: theme.borderColor},
                        ]}>
                        <Ionicons
                            name="location-outline"
                            style={[
                                styles.iconLocation,
                                {color: theme.borderColor},
                            ]}
                        />
                        <TextInput
                            defaultValue={location || ''}
                            onChangeText={text => setLocation(text)}
                            placeholder={t('profile.location')}
                            placeholderTextColor={theme.holderColorLighter}
                            style={[
                                styles.inputName,
                                {color: theme.textHightLight},
                            ]}
                            maxLength={100}
                        />
                    </View>
                )}

                <StyleTouchable
                    customStyle={[
                        styles.descriptionBox,
                        {borderColor: theme.borderColor},
                    ]}
                    activeOpacity={1}
                    onPress={() => inputDescriptionRef.current?.focus()}>
                    <StyleInput
                        ref={inputDescriptionRef}
                        value={description}
                        i18Placeholder="profile.description"
                        multiline
                        onChangeText={value => setDescription(value)}
                        containerStyle={{width: '100%'}}
                        inputStyle={[
                            styles.inputDescription,
                            {color: theme.textHightLight},
                        ]}
                        hasUnderLine={false}
                        hasErrorBox={false}
                        maxLength={1000}
                    />
                </StyleTouchable>

                {isShopAccount && (
                    <StyleTouchable
                        customStyle={[
                            styles.bankBox,
                            {borderColor: theme.borderColor},
                        ]}
                        activeOpacity={1}
                        onPress={() => modalUpdateBank.current?.show()}>
                        <StyleText
                            i18Text="profile.bankName"
                            customStyle={[
                                styles.textBankName,
                                {color: theme.textHightLight},
                            ]}>
                            <StyleText
                                originValue={`: ${setting.bank_code}`}
                                customStyle={[
                                    styles.textBankName,
                                    {color: theme.textHightLight},
                                ]}
                            />
                        </StyleText>
                        <StyleText
                            i18Text="profile.accountNumber"
                            customStyle={[
                                styles.textBankName,
                                {color: theme.textHightLight},
                            ]}>
                            <StyleText
                                originValue={`: ${setting.bank_account}`}
                                customStyle={[
                                    styles.textBankName,
                                    {color: theme.textHightLight},
                                ]}
                            />
                        </StyleText>
                    </StyleTouchable>
                )}

                <StyleButton
                    title="profile.edit.confirmButton"
                    containerStyle={styles.saveBtnView}
                    onPress={() => onSaveChange()}
                    disable={disableButton}
                />

                {isLoading && <LoadingScreen />}
            </StyleContainer>

            <StyleActionSheet
                ref={modalUpdateBank}
                listTextAndAction={[
                    {
                        text: 'profile.post.edit',
                        action: () => navigate(ROOT_SCREEN.updateBankAccount),
                    },
                    {
                        text: 'common.cancel',
                        action: () => null,
                    },
                ]}
            />
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        alignItems: 'center',
    },
    // avatar
    avatarBox: {
        width: '200@s',
        height: '200@s',
        marginTop: '10@vs',
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderWidth: '2@ms',
        borderRadius: '200@s',
    },
    avatarImg: {
        width: '100%',
        height: '100%',
        borderRadius: '100@vs',
    },
    btnEditAvatar: {
        width: '27@ms',
        height: '27@ms',
        bottom: '10@s',
        left: '20@s',
    },
    // name
    nameBox: {
        width: '80%',
        alignSelf: 'center',
        borderWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '5@s',
        borderRadius: '5@ms',
        marginTop: '10@vs',
    },
    inputName: {
        flex: 1,
        fontSize: FONT_SIZE.normal,
        paddingTop: '10@vs',
        paddingBottom: '10@vs',
        marginLeft: '5@s',
    },
    iconNameBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconLocation: {
        fontSize: '20@ms',
    },
    // description
    descriptionBox: {
        width: '80%',
        minHeight: '100@vs',
        paddingBottom: '10@vs',
        paddingTop: '5@vs',
        borderWidth: borderWidthTiny,
        borderColor: 'white',
        borderRadius: '5@ms',
        marginTop: '10@vs',
    },
    inputDescription: {
        fontSize: FONT_SIZE.normal,
    },
    bankBox: {
        width: '80%',
        borderWidth: borderWidthTiny,
        paddingVertical: '5@vs',
        marginTop: '10@vs',
        borderRadius: '5@ms',
        paddingHorizontal: '10@s',
    },
    textBankName: {
        fontSize: FONT_SIZE.normal,
    },
    // btnSave
    saveBtnView: {
        paddingHorizontal: '60@s',
        marginTop: '40@vs',
        marginBottom: '10@vs',
    },
});

export default EditProfile;
