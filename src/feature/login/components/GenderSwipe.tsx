import {scrollItemHeight} from 'asset';
import {GENDER_TYPE} from 'asset/enum';
import Images from 'asset/img/images';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import React, {useEffect, useRef} from 'react';
import {Animated, ImageStyle, View, ViewStyle} from 'react-native';
import {scale} from 'react-native-size-matters';
import {verticalScale} from 'utility/scale';

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
    <View style={$container}>
      <StyleText i18Text="login.detailInformation.firstChooseGender" />
      <Animated.View style={[$animatedView, {transform: [{translateX}]}]}>
        {listGender.map(item => {
          const isChoose = item.id === gender;
          const opacity = isChoose ? 1 : 0.4;
          return (
            <StyleTouchable
              key={item.id}
              customStyle={$genderBox}
              onPress={() => setGender(item.id)}>
              <StyleImage
                source={item.source}
                customStyle={[$iconGender, {opacity}]}
              />
            </StyleTouchable>
          );
        })}
      </Animated.View>
    </View>
  );
};

const $container: ViewStyle = {
  width: '100%',
  height: scrollItemHeight,
  alignItems: 'center',
  justifyContent: 'center',
};
const $animatedView: ViewStyle = {
  width: genderBoxSize * 3,
  height: genderBoxSize,
  flexDirection: 'row',
  marginTop: verticalScale(12),
};
const $genderBox: ViewStyle = {
  width: genderBoxSize,
  height: genderBoxSize,
};
const $iconGender: ImageStyle = {
  width: '90%',
  height: '90%',
};

export default GenderSwipe;
