import {StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React, {ReactNode, useEffect, useRef} from 'react';
import {Animated, StyleProp, View, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface Props {
    containerStyle?: StyleProp<ViewStyle>;
    children?: ReactNode;
    disable?: boolean;
    onPress(): void;
}

const FlyButton = (props: Props) => {
    const {containerStyle, children, disable = false, onPress} = props;
    const theme = Redux.getTheme();

    const aim = useRef(new Animated.Value(0)).current;
    // const translateY = aim.interpolate({
    //     inputRange: [0, 1],
    //     outputRange: [verticalScale(200), 0],
    // });

    useEffect(() => {
        Animated.timing(aim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false,
        }).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.container,
                containerStyle,
                {
                    transform: [{scale: aim}],
                },
            ]}>
            <View
                style={[
                    styles.spaceBackground,
                    {
                        borderColor: theme.borderColor,
                        shadowColor: theme.textColor,
                        opacity: disable ? 0.4 : 1,
                    },
                    containerStyle,
                    {
                        transform: [{rotate: '45deg'}],
                    },
                ]}
            />
            <StyleTouchable
                customStyle={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                disable={disable}
                onPress={onPress}>
                {children}
            </StyleTouchable>
        </Animated.View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100@s',
        height: '100@s',
    },
    spaceBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderWidth: '1@ms',
        borderRadius: '10@s',
        shadowOffset: {
            width: 2,
            height: 1,
        },
        shadowOpacity: 0.6,
    },
});

export default FlyButton;
