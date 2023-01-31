import {FONT_SIZE} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import StyleInput, {StyleInputProps} from 'components/base/StyleInput';
import React, {forwardRef} from 'react';
import {Platform} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

const InputBox = (props: StyleInputProps, ref: any) => {
    return (
        <StyleInput
            ref={ref}
            hasErrorBox={false}
            hasUnderLine={false}
            placeholderTextColor={Theme.common.blueInputHolder}
            {...props}
            inputStyle={[styles.input, props.inputStyle]}
        />
    );
};

const styles = ScaledSheet.create({
    input: {
        color: Theme.common.white,
        backgroundColor: Theme.common.blueInput,
        borderRadius: '5@ms',
        fontSize: FONT_SIZE.normal,
        paddingTop: Platform.select({
            ios: '14@ms',
            android: '8@ms',
        }),
        paddingBottom: Platform.select({
            ios: '14@ms',
            android: '8@ms',
        }),
    },
});

export default forwardRef(InputBox);
