import React, {
  ForwardedRef,
  forwardRef,
  FunctionComponent,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {SceneMap, TabView as TabViewRoot} from 'react-native-tab-view';

interface PageScrollEvent {
  nativeEvent: {
    position: number;
    offset: number;
  };
}

interface TabViewProps {
  listElements: FunctionComponent[];
  style?: StyleProp<ViewStyle>;
  onPageScroll?: (e: PageScrollEvent) => void;
  onChangeIndex?: (value: number) => void;
}

interface TypeTabViewRef {
  navigateToIndex: (value: number) => void;
}

const TabView = (
  {listElements, style, onPageScroll, onChangeIndex}: TabViewProps,
  ref: ForwardedRef<TypeTabViewRef>,
) => {
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
  const [index, setIndex] = useState(0);

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

  return (
    <TabViewRoot
      navigationState={{index, routes: initValue.route}}
      renderScene={SceneMap(initValue.scene())}
      style={style}
      onIndexChange={value => {
        setIndex(value);
        onChangeIndex?.(value);
      }}
      renderTabBar={() => null}
      onPageScroll={onPageScroll}
    />
  );
};

export default forwardRef(TabView);
