import {Metrics} from 'asset/metrics';
import StyleTouchHaveDouble from 'components/base/StyleTouchHaveDouble';
import React, {useState} from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import Video, {VideoProperties} from 'react-native-video';

interface Props extends VideoProperties {
    onDoublePress(): void;
}

const screenWidth = Metrics.width;

const VideoBubble = (props: Props) => {
    const {onDoublePress} = props;
    const [height, setHeight] = useState(0);

    return (
        <StyleTouchHaveDouble
            style={styles.container}
            onDoubleClick={onDoublePress}>
            <Video
                style={[styles.container, {height}]}
                onLoad={e => {
                    let ratio = 1;
                    if (e.naturalSize.orientation === 'landscape') {
                        ratio = e.naturalSize.height / e.naturalSize.width;
                    } else if (e.naturalSize.orientation === 'portrait') {
                        ratio = e.naturalSize.width / e.naturalSize.height;
                    }
                    ratio = ratio > 1.3 ? 1.3 : ratio;
                    setHeight(ratio * screenWidth);
                }}
                controls
                resizeMode="cover"
                {...props}
            />
        </StyleTouchHaveDouble>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
    },
});

export default VideoBubble;
