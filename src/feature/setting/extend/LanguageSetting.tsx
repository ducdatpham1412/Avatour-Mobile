import {apiChangeLanguage} from 'api/module';
import {LANGUAGE_TYPE} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {StyleImage} from 'components/base';
import Redux from 'hook/useRedux';
import {appAlert} from 'navigation/NavigationService';
import React, {useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {chooseLanguageFromId} from 'utility/assistant';
import FindmeAsyncStorage from 'utility/FindmeAsyncStorage';
import I18Next from 'utility/I18Next';

const LanguageSetting = () => {
    const theme = Redux.getTheme();
    const language = Redux.getPassport().setting?.language;
    const isModeExp = Redux.getModeExp();

    const [isPicked, setIsPicked] = useState(language);
    const selectBorderColor = (lan: number) =>
        isPicked === lan ? theme.highlightColor : theme.holderColor;

    const switchLanguage = async (newLanguage: number) => {
        try {
            if (!isModeExp) {
                apiChangeLanguage(newLanguage);
            }
            I18Next.changeLanguage(chooseLanguageFromId(newLanguage));
            Redux.updatePassport({setting: {language: newLanguage}});
            setIsPicked(newLanguage);
            await FindmeAsyncStorage.editLanguageModeExp(
                chooseLanguageFromId(newLanguage),
            );
            appAlert('alert.successChange');
        } catch (err) {
            appAlert(err);
        }
    };

    return (
        <View style={styles.container}>
            {/* ENGLISH */}
            <TouchableOpacity
                style={[
                    styles.themeBox,
                    {borderColor: selectBorderColor(LANGUAGE_TYPE.en)},
                ]}
                onPress={() => switchLanguage(LANGUAGE_TYPE.en)}>
                <StyleImage
                    source={Images.images.english}
                    customStyle={styles.themeImage}
                />
            </TouchableOpacity>

            {/* VIETNAMESE */}
            <TouchableOpacity
                style={[
                    styles.themeBox,
                    {borderColor: selectBorderColor(LANGUAGE_TYPE.vi)},
                ]}
                onPress={() => switchLanguage(LANGUAGE_TYPE.vi)}>
                <StyleImage
                    source={Images.images.vietnamese}
                    customStyle={styles.themeImage}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '80%',
        paddingVertical: '20@vs',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
    },
    themeBox: {
        width: Metrics.width / 4,
        height: Metrics.width / 4,
        borderWidth: '5@vs',
        borderRadius: '20@vs',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    themeImage: {
        width: '100%',
        height: '100%',
    },
});

export default LanguageSetting;
