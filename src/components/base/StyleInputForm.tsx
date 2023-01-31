import InputBox from 'components/common/InputBox';
import React, {forwardRef} from 'react';
import {Controller, RegisterOptions, useFormContext} from 'react-hook-form';
import {ScaledSheet} from 'react-native-size-matters';
import {StyleInputProps} from './StyleInput';
import StyleText from './StyleText';

interface StyleInputFormProps extends StyleInputProps {
    name: string;
    rule?: RegisterOptions;
    defaultValue?: string;
}

const StyleInputForm = (props: StyleInputFormProps, ref: any) => {
    const {name, rule, defaultValue, onChangeText} = props;
    const formContext = useFormContext();
    const {
        control,
        formState: {errors},
    } = formContext;
    const errorMessage = errors?.[name]?.message || '';

    if (!formContext) {
        return <StyleText i18Text="common.null" />;
    }

    return (
        <Controller
            control={control}
            name={name}
            rules={rule}
            defaultValue={defaultValue}
            render={({field: {onChange, value}}) => (
                <InputBox
                    ref={ref}
                    onChangeText={text =>
                        onChangeText?.(text) || onChange(text)
                    }
                    value={value}
                    errorMessage={errorMessage}
                    hasErrorBox
                    customErrorText={styles.errorText}
                    {...props}
                />
            )}
        />
    );
};

const styles = ScaledSheet.create({
    errorText: {
        fontSize: '11@ms',
    },
});

export default forwardRef(StyleInputForm);
