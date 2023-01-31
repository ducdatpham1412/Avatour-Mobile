import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import React, {useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Video from 'react-native-video';

interface Props {
    uri: string;
}

const PreviewVideo = ({uri}: Props) => {
    const [video, setVideo] = useState({
        height: 0,
        currentTime: 0,
    });

    return (
        <View
            style={[
                styles.container,
                {
                    height: video.height,
                },
            ]}>
            <Video
                source={{uri}}
                style={styles.videoView}
                onLoad={e => {
                    const ratio = e.naturalSize.height / e.naturalSize.width;
                    setVideo({
                        height: ratio * Metrics.width,
                        currentTime: e.duration / 2.5,
                    });
                }}
                paused
                currentTime={video.currentTime}
            />
            <MaterialCommunityIcons
                name="play-pause"
                style={styles.playPauseIcon}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: Metrics.width,
        alignItems: 'center',
        justifyContent: 'center',
    },
    videoView: {
        width: '100%',
        height: '100%',
    },
    playPauseIcon: {
        fontSize: '50@ms',
        position: 'absolute',
        color: Theme.common.white,
        shadowColor: 'black',
        shadowRadius: 10,
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 2,
            height: 2,
        },
    },
});

export default PreviewVideo;
