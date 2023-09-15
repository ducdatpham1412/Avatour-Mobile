import {BORDER_RADIUS, FONT_SIZE, LIST_TOPICS, ratioAvatar} from 'asset';
import {TOPIC} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
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
import {useSafeArea, useTheme} from 'hook';
import {goBack} from 'navigation/NavigationService';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import {
  ModalActionSheet,
  ModalAlert,
  ModalTimePicker,
  TimeValue,
} from 'navigation/screen/modals';
import React, {Dispatch, SetStateAction, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ImageStyle,
  StyleProp,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
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
import {Title, TitleAndInput} from './components';
import {ParamsCreateLocation, useCreateLocation} from './hooks';
import {LoadingScreen} from './screens';
import {
  TypeBusinessTime,
  TypeLocationPrice,
  listOptionsBusinessTime,
  listOptionsPrice,
} from 'utility/staticData';
import isEqual from 'react-fast-compare';

const onShowOptionAvatar = (setAvatar: Dispatch<SetStateAction<string>>) => {
  ModalActionSheet.show({
    options: [
      {
        title: 'common.chooseFromCamera',
        onPress: async () => {
          try {
            setTimeout(async () => {
              const res = await ImageUploader.pickCamera({
                maxWidth: imageWidth,
                maxHeight: imageWidth * ratioAvatar,
              });
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
                maxWidth: imageWidth,
                maxHeight: imageWidth * ratioAvatar,
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

const CreateLocation = ({
  route: {
    params: {itemNew, itemEdit},
  },
}: RouteParams<AppParamsList[ROOT_SCREEN.createLocation]>) => {
  const theme = useTheme();
  const {t} = useTranslation();
  const {bottom} = useSafeArea();

  const initValue = useRef<ParamsCreateLocation>({
    id: itemEdit?.id,
    avatar: itemEdit?.avatar || '',
    name: itemEdit?.name || itemNew?.name || '',
    address: itemEdit?.location || '',
    duration: String(itemEdit?.duration || ''),
    typePrice:
      itemEdit?.min_cost !== 0 || itemEdit.max_cost !== 0 ? 'paid' : 'free',
    minCost: String(itemEdit?.min_cost ?? ''),
    maxCost: String(itemEdit?.max_cost ?? ''),
    typeBusinessTime:
      itemEdit?.start_time === 0 && itemEdit?.end_time === 0
        ? 'all-day'
        : 'limit',
    startTime: itemEdit?.start_time ?? 0,
    endTime: itemEdit?.end_time ?? 0,
    services: itemEdit?.services ?? [TOPIC.food, TOPIC.backpacking],
    description: itemEdit?.description ?? '',
  });
  const inputDescriptionRef = useRef<TextInput>(null);

  const [
    {
      avatar,
      name,
      duration,
      address,
      typePrice,
      services,
      loadingSave,
      minCost,
      maxCost,
      typeTime,
      startTime,
      endTime,
      description,
    },
    {
      setAvatar,
      setName,
      setDescription,
      setAddress,
      setDuration,
      setTypePrice,
      setServices,
      setMinCost,
      setMaxCost,
      setTypeTime,
      setStartTime,
      setEndTime,
      save,
    },
  ] = useCreateLocation(initValue.current);

  let disableButton = false;

  if (itemEdit) {
    disableButton =
      !avatar ||
      !name ||
      !address ||
      !(Number(duration) > 0) ||
      !services.length ||
      (avatar === initValue.current.avatar &&
        name === initValue.current.name &&
        address === initValue.current.address &&
        duration === initValue.current.duration &&
        isEqual(services, initValue.current.services) &&
        description === initValue.current.description);

    if (disableButton) {
      disableButton =
        typePrice === 'free'
          ? Number(initValue.current.minCost) === 0 &&
            Number(initValue.current.maxCost) === 0
          : Number(minCost) === Number(initValue.current.minCost) &&
            Number(maxCost) === Number(initValue.current.maxCost);
    }

    if (disableButton) {
      disableButton =
        typeTime === 'all-day'
          ? Number(initValue.current.startTime) === 0 &&
            Number(initValue.current?.endTime) === 0
          : startTime === Number(initValue.current.startTime) &&
            endTime === Number(initValue.current.endTime);
    }
  }

  const onSave = async () => {
    try {
      const res = await save();
      ModalAlert.success({
        i18Content:
          res === 'new-location'
            ? 'alert.createLocationSuccess'
            : 'alert.editLocationSuccess',
        onClose: goBack,
      });
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    }
  };

  return (
    <>
      <StyleContainer
        headerProps={{
          title: 'discovery.addLocation',
          onGoBack: () => {
            if (itemNew || !disableButton) {
              ModalAlert.options({
                i18Content: 'common.wantToDiscard',
                onContinue: goBack,
              });
            } else {
              goBack();
            }
          },
        }}
        backgroundColor={theme.white}
        customStyle={[$container, {paddingBottom: bottom}]}
        scrollEnabled
        BottomComponent={
          <View
            style={[
              $bottom,
              {
                shadowColor: theme.gray_500,
                paddingBottom: bottom,
                backgroundColor: theme.white,
              },
            ]}>
            <StyleButton
              containerStyle={$button}
              title={itemNew ? 'common.suggest' : 'common.edit'}
              disable={disableButton}
              onPress={onSave}
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
            defaultValue: initValue.current.name,
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
            defaultValue: initValue.current.address,
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
            <View style={{width: scale(16)}} />
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
            defaultValue={initValue.current.description}
          />
        </StyleTouchable>
      </StyleContainer>

      {loadingSave && <LoadingScreen />}
    </>
  );
};

const imageWidth = Metrics.width - scale(32);
const $container: ViewStyle = {
  paddingHorizontal: scale(16),
};
const $imageView: ViewStyle = {
  width: imageWidth,
  height: imageWidth * ratioAvatar + verticalScale(16),
  marginTop: verticalScale(16),
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
const $element: ViewStyle = {
  marginTop: verticalScale(16),
};
const $inputPrice: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  marginTop: verticalScale(8),
};
const $inputBox: ViewStyle = {
  flex: 1,
};
const $bottom: StyleProp<ViewStyle> = [
  {
    paddingTop: verticalScale(16),
  },
  $styleTopShadow,
];
const $button: ViewStyle = {
  width: '90%',
};
const $description: ViewStyle = {
  width: '100%',
  height: moderateScale(150),
  borderRadius: BORDER_RADIUS.f3,
  borderWidth: moderateScale(1),
  marginTop: verticalScale(8),
};
const $inputDescription: TextStyle = {
  width: '100%',
  paddingHorizontal: scale(12),
  paddingTop: verticalScale(12),
  paddingBottom: verticalScale(12),
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

export default CreateLocation;
