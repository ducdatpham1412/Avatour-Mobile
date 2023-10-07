import {apiReportUser} from 'api/discovery';
import {safePaddingNotZero} from 'asset/metrics';
import {
  FONT_SIZE,
  FONT_WEIGHT_MEDIUM,
  REPORT_REASONS,
} from 'asset/standardValue';
import {
  AppInput,
  StyleButton,
  StyleContainer,
  StyleText,
  StyleTouchable,
} from 'components/base';
import RowPickImages from 'components/common/RowPickImages';
import {useTheme} from 'hook';
import {AppParamsList} from 'navigation/config';
import ROOT_SCREEN from 'navigation/config/routes';
import {goBack} from 'navigation/NavigationService';
import {checkAuthenticated} from 'navigation/screen/AppModal';
import {ModalActionSheet, ModalAlert} from 'navigation/screen/modals';
import React, {useRef, useState} from 'react';
import {TextInput, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScaledSheet} from 'react-native-size-matters';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {scale} from 'utility/scale';

interface Props {
  route: {
    params: AppParamsList[ROOT_SCREEN.reportUser];
  };
}

// TODO: Fix this screen: 1. Fix ts error | 2. Fix api upload images
const ReportUser = ({
  route: {
    params: {idUser, nameUser},
  },
}: Props) => {
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();
  const inputDescriptionRef = useRef<TextInput>(null);

  const [reasonReport, setReasonReport] =
    useState<(typeof REPORT_REASONS)[number]>();
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);

  const onSubmitReport = () => {
    if (reasonReport) {
      checkAuthenticated({
        onAuthenticated: async () => {
          try {
            await apiReportUser({
              userId: idUser,
              body: {
                reason: reasonReport.id,
                description,
                listImages: [],
              },
            });

            ModalAlert.notification({
              i18Content: 'discovery.report.reportHadSent',
              onClose: goBack,
            });
          } catch (err) {
            ModalAlert.error({
              content: err,
            });
          }
        },
      });
    }
  };

  return (
    <StyleContainer
      headerProps={{
        title: nameUser
          ? 'discovery.report.reportPerson'
          : 'discovery.report.title',
        titleParams: {
          name: nameUser,
        },
      }}
      BottomComponent={
        <StyleButton
          title="discovery.report.sendReport"
          disable={!reasonReport}
          onPress={onSubmitReport}
          containerStyle={{
            marginBottom: bottom || safePaddingNotZero,
            width: '90%',
          }}
        />
      }>
      <StyleText customStyle={styles.titleChooseReason}>
        <StyleText
          originValue="※ "
          customStyle={[styles.titleChooseReason, {color: theme.red}]}
        />
        <StyleText
          i18Text="discovery.report.chooseReason"
          customStyle={styles.titleChooseReason}
        />
      </StyleText>
      <View style={styles.chooseReasonView}>
        <View style={[styles.textReasonBox, {borderColor: theme.gray_400}]}>
          <StyleText
            i18Text={reasonReport?.name || 'common.null'}
            numberOfLines={1}
          />
        </View>
        <StyleTouchable
          customStyle={[styles.buttonOpenPicker, {borderColor: theme.gray_400}]}
          onPress={() => {
            ModalActionSheet.show({
              options: REPORT_REASONS.map(item => {
                return {
                  title: item.name,
                  onPress: () => setReasonReport(item),
                };
              }),
              fontSize: FONT_SIZE.f2,
            });
          }}>
          <FontAwesome5
            name="chevron-down"
            style={[styles.iconPickerDown, {color: theme.black}]}
          />
        </StyleTouchable>
      </View>

      {/* Description */}
      <StyleText
        i18Text="discovery.report.detailDescription"
        customStyle={styles.titleChooseReason}
      />
      <StyleTouchable
        customStyle={[
          styles.detailDescriptionView,
          {borderColor: theme.gray_400},
        ]}
        activeOpacity={1}
        onPress={() => inputDescriptionRef.current?.focus()}>
        <AppInput
          ref={inputDescriptionRef}
          multiline
          style={styles.inputDescription}
          placeholder="Aa"
          maxLength={200}
          onChangeText={(text: string) => setDescription(text)}
        />
      </StyleTouchable>

      {/* Upload image */}
      <StyleText
        i18Text="discovery.report.uploadImage"
        customStyle={styles.titleChooseReason}
      />
      <RowPickImages
        numberImages={3}
        listImages={images}
        setListImages={setImages}
        containerStyle={styles.uploadImageView}
      />
    </StyleContainer>
  );
};

const styles = ScaledSheet.create({
  // pick reason
  titleChooseReason: {
    marginTop: '16@vs',
    fontWeight: FONT_WEIGHT_MEDIUM,
  },
  chooseReasonView: {
    width: '100%',
    height: '40@vs',
    marginTop: '10@vs',
    flexDirection: 'row',
  },
  textReasonBox: {
    flex: 1,
    borderWidth: '0.5@s',
    borderRadius: '7@vs',
    paddingHorizontal: '10@s',
    justifyContent: 'center',
  },
  textReason: {
    fontSize: '14@ms',
  },
  buttonOpenPicker: {
    width: '40@vs',
    height: '40@vs',
    borderWidth: '0.5@s',
    borderRadius: '7@vs',
    marginLeft: '5@s',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPickerDown: {
    fontSize: '14@ms',
  },
  // detail description
  detailDescriptionView: {
    width: '100%',
    height: '150@ms',
    borderWidth: '0.5@s',
    borderRadius: '7@vs',
    marginTop: '10@vs',
    paddingVertical: '5@vs',
  },
  inputDescription: {
    width: '100%',
    paddingHorizontal: scale(8),
  },
  // upload image
  uploadImageView: {
    marginTop: '10@vs',
  },
  // picker
  elementPicker: {
    width: '100%',
    height: '50@vs',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textReport: {
    fontSize: '14@ms',
    fontWeight: 'bold',
  },
});

export default ReportUser;
