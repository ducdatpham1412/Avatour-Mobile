import {useTheme} from 'hook';
import React, {forwardRef, useRef} from 'react';
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  RefreshControl,
  View,
} from 'react-native';
import StyleText from './StyleText';

interface StyleListProps extends FlatListProps<any> {
  data: any;
  ListHeaderComponent?: any;
  loading?: boolean;
  loadingMore?: boolean;
  disableRefresh?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onLoadMore?: () => void;
}

const StyleList = (props: StyleListProps, ref: any) => {
  const {refreshing, onRefresh, onLoadMore, loadingMore} = props;
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

  // render_view
  const renderFooterView = () => {
    if (loadingMore) {
      return (
        <View
          style={{
            width: '100%',
            marginVertical: 20,
          }}>
          <ActivityIndicator size="small" color={theme.p_800} />
        </View>
      );
    }
    return null;
  };
  const renderEmptyView = () => {
    return (
      <StyleText
        originValue="----"
        customStyle={{
          fontSize: 17,
          color: theme.gray_500,
          alignSelf: 'center',
          marginTop: 40,
        }}
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
          refreshing={!!refreshing}
          onRefresh={handleRefresh}
          tintColor={theme.p_800}
          colors={[theme.p_800]}
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

export default forwardRef(StyleList);
