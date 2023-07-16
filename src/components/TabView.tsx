import {useTheme} from 'hook';
import React, {
  ForwardedRef,
  forwardRef,
  FunctionComponent,
  ReactNode,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  LayoutChangeEvent,
  ScrollView,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import {SceneMap, TabView as TabViewRoot} from 'react-native-tab-view';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {StyleTouchable} from './base';
import {horizontalPadding} from 'asset/metrics';
import {borderWidthTiny} from 'utility/assistant';

interface TabViewProps {
  listElements: FunctionComponent[];
  listIconTabBar?: ReactNode[];
  RightButtonTabBar?: ReactNode; // Only for tabBarType = 'scroll'
  style?: StyleProp<ViewStyle>;
  tabBarStyle?: StyleProp<ViewStyle>;
  tabBarElementScrollWidth?: number;
  indicatorStyle?: StyleProp<ViewStyle>;
  initialIndex?: number;
  onChangeIndex?: (value: number) => void;
  indicatorWidthRatio?: number;
  tabBarType?: 'fix-width' | 'scroll';
  lazy?: boolean;
  onLayOut?: (e: LayoutChangeEvent) => void;
}

interface TypeTabViewRef {
  navigateToIndex: (value: number) => void;
}

const tabBarScrollMargin = scale(8);

const TabView = (
  {
    listElements,
    listIconTabBar = [],
    RightButtonTabBar,
    style,
    tabBarStyle,
    tabBarElementScrollWidth = moderateScale(100),
    indicatorStyle,
    initialIndex = 0,
    onChangeIndex,
    indicatorWidthRatio = 0.5,
    tabBarType = 'fix-width',
    lazy = true,
    onLayOut,
  }: TabViewProps,
  ref: ForwardedRef<TypeTabViewRef>,
) => {
  const theme = useTheme();

  const initValue = useMemo(() => {
    return {
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
    };
  }, [listElements.length]);

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
    if (tabBarType === 'fix-width') {
      return (
        <View style={[$tabBar, tabBarStyle]}>
          <View style={$tabBarView}>
            {initValue.route.map((_, _index) => {
              return (
                <StyleTouchable
                  key={_index}
                  customStyle={$tabBarBox}
                  //   normalOpacity={_index === index ? 1 : 0.4}
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
    }

    if (tabBarType === 'scroll') {
      return (
        <View style={[$tabBar, tabBarStyle]}>
          <ScrollView
            style={$scroll}
            contentContainerStyle={$scrollContent}
            horizontal
            showsHorizontalScrollIndicator={false}>
            <Animated.View
              style={[
                $indicatorScroll,
                {backgroundColor: theme.p_800},
                indicatorStyle,
                {
                  width: indicatorWidth,
                  transform: [{translateX: translateXIndicator.current}],
                },
              ]}
            />
            {initValue.route.map((_, _index) => {
              return (
                <StyleTouchable
                  key={_index}
                  customStyle={[
                    $tabBarScrollBox,
                    {
                      borderColor: theme.gray_600,
                      width: tabBarElementScrollWidth,
                      marginRight: tabBarScrollMargin,
                    },
                  ]}
                  //   normalOpacity={_index === index ? 1 : 0.4}
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
            {RightButtonTabBar}
          </ScrollView>
        </View>
      );
    }

    return null;
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
        if (tabBarType === 'fix-width') {
          const newTranslateX =
            (nativeEvent.position + nativeEvent.offset) * indicatorWidth;
          translateXIndicator.current.setValue(newTranslateX);
        } else if (tabBarType === 'scroll') {
          const newTranslateX =
            (nativeEvent.position + nativeEvent.offset) *
            (indicatorWidth + tabBarScrollMargin);
          translateXIndicator.current.setValue(newTranslateX);
        }
      }}
      lazy={lazy}
      onLayout={onLayOut}
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
const $scroll: ViewStyle = {
  width: '100%',
  height: moderateScale(30),
};
const $scrollContent: ViewStyle = {
  paddingHorizontal: horizontalPadding,
};
const $tabBarScrollBox: ViewStyle = {
  height: moderateScale(30),
  borderWidth: borderWidthTiny,
  borderRadius: 100,
  alignItems: 'center',
  justifyContent: 'center',
};
const $indicatorScroll: ViewStyle = {
  position: 'absolute',
  left: horizontalPadding,
  height: moderateScale(30),
  backgroundColor: 'red',
  borderRadius: 100,
};

export default forwardRef(TabView);
