import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import ImageZoomAndCrop from 'react-native-image-zoom-and-crop';
import {ScaledSheet} from 'react-native-size-matters';

interface Props {
    width: number;
    height: number;
    url: string;
    onChangeCropperParams(params: {url: string; value: any}): void;
}

const EditZoomCropImage = (props: Props) => {
    const {width, height, url, onChangeCropperParams} = props;
    const timeOutCheck = useRef<any>();
    const [cropperParams, setCropperParams] = useState({});

    useEffect(() => {
        clearTimeout(timeOutCheck.current);
        timeOutCheck.current = setTimeout(() => {
            onChangeCropperParams({url, value: cropperParams});
        }, 300);
    }, [cropperParams]);

    return (
        <View style={[styles.container, {width, height}]}>
            <ImageZoomAndCrop
                imageUri={url}
                cropAreaWidth={width}
                cropAreaHeight={height}
                setCropperParams={setCropperParams}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        justifyContent: 'center',
    },
});

export default EditZoomCropImage;
