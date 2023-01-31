import {FONT_SIZE, LINE_HEIGHT} from 'asset/standardValue';
import {TypeTheme} from 'asset/theme/Theme';
import {StyleButton, StyleText} from 'components/base';
import AppInput from 'components/base/AppInput';
import ButtonX from 'components/common/ButtonX';
import React, {Component} from 'react';
import {TextInput, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {ScaledSheet} from 'react-native-size-matters';
import I18Next from 'utility/I18Next';
import {validateIsNumber} from 'utility/validate';

interface Props {
    price: string;
    onChangePrice(value: string): void;
    theme: TypeTheme;
}

interface States {
    tempPrice: string;
}

let timeout: any;
class ModalRetailPrice extends Component<Props, States> {
    modalRef = React.createRef<Modalize>();

    inputNumberRef = React.createRef<TextInput>();

    state: States = {
        tempPrice: this.props.price,
    };

    show() {
        this.modalRef.current?.open();
        timeout = setTimeout(() => {
            this.inputNumberRef.current?.focus();
        }, 200);
        return () => clearTimeout(timeout);
    }

    private onConfirm = () => {
        this.props.onChangePrice(this.state.tempPrice);
        this.modalRef.current?.close();
    };

    render() {
        const {theme, price} = this.props;
        const {tempPrice} = this.state;

        const isValidPriceValue = validateIsNumber(tempPrice);

        const Content = () => {
            return (
                <>
                    <View style={styles.inputView}>
                        <View
                            style={[
                                styles.inputPriceBox,
                                {
                                    backgroundColor: theme.backgroundTextInput,
                                },
                            ]}>
                            <AppInput
                                ref={this.inputNumberRef}
                                value={tempPrice}
                                onChangeText={value => {
                                    if (validateIsNumber(value) || !value) {
                                        this.setState({
                                            tempPrice: value,
                                        });
                                    }
                                }}
                                placeholder={I18Next.t('profile.price')}
                                placeholderTextColor={theme.borderColor}
                                style={[
                                    styles.inputPrice,
                                    {
                                        color: theme.textHightLight,
                                    },
                                ]}
                                keyboardType="numeric"
                                returnKeyType="done"
                                defaultValue={price}
                            />
                            <StyleText
                                originValue="vnd"
                                customStyle={[
                                    styles.textVnd,
                                    {color: theme.borderColor},
                                ]}
                            />
                        </View>
                    </View>
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
                                tempPrice: price,
                            });
                        }}
                    />
                    <StyleText
                        i18Text="profile.addPrice"
                        customStyle={[styles.title, {color: theme.textColor}]}
                    />

                    {Content()}

                    <StyleButton
                        containerStyle={styles.buttonView}
                        titleStyle={styles.titleButton}
                        title="common.save"
                        disable={!isValidPriceValue}
                        onPress={() => this.onConfirm()}
                    />
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
        marginTop: '15@vs',
        paddingHorizontal: '8@s',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputPriceBox: {
        flex: 1,
        marginVertical: 0,
        borderRadius: '5@ms',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputPrice: {
        flex: 1,
        marginVertical: 0,
        paddingTop: '8@vs',
        paddingBottom: '8@vs',
        paddingHorizontal: '7@s',
        fontSize: FONT_SIZE.normal,
        lineHeight: LINE_HEIGHT.normal,
    },
    textVnd: {
        marginRight: '7@s',
        fontSize: FONT_SIZE.normal,
    },
    buttonView: {
        paddingHorizontal: '40@s',
        paddingVertical: '7@vs',
        marginTop: '20@vs',
    },
    titleButton: {
        fontSize: '15@ms',
        fontWeight: 'bold',
    },
});

export default ModalRetailPrice;
