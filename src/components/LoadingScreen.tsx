import Images from 'asset/img/images';
import Redux from 'hook/useRedux';
import LottieView from 'lottie-react-native';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface Props {
    hasLogo?: boolean;
    opacityBackground?: number;
}

const LoadingScreen = (props: Props) => {
    const {hasLogo = true, opacityBackground = 0.9} = props;
    const theme = Redux.getTheme();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: theme.backgroundColor,
                    opacity: opacityBackground,
                },
            ]}>
            {hasLogo && (
                <LottieView
                    source={Images.images.loadingPlane}
                    style={styles.iconFly}
                    autoPlay
                    loop
                    speed={1}
                />
            )}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconFly: {
        width: '100@ms',
        height: '100@ms',
    },
});

export default LoadingScreen;
