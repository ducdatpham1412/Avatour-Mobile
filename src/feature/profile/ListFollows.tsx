import {TypeFollowResponse} from 'api/interface';
import {apiGetListFollow} from 'api/profile';
import {updatePassport} from 'app-redux';
import {useAppSelector} from 'app-redux/store';
import {FONT_WEIGHT_MEDIUM} from 'asset';
import {TYPE_FOLLOW} from 'asset/enum';
import {TabView} from 'components';
import {StyleContainer, StyleText} from 'components/base';
import StyleList from 'components/base/StyleList';
import {useTheme} from 'hook';
import usePaging from 'hook/usePaging';
import {AppParamsList} from 'navigation/config';
import ROOT_SCREEN from 'navigation/config/routes';
import React, {useEffect} from 'react';
import {TextStyle, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {scale} from 'utility/scale';
import ItemFollow from './components/ItemFollow';
import {useOtherProfile} from './hooks';

interface Props {
  userId: number;
}

const renderItem = (item: TypeFollowResponse) => {
  return <ItemFollow item={item} />;
};

const FollowerScreen = ({userId}: Props) => {
  const {
    modeExp,
    passport: {profile},
  } = useAppSelector(state => state.accountSlice);
  const isMyProfile = profile.id === userId;
  const [_, {mutate}] = isMyProfile
    ? [{}, {mutate: () => null}]
    : useOtherProfile(userId, {revalidateAll: false});

  if (modeExp) {
    return null;
  }

  const {
    list,
    refreshing,
    onRefresh,
    onLoadMore,
    initLoading,
    loadingMore,
    data,
  } = usePaging({
    request: apiGetListFollow,
    params: {
      userId,
      type: TYPE_FOLLOW.follower,
    },
  });

  useEffect(() => {
    if (data?.totalItems) {
      if (isMyProfile) {
        updatePassport({
          profile: {
            followers: data?.totalItems,
          },
        });
      } else {
        mutate(
          pre => {
            if (pre) {
              return {
                ...pre,
                followers: data?.totalItems,
              };
            }
          },
          {revalidate: false},
        );
      }
    }
  }, [data?.totalItems, isMyProfile]);

  return (
    <StyleList
      data={list}
      renderItem={({item}: any) => renderItem(item)}
      keyExtractor={item => item.id}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onLoadMore={onLoadMore}
      loading={initLoading}
      loadingMore={loadingMore}
      contentContainerStyle={$contentContainer}
    />
  );
};

const FollowingScreen = ({userId}: Props) => {
  const {
    modeExp,
    passport: {profile},
  } = useAppSelector(state => state.accountSlice);
  const isMyProfile = profile.id === userId;
  const [_, {mutate}] = isMyProfile
    ? [{}, {mutate: () => null}]
    : useOtherProfile(userId, {revalidateAll: false});

  if (modeExp) {
    return null;
  }

  const {
    list,
    refreshing,
    onRefresh,
    onLoadMore,
    loadingMore,
    initLoading,
    data,
  } = usePaging({
    request: apiGetListFollow,
    params: {
      userId,
      type: TYPE_FOLLOW.following,
    },
  });

  useEffect(() => {
    if (data?.totalItems) {
      if (isMyProfile) {
        updatePassport({
          profile: {
            followings: data?.totalItems,
          },
        });
      } else {
        mutate(
          pre => {
            if (pre) {
              return {
                ...pre,
                followings: data?.totalItems,
              };
            }
          },
          {revalidate: false},
        );
      }
    }
  }, [data?.totalItems, isMyProfile]);

  return (
    <StyleList
      data={list}
      renderItem={({item}: any) => renderItem(item)}
      keyExtractor={item => item.id}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onLoadMore={onLoadMore}
      loading={initLoading}
      loadingMore={loadingMore}
      contentContainerStyle={$contentContainer}
    />
  );
};

/**
 * Boss here
 */
const ListFollows = ({
  route,
}: RouteParams<AppParamsList[ROOT_SCREEN.listFollows]>) => {
  const {userId, name, initTab} = route.params;
  const theme = useTheme();

  const follower = () => {
    return <FollowerScreen userId={userId} />;
  };

  const following = () => {
    return <FollowingScreen userId={userId} />;
  };

  return (
    <StyleContainer
      headerProps={{
        title: name as I18Normalize,
      }}
      customStyle={$container}
      scrollEnabled={false}
      backgroundColor={theme.white}>
      <TabView
        listElements={[follower, following]}
        listIconTabBar={[
          <StyleText i18Text="profile.follower" customStyle={$titleTabBar} />,
          <StyleText i18Text="profile.following" customStyle={$titleTabBar} />,
        ]}
        initialIndex={initTab === 'following' ? 1 : 0}
        tabBarStyle={$tabBar}
      />
    </StyleContainer>
  );
};

const $container: ViewStyle = {
  paddingHorizontal: 0,
};
const $tabBar: ViewStyle = {
  paddingHorizontal: scale(70),
};
const $titleTabBar: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $contentContainer: ViewStyle = {
  paddingHorizontal: scale(20),
};

export default ListFollows;
