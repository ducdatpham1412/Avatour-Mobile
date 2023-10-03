import {apiEditProfile} from 'api/profile';
import {updatePassport} from 'app-redux';
import Store, {useAppSelector} from 'app-redux/store';
import {BORDER_RADIUS, FONT_SIZE, LIST_TOPICS, ratioAvatar} from 'asset';
import {ACCOUNT} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics, safePaddingNotZero, verticalMargin} from 'asset/metrics';
import {
  AppInput,
  StyleButton,
  StyleContainer,
  StyleIcon,
  StyleImage,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {TickBox} from 'feature/discovery/components';
import {useLoading, useSafeArea, useTheme} from 'hook';
import {goBack, navigate} from 'navigation/NavigationService';
import ROOT_SCREEN from 'navigation/config/routes';
import {
  ModalActionSheet,
  ModalAlert,
  ModalTimePicker,
  TimeValue,
} from 'navigation/screen/modals';
import React, {Dispatch, SetStateAction, useRef, useState} from 'react';
import isEqual from 'react-fast-compare';
import {useTranslation} from 'react-i18next';
import {ImageStyle, TextInput, TextStyle, View, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import ImageUploader from 'utility/ImageUploader';
import {$styleTopShadow, logger, seeDetailImage} from 'utility/assistant';
import {
  formatHours,
  formatInputNumber,
  formatLocaleNumber,
} from 'utility/format';
import {impactLight} from 'utility/haptic';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {
  TypeBusinessTime,
  TypeLocationPrice,
  listOptionsBusinessTime,
  listOptionsPrice,
} from 'utility/staticData';
import {Title, TitleAndInput} from './components';

const onShowOptionAvatar = (setAvatar: Dispatch<SetStateAction<string>>) => {
  ModalActionSheet.show({
    options: [
      {
        title: 'common.chooseFromCamera',
        onPress: async () => {
          try {
            setTimeout(async () => {
              const res = await ImageUploader.pickCamera();
              setAvatar(res?.path ?? res?.sourceURL);
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
              const res = await ImageUploader.pickLibrary({
                maxWidth: Metrics.width,
                maxHeight: Metrics.width * ratioAvatar,
              });
              setAvatar(res?.path ?? res?.sourceURL);
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

const EditProfileUser = () => {
  const {bottom} = useSafeArea();
  const theme = useTheme();
  const {profile} = useAppSelector(state => state.accountSlice.passport);
  const {loading, setLoading} = useLoading();
  const {t} = useTranslation();

  const inputDescriptionRef = useRef<TextInput>(null);

  const [avatar, setAvatar] = useState(profile?.avatar);
  const [name, setName] = useState(profile?.name);
  const [description, setDescription] = useState(profile?.description);

  let disableButton =
    !name ||
    (avatar === profile.avatar &&
      name === profile.name &&
      description === profile.description);

  const onSaveChange = async () => {
    try {
      setLoading(true);
      const {modeExp} = Store.getState().accountSlice;
      const {token} = Store.getState().logicSlice;

      if (!modeExp && token) {
        const newAvatar = avatar === profile.avatar ? undefined : avatar;
        const newName = name === profile.name ? undefined : name.trim();
        const newDescription =
          description === profile.description ? undefined : description.trim();

        await apiEditProfile({
          avatar: newAvatar,
          name: newName,
          description: newDescription,
        });
      }

      updatePassport({
        profile: {
          avatar: avatar,
          name: name.trim(),
          description: description.trim(),
        },
      });

      ModalAlert.success({
        i18Content: 'alert.successUpdatePro',
        onClose: () => goBack(),
      });
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StyleContainer
        scrollEnabled
        headerProps={{title: 'profile.editProfile'}}
        backgroundColor={theme.white}
        BottomComponent={
          <View
            style={[
              $bottom,
              $styleTopShadow,
              {backgroundColor: theme.white, shadowColor: theme.gray_500},
            ]}>
            <StyleButton
              title="common.update"
              containerStyle={{
                marginBottom: bottom,
                width: '90%',
              }}
              onPress={onSaveChange}
              disable={disableButton}
              isLoading={loading}
            />
          </View>
        }>
        <View style={$imageView}>
          <StyleTouchable
            customStyle={$image}
            onPress={() => {
              if (avatar) {
                seeDetailImage({
                  images: [avatar],
                });
              }
            }}>
            <StyleImage
              source={{
                uri: avatar,
              }}
              customStyle={[$image, {backgroundColor: theme.gray_100}]}
              defaultImageSource="image"
            />
          </StyleTouchable>
          <StyleTouchable
            customStyle={[$buttonCamera, {backgroundColor: theme.gray_200}]}
            onPress={() => onShowOptionAvatar(setAvatar)}>
            <StyleIcon
              source={Images.icons.camera}
              size={24}
              tintColor={theme.black}
            />
          </StyleTouchable>
        </View>

        <TitleAndInput
          title="discovery.name"
          textInputProps={{
            defaultValue: name,
            placeholder: t('discovery.name'),
            onChangeText: text => setName(text),
          }}
        />

        <Title title="profile.description" mandatory={false} style={$element} />
        <StyleTouchable
          customStyle={[$description, {borderColor: theme.gray_300}]}
          activeOpacity={1}
          onPress={() => inputDescriptionRef.current?.focus()}>
          <AppInput
            ref={inputDescriptionRef}
            style={$inputDescription}
            multiline
            placeholder={t('profile.locationDescription')}
            onChangeText={text => setDescription(text)}
            defaultValue={description}
          />
        </StyleTouchable>
      </StyleContainer>
    </>
  );
};

const EditProfileSupplier = () => {
  const {bottom} = useSafeArea();
  const theme = useTheme();
  const {profile} = useAppSelector(state => state.accountSlice.passport);
  const {loading, setLoading} = useLoading();
  const {t} = useTranslation();

  const inputDescriptionRef = useRef<TextInput>(null);

  const [avatar, setAvatar] = useState(profile.avatar);
  const [name, setName] = useState(profile.name);
  const [address, setAddress] = useState(profile.location);
  const [duration, setDuration] = useState(String(profile.duration));

  const [typePrice, setTypePrice] = useState<TypeLocationPrice>(() => {
    if (profile.min_cost === 0 && profile.max_cost === 0) {
      return 'free';
    }
    return 'paid';
  });
  const [minCost, setMinCost] = useState(String(profile.min_cost));
  const [maxCost, setMaxCost] = useState(String(profile.max_cost));

  const [typeTime, setTypeTime] = useState<TypeBusinessTime>(() => {
    if (profile.start_time === 0 && profile.end_time === 0) {
      return 'all-day';
    }
    return 'limit';
  });
  const [startTime, setStartTime] = useState(profile.start_time);
  const [endTime, setEndTime] = useState(profile.end_time);

  const [services, setServices] = useState(profile.services);
  const [description, setDescription] = useState(profile.description);

  let disableButton =
    !name ||
    !address ||
    !services.length ||
    !duration ||
    (avatar === profile.avatar &&
      name === profile.name &&
      address === profile.location &&
      Number(duration) === profile.duration &&
      isEqual(services, profile.services) &&
      description === profile.description);

  if (disableButton) {
    disableButton =
      typePrice === 'free'
        ? profile.min_cost === 0 && profile.max_cost === 0
        : Number(minCost) === profile.min_cost &&
          Number(maxCost) === profile.max_cost;
  }

  if (disableButton) {
    disableButton =
      typeTime === 'all-day'
        ? profile.start_time === 0 && profile.max_cost === 0
        : startTime === profile.start_time && endTime === profile.end_time;
  }

  const onSaveChange = async () => {
    try {
      setLoading(true);
      const {modeExp} = Store.getState().accountSlice;

      const newAvatar = avatar === profile.avatar ? undefined : avatar;
      const newName = name === profile.name ? undefined : name.trim();
      const newAddress = address === profile.location ? undefined : address;
      const newDuration =
        Number(duration) === profile.duration ? undefined : Number(duration);

      let newMinCost: number | undefined = 0;
      let newMaxCost: number | undefined = 0;

      if (typePrice === 'free') {
        newMinCost = profile.min_cost === 0 ? undefined : 0;
        newMaxCost = profile.max_cost === 0 ? undefined : 0;
      } else {
        newMinCost =
          Number(minCost) === profile.min_cost ? undefined : Number(minCost);
        newMaxCost =
          Number(maxCost) === profile.min_cost ? undefined : Number(maxCost);
      }

      let newStartTime: number | undefined = 0;
      let newEndTime: number | undefined = 0;

      if (typeTime === 'all-day') {
        newStartTime = profile.start_time === 0 ? undefined : 0;
        newEndTime = profile.end_time === 0 ? undefined : 0;
      } else {
        newStartTime = startTime === profile.start_time ? undefined : startTime;
        newEndTime = endTime === profile.end_time ? undefined : endTime;
      }

      const newServices = isEqual(services, profile.services)
        ? undefined
        : JSON.stringify(services);

      const newDescription =
        description === profile.description ? undefined : description.trim();

      if (!modeExp) {
        await apiEditProfile({
          name: newName,
          description: newDescription,
          avatar: newAvatar,
          location: newAddress,
          min_cost: newMinCost,
          max_cost: newMaxCost,
          duration: newDuration,
          services: newServices,
          start_time: newStartTime,
          end_time: newEndTime,
        });
      }

      updatePassport({
        profile: {
          avatar: avatar,
          name: name.trim(),
          description: description.trim(),
          location: address,
          min_cost:
            newMinCost !== undefined ? Number(newMinCost) : profile.min_cost,
          max_cost:
            newMaxCost !== undefined ? Number(newMaxCost) : profile.max_cost,
          duration: Number(duration),
          services,
          start_time:
            newStartTime !== undefined ? newStartTime : profile.start_time,
          end_time: newEndTime !== undefined ? newEndTime : profile.end_time,
        },
      });

      ModalAlert.success({
        i18Content: 'alert.successUpdatePro',
        onClose: () => goBack(),
      });
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StyleContainer
        scrollEnabled
        headerProps={{title: 'profile.editProfile'}}
        backgroundColor={theme.white}
        customStyle={{paddingBottom: safePaddingNotZero}}
        BottomComponent={
          <View
            style={[
              $bottom,
              $styleTopShadow,
              {backgroundColor: theme.white, shadowColor: theme.gray_500},
            ]}>
            <StyleButton
              title="common.update"
              containerStyle={{
                marginBottom: bottom,
                width: '90%',
              }}
              onPress={onSaveChange}
              disable={disableButton}
              isLoading={loading}
            />
          </View>
        }>
        <View style={$imageView}>
          <StyleTouchable
            customStyle={$image}
            onPress={() => {
              if (avatar) {
                seeDetailImage({
                  images: [avatar],
                });
              }
            }}>
            <StyleImage
              source={{
                uri: avatar,
              }}
              customStyle={[$image, {backgroundColor: theme.gray_100}]}
              defaultImageSource="image"
            />
          </StyleTouchable>
          <StyleTouchable
            customStyle={[$buttonCamera, {backgroundColor: theme.gray_200}]}
            onPress={() => onShowOptionAvatar(setAvatar)}>
            <StyleIcon
              source={Images.icons.camera}
              size={24}
              tintColor={theme.black}
            />
          </StyleTouchable>
        </View>

        <TitleAndInput
          title="discovery.name"
          textInputProps={{
            defaultValue: name,
            placeholder: t('discovery.name'),
            onChangeText: text => setName(text),
          }}
        />

        <TitleAndInput
          title="profile.address"
          containerStyle={$element}
          textInputProps={{
            placeholder: t('discovery.homeAddress'),
            onChangeText: text => setAddress(text),
            defaultValue: address,
          }}
        />

        <TitleAndInput
          title={
            `${t('discovery.durationHere')} (${t(
              'discovery.hour',
            )})` as I18Normalize
          }
          containerStyle={$element}
          textInputProps={{
            placeholder: '2h',
            keyboardType: 'numeric',
            value: formatLocaleNumber(duration),
            onChangeText: text => {
              const temp = formatInputNumber(text, {isDecimal: true});
              if (temp !== null) {
                setDuration(temp);
              }
            },
          }}
        />

        <TickBox
          title="profile.businessHours"
          listOptions={listOptionsBusinessTime}
          listChosen={[{id: typeTime, text: 'common.null'}]}
          onPressOption={option => {
            if (option.id !== typeTime) {
              impactLight();
              setTypeTime(option.id as TypeBusinessTime);
            }
          }}
          containerStyle={$element}
          layOut="grid"
          mandatory
        />
        {typeTime === 'limit' && (
          <View style={$businessTime}>
            <StyleTouchable
              customStyle={[$businessTimeBox, {borderColor: theme.gray_300}]}
              onPress={() => {
                let initTime: TimeValue | undefined;
                if (startTime) {
                  const format = formatHours(startTime);
                  initTime = {
                    hours: format.hours,
                    minutes: format.minutes,
                  };
                } else {
                  initTime = {
                    hours: 6,
                    minutes: 0,
                  };
                }
                ModalTimePicker.show({
                  title: 'profile.selectOpenHour',
                  initTime,
                  onChange: v => {
                    const temp = v.hours + v.minutes / 100;
                    setStartTime(temp);
                    if (!endTime) {
                      ModalTimePicker.show({
                        title: 'profile.selectCloseHour',
                        initTime: {
                          hours: 22,
                          minutes: 0,
                        },
                        onChange: vEnd => {
                          const tempEnd = vEnd.hours + vEnd.minutes / 100;
                          setEndTime(tempEnd);
                        },
                      });
                    }
                  },
                });
              }}>
              {startTime ? (
                <StyleText originValue={formatHours(startTime).text} />
              ) : (
                <StyleText
                  originValue={`${t('profile.ex')}: 6:00`}
                  customStyle={{
                    color: theme.gray_400,
                  }}
                />
              )}
            </StyleTouchable>

            <StyleText originValue="~" customStyle={$divider} />

            <StyleTouchable
              customStyle={[$businessTimeBox, {borderColor: theme.gray_300}]}
              onPress={() => {
                let initTime: TimeValue | undefined;
                if (endTime) {
                  const format = formatHours(endTime);
                  initTime = {
                    hours: format.hours,
                    minutes: format.minutes,
                  };
                } else {
                  initTime = {
                    hours: 22,
                    minutes: 0,
                  };
                }
                ModalTimePicker.show({
                  title: 'profile.selectCloseHour',
                  initTime,
                  onChange: v => {
                    const temp = v.hours + v.minutes / 100;
                    setEndTime(temp);
                  },
                });
              }}>
              {endTime ? (
                <StyleText originValue={formatHours(endTime).text} />
              ) : (
                <StyleText
                  originValue={`${t('profile.ex')}: 22:00`}
                  customStyle={{
                    color: theme.gray_400,
                  }}
                />
              )}
            </StyleTouchable>
          </View>
        )}

        <TickBox
          title="profile.price"
          listOptions={listOptionsPrice}
          listChosen={[{id: typePrice, text: 'common.null'}]}
          onPressOption={option => {
            if (option.id !== typePrice) {
              impactLight();
              setTypePrice(option.id as TypeLocationPrice);
            }
          }}
          containerStyle={$element}
          layOut="grid"
          mandatory
        />
        {typePrice === 'paid' && (
          <View style={$inputPrice}>
            <View style={$inputBox}>
              <TitleAndInput
                title="discovery.minCost"
                textInputProps={{
                  placeholder: '50,000 vnd',
                  value: formatLocaleNumber(minCost),
                  onChangeText: text => {
                    const temp = formatInputNumber(text);
                    if (temp !== null) {
                      setMinCost(temp);
                    }
                  },
                  keyboardType: 'numeric',
                }}
              />
            </View>

            <StyleText
              originValue="~"
              customStyle={[$divider, {marginTop: 20}]}
            />

            <View style={$inputBox}>
              <TitleAndInput
                title="discovery.maxCost"
                textInputProps={{
                  placeholder: '200,000 vnd',
                  value: formatLocaleNumber(maxCost),
                  onChangeText: text => {
                    const temp = formatInputNumber(text);
                    if (temp !== null) {
                      setMaxCost(temp);
                    }
                  },
                  keyboardType: 'numeric',
                }}
              />
            </View>
          </View>
        )}

        <TickBox
          title="discovery.chooseTopic"
          listOptions={LIST_TOPICS.map(item => ({
            id: item.id,
            text: item.text,
          }))}
          listChosen={LIST_TOPICS.filter(item => {
            return services.includes(item.id);
          })}
          onPressOption={option => {
            if (services.includes(option.id as number)) {
              if (services.length === 1) {
                return;
              }
              impactLight();
              setServices(pre => pre.filter(id => id !== option.id));
            } else {
              impactLight();
              setServices(pre => pre.concat([option.id as number]));
            }
          }}
          containerStyle={$element}
          layOut="grid"
          mandatory
          pick="check-box"
        />

        <Title title="profile.description" mandatory={false} style={$element} />
        <StyleTouchable
          customStyle={[$description, {borderColor: theme.gray_300}]}
          activeOpacity={1}
          onPress={() => inputDescriptionRef.current?.focus()}>
          <AppInput
            ref={inputDescriptionRef}
            style={$inputDescription}
            multiline
            placeholder={t('profile.locationDescription')}
            onChangeText={text => setDescription(text)}
            defaultValue={description}
          />
        </StyleTouchable>

        <StyleTouchable
          customStyle={[$bankBox, {backgroundColor: theme.background}]}
          onPress={() =>
            ModalActionSheet.show({
              options: [
                {
                  title: 'common.edit',
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
      </StyleContainer>
    </>
  );
};

const EditProfile = () => {
  const {account_type} = useAppSelector(
    state => state.accountSlice.passport.profile,
  );

  if (account_type === ACCOUNT.user || account_type === ACCOUNT.shareTour) {
    return <EditProfileUser />;
  }

  return <EditProfileSupplier />;
};

const imageWidth = Metrics.width - scale(32);
const $imageView: ViewStyle = {
  width: imageWidth,
  height: imageWidth * ratioAvatar + verticalScale(16),
  marginTop: verticalMargin,
  paddingBottom: verticalScale(16),
  borderRadius: BORDER_RADIUS.f2,
};
const $image: ImageStyle = {
  width: '100%',
  height: '100%',
  borderRadius: BORDER_RADIUS.f2,
};
const $buttonCamera: ViewStyle = {
  position: 'absolute',
  bottom: 0,
  right: scale(20),
  width: moderateScale(44),
  height: moderateScale(44),
  borderRadius: 50,
  alignItems: 'center',
  justifyContent: 'center',
};
const $inputDescription: ViewStyle = {
  width: '100%',
  paddingTop: verticalScale(8),
  paddingBottom: verticalScale(8),
  paddingHorizontal: scale(12),
  minHeight: verticalScale(100),
  maxHeight: verticalScale(200),
};
const $bankBox: ViewStyle = {
  width: '100%',
  paddingVertical: verticalScale(12),
  paddingHorizontal: scale(12),
  marginTop: verticalMargin,
  borderRadius: BORDER_RADIUS.f3,
};
const $textBank: TextStyle = {
  fontWeight: 'bold',
};
const $element: ViewStyle = {
  marginTop: verticalMargin,
};
const $description: ViewStyle = {
  width: '100%',
  height: moderateScale(150),
  borderRadius: BORDER_RADIUS.f3,
  borderWidth: moderateScale(1),
  marginTop: verticalScale(8),
};
const $bottom: ViewStyle = {
  width: '100%',
  paddingTop: verticalMargin,
};
const $inputPrice: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  marginTop: verticalScale(8),
};
const $inputBox: ViewStyle = {
  flex: 1,
};
const $businessTime: ViewStyle = {
  width: '100%',
  height: moderateScale(45),
  flexDirection: 'row',
  marginTop: verticalScale(8),
};
const $businessTimeBox: ViewStyle = {
  flex: 1,
  borderWidth: moderateScale(1),
  borderRadius: BORDER_RADIUS.f3,
  justifyContent: 'center',
  paddingHorizontal: scale(12),
};
const $divider: TextStyle = {
  fontSize: FONT_SIZE.f1,
  marginHorizontal: scale(8),
  alignSelf: 'center',
};

export default EditProfile;
