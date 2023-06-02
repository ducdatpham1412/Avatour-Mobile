import {apiEditProfile} from 'api/profile';
import {updatePassport} from 'app-redux';
import Store, {useAppSelector} from 'app-redux/store';
import {ACCOUNT} from 'asset/enum';
import {safePaddingNotZero} from 'asset/metrics';
import {
  AppInput,
  StyleButton,
  StyleContainer,
  StyleImage,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {useLoading, useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {ModalActionSheet, ModalAlert} from 'navigation/screen/modals';
import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ImageStyle, TextInput, TextStyle, View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageUploader from 'utility/ImageUploader';
import {logger, seeDetailImage} from 'utility/assistant';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import BtnPenEdit from './components/BtnPenEdit';

const EditProfile = () => {
  const {bottom} = useSafeAreaInsets();
  const theme = useTheme();
  const {profile} = useAppSelector(state => state.accountSlice.passport);
  const {loading, setLoading} = useLoading();
  const {t} = useTranslation();

  const inputDescriptionRef = useRef<TextInput>(null);

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
      !name || (name === profile.name && description === profile.description);
  }

  const onSaveChange = async () => {
    try {
      setLoading(true);
      const {modeExp} = Store.getState().accountSlice;
      const {token} = Store.getState().logicSlice;

      if (!modeExp && token) {
        // let newAvatar;
        // if (avatar !== profile.avatar) {
        //   if (avatar === '') {
        //     newAvatar = '';
        //   } else {
        //     newAvatar = await ImageUploader.upLoad(avatar, 1000);
        //   }
        // }

        const newName = name === profile.name ? undefined : name;
        const newDescription =
          description === profile.description ? undefined : description;
        const newLocation =
          location === profile.location ? undefined : location;

        await apiEditProfile({
          //   avatar: newAvatar,
          name: newName,
          description: newDescription,
          location: newLocation,
        });
      }

      updatePassport({
        profile: {avatar: avatar || '', name, description, location},
      });

      ModalAlert.success({
        i18Content: 'alert.successUpdatePro',
        onClose: () => navigate(PROFILE_ROUTE.myProfile),
      });
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    } finally {
      setLoading(false);
    }
  };

  const onShowOptionAvatar = () => {
    ModalActionSheet.show({
      options: [
        {
          title: 'common.chooseFromCamera',
          onPress: async () => {
            try {
              setTimeout(async () => {
                const res = await ImageUploader.pickCamera();
                setAvatar(res);
              }, 200);
            } catch (err) {
              logger(err);
            }
          },
        },
        {
          title: 'common.chooseFromLibrary',
          onPress: async () => {
            try {
              setTimeout(async () => {
                const res = await ImageUploader.pickLibrary();
                setAvatar(res);
              }, 200);
            } catch (err) {
              logger(err);
            }
          },
        },
        {
          title: 'profile.removeAvatar',
          onPress: () => setAvatar(''),
        },
      ],
    });
  };

  return (
    <>
      <StyleContainer
        scrollEnabled
        customStyle={$container}
        headerProps={{title: 'profile.editProfile'}}
        BottomComponent={
          <StyleButton
            title="profile.edit.confirmButton"
            containerStyle={{
              marginBottom: bottom || safePaddingNotZero,
              width: '80%',
            }}
            onPress={onSaveChange}
            disable={disableButton}
            isLoading={loading}
          />
        }>
        <View style={$avatarBox}>
          <StyleTouchable
            customStyle={[
              $avatar,
              {
                borderColor: theme.p_600,
              },
            ]}
            onPress={() => {
              if (avatar) {
                seeDetailImage({
                  images: [avatar],
                });
              }
            }}
            onLongPress={onShowOptionAvatar}>
            <StyleImage source={{uri: avatar}} customStyle={$avatarImg} />
          </StyleTouchable>

          <BtnPenEdit
            containerStyle={$btnEditAvatar}
            onPress={onShowOptionAvatar}
          />
        </View>

        <View style={[$nameBox, {backgroundColor: theme.white}]}>
          <AntDesign
            name="user"
            style={[$iconLocation, {color: theme.gray_600}]}
          />
          <AppInput
            defaultValue={name || ''}
            onChangeText={text => setName(text)}
            placeholder={t('profile.edit.name')}
            style={$inputName}
            maxLength={100}
          />
        </View>

        {isShopAccount && (
          <View style={[$nameBox, {backgroundColor: theme.white}]}>
            <Ionicons
              name="location-outline"
              style={[$iconLocation, {color: theme.gray_600}]}
            />
            <AppInput
              defaultValue={location || ''}
              onChangeText={text => setLocation(text)}
              placeholder={t('profile.location')}
              style={$inputName}
              maxLength={100}
            />
          </View>
        )}

        <StyleTouchable
          customStyle={[$descriptionBox, {backgroundColor: theme.white}]}
          activeOpacity={1}
          onPress={() => inputDescriptionRef.current?.focus()}>
          <AppInput
            ref={inputDescriptionRef}
            value={description}
            placeholder={t('profile.description')}
            multiline
            onChangeText={value => setDescription(value)}
            style={$inputDescription}
            maxLength={1000}
          />
        </StyleTouchable>

        {isShopAccount && (
          <StyleTouchable
            customStyle={[$bankBox, {backgroundColor: theme.white}]}
            onPress={() =>
              ModalActionSheet.show({
                options: [
                  {
                    title: 'profile.post.edit',
                    onPress: () => navigate(ROOT_SCREEN.updateBankAccount),
                  },
                ],
              })
            }>
            <StyleText i18Text="profile.bankName">
              <StyleText originValue=": " />
              <StyleText
                originValue={profile?.information?.bank_code}
                customStyle={$textBank}
              />
            </StyleText>
            <StyleText i18Text="profile.accountNumber">
              <StyleText originValue=": " />
              <StyleText
                originValue={`${profile?.information?.bank_account}`}
                customStyle={$textBank}
              />
            </StyleText>
          </StyleTouchable>
        )}
      </StyleContainer>
    </>
  );
};

const $container: ViewStyle = {
  alignItems: 'center',
};
const $avatarBox: ViewStyle = {
  width: moderateScale(150),
  height: moderateScale(150),
  marginTop: verticalScale(10),
};
const $avatar: ImageStyle = {
  width: '100%',
  height: '100%',
  borderWidth: moderateScale(2.5),
  borderRadius: 150,
};
const $avatarImg: ImageStyle = {
  width: '100%',
  height: '100%',
  borderRadius: 100,
};
const $btnEditAvatar: ViewStyle = {
  width: moderateScale(27),
  height: moderateScale(27),
  bottom: scale(10),
  left: scale(10),
};
const $nameBox: ViewStyle = {
  width: '90%',
  alignSelf: 'center',
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: scale(5),
  borderRadius: moderateScale(5),
  marginTop: verticalScale(10),
};
const $inputName: TextStyle = {
  flex: 1,
  paddingTop: verticalScale(10),
  paddingBottom: verticalScale(10),
  marginLeft: scale(5),
};
const $iconLocation: TextStyle = {
  fontSize: moderateScale(20),
};
const $descriptionBox: ViewStyle = {
  width: '90%',
  borderRadius: moderateScale(5),
  marginTop: verticalScale(10),
  paddingVertical: verticalScale(10),
};
const $inputDescription: ViewStyle = {
  width: '100%',
  padding: scale(10),
  minHeight: verticalScale(100),
  maxHeight: verticalScale(200),
};
const $bankBox: ViewStyle = {
  width: '90%',
  paddingVertical: verticalScale(5),
  marginTop: verticalScale(10),
  borderRadius: moderateScale(5),
  paddingHorizontal: scale(10),
};
const $textBank: TextStyle = {
  fontWeight: 'bold',
};

export default EditProfile;
