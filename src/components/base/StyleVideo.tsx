import React from 'react';
import {VideoProperties} from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';

interface Props extends VideoProperties {
    disableSeekbar?: boolean;
    isOverlay?: boolean;
    onPressOverlay?(): void;
}

const StyleVideo = (props: Props) => {
    return (
        <VideoPlayer
            // onProgress={data => console.log(data)}
            // onEnd={() => ref.current?.seek(0)}
            // onProgress={data => console.log(data)}
            repeat
            controlTimeout={2000}
            tapAnywhereToPause
            {...props}
            controls={false}
            disableTimer
            disablePlayPause
            disableFullscreen
            disableBack
            onPlay={() => null}
            isOverlay={props.isOverlay}
            onPressOverlay={() => props.onPressOverlay?.()}
        />
    );
};

export default StyleVideo;
