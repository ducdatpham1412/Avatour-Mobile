import {apiChangeInformation} from 'api/module';
import {ERROR_MESSAGE_ENUM} from 'asset/enum';
import {FONT_SIZE} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {StyleButton, StyleText} from 'components/base';
import AppInput from 'components/base/AppInput';
import Redux from 'hook/useRedux';
import React, {useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {validateIsNumber, validateIsPhone} from 'utility/validate';

interface Props {
    onCloseModal(): void;
}

const AddPhone = (props: Props) => {
    const {onCloseModal} = props;
    const theme = Redux.getTheme();

    const [phone, setPhone] = useState('');
    const [isPhoneExisted, setIsPhoneExisted] = useState(false);

    const onSave = async () => {
        try {
            await apiChangeInformation({
                phone,
            });
            Redux.updatePassport({
                information: {
                    phone,
                },
            });
            onCloseModal();
        } catch (err) {
            if (err === ERROR_MESSAGE_ENUM.phone_existed) {
                setIsPhoneExisted(true);
            }
        }
    };

    return (
        <View
            style={[
                styles.modalAddPhoneView,
                {backgroundColor: theme.backgroundColor},
            ]}>
            <StyleText
                i18Text="alert.needToAddPhone"
                customStyle={[
                    styles.textHeaderPhone,
                    {color: theme.textHightLight},
                ]}
            />
            <AppInput
                value={phone}
                onChangeText={text => {
                    if (validateIsNumber(text) || !text) {
                        setPhone(text);
                    }
                }}
                style={[
                    styles.inputBox,
                    {
                        backgroundColor: theme.backgroundButtonColor,
                        color: theme.textHightLight,
                    },
                ]}
                placeholder="+84"
                placeholderTextColor={theme.holderColorLighter}
                keyboardType="numeric"
            />

            <StyleText
                i18Text={isPhoneExisted ? 'alert.phoneExisted' : 'common.null'}
                customStyle={styles.textError}
            />

            <StyleButton
                title="common.save"
                containerStyle={styles.buttonView}
                onPress={() => onSave()}
                disable={!validateIsPhone(phone)}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    modalAddPhoneView: {
        width: '100%',
        borderTopLeftRadius: '10@ms',
        borderTopRightRadius: '10@ms',
        alignItems: 'center',
        paddingHorizontal: '15@s',
    },
    textHeaderPhone: {
        fontSize: FONT_SIZE.normal,
        marginTop: '5@vs',
        textAlign: 'center',
    },
    inputBox: {
        width: '80%',
        marginTop: '20@vs',
        borderRadius: '5@ms',
        paddingHorizontal: '8@s',
        paddingTop: '5@vs',
        paddingBottom: '5@vs',
        fontSize: FONT_SIZE.normal,
    },
    buttonView: {
        marginVertical: '20@vs',
        paddingVertical: '5@vs',
    },
    textError: {
        fontSize: FONT_SIZE.tiny,
        color: Theme.common.red,
        marginTop: '5@vs',
        height: '15@ms',
    },
});

export default AddPhone;
