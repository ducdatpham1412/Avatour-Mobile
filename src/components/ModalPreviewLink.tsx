import {TypeBubblePalace} from 'api/interface';
import {FONT_SIZE} from 'asset/standardValue';
import Theme, {TypeTheme} from 'asset/theme/Theme';
import React, {Component} from 'react';
import {Linking, Platform, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {ScaledSheet} from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {I18Normalize} from 'utility/I18Next';
import {logger, onGoToProfile} from 'utility/assistant';
import {validateIsLink} from 'utility/validate';
import {StyleIcon, StyleText, StyleTouchable} from './base';
import StyleWebView from './base/StyleWebView';
import ButtonX from './common/ButtonX';

interface Props {
    theme: TypeTheme;
}

interface States {
    link: string;
    userReviewed:
        | {
              id: number;
              name: string;
              avatar: string;
              description: string;
              location: string;
          }
        | undefined;
}

export default class ModalPreviewLink extends Component<Props, States> {
    modalRef = React.createRef<Modalize>();

    state: States = {
        link: '',
        userReviewed: undefined,
    };

    show(item: TypeBubblePalace) {
        this.setState({
            link: item.link || '',
            userReviewed: item.userReviewed,
        });
        this.modalRef.current?.open();
    }

    private async onPressButton() {
        if (this.state.userReviewed) {
            this.modalRef.current?.close();
            onGoToProfile(this.state.userReviewed.id);
        } else if (this.state.link) {
            try {
                await Linking.openURL(this.state.link);
                this.modalRef.current?.close();
            } catch (err) {
                logger(err);
            }
        }
    }

    render() {
        const {theme} = this.props;
        const {link, userReviewed} = this.state;
        const textButton: I18Normalize = userReviewed
            ? 'discovery.goToProfile'
            : 'discovery.openLink';

        const Content = () => {
            if (userReviewed) {
                return (
                    <View style={styles.informationView}>
                        <StyleIcon
                            source={{uri: userReviewed.avatar}}
                            size={50}
                            customStyle={styles.avatar}
                        />
                        <View style={styles.infoBox}>
                            <StyleText
                                originValue={userReviewed.name}
                                customStyle={[
                                    styles.textName,
                                    {color: theme.textHightLight},
                                ]}
                                numberOfLines={1}
                            />
                            <StyleText
                                originValue={userReviewed.description}
                                customStyle={[
                                    styles.textDescription,
                                    {color: theme.textColor},
                                ]}
                                numberOfLines={2}
                            />
                            <View style={styles.locationTouch}>
                                <Ionicons
                                    name="ios-location-sharp"
                                    style={[
                                        styles.iconLocation,
                                        {color: Theme.common.commentGreen},
                                    ]}
                                />
                                <StyleText
                                    originValue={'Ha noi, Viet nam'}
                                    customStyle={[
                                        styles.textLocation,
                                        {color: theme.highlightColor},
                                    ]}
                                    numberOfLines={2}
                                />
                            </View>
                        </View>
                    </View>
                );
            }

            if (link) {
                const isLinkValid = validateIsLink(link);
                return (
                    <>
                        <View style={styles.textLinkView}>
                            <StyleText
                                originValue={link}
                                customStyle={[
                                    styles.textLink,
                                    {color: theme.borderColor},
                                ]}
                                numberOfLines={1}
                            />
                        </View>
                        <View
                            style={[
                                styles.webView,
                                isLinkValid
                                    ? {}
                                    : {
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                      },
                            ]}>
                            {isLinkValid ? (
                                <StyleWebView source={{uri: link}} />
                            ) : (
                                <StyleText
                                    i18Text="alert.invalidLink"
                                    customStyle={[styles.textInvalid]}
                                />
                            )}
                        </View>
                    </>
                );
            }

            return null;
        };

        return (
            <Modalize
                ref={this.modalRef}
                modalStyle={styles.modal}
                withHandle={false}>
                <View
                    style={[
                        styles.container,
                        {backgroundColor: theme.backgroundColor},
                    ]}>
                    <ButtonX
                        containerStyle={styles.buttonClose}
                        onPress={() => {
                            this.modalRef.current?.close();
                        }}
                    />

                    {Content()}

                    <StyleTouchable
                        customStyle={[
                            styles.buttonView,
                            {backgroundColor: theme.backgroundButtonColor},
                        ]}
                        onPress={() => this.onPressButton()}>
                        <StyleText
                            i18Text={textButton}
                            customStyle={[
                                styles.textButton,
                                {color: theme.textHightLight},
                            ]}
                        />
                        <Feather
                            name="corner-up-right"
                            style={[
                                styles.iconRight,
                                {color: theme.textHightLight},
                            ]}
                        />
                    </StyleTouchable>
                </View>
            </Modalize>
        );
    }
}

const styles = ScaledSheet.create({
    modal: {
        backgroundColor: 'transparent',
    },
    container: {
        width: '90%',
        paddingTop: '10@vs',
        paddingBottom: '20@vs',
        marginTop: '100@vs',
        alignSelf: 'center',
        borderRadius: '7@ms',
        alignItems: 'center',
        paddingHorizontal: '10@s',
    },
    buttonClose: {
        position: 'absolute',
        top: '7@s',
        right: '7@s',
    },
    informationView: {
        width: '100%',
        marginTop: '20@vs',
        flexDirection: 'row',
    },
    avatar: {
        borderRadius: '30@ms',
    },
    infoBox: {
        flex: 1,
        paddingLeft: '10@s',
    },
    textName: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
    },
    textDescription: {
        fontSize: FONT_SIZE.small,
        marginTop: '7@vs',
    },
    locationTouch: {
        marginTop: '7@vs',
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconLocation: {
        fontSize: '17@ms',
    },
    textLocation: {
        fontSize: FONT_SIZE.small,
        marginLeft: '5@s',
    },
    buttonView: {
        borderWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        flexDirection: 'row',
        paddingHorizontal: '30@s',
        paddingVertical: '5@vs',
        marginTop: '20@vs',
        alignItems: 'center',
        borderRadius: '5@ms',
    },
    textButton: {
        fontSize: FONT_SIZE.small,
        fontWeight: 'bold',
    },
    iconRight: {
        fontSize: '15@ms',
        marginLeft: '10@s',
    },
    textLinkView: {
        width: '80%',
        height: '20@vs',
        alignSelf: 'flex-start',
    },
    textLink: {
        fontSize: FONT_SIZE.small,
    },
    webView: {
        width: '100%',
        height: '130@vs',
        borderRadius: '5@ms',
        overflow: 'hidden',
    },
    textInvalid: {
        fontSize: FONT_SIZE.small,
        color: Theme.common.red,
    },
});
