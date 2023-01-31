import {Metrics} from 'asset/metrics';
import Redux from 'hook/useRedux';
import {goBack, TypeSwipeImages} from 'navigation/NavigationService';
import React from 'react';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import Feather from 'react-native-vector-icons/Feather';
import {StyleTouchable} from './base';
import PanZoomImage from './PanZoomImage';
import StyleTabView from './StyleTabView';

interface Props {
    route: {
        params: TypeSwipeImages;
    };
}

const SwipeImages = ({route}: Props) => {
    const {listImages, initIndex = 0} = route.params;
    const theme = Redux.getTheme();

    return (
        <>
            <StyleTabView
                containerStyle={{
                    height: Metrics.height,
                }}
                initIndex={initIndex}>
                {listImages.map((item, index) => (
                    <PanZoomImage key={index} uri={item.url} />
                ))}
            </StyleTabView>

            <StyleTouchable
                customStyle={[
                    styles.comebackView,
                    {backgroundColor: theme.backgroundButtonColor},
                ]}
                onPress={goBack}
                hitSlop={15}>
                <Feather
                    name="x"
                    style={[styles.iconComeBack, {color: theme.textColor}]}
                />
            </StyleTouchable>
        </>
    );
};

const styles = ScaledSheet.create({
    elementView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    comebackView: {
        position: 'absolute',
        padding: '4@ms',
        right: '20@s',
        top: Metrics.safeTopPadding + verticalScale(10),
        borderRadius: '20@ms',
    },
    iconComeBack: {
        fontSize: '14@ms',
    },
});

export default SwipeImages;
