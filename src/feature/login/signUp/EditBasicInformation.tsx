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
import ClassDateTimePicker from 'components/base/picker/ClassDateTimePicker';
import InputBox from 'components/common/InputBox';
import Redux from 'hook/useRedux';
import {AppParamsList, LOGIN_ROUTE} from 'navigation/config';
import {appAlert, appAlertYesNo, goBack} from 'navigation/NavigationService';
import React, {useRef, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import {isIOS} from 'utility/assistant';
import AsyncStore from 'utility/asyncStore';
import {formatDateDayMonthYear, formatUTCDate} from 'utility/format';
import {I18Normalize} from 'utility/I18Next';
import AuthenticateService from 'utility/login/loginService';
import GenderSwipe from '../components/GenderSwipe';

export const scrollItemHeight = verticalScale(140);
const defaultDate = new Date(2000, 0, 1);

const EditBasicInformation = ({
  route,
}: RouteParams<AppParamsList[LOGIN_ROUTE.editBasicInformation]>) => {
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
          await AsyncStore.updateActiveUser(itemLoginSuccess);
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
            pagingEnabled
            indicatorStyle="white"
            showsVerticalScrollIndicator={false}
            onMomentumScrollEnd={e => {
              const offSet = e.nativeEvent.contentOffset.y;
              setIndex(Math.round(offSet / scrollItemHeight));
            }}
            decelerationRate={isIOS ? 0 : 0.8}
            scrollEventThrottle={40}>
            {/* Gender */}
            <GenderSwipe gender={gender} setGender={setGender} />

            {/* Name */}
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

            {/* Birthday */}
            <View style={styles.pickerBox}>
              <StyleTouchable
                hitSlop={20}
                onPress={() => dateTimeRef.current?.show()}>
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
        />
      </StyleContainer>
    );
  };

  return (
    <SafeView>
      <StyleText
        i18Text="login.detailInformation.title"
        customStyle={styles.titleText}
      />
      {RenderPicker()}

      <ClassDateTimePicker
        ref={dateTimeRef}
        initDate={birthday || defaultDate}
        onChangeDateTime={value => setBirthday(value)}
        theme={Theme.lightTheme}
      />
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
