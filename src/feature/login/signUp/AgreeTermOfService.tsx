import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {StyleButton, StyleImage, StyleText} from 'components/base';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {TypeItemLoginSuccess} from 'utility/login/loginService';
import BackgroundAuthen from '../components/BackgroundAuthen';

interface Props {
    route: {
        params: {
            itemLoginSuccess: TypeItemLoginSuccess;
        };
    };
}

const AgreeTermOfService = ({route}: Props) => {
    const {itemLoginSuccess} = route.params;

    const onGoToEditInformation = async () => {
        navigate(LOGIN_ROUTE.editBasicInformation, {
            itemLoginSuccess,
        });
    };

    return (
        <View style={styles.container}>
            <BackgroundAuthen />
            <StyleImage
                source={Images.images.successful}
                customStyle={styles.imageSuccess}
            />
            <StyleText
                i18Text="login.agreeTermOfService.contentSuggest"
                customStyle={styles.contentSuggest}
            />

            <StyleButton
                title="login.agreeTermOfService.agreeTermOfService"
                onPress={onGoToEditInformation}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Theme.darkTheme.backgroundColor,
    },
    imageSuccess: {
        width: Metrics.width / 2,
        height: Metrics.width / 2,
    },
    contentSuggest: {
        marginVertical: '32@vs',
        color: Theme.common.white,
        fontSize: '15@ms',
        textAlign: 'center',
        paddingHorizontal: '40@s',
    },
});

export default AgreeTermOfService;
