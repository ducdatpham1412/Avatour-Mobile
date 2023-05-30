import {apiChangeInformation} from 'api/setting';
import {GENDER_TYPE} from 'asset/enum';
import {safePaddingNotZero} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {
  SafeView,
  StyleButton,
  StyleContainer,
  StyleText,
  StyleTouchable,
} from 'components/base';
import InputBox from 'components/common/InputBox';
import {useLoading} from 'hook';
import {AppParamsList, LOGIN_ROUTE} from 'navigation/config';
import {ModalAlert, ModalDatePicker} from 'navigation/screen/modals';
import React, {useRef, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import {I18Normalize} from 'utility/I18Next';
import {isIOS} from 'utility/assistant';
import AsyncStore from 'utility/asyncStore';
import {formatDateDayMonthYear, formatUTCDate} from 'utility/format';
import AuthenticateService from 'utility/login/loginService';
import GenderSwipe from '../components/GenderSwipe';

export const scrollItemHeight = verticalScale(200);
const defaultDate = new Date(2000, 0, 1);

const EditBasicInformation = ({
  route,
}: RouteParams<AppParamsList[LOGIN_ROUTE.editBasicInformation]>) => {
  const {isLoginSocial = false, itemLoginSuccess} = route?.params ?? {};
  const scrollPickerRef = useRef<ScrollView>(null);

  const {loading, setLoading} = useLoading();

  const [gender, setGender] = useState(GENDER_TYPE.woman);
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);
  const [index, setIndex] = useState(0);

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

  const onPressButton = () => {
    if (index < 2) {
      scrollPickerRef.current?.scrollTo({
        y: scrollItemHeight * (index + 1),
        animated: true,
      });
    } else if (birthday && name) {
      const onEditProfileAndGo = async (isKeep: boolean) => {
        try {
          setLoading(true);
          const updateObject = {
            gender,
            name,
            birthday: formatUTCDate(birthday),
          };
          await apiChangeInformation(updateObject);
          await AsyncStore.updateActiveUser(itemLoginSuccess);
          await AuthenticateService.loginSuccess({
            itemLoginSuccess,
            isKeepSign: isKeep,
            isLoginSocial,
          });
        } catch (err) {
          ModalAlert.error({
            content: err,
          });
        } finally {
          setLoading(false);
        }
      };

      if (isLoginSocial) {
        onEditProfileAndGo(true);
      } else {
        ModalAlert.options({
          i18Content: 'alert.wantToSave',
          onContinue: () => onEditProfileAndGo(true),
          onCancel: () => onEditProfileAndGo(false),
        });
      }
    }
  };

  return (
    <SafeView>
      <StyleText
        i18Text="login.detailInformation.title"
        customStyle={styles.titleText}
      />
      <StyleContainer containerStyle={styles.pickerPart} extraHeight={50}>
        <View style={styles.pickerView}>
          <ScrollView
            ref={scrollPickerRef}
            snapToInterval={scrollItemHeight}
            pagingEnabled
            indicatorStyle="white"
            showsVerticalScrollIndicator={false}
            onMomentumScrollEnd={e => {
              const offSet = e.nativeEvent.contentOffset.y;
              setIndex(Math.round(offSet / scrollItemHeight));
            }}
            decelerationRate={isIOS ? 0 : 0.8}
            scrollEventThrottle={40}>
            <GenderSwipe gender={gender} setGender={setGender} />

            <View style={styles.pickerBox}>
              <StyleText i18Text="login.detailInformation.enterYourName" />
              <InputBox
                value={name}
                onChangeText={text => setName(text)}
                style={{marginTop: verticalScale(30)}}
                i18Placeholder="profile.edit.name"
                onSubmitEditing={onPressButton}
                selectionColor={Theme.darkTheme.textHightLight}
              />
            </View>

            <View style={styles.pickerBox}>
              <StyleTouchable
                hitSlop={20}
                onPress={() => {
                  ModalDatePicker.show({
                    date: String(birthday ?? defaultDate),
                    onChangeRange(value) {
                      setBirthday(value.date);
                    },
                  });
                }}>
                <StyleText
                  i18Text={textBirthday as I18Normalize}
                  customStyle={
                    birthday ? styles.textBirthday : styles.textChooseBirthday
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
          isLoading={loading}
        />
      </StyleContainer>
    </SafeView>
  );
};

const styles = ScaledSheet.create({
  titleText: {
    fontSize: FONT_SIZE.f1,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: safePaddingNotZero,
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
  nameText: {
    color: Theme.common.white,
  },
  textChooseBirthday: {
    textDecorationLine: 'underline',
  },
  textBirthday: {
    fontSize: '40@ms',
    fontWeight: 'bold',
  },
});

export default EditBasicInformation;
