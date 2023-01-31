import {Metrics} from 'asset/metrics';
import {DELAY_LONG_PRESS} from 'asset/standardValue';
import {StyleImage, StyleTouchable} from 'components/base';
import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';

interface Props {
    imageUrl: string;
    total: number;
    onPress(): void;
    onLongPress(): void;
}

const MessageImage = ({imageUrl, total, onPress, onLongPress}: Props) => {
    const [imgHeight, setImgHeight] = useState(0);

    useEffect(() => {
        Image.getSize(imageUrl, (width, height) => {
            if (total === 2) {
                setImgHeight(verticalScale(80));
            } else {
                const percent = height / width;
                // the width of image box, see in ItemMessage
                const imageBoxWidth = Metrics.width * 0.7;
                setImgHeight(imageBoxWidth * percent);
            }
        });
    }, []);

    return (
        <StyleTouchable
            customStyle={styles.container}
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.9}
            delayLongPress={DELAY_LONG_PRESS}>
            <StyleImage
                source={{uri: imageUrl}}
                customStyle={[styles.image, {height: imgHeight}]}
            />
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingLeft: '5@s',
    },
    image: {
        width: '100%',
        borderRadius: '10@s',
    },
});

export default MessageImage;
