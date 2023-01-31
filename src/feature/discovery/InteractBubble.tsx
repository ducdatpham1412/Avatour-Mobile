import {TypeInteractBubble} from 'api/interface';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import {
    StyleImage,
    StyleInput,
    StyleText,
    StyleTouchable,
} from 'components/base';
import Redux from 'hook/useRedux';
import {startChatTag} from 'hook/useSocketIO';
import {goBack} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Platform, Text, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';

interface Props {
    route: {
        params: TypeInteractBubble;
    };
}

const InteractBubble = ({route}: Props) => {
    const {userId, name, avatar} = route.params;

    const theme = Redux.getTheme();

    const translateY = useRef(new Animated.Value(-300)).current;
    const aim = useRef(new Animated.Value(0)).current;
    const rotateY = aim.interpolate({
        inputRange: [0, 1],
        outputRange: ['80deg', '0deg'],
    });

    const inputRef = useRef<any>();
    const [message, setMessage] = useState('');

    const startMoving = () => {
        Animated.timing(translateY, {
            toValue: 0,
            useNativeDriver: true,
            duration: 600,
        }).start(() => {
            Animated.spring(aim, {
                toValue: 1,
                useNativeDriver: true,
                speed: 0.1,
            }).start();
        });
    };

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    useEffect(() => {
        startMoving();
    }, []);

    const onTouchBackground = useCallback(() => {
        if (inputRef.current.isFocused()) {
            inputRef.current.blur();
        } else {
            goBack();
        }
    }, []);

    const onSendInteract = () => {
        startChatTag({
            content: message,
            userId,
        });
        goBack();
    };

    /**
     * Render view
     */
    const RenderNameAndAvatar = () => {
        return (
            <View
                style={[
                    styles.avatarAndNameBox,
                    {borderBottomColor: theme.holderColorLighter},
                ]}>
                <StyleImage
                    source={{uri: avatar}}
                    customStyle={styles.avatar}
                />
                <StyleText
                    originValue={name}
                    customStyle={[
                        styles.nameText,
                        {color: theme.textHightLight},
                    ]}
                    numberOfLines={1}
                />
            </View>
        );
    };

    const RenderIconSend = useMemo(() => {
        return (
            <Feather
                name="send"
                style={[styles.iconSend, {color: theme.highlightColor}]}
            />
        );
    }, []);

    return (
        <View style={[styles.container]}>
            <Text style={styles.spaceView} onPress={onTouchBackground} />

            <Animated.View
                style={[
                    styles.animatedView,
                    {transform: [{rotateY}, {translateY}]},
                ]}>
                <Text style={styles.spaceView} onPress={onTouchBackground} />
                <View
                    style={[
                        styles.cordBox,
                        {backgroundColor: theme.backgroundButtonColor},
                    ]}
                />

                <View
                    style={[
                        styles.inputMessageBox,
                        {
                            backgroundColor: theme.backgroundButtonColor,
                        },
                    ]}>
                    {RenderNameAndAvatar()}

                    <View style={styles.inputAndSendView}>
                        <StyleInput
                            ref={inputRef}
                            value={message}
                            onChangeText={text => setMessage(text)}
                            containerStyle={styles.inputContainer}
                            inputStyle={[
                                styles.input,
                                {color: theme.textHightLight},
                            ]}
                            multiline
                            i18Placeholder="Hello"
                            placeholderTextColor={theme.holderColorLighter}
                            keyboardAppearance={Redux.getThemeKeyboard()}
                            hasErrorBox={false}
                            hasUnderLine={false}
                            isEffectTabBar
                        />
                        <StyleTouchable
                            onPress={onSendInteract}
                            disable={!message}>
                            {RenderIconSend}
                        </StyleTouchable>
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    spaceView: {
        position: 'absolute',
        width: '100%',
        height: Metrics.height,
    },
    animatedView: {
        width: '100%',
        alignItems: 'center',
    },
    // cord
    cordBox: {
        width: '3@s',
        height: '40%',
        backgroundColor: 'red',
    },
    // avatar and name
    avatarAndNameBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '10@s',
        paddingBottom: '10@vs',
        borderBottomWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        overflow: 'hidden',
    },
    avatar: {
        width: '35@s',
        height: '35@s',
        borderRadius: '30@s',
    },
    nameText: {
        fontSize: FONT_SIZE.big,
        fontWeight: 'bold',
        marginLeft: '10@s',
    },
    // input
    inputMessageBox: {
        width: '80%',
        borderRadius: '15@vs',
        paddingHorizontal: '10@s',
        paddingVertical: '20@vs',
    },
    inputAndSendView: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: '10@vs',
    },
    inputContainer: {
        flex: 1,
        paddingHorizontal: '5@s',
        paddingTop: '5@vs',
        paddingBottom: '10@vs',
        fontSize: '14@ms',
        maxHeight: '70@vs',
    },
    input: {
        fontSize: FONT_SIZE.normal,
    },
    iconSend: {
        fontSize: '20@ms',
        marginLeft: '20@s',
        marginRight: '10@s',
    },
});

export default InteractBubble;
