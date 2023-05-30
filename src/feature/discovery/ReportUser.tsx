import {apiReportUser} from 'api/discovery';
import {safePaddingNotZero} from 'asset/metrics';
import {REPORT_REASONS} from 'asset/standardValue';
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
import {goBack, popUpPicker} from 'navigation/NavigationService';
import {ModalAlert} from 'navigation/screen/modals';
import React, {useCallback, useRef, useState} from 'react';
import {TextInput, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {I18Normalize} from 'utility/I18Next';
import ImageUploader from 'utility/ImageUploader';
import {scale} from 'utility/scale';

interface Props {
  route: {
    params: AppParamsList[ROOT_SCREEN.reportUser];
  };
}

const ReportUser = ({
  route: {
    params: {idUser, nameUser},
  },
}: Props) => {
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();
  const inputDescriptionRef = useRef<TextInput>(null);

  const [reasonReport, setReasonReport] = useState<{
    id: number;
    name: I18Normalize;
  }>();
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);

  const onNavigateToPicker = useCallback(() => {
    popUpPicker({
      data: REPORT_REASONS,
      renderItem: (item: any) => (
        <View style={styles.elementPicker}>
          <StyleText
            i18Text={item.name}
            customStyle={[styles.textReport, {color: theme.textColor}]}
          />
        </View>
      ),
      itemHeight: verticalScale(50),
      onSetItemSelected: (item: any) => {
        setReasonReport(item);
      },
      initIndex:
        REPORT_REASONS.findIndex(item => item.name === reasonReport?.name) || 0,
    });
  }, [reasonReport]);

  const onSubmitReport = async () => {
    if (reasonReport) {
      try {
        let nameImages: Array<string> = [];
        if (images.length) {
          nameImages = await ImageUploader.upLoadManyImg(images);
        }
        await apiReportUser({
          userId: idUser,
          body: {
            reason: reasonReport.id,
            description,
            listImages: nameImages,
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
          containerStyle={{marginBottom: bottom || safePaddingNotZero}}
        />
      }>
      <StyleText
        i18Text="discovery.report.chooseReason"
        customStyle={styles.titleChooseReason}
      />
      <View style={styles.chooseReasonView}>
        <View style={[styles.textReasonBox, {borderColor: theme.gray_400}]}>
          <StyleText
            i18Text={reasonReport?.name || 'common.null'}
            numberOfLines={1}
          />
        </View>
        <StyleTouchable
          customStyle={[styles.buttonOpenPicker, {borderColor: theme.gray_400}]}
          onPress={onNavigateToPicker}>
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
    marginTop: '20@vs',
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
