import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, StyleProp, View, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {chooseIconHobby} from 'utility/assistant';

interface Props {
    bubbleId?: string;
    color: number;
    onTouchStart?(): void;
    onTouchEnd?(): void;
    containerStyle?: StyleProp<ViewStyle>;
}

const IconHobby = ({
    color,
    onTouchStart,
    onTouchEnd,
    containerStyle,
}: Props) => {
    const aim = useRef(new Animated.Value(0)).current;
    const degree = aim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const x = useMemo(() => {
        return Animated.loop(
            Animated.timing(aim, {
                toValue: 1,
                duration: 4000,
                useNativeDriver: true,
            }),
        );
    }, []);

    useEffect(() => {
        x.start();
    }, []);

    return (
        <View
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={[styles.container, containerStyle]}>
            <Animated.Image
                source={{uri: chooseIconHobby(color)}}
                style={[
                    styles.iconHobby,
                    {
                        transform: [{rotate: degree}],
                    },
                ]}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        marginTop: '38@vs',
    },
    iconHobby: {
        width: '35@s',
        height: '35@s',
    },
});

export default IconHobby;
