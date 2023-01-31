import {FONT_SIZE} from 'asset/standardValue';
import {TypeTheme} from 'asset/theme/Theme';
import {StyleButton, StyleText} from 'components/base';
import ButtonX from 'components/common/ButtonX';
import React, {Component} from 'react';
import {Platform, TextInput, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import I18Next from 'utility/I18Next';
import {validateIsPhone} from 'utility/validate';

interface Props {
    phone: string;
    onChangePhone(value: string): void;
    theme: TypeTheme;
}

interface States {
    tempPhone: string;
}

let timeout: any;

const borderWidthError = Platform.select({
    ios: moderateScale(0.5),
    android: moderateScale(1),
});

class ModalChangePhone extends Component<Props, States> {
    modalRef = React.createRef<Modalize>();

    inputRef = React.createRef<TextInput>();

    state: States = {
        tempPhone: this.props.phone,
    };

    show() {
        this.modalRef.current?.open();
        timeout = setTimeout(() => {
            this.inputRef.current?.focus();
        }, 200);
        return () => clearTimeout(timeout);
    }

    private onConfirm = () => {
        this.props.onChangePhone(this.state.tempPhone);
        this.modalRef.current?.close();
    };

    render() {
        const {phone, theme} = this.props;
        const {tempPhone} = this.state;
        const isValid = validateIsPhone(tempPhone);
        const borderWidth = isValid ? 0 : borderWidthError;

        const Content = () => {
            return (
                <>
                    <StyleText
                        i18Text="setting.personalInfo.editPhone"
                        customStyle={[styles.title, {color: theme.textColor}]}
                    />

                    <View
                        style={[
                            styles.inputView,
                            {
                                backgroundColor: theme.backgroundTextInput,
                                borderWidth,
                                borderColor: theme.highlightColor,
                            },
                        ]}>
                        <TextInput
                            ref={this.inputRef}
                            defaultValue={tempPhone}
                            onChangeText={value =>
                                this.setState({
                                    tempPhone: value,
                                })
                            }
                            placeholder={I18Next.t(
                                'setting.personalInfo.editPhone',
                            )}
                            placeholderTextColor={theme.borderColor}
                            multiline
                            style={[styles.input, {color: theme.textColor}]}
                        />
                    </View>

                    <StyleText
                        i18Text={isValid ? 'common.null' : 'alert.inValidPhone'}
                        customStyle={[
                            styles.textInvalidLink,
                            {color: theme.highlightColor},
                        ]}
                    />

                    <StyleButton
                        containerStyle={styles.buttonView}
                        titleStyle={styles.titleButton}
                        title="common.change"
                        disable={!isValid || phone === tempPhone}
                        onPress={() => this.onConfirm()}
                    />
                </>
            );
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
                            this.setState({
                                tempPhone: phone,
                            });
                        }}
                    />

                    {Content()}
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
    title: {
        fontSize: '15@ms',
        fontWeight: 'bold',
    },
    inputView: {
        width: '100%',
        marginTop: '10@vs',
        borderRadius: '5@ms',
        paddingHorizontal: '8@s',
        paddingVertical: '8@vs',
    },
    input: {
        marginVertical: 0,
        paddingTop: 0,
        // paddingBottom: '0.25@vs',
        maxHeight: '70@vs',
    },
    textInvalidLink: {
        fontSize: '10@ms',
        alignSelf: 'flex-start',
        marginTop: '7@vs',
        marginLeft: '2@s',
    },
    buttonView: {
        paddingHorizontal: '40@s',
        paddingVertical: '7@vs',
        marginTop: '13@vs',
    },
    titleButton: {
        fontSize: '15@ms',
        fontWeight: 'normal',
    },
    avatar: {
        width: '50@s',
        height: '50@s',
        borderRadius: '25@s',
    },
    textReview: {
        fontSize: FONT_SIZE.normal,
        marginTop: '15@vs',
    },
});

export default ModalChangePhone;
