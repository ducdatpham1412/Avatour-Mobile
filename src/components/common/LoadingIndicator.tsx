import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface Props {
    color: string;
}

const LoadingIndicator = ({color}: Props) => {
    return (
        <View style={styles.loadingMoreView}>
            <ActivityIndicator color={color} />
        </View>
    );
};

const styles = ScaledSheet.create({
    loadingMoreView: {
        width: '100%',
        height: '100@vs',
        justifyContent: 'center',
    },
});

export default LoadingIndicator;
