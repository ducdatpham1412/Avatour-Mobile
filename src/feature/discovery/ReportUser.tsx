import {apiReportUser} from 'api/module';
import {REPORT_REASONS} from 'asset/standardValue';
import {
    StyleButton,
    StyleContainer,
    StyleInput,
    StyleText,
    StyleTouchable,
} from 'components/base';
import RowPickImages from 'components/common/RowPickImages';
import LoadingScreen from 'components/LoadingScreen';
import ViewSafeTopPadding from 'components/ViewSafeTopPadding';
import Redux from 'hook/useRedux';
import StyleHeader from 'navigation/components/StyleHeader';
import {appAlert, goBack, popUpPicker} from 'navigation/NavigationService';
import React, {useCallback, useRef, useState} from 'react';
import {TextInput, View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {I18Normalize} from 'utility/I18Next';
import ImageUploader from 'utility/ImageUploader';

interface Props {
    route: {
        params: {
            idUser: number;
            nameUser?: string;
        };
    };
}

const ReportUser = ({route}: Props) => {
    const {idUser, nameUser = ''} = route.params;

    const theme = Redux.getTheme();
    const isLoading = Redux.getIsLoading();
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
                        customStyle={[
                            styles.textReport,
                            {color: theme.textColor},
                        ]}
                    />
                </View>
            ),
            itemHeight: verticalScale(50),
            onSetItemSelected: (item: any) => {
                setReasonReport(item);
            },
            initIndex:
                REPORT_REASONS.findIndex(
                    item => item.name === reasonReport?.name,
                ) || 0,
        });
    }, [reasonReport]);

    const onSubmitReport = async () => {
        if (reasonReport) {
            try {
                Redux.setIsLoading(true);

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

                appAlert('discovery.report.reportHadSent', {
                    actionClickOk: () => {
                        goBack();
                        goBack();
                    },
                });
            } catch (err) {
                appAlert(err);
            } finally {
                Redux.setIsLoading(false);
            }
        }
    };

    return (
        <>
            <ViewSafeTopPadding />
            <StyleHeader
                title={
                    nameUser
                        ? 'discovery.report.reportPerson'
                        : 'discovery.report.title'
                }
                titleParams={{
                    name: nameUser,
                }}
            />
            <StyleContainer customStyle={styles.body} scrollEnabled>
                {/* Pick one reason */}
                <StyleText
                    i18Text="discovery.report.chooseReason"
                    customStyle={[
                        styles.titleChooseReason,
                        {color: theme.textColor},
                    ]}
                />
                <View style={styles.chooseReasonView}>
                    <View
                        style={[
                            styles.textReasonBox,
                            {borderColor: theme.borderColor},
                        ]}>
                        <StyleText
                            i18Text={reasonReport?.name || 'common.null'}
                            customStyle={[
                                styles.textReason,
                                {color: theme.textColor},
                            ]}
                            numberOfLines={1}
                        />
                    </View>
                    <StyleTouchable
                        customStyle={[
                            styles.buttonOpenPicker,
                            {borderColor: theme.borderColor},
                        ]}
                        onPress={onNavigateToPicker}>
                        <FontAwesome5
                            name="chevron-down"
                            style={[
                                styles.iconPickerDown,
                                {color: theme.textColor},
                            ]}
                        />
                    </StyleTouchable>
                </View>

                {/* Description */}
                <StyleText
                    i18Text="discovery.report.detailDescription"
                    customStyle={[
                        styles.titleChooseReason,
                        {color: theme.textColor},
                    ]}
                />
                <StyleTouchable
                    customStyle={[
                        styles.detailDescriptionView,
                        {borderColor: theme.borderColor},
                    ]}
                    activeOpacity={1}
                    onPress={() => inputDescriptionRef.current?.focus()}>
                    <StyleInput
                        ref={inputDescriptionRef}
                        multiline
                        hasUnderLine={false}
                        containerStyle={{width: '100%'}}
                        placeholder="Aa"
                        maxLength={200}
                        onChangeText={(text: string) => setDescription(text)}
                        isEffectTabBar={false}
                        inputStyle={styles.inputDescription}
                    />
                </StyleTouchable>

                {/* Upload image */}
                <StyleText
                    i18Text="discovery.report.uploadImage"
                    customStyle={[
                        styles.titleChooseReason,
                        {color: theme.textColor},
                    ]}
                />
                <RowPickImages
                    numberImages={3}
                    listImages={images}
                    setListImages={setImages}
                    containerStyle={styles.uploadImageView}
                />

                {/* Button */}
                <StyleButton
                    title="discovery.report.sendReport"
                    containerStyle={styles.buttonSendReport}
                    disable={!reasonReport}
                    onPress={onSubmitReport}
                />

                {isLoading && <LoadingScreen />}
            </StyleContainer>
        </>
    );
};

const styles = ScaledSheet.create({
    body: {
        paddingHorizontal: '15@s',
    },
    // pick reason
    titleChooseReason: {
        fontSize: '13@ms',
        marginTop: '30@vs',
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
    // upload image
    uploadImageView: {
        marginTop: '10@vs',
    },
    // button
    buttonSendReport: {
        marginTop: '40@vs',
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
    inputDescription: {
        fontSize: '14@ms',
    },
});

export default ReportUser;
