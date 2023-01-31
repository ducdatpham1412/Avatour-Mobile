import Redux from 'hook/useRedux';
import {useTabBar} from 'navigation/config/TabBarProvider';
import React, {forwardRef, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {
    StyleProp,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {scale, ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {I18Normalize} from 'utility/I18Next';
import StyleText from './StyleText';

export interface StyleInputProps extends TextInputProps {
    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    i18Placeholder?: I18Normalize;
    hasErrorBox?: boolean;
    label?: any;
    hasUnderLine?: boolean;
    customErrorBox?: StyleProp<ViewStyle>;
    customErrorText?: StyleProp<TextStyle>;
    errorMessage?: I18Normalize;
    isEffectTabBar?: boolean;
}

const StyleInput = (props: StyleInputProps, ref: any) => {
    const theme = Redux.getTheme();
    const {t} = useTranslation();
    const {
        containerStyle,
        inputStyle,
        i18Placeholder,
        hasErrorBox = true,
        label,
        hasUnderLine = true,
        customErrorBox,
        customErrorText,
        errorMessage = '',
        isEffectTabBar = true,
    } = props;
    const inputRef = useRef<TextInput>(null);
    const {setShowTabBar} = useTabBar();

    const RenderErrorLabel = () => {
        return (
            <View style={styles.errorLabel}>
                {label || (
                    <AntDesign
                        name="warning"
                        style={[
                            styles.text,
                            {color: theme.highlightColor},
                            customErrorText,
                        ]}
                    />
                )}
            </View>
        );
    };

    const RenderMoreText = () => {
        return hasErrorBox ? (
            <View
                style={[
                    styles.errorBox,
                    {
                        borderTopColor: theme.borderColor,
                        borderTopWidth: hasUnderLine ? scale(0.5) : 0,
                    },
                    customErrorBox,
                ]}>
                {!!errorMessage && (
                    <>
                        {RenderErrorLabel()}
                        <View style={styles.errorText}>
                            <StyleText
                                i18Text={errorMessage}
                                customStyle={[
                                    styles.text,
                                    {color: theme.highlightColor},
                                    customErrorText,
                                ]}
                            />
                        </View>
                    </>
                )}
            </View>
        ) : null;
    };

    const onFocus = () => {
        if (isEffectTabBar) {
            setShowTabBar(false);
        }
    };
    const onBlur = () => {
        if (isEffectTabBar) {
            setShowTabBar(true);
        }
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <TextInput
                ref={ref || inputRef}
                style={[styles.input, {color: theme.textColor}, inputStyle]}
                placeholderTextColor={theme.holderColor}
                autoCapitalize="none"
                placeholder={i18Placeholder ? t(String(i18Placeholder)) : ''}
                returnKeyType="next"
                keyboardAppearance={Redux.getThemeKeyboard()}
                textContentType="oneTimeCode"
                onFocus={onFocus}
                onBlur={onBlur}
                {...props}
            />

            {RenderMoreText()}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '80%',
        alignSelf: 'center',
    },
    input: {
        fontSize: '17@ms',
        paddingHorizontal: '10@vs',
        paddingVertical: 0,
    },
    errorBox: {
        width: '100%',
        minHeight: '20@vs',
        marginTop: '5@vs',
        flexDirection: 'row',
        paddingBottom: '5@vs',
    },
    errorLabel: {
        justifyContent: 'center',
    },
    errorText: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: '7@s',
    },
    text: {
        fontSize: '13@ms',
    },
});

export default forwardRef(StyleInput);
