import {useTheme} from 'hook';
import React, {
  ForwardedRef,
  forwardRef,
  FunctionComponent,
  ReactNode,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {Animated, StyleProp, View, ViewStyle} from 'react-native';
import {SceneMap, TabView as TabViewRoot} from 'react-native-tab-view';
import {moderateScale, verticalScale} from 'utility/scale';
import {StyleTouchable} from './base';

interface TabViewProps {
  listElements: FunctionComponent[];
  listIconTabBar?: ReactNode[];
  style?: StyleProp<ViewStyle>;
  tabBarStyle?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
  initialIndex?: number;
  onChangeIndex?: (value: number) => void;
  indicatorWidthRatio?: number;
}

interface TypeTabViewRef {
  navigateToIndex: (value: number) => void;
}

const TabView = (
  {
    listElements,
    listIconTabBar = [],
    style,
    tabBarStyle,
    indicatorStyle,
    initialIndex = 0,
    onChangeIndex,
    indicatorWidthRatio = 0.5,
  }: TabViewProps,
  ref: ForwardedRef<TypeTabViewRef>,
) => {
  const theme = useTheme();

  const initValue = useRef({
    route: listElements.map((_, index) => ({
      key: String(index),
      title: '',
    })),
    scene: () => {
      const res: Record<string, FunctionComponent> = {};
      listElements.forEach((item, index) => {
        res[String(index)] = item;
      });
      return res;
    },
  }).current;
  const translateXIndicator = useRef(new Animated.Value(0));

  const [index, setIndex] = useState(initialIndex);
  const [indicatorWidth, setIndicatorWidth] = useState(0);

  useImperativeHandle(
    ref,
    () => ({
      navigateToIndex: value => {
        setIndex(value);
        onChangeIndex?.(value);
      },
    }),
    [],
  );

  const renderTabBar = () => {
    return (
      <View style={[$tabBar, tabBarStyle]}>
        <View style={$tabBarView}>
          {initValue.route.map((_, _index) => {
            return (
              <StyleTouchable
                customStyle={[$tabBarBox]}
                normalOpacity={_index === index ? 1 : 0.4}
                onLayout={e => {
                  if (_index === 0) {
                    setIndicatorWidth(e.nativeEvent.layout.width);
                    translateXIndicator.current.setValue(
                      e.nativeEvent.layout.width * initialIndex,
                    );
                  }
                }}
                onPress={() => {
                  setIndex(_index);
                  onChangeIndex?.(_index);
                }}>
                {listIconTabBar?.[_index]}
              </StyleTouchable>
            );
          })}
        </View>
        <View style={[$indicator, indicatorStyle]}>
          <Animated.View
            style={{
              width: indicatorWidth,
              transform: [{translateX: translateXIndicator.current}],
              alignItems: 'center',
            }}>
            <View
              style={[
                $indicatorView,
                {
                  width: indicatorWidth * indicatorWidthRatio,
                  backgroundColor: theme.black,
                },
              ]}
            />
          </Animated.View>
        </View>
      </View>
    );
  };

  return (
    <TabViewRoot
      navigationState={{index, routes: initValue.route}}
      renderScene={SceneMap(initValue.scene())}
      style={style}
      onIndexChange={value => {
        setIndex(value);
        onChangeIndex?.(value);
      }}
      renderTabBar={renderTabBar}
      onPageScroll={({nativeEvent}) => {
        const newTranslateX =
          (nativeEvent.position + nativeEvent.offset) * indicatorWidth;
        translateXIndicator.current.setValue(newTranslateX);
      }}
      lazy
    />
  );
};

const $tabBar: ViewStyle = {
  width: '100%',
  paddingTop: verticalScale(12),
};
const $tabBarView: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
};
const $tabBarBox: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
};
const $indicator: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(8),
};
const $indicatorView: ViewStyle = {
  height: moderateScale(1),
};

export default forwardRef(TabView);
