import {LoadingIcon} from 'feature/profile/screens';
import {useTheme} from 'hook';
import React, {
  JSXElementConstructor,
  ReactElement,
  forwardRef,
  useRef,
} from 'react';
import {
  FlatList,
  FlatListProps,
  RefreshControl,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {moderateScale, verticalScale} from 'utility/scale';
import StyleText from './StyleText';

interface StyleListProps<T = any> extends FlatListProps<T> {
  data: Array<T>;
  ListHeaderComponent?: any;
  loadingMore?: boolean;
  disableRefresh?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  initLoading?: boolean;
  renderItem: ({
    item,
    index,
  }: {
    item: T;
    index: number;
  }) => ReactElement<any, string | JSXElementConstructor<any>> | null;
}

const StyleList = (props: StyleListProps, ref: any) => {
  const {refreshing, onRefresh, onLoadMore, loadingMore, initLoading} = props;
  const theme = useTheme();

  const listRef = useRef<FlatList>(null);

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };
  const handleLoadMore = () => {
    if (onLoadMore) {
      onLoadMore();
    }
  };

  if (initLoading) {
    return (
      <View style={$loadingMore}>
        <LoadingIcon />
      </View>
    );
  }

  // render_view
  const renderFooterView = () => {
    // if (loadingMore) {
    //   return (
    //     <View style={$loadingMore}>
    //       {props.data.length ? (
    //         <ActivityIndicator size="small" color={theme.p_700} />
    //       ) : (
    //         <LoadingIcon />
    //       )}
    //     </View>
    //   );
    // }
    return null;
  };
  const renderEmptyView = () => {
    return (
      <StyleText
        originValue="----"
        customStyle={[$textEmpty, {color: theme.p_700}]}
      />
    );
  };

  return (
    <FlatList
      ref={ref || listRef}
      initialNumToRender={20}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={!!refreshing}
          onRefresh={handleRefresh}
          tintColor={theme.p_700}
          colors={[theme.p_700]}
        />
      }
      onEndReached={handleLoadMore}
      ListFooterComponent={renderFooterView}
      ListEmptyComponent={renderEmptyView}
      nestedScrollEnabled
      {...props}
    />
  );
};

const $loadingMore: ViewStyle = {
  width: '100%',
  marginVertical: verticalScale(20),
  alignItems: 'center',
};
const $textEmpty: TextStyle = {
  fontSize: moderateScale(17),
  alignSelf: 'center',
  marginTop: verticalScale(40),
};

export default forwardRef(StyleList);
