import {StyleImage, StyleText} from 'components/base';
import Redux from 'hook/useRedux';
import React, {useEffect, useRef} from 'react';
import {Animated, Easing, View} from 'react-native';
import {scale, ScaledSheet} from 'react-native-size-matters';
import {isIOS} from 'utility/assistant';

interface Props {
    avatar: string;
    isMyChatTag: boolean;
}

let typingInterval: any;
const typingOpacity = isIOS ? 0.6 : 0.5;

const Typing = (props: Props) => {
    const {avatar, isMyChatTag} = props;
    const theme = Redux.getTheme();
    const aim = useRef(new Animated.Value(1)).current;

    const marginLeft = isMyChatTag ? 0 : scale(10);
    const marginRight = isMyChatTag ? scale(10) : 0;

    useEffect(() => {
        typingInterval = setInterval(() => {
            Animated.timing(aim, {
                toValue: typingOpacity,
                duration: 745,
                useNativeDriver: true,
                easing: Easing.circle,
            }).start(() => {
                Animated.timing(aim, {
                    toValue: 1,
                    duration: 745,
                    useNativeDriver: true,
                    easing: Easing.circle,
                }).start();
            });
        }, 1500);
        return () => clearInterval(typingInterval);
    }, []);

    return (
        <View
            style={[
                styles.container,
                {
                    flexDirection: isMyChatTag ? 'row-reverse' : 'row',
                },
            ]}>
            <Animated.View style={{opacity: aim}}>
                <StyleImage
                    source={{uri: avatar}}
                    customStyle={[
                        styles.avatar,
                        {borderColor: theme.holderColor},
                    ]}
                />
            </Animated.View>
            <StyleText
                i18Text="mess.typing"
                customStyle={[
                    styles.textTyping,
                    {color: theme.holderColor, marginLeft, marginRight},
                ]}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        paddingBottom: '0@vs',
        paddingTop: '10@vs',
        alignItems: 'center',
    },
    avatar: {
        width: '40@ms',
        height: '40@ms',
        borderRadius: '20@ms',
        borderWidth: '4@ms',
    },
    textTyping: {
        fontSize: '15@ms',
    },
});

export default Typing;
