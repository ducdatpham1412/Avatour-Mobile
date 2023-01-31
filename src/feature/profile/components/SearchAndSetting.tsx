import {LANDING_PAGE_URL} from 'asset/standardValue';
import {StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import HeaderLeftIcon from 'navigation/components/HeaderLeftIcon';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {goBack, navigate} from 'navigation/NavigationService';
import React from 'react';
import {View} from 'react-native';
import {moderateScale, scale, ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

interface Props {
    onShowOptions(): void;
    hasGuideButton?: boolean;
    hasBackBtn?: boolean;
    hasSettingBtn?: boolean;
    onGoBack?(): void;
}

const SearchAndSetting = (props: Props) => {
    const {
        onShowOptions,
        hasGuideButton = false,
        hasBackBtn = true,
        hasSettingBtn = true,
        onGoBack,
    } = props;
    const theme = Redux.getTheme();

    const onGoToUserGuide = () => {
        navigate(ROOT_SCREEN.webView, {
            title: 'setting.component.typeMainSetting.aboutFindme',
            linkWeb: LANDING_PAGE_URL,
        });
    };

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            {hasBackBtn && <HeaderLeftIcon onPress={onGoBack || goBack} />}

            <View style={styles.leftBtnView}>
                {hasGuideButton && (
                    <StyleTouchable
                        customStyle={[
                            styles.buttonBox,
                            {backgroundColor: theme.backgroundButtonColor},
                        ]}
                        onPress={onGoToUserGuide}>
                        <SimpleLineIcons
                            name="book-open"
                            style={[
                                styles.iconSetting,
                                {color: theme.textColor},
                            ]}
                        />
                    </StyleTouchable>
                )}
            </View>

            <View style={styles.rightBtnView}>
                <StyleTouchable
                    customStyle={[
                        styles.buttonBox,
                        {
                            backgroundColor: theme.backgroundButtonColor,
                            marginRight: scale(10),
                        },
                    ]}
                    onPress={onShowOptions}>
                    <AntDesign
                        name="bars"
                        style={[styles.iconSetting, {color: theme.textColor}]}
                    />
                </StyleTouchable>

                {hasSettingBtn && (
                    <StyleTouchable
                        customStyle={[
                            styles.buttonBox,
                            {backgroundColor: theme.backgroundButtonColor},
                        ]}
                        onPress={() => navigate(PROFILE_ROUTE.settingRoute)}>
                        <AntDesign
                            name="setting"
                            style={[
                                styles.iconSetting,
                                {color: theme.textColor},
                            ]}
                        />
                    </StyleTouchable>
                )}
            </View>
        </View>
    );
};

export const searchSettingHeight = moderateScale(40);
const styles = ScaledSheet.create({
    container: {
        width: '100%',
        height: searchSettingHeight,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '20@s',
    },
    leftBtnView: {
        flexDirection: 'row',
    },
    rightBtnView: {
        flexDirection: 'row',
    },
    iconSetting: {
        fontSize: '15@ms',
    },
    buttonBox: {
        width: '30@ms',
        height: '30@ms',
        borderRadius: '15@ms',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SearchAndSetting;
