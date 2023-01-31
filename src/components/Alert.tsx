import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import Redux from 'hook/useRedux';
import {goBack} from 'navigation/NavigationService';
import React, {useEffect, useRef} from 'react';
import {Animated, TouchableOpacity, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {I18Normalize} from 'utility/I18Next';
import {StyleIcon, StyleText} from './base';

interface Props {
    route: {
        params: {
            notice: I18Normalize;
            actionClickOk?(): void;
            moreNotice?: I18Normalize;
            moreAction?(): void;
        };
    };
}

const Alert = ({route}: Props) => {
    const {notice, actionClickOk, moreNotice, moreAction} = route.params;
    const theme = Redux.getTheme();

    const scale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(scale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <>
            <Animated.View
                style={[
                    styles.notificationBox,
                    {
                        backgroundColor: theme.backgroundButtonColor,
                        transform: [{scaleY: scale}],
                    },
                ]}>
                {/* Header */}
                <View style={styles.header}>
                    <StyleIcon
                        source={Images.icons.alert}
                        size={30}
                        customStyle={{tintColor: theme.borderColor}}
                    />
                    <StyleText
                        originValue="Alert"
                        customStyle={[
                            styles.headerText,
                            {color: theme.borderColor},
                        ]}
                    />
                </View>

                {/* Notification */}
                <View style={styles.notice}>
                    <StyleText
                        i18Text={notice}
                        customStyle={[
                            styles.contentText,
                            {color: theme.textColor},
                        ]}
                    />
                </View>

                {/* Button ok and more */}
                <View style={styles.buttonBox}>
                    <TouchableOpacity
                        style={[
                            styles.buttonElement,
                            {
                                backgroundColor: theme.borderColor,
                                opacity: moreNotice ? 0.7 : 1,
                            },
                        ]}
                        onPress={actionClickOk || goBack}>
                        <StyleText
                            originValue="Ok"
                            customStyle={styles.textButtonElement}
                        />
                    </TouchableOpacity>

                    {!!moreNotice && (
                        <TouchableOpacity
                            style={[
                                styles.buttonElement,
                                {backgroundColor: theme.borderColor},
                            ]}
                            onPress={moreAction}>
                            <StyleText
                                i18Text={moreNotice}
                                customStyle={styles.textButtonElement}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </Animated.View>
        </>
    );
};

const styles = ScaledSheet.create({
    notificationBox: {
        width: Metrics.width * 0.8,
        borderRadius: '30@s',
        paddingHorizontal: '20@s',
        marginTop: Metrics.width / 2,
        alignSelf: 'center',
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: '10@vs',
    },
    headerText: {
        fontSize: FONT_SIZE.big,
        fontWeight: 'bold',
        marginLeft: '8@s',
    },
    notice: {
        width: '100%',
        alignItems: 'center',
    },
    contentText: {
        fontSize: FONT_SIZE.normal,
        fontStyle: 'italic',
    },
    buttonBox: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: '20@vs',
    },
    buttonElement: {
        paddingVertical: '5@vs',
        paddingHorizontal: '20@s',
        borderRadius: '15@s',
    },
    textButtonElement: {
        fontSize: FONT_SIZE.normal,
        color: 'white',
    },
});

export default Alert;
