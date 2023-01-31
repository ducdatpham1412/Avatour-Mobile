import {TypePrice} from 'api/interface/discovery';
import {FONT_SIZE, LINE_HEIGHT} from 'asset/standardValue';
import Theme, {TypeTheme} from 'asset/theme/Theme';
import {StyleButton, StyleText} from 'components/base';
import AppInput from 'components/base/AppInput';
import ButtonX from 'components/common/ButtonX';
import React, {Component} from 'react';
import {TextInput, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {ScaledSheet} from 'react-native-size-matters';
import {borderWidthTiny} from 'utility/assistant';
import I18Next, {I18Normalize} from 'utility/I18Next';
import {validateIsNumber} from 'utility/validate';

interface Props {
    prices: Array<TypePrice>;
    onAddPrice(value: TypePrice): void;
    onChangePrice(params: {indexEdit: number; value: TypePrice}): void;
    theme: TypeTheme;
}

interface States {
    numberPeople: string;
    priceValue: string;
}

interface TypeShow {
    numberPeople: string;
    priceValue: string;
    indexEdit: number;
}

let timeout: any;

class ModalAddPrice extends Component<Props, States> {
    modalRef = React.createRef<Modalize>();

    inputNumberRef = React.createRef<TextInput>();

    inputPriceRef = React.createRef<TextInput>();

    indexEdit: number | null = null;

    state: States = {
        numberPeople: '',
        priceValue: '',
    };

    show(params?: TypeShow) {
        if (params) {
            this.setState({
                numberPeople: params.numberPeople,
                priceValue: params.priceValue,
            });
            this.indexEdit = params.indexEdit;
        }
        this.modalRef.current?.open();
        timeout = setTimeout(() => {
            this.inputNumberRef.current?.focus();
        }, 200);
        return () => clearTimeout(timeout);
    }

    private onConfirm = () => {
        if (this.indexEdit === null) {
            this.props.onAddPrice({
                number_people: Number(this.state.numberPeople),
                value: this.state.priceValue,
            });
        } else {
            this.props.onChangePrice({
                indexEdit: this.indexEdit,
                value: {
                    number_people: Number(this.state.numberPeople),
                    value: this.state.priceValue,
                },
            });
        }
        this.setState({
            numberPeople: '',
            priceValue: '',
        });
        this.indexEdit = null;
        this.modalRef.current?.close();
    };

    private onCancel = () => {
        if (this.indexEdit === null) {
            this.modalRef.current?.close();
        } else {
            this.setState({
                numberPeople: '',
                priceValue: '',
            });
            this.modalRef.current?.close();
        }
        this.indexEdit = null;
    };

    render() {
        const {theme, prices} = this.props;
        const {numberPeople, priceValue} = this.state;

        let isValidNumberPeople = true;
        let textAlertNumberPeople: I18Normalize = 'common.null';
        const paramsNumberPeople: any = {};

        let isValidPriceValue = true;
        let textAlertPrice: I18Normalize = 'common.null';
        const paramsPrice: any = {};

        // add new one
        if (this.indexEdit === null) {
            const lastPrice = prices[prices.length - 1];
            if (lastPrice) {
                if (Number(numberPeople) < lastPrice.number_people) {
                    isValidNumberPeople = false;
                    paramsNumberPeople.value = lastPrice.number_people;
                    textAlertNumberPeople = 'alert.numberPeopleMoreThan';
                }

                isValidPriceValue =
                    Number(priceValue) < Number(lastPrice.value) &&
                    !!priceValue;
                paramsPrice.value = lastPrice.value;
                textAlertPrice = 'alert.priceLessThan';
            } else if (Number(numberPeople) <= 1) {
                isValidNumberPeople = false;
                paramsNumberPeople.value = 1;
                textAlertNumberPeople = 'alert.numberPeopleMoreThan';
            }
        }
        // edit an index price
        else {
            const start = prices[this.indexEdit - 1];
            const end = prices[this.indexEdit + 1];
            if (start && end) {
                isValidNumberPeople =
                    Number(numberPeople) > start.number_people &&
                    Number(numberPeople) < end.number_people;
                textAlertNumberPeople = 'alert.numberPeopleMoreAndLess';
                paramsNumberPeople.start = start.number_people;
                paramsNumberPeople.end = end.number_people;

                isValidPriceValue =
                    Number(priceValue) < Number(start.value) &&
                    Number(priceValue) > Number(end.value);
                textAlertPrice = 'alert.priceMoreLessThan';
                paramsPrice.start = start.value;
                paramsPrice.end = end.value;
            } else if (start) {
                isValidNumberPeople =
                    Number(numberPeople) > start.number_people;
                textAlertNumberPeople = 'alert.numberPeopleMoreThan';
                paramsNumberPeople.value = start.number_people;

                isValidPriceValue = Number(priceValue) < Number(start.value);
                textAlertPrice = 'alert.priceLessThan';
                paramsPrice.value = start.value;
            } else if (end) {
                isValidNumberPeople = Number(numberPeople) < end.number_people;
                if (!isValidNumberPeople) {
                    textAlertNumberPeople = 'alert.numberPeopleLessThan';
                    paramsNumberPeople.value = end.number_people;
                } else {
                    isValidNumberPeople = Number(numberPeople) > 1;
                    paramsNumberPeople.value = 1;
                    textAlertNumberPeople = 'alert.numberPeopleMoreThan';
                }

                isValidPriceValue = Number(priceValue) > Number(end.value);
                textAlertPrice = 'alert.priceMoreThan';
                paramsPrice.value = end.value;
            } else if (Number(numberPeople) <= 1) {
                isValidNumberPeople = false;
                paramsNumberPeople.value = 1;
                textAlertNumberPeople = 'alert.numberPeopleMoreThan';
            }
        }

        const borderWidthNumber = isValidNumberPeople ? 0 : borderWidthTiny;
        const borderWidthPrice = isValidPriceValue ? 0 : borderWidthTiny;

        const Content = () => {
            return (
                <>
                    <View style={styles.inputView}>
                        <AppInput
                            ref={this.inputNumberRef}
                            value={numberPeople}
                            onChangeText={value => {
                                if (validateIsNumber(value) || !value) {
                                    this.setState({
                                        numberPeople: value,
                                    });
                                }
                            }}
                            placeholder={I18Next.t('profile.number')}
                            placeholderTextColor={theme.borderColor}
                            style={[
                                styles.inputNumberPeople,
                                {
                                    color: theme.textHightLight,
                                    backgroundColor: theme.backgroundTextInput,
                                    borderWidth: borderWidthNumber,
                                },
                            ]}
                            onSubmitEditing={() =>
                                this.inputPriceRef.current?.focus()
                            }
                            keyboardType="numeric"
                            returnKeyType="next"
                        />
                        <StyleText
                            originValue="-"
                            customStyle={[
                                styles.textMiddle,
                                {color: theme.borderColor},
                            ]}
                        />
                        <View
                            style={[
                                styles.inputPriceBox,
                                {
                                    backgroundColor: theme.backgroundTextInput,
                                    borderWidth: borderWidthPrice,
                                },
                            ]}>
                            <AppInput
                                ref={this.inputPriceRef}
                                value={priceValue}
                                onChangeText={value => {
                                    if (validateIsNumber(value) || !value) {
                                        this.setState({
                                            priceValue: value,
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

                    {!isValidNumberPeople && (
                        <StyleText
                            i18Text={textAlertNumberPeople}
                            i18Params={paramsNumberPeople}
                            customStyle={[
                                styles.textInvalidLink,
                                {color: theme.highlightColor},
                            ]}
                        />
                    )}

                    {!isValidPriceValue && (
                        <StyleText
                            i18Text={textAlertPrice}
                            i18Params={paramsPrice}
                            customStyle={[
                                styles.textInvalidLink,
                                {color: theme.highlightColor},
                            ]}
                        />
                    )}
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
                        onPress={() => this.onCancel()}
                    />
                    <StyleText
                        i18Text={'profile.addPrice'}
                        customStyle={[styles.title, {color: theme.textColor}]}
                    />
                    {Content()}
                    <StyleButton
                        containerStyle={styles.buttonView}
                        titleStyle={styles.titleButton}
                        title="common.save"
                        disable={
                            !isValidNumberPeople ||
                            !isValidPriceValue ||
                            !numberPeople ||
                            !priceValue
                        }
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
    textMiddle: {
        fontSize: FONT_SIZE.normal,
        marginHorizontal: '10@s',
    },
    inputView: {
        width: '100%',
        marginTop: '15@vs',
        paddingHorizontal: '8@s',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputNumberPeople: {
        flex: 1,
        marginVertical: 0,
        paddingTop: '8@vs',
        paddingBottom: '8@vs',
        paddingHorizontal: '7@s',
        borderRadius: '5@ms',
        fontSize: FONT_SIZE.normal,
        borderColor: Theme.common.red,
    },
    inputPriceBox: {
        flex: 3,
        marginVertical: 0,
        borderRadius: '5@ms',
        borderColor: Theme.common.red,
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
    textInvalidLink: {
        fontSize: '10@ms',
        alignSelf: 'flex-start',
        marginTop: '7@vs',
        marginLeft: '10@s',
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

export default ModalAddPrice;
