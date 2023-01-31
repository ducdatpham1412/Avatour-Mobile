import {StyleImage} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

const BackgroundAuthen = () => {
    const {imageBackground} = Redux.getResource();

    return (
        <View style={styles.backgroundView}>
            <StyleImage
                source={{uri: imageBackground}}
                customStyle={styles.imageBackground}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    backgroundView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: -1,
    },
    imageBackground: {
        width: '100%',
        height: '100%',
    },
});

export default BackgroundAuthen;
