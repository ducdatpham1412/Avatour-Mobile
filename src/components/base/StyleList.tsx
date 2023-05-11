import {useTheme} from 'hook';
import React, {forwardRef, useRef} from 'react';
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  RefreshControl,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {moderateScale, verticalScale} from 'utility/scale';
import StyleText from './StyleText';

interface StyleListProps extends FlatListProps<any> {
  data: Array<any>;
  ListHeaderComponent?: any;
  loading?: boolean;
  loadingMore?: boolean;
  disableRefresh?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  initLoading?: boolean;
}

const StyleList = (props: StyleListProps, ref: any) => {
  const {refreshing, onRefresh, onLoadMore, loadingMore, initLoading, loading} =
    props;
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
        <ActivityIndicator size="small" color={theme.p_700} />
      </View>
    );
  }

  // render_view
  const renderFooterView = () => {
    if (loadingMore) {
      return (
        <View style={$loadingMore}>
          <ActivityIndicator size="small" color={theme.p_700} />
        </View>
      );
    }
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
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={!!refreshing || !!loading}
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
};
const $textEmpty: TextStyle = {
  fontSize: moderateScale(17),
  alignSelf: 'center',
  marginTop: verticalScale(40),
};

export default forwardRef(StyleList);
