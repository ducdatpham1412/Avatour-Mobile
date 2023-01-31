import {GENDER_TYPE} from 'asset/enum';
import Images from 'asset/img/images';
import Theme from 'asset/theme/Theme';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import React, {useEffect, useRef} from 'react';
import {Animated, View} from 'react-native';
import {scale, ScaledSheet} from 'react-native-size-matters';

const listGender = [
    {
        id: GENDER_TYPE.man,
        source: Images.icons.boy,
    },
    {
        id: GENDER_TYPE.woman,
        source: Images.icons.girl,
    },
    {
        id: GENDER_TYPE.notToSay,
        source: Images.icons.lgbt,
    },
];

interface Props {
    gender: number;
    setGender: Function;
}

const genderBoxSize = scale(80);

const GenderSwipe = (props: Props) => {
    const {gender, setGender} = props;

    const translateX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let distance = 0;
        if (gender === GENDER_TYPE.man) {
            distance = genderBoxSize;
        } else if (gender === GENDER_TYPE.woman) {
            distance = 0;
        } else if (gender === GENDER_TYPE.notToSay) {
            distance = -genderBoxSize;
        }
        Animated.spring(translateX, {
            toValue: distance,
            useNativeDriver: true,
        }).start();
    }, [gender]);

    return (
        <View style={styles.container}>
            <StyleText
                i18Text="login.detailInformation.firstChooseGender"
                customStyle={styles.title}
            />
            <Animated.View
                style={[styles.animateView, {transform: [{translateX}]}]}>
                {listGender.map(item => {
                    const isChoose = item.id === gender;
                    const opacity = isChoose ? 1 : 0.4;
                    return (
                        <StyleTouchable
                            key={item.id}
                            customStyle={styles.genderBox}
                            onPress={() => setGender(item.id)}>
                            <StyleImage
                                source={item.source}
                                customStyle={[styles.iconGender, {opacity}]}
                            />
                        </StyleTouchable>
                    );
                })}
            </Animated.View>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        height: '140@vs',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: '15@ms',
        color: Theme.common.white,
    },
    animateView: {
        width: genderBoxSize * 3,
        height: genderBoxSize,
        flexDirection: 'row',
        marginTop: '20@vs',
    },
    genderBox: {
        width: '80@s',
        height: '80@s',
    },
    iconGender: {
        width: '90%',
        height: '90%',
    },
});

export default GenderSwipe;
