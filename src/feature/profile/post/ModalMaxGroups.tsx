import {FONT_SIZE, LINE_HEIGHT} from 'asset/standardValue';
import {StyleButton, StyleText} from 'components/base';
import AppInput from 'components/base/AppInput';
import ButtonX from 'components/common/ButtonX';
import Redux from 'hook/useRedux';
import React, {useRef, useState} from 'react';
import {TextInput, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {ScaledSheet} from 'react-native-size-matters';
import I18Next from 'utility/I18Next';
import {validateIsNumber} from 'utility/validate';

const ModalMaxGroups = () => {
    const theme = Redux.getTheme();
    const inputNumberRef = useRef<TextInput>(null);
    const modalRef = useRef<any>(null);
    const timeOutInput = useRef<any>(null);

    const oldMaxGroups = useRef('1');
    const [maxGroups, setMaxGroups] = useState('1');

    const isValidPriceValue =
        validateIsNumber(maxGroups) && Number(maxGroups) > 0;

    const showModal = () => {
        modalRef.current?.open();
        timeOutInput.current = setTimeout(() => {
            inputNumberRef.current?.focus();
        }, 200);
        return () => inputNumberRef.current?.blur();
    };

    const JSX = () => {
        return (
            <Modalize
                ref={modalRef}
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
                            modalRef.current?.close();
                            setMaxGroups(oldMaxGroups.current);
                        }}
                    />
                    <StyleText
                        i18Text="profile.maxGroups"
                        customStyle={[styles.title, {color: theme.textColor}]}
                    />

                    <View
                        style={[
                            styles.inputPriceBox,
                            {
                                backgroundColor: theme.backgroundTextInput,
                            },
                        ]}>
                        <AppInput
                            ref={inputNumberRef}
                            value={maxGroups}
                            onChangeText={text => {
                                if (validateIsNumber(text) || !text) {
                                    setMaxGroups(text);
                                }
                            }}
                            placeholder={I18Next.t('profile.price')}
                            placeholderTextColor={theme.borderColor}
                            style={[
                                styles.inputPrice,
                                {
                                    color: theme.textColor,
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

                    <StyleButton
                        containerStyle={styles.buttonView}
                        titleStyle={styles.titleButton}
                        title="common.save"
                        disable={!isValidPriceValue}
                        onPress={() => {
                            modalRef.current?.close();
                            oldMaxGroups.current = maxGroups;
                        }}
                    />
                </View>
            </Modalize>
        );
    };

    return {
        jsx: JSX(),
        maxGroups,
        showModal,
    };
};

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
    inputPriceBox: {
        width: '50%',
        marginTop: '15@vs',
        paddingHorizontal: '8@s',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
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

export default ModalMaxGroups;
