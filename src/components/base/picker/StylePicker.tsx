import {FONT_SIZE} from 'asset/standardValue';
import Redux from 'hook/useRedux';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import {goBack} from 'navigation/NavigationService';
import React, {useRef, useState} from 'react';
import {Animated, ScrollView, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import StyleContainer from '../StyleContainer';
import StyleText from '../StyleText';
import StyleTouchable from '../StyleTouchable';

interface Props {
  route: {
    params: AppParamsList[ROOT_SCREEN.picker];
  };
}

const StylePicker = ({route}: Props) => {
  const {
    data,
    itemHeight,
    onSetItemSelected,
    initIndex = 0,
    onCancel,
  } = route.params;
  const theme = Redux.getTheme();
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <StyleContainer
      containerStyle={{backgroundColor: 'transparent'}}
      customStyle={styles.container}
      extraHeight={10}>
      <View
        style={[
          styles.body,
          {
            backgroundColor: theme.backgroundColor,
            borderColor: theme.borderColor,
          },
        ]}>
        {/* Header */}
        <View
          style={[styles.headerView, {borderBottomColor: theme.borderColor}]}>
          <StyleTouchable onPress={onCancel || goBack}>
            <StyleText
              i18Text="common.cancel"
              customStyle={[styles.textCancel, {color: theme.textColor}]}
            />
          </StyleTouchable>
          <View style={{flex: 1}} />
          <StyleTouchable
            onPress={() => {
              onSetItemSelected(data[currentIndex]);
              goBack();
            }}>
            <StyleText
              i18Text="common.imageUpload.selected"
              customStyle={[styles.textSelect, {color: theme.textColor}]}
            />
          </StyleTouchable>
        </View>

        {/* Content */}
        <View style={[styles.contentView, {height: itemHeight * 5}]}>
          <View
            style={[
              styles.selectedBox,
              {
                backgroundColor: theme.backgroundButtonColor,
                height: itemHeight,
                top: itemHeight * 2,
              },
            ]}
          />
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={[
              styles.contentScroll,
              {
                paddingTop: itemHeight * 2,
                paddingBottom: itemHeight * 2,
              },
            ]}
            snapToInterval={itemHeight}
            onScroll={event => {
              const newIndex = Math.round(
                event.nativeEvent.contentOffset.y / itemHeight,
              );
              setCurrentIndex(newIndex);
            }}
            onLayout={() =>
              scrollRef.current?.scrollTo({
                y: itemHeight * initIndex,
              })
            }>
            {data.map((item, index) => {
              const isCurrent = index === currentIndex;
              const isByOne = Math.abs(index - currentIndex) === 1;
              const rotateX = isCurrent ? '0deg' : isByOne ? '40deg' : '60deg';
              return (
                <Animated.View
                  key={index}
                  style={{
                    opacity: isCurrent ? 1 : 0.3,
                    transform: [
                      {
                        rotateX,
                      },
                    ],
                    width: '100%',
                    alignItems: 'center',
                  }}>
                  {route.params.renderItem(item)}
                </Animated.View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </StyleContainer>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  body: {
    width: '100%',
    borderWidth: '1@ms',
    borderRadius: '10@ms',
    borderBottomWidth: 0,
  },
  // header view
  headerView: {
    width: '100%',
    paddingVertical: '7@vs',
    paddingHorizontal: '20@s',
    flexDirection: 'row',
    borderBottomWidth: '0.5@ms',
  },
  textCancel: {
    fontSize: FONT_SIZE.normal,
  },
  textSelect: {
    fontSize: FONT_SIZE.normal,
    fontWeight: 'bold',
  },
  // picker view
  contentView: {
    width: '100%',
  },
  selectedBox: {
    width: '100%',
    opacity: 0.5,
    position: 'absolute',
  },
  contentScroll: {
    alignItems: 'center',
    paddingBottom: '30@vs',
  },
});

export default StylePicker;
