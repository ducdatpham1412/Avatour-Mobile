import {useAppSelector} from 'app-redux/store';
import {FONT_SIZE} from 'asset';
import {
  APP_EVENT,
  NOTIFICATION,
  STATUS_NOTIFICATION,
  TYPE_AUTH_REQUEST,
} from 'asset/enum';
import {ImageEmptyWithDesk} from 'asset/icons';
import {verticalMargin} from 'asset/metrics';
import {StyleContainer, StyleList, StyleText} from 'components/base';
import {useAppEvent, useSafeArea, useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {PROFILE_ROUTE, ROOT_SCREEN} from 'navigation/config';
import React, {useCallback, useEffect} from 'react';
import {View, ViewStyle} from 'react-native';
import {verticalScale} from 'utility/scale';
import {ItemNotification} from './components';
import {useNotifications} from './hooks';

const Empty = () => {
  const theme = useTheme();

  return (
    <View style={$empty}>
      <ImageEmptyWithDesk size={300} />
      <StyleText
        i18Text="notification.notHaveNotifications"
        customStyle={{
          fontSize: FONT_SIZE.f3,
          marginTop: verticalMargin,
          color: theme.gray_500,
        }}
      />
    </View>
  );
};

const NotificationScreen = () => {
  const theme = useTheme();
  const {paddingBottom} = useSafeArea();
  const {id: myId} = useAppSelector(
    state => state.accountSlice.passport.profile,
  );

  const [
    {list, initLoading, refreshing, loadingMore},
    {readNotification, onRefresh, onLoadMore},
  ] = useNotifications();

  useAppEvent(APP_EVENT.refreshNotification, onRefresh);

  useEffect(() => {
    onRefresh();
  }, [myId]);

  const onPressNotification = useCallback(async (item: TypeNotification) => {
    if (item.status === STATUS_NOTIFICATION.notRead) {
      readNotification(item.id).catch(err => {
        console.log('Error read notification: ', err);
      });
    }

    if (item.type === NOTIFICATION.request) {
      switch (item.data.type) {
        case TYPE_AUTH_REQUEST.update_bank:
          navigate(ROOT_SCREEN.editProfile);
          break;
        case TYPE_AUTH_REQUEST.update_price:
          navigate(PROFILE_ROUTE.createSale, {
            itemEdit: item?.data?.data?.sale,
          });
          break;
        case TYPE_AUTH_REQUEST.suggest_location:
          navigate(ROOT_SCREEN.otherProfile, {
            id: item?.data?.data?.id,
          });
          break;
        default:
          break;
      }
      return;
    }

    if (item.type === NOTIFICATION.hasNewJoin) {
      navigate(ROOT_SCREEN.detailMeJoin, {
        estimateId: item.data?.id,
        initValue: item?.data,
        mode: 'see-detail',
      });
      return;
    }

    if (item.type === NOTIFICATION.joinGb) {
      navigate(ROOT_SCREEN.detailMeJoin, {
        estimateId: item.data?.id,
        initValue: item?.data,
        mode: 'see-detail',
      });
      return;
    }
  }, []);

  const renderItem = useCallback(({item}: {item: TypeNotification}) => {
    return (
      <ItemNotification item={item} onPress={() => onPressNotification(item)} />
    );
  }, []);

  return (
    <StyleContainer
      headerProps={{
        title: 'notification.title',
        LeftComponent: null,
      }}
      backgroundColor={theme.white}
      customStyle={$container}
      layOut="view">
      <StyleList
        data={list}
        renderItem={renderItem}
        keyExtractor={item => String(item?.id)}
        initLoading={initLoading}
        refreshing={refreshing}
        onRefresh={onRefresh}
        loadingMore={loadingMore}
        onLoadMore={onLoadMore}
        ListEmptyComponent={Empty}
        contentContainerStyle={{paddingBottom}}
      />
    </StyleContainer>
  );
};

const $container: ViewStyle = {
  paddingHorizontal: 0,
};
const $empty: ViewStyle = {
  alignSelf: 'center',
  alignItems: 'center',
  marginTop: verticalScale(100),
};

export default NotificationScreen;
