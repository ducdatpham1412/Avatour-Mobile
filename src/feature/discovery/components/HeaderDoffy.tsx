import {TypeGetProfileResponse} from 'api/interface';
import {SESSION} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import Theme, {TypeTheme} from 'asset/theme/Theme';
import {
    StyleIcon,
    StyleImage,
    StyleText,
    StyleTouchable,
} from 'components/base';
import ROOT_SCREEN from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React, {Component} from 'react';
import isEqual from 'react-fast-compare';
import {Animated, Platform, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {getSessionOfDay} from 'utility/format';
import {I18Normalize} from 'utility/I18Next';

interface Props {
    theme: TypeTheme;
    profile: TypeGetProfileResponse;
    numberNewMessages: number;
}

class HeaderDoffy extends Component<Props> {
    opacity = new Animated.Value(0);

    shouldComponentUpdate(nextProps: Props) {
        if (
            nextProps.theme.backgroundColor !== this.props.theme.backgroundColor
        ) {
            return true;
        }
        if (!isEqual(nextProps.profile, this.props.profile)) {
            return true;
        }
        if (nextProps.numberNewMessages !== this.props.numberNewMessages) {
            return true;
        }
        return false;
    }

    render() {
        const {theme, profile, numberNewMessages} = this.props;
        const session = getSessionOfDay();
        let textSession: I18Normalize = 'discovery.goodMorning';
        if (session === SESSION.afternoon) {
            textSession = 'discovery.goodAfternoon';
        } else if (session === SESSION.evening) {
            textSession = 'discovery.goodEvening';
        }

        return (
            <View style={styles.container}>
                <View style={styles.toolLeftView}>
                    <View style={styles.avatarBox}>
                        <StyleImage
                            source={{uri: profile.avatar}}
                            customStyle={styles.avatar}
                        />
                    </View>
                    <View>
                        <StyleText
                            i18Text={textSession}
                            customStyle={[
                                styles.textHello,
                                {color: Theme.common.gradientTabBar2},
                            ]}
                            numberOfLines={1}
                        />
                        <StyleText
                            originValue={profile.name}
                            customStyle={styles.doffyText}
                            numberOfLines={1}
                        />
                    </View>
                </View>

                <StyleTouchable
                    onPress={() => navigate(ROOT_SCREEN.chatRoute)}
                    hitSlop={{
                        right: 10,
                    }}
                    customStyle={styles.messageView}>
                    <StyleIcon
                        source={Images.icons.chat}
                        customStyle={[
                            styles.iconMessenger,
                            {tintColor: theme.textHightLight},
                        ]}
                        size={23}
                    />
                    {!!numberNewMessages && (
                        <View style={styles.newMessageBox}>
                            <StyleText
                                originValue={numberNewMessages}
                                customStyle={styles.textNewMessages}
                            />
                        </View>
                    )}
                </StyleTouchable>
            </View>
        );
    }
}

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        height: '40@vs',
        marginTop: Metrics.safeTopPadding,
        justifyContent: 'space-between',
    },
    body: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    imageBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
    },
    avatarBox: {
        width: '30@ms',
        height: '30@ms',
        borderRadius: '15@ms',
        marginRight: '10@s',
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    textHello: {
        fontSize: FONT_SIZE.small,
    },
    doffyText: {
        fontSize: FONT_SIZE.small,
        fontWeight: 'bold',
        color: Theme.common.gradientTabBar1,
    },
    toolLeftView: {
        flexDirection: 'row',
        maxWidth: '70%',
        alignItems: 'center',
        overflow: 'hidden',
        paddingLeft: '15@s',
    },
    messageView: {
        height: '100%',
        justifyContent: 'center',
        paddingLeft: '10@s',
        paddingRight: '15@s',
    },
    iconMessenger: {
        tintColor: Theme.common.gradientTabBar2,
    },
    newMessageBox: {
        position: 'absolute',
        width: '15@ms',
        height: '15@ms',
        borderRadius: '10@ms',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Theme.common.red,
        top: Platform.select({
            android: '3@ms',
            ios: '7@ms',
        }),
        right: '10@s',
    },
    textNewMessages: {
        fontSize: '8@ms',
        color: Theme.common.white,
    },
});

export default HeaderDoffy;
