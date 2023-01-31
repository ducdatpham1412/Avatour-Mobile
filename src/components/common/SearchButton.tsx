import Redux from 'hook/useRedux';
import React, {useRef, useState} from 'react';
import {StyleProp, TextInputProps, ViewStyle} from 'react-native';
import {Animated, TextInput, TouchableOpacity, View} from 'react-native';
import {moderateScale, scale, ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';

interface SearchButtonProps extends TextInputProps {
    customStyle?: StyleProp<ViewStyle>;
    keyWordSearch?: string;
    setKeyWordSearch?: any;
    placeholder?: string;
    maxWidthScale?: number;
}

const SearchButton = (props: SearchButtonProps) => {
    const {
        customStyle,
        keyWordSearch,
        setKeyWordSearch,
        placeholder,
        maxWidthScale = 170,
    } = props;
    const theme = Redux.getTheme();

    const searchIcon = (
        <Feather
            name="search"
            size={moderateScale(22)}
            color={theme.textColor}
        />
    );
    const deleteIcon = (
        <Feather name="x" size={moderateScale(22)} color={theme.textColor} />
    );
    /**
     * HANDLING EFFECT
     */
    const opacitySearch = useRef(new Animated.Value(0.7)).current;
    const [isSearching, setIsSearching] = useState(false);
    const [inputWidth, setInputWidth] = useState(0);
    const focusInput = useRef<any>(null);

    const aim = useRef(new Animated.Value(0)).current;
    aim.addListener(({value}) => setInputWidth(value));

    let x: any;
    const changeOpacity = (type: string) => {
        if (type === 'focus') {
            opacitySearch.setValue(1);
            return () => clearTimeout(x);
        }
        if (type === 'blur') {
            // x = setTimeout(() => {
            //     Animated.timing(opacitySearch, {
            //         toValue: 0.7,
            //         duration: 300,
            //         useNativeDriver: true,
            //     }).start();
            // }, 3000);
            opacitySearch.setValue(0.7);
        }
        return () => clearTimeout(x);
    };

    const stretchInput = () => {
        if (isSearching && !!keyWordSearch) {
            setKeyWordSearch('');
        } else {
            Animated.timing(aim, {
                toValue: isSearching ? 0 : scale(maxWidthScale),
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                if (!isSearching) {
                    focusInput.current.focus();
                } else {
                    focusInput.current.blur();
                }
                setIsSearching(!isSearching);
            });
        }
    };
    /**
     * -------------------------
     */

    return (
        <Animated.View
            style={[
                styles.buttonSearch,
                {
                    backgroundColor: theme.backgroundButtonColor,
                    opacity: opacitySearch,
                },
                customStyle,
            ]}>
            {/* TEXT_INPUT PART */}
            <Animated.View
                style={{width: inputWidth, justifyContent: 'center'}}>
                <TextInput
                    ref={focusInput}
                    value={keyWordSearch}
                    style={[styles.textInput, {color: theme.textColor}]}
                    returnKeyType="search"
                    placeholder={placeholder}
                    placeholderTextColor={theme.borderColor}
                    onChangeText={value => setKeyWordSearch(value)}
                    onFocus={() => changeOpacity('focus')}
                    onBlur={() => changeOpacity('blur')}
                    keyboardAppearance={Redux.getThemeKeyboard()}
                    {...props}
                />
            </Animated.View>

            {/* BUTTON SEARCH OR CLEAR */}
            <View style={styles.searchOrClearBox}>
                <TouchableOpacity
                    style={styles.buttonSearchOrClear}
                    onPress={stretchInput}>
                    {!isSearching ? searchIcon : deleteIcon}
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = ScaledSheet.create({
    buttonSearch: {
        flexDirection: 'row',
        borderRadius: '30@vs',
    },
    textInput: {
        flex: 1,
        fontSize: '15@ms',
        paddingVertical: 0,
        paddingLeft: '15@s',
    },
    searchOrClearBox: {
        width: '38@vs',
        height: '38@vs',
        borderRadius: '30@vs',
    },
    buttonSearchOrClear: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SearchButton;
