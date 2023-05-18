/* eslint-disable react-hooks/rules-of-hooks */
import {TypeFollowResponse} from 'api/interface';
import {apiGetListFollow} from 'api/profile';
import {TYPE_FOLLOW} from 'asset/enum';
import {TabView} from 'components';
import {StyleContainer, StyleText} from 'components/base';
import StyleList from 'components/base/StyleList';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import {AppParamsList} from 'navigation/config';
import ROOT_SCREEN from 'navigation/config/routes';
import React, {useEffect} from 'react';
import {ViewStyle} from 'react-native';
import {modeExpUsePaging} from 'utility/assistant';
import {I18Normalize} from 'utility/I18Next';
import ItemFollow from './components/ItemFollow';

interface Props {
  userId: number;
}

const RenderItem = (item: TypeFollowResponse) => {
  return <ItemFollow item={item} />;
};

const FollowerScreen = ({userId}: Props) => {
  const theme = Redux.getTheme();
  const isModeExp = Redux.getModeExp();

  const {list, refreshing, onRefresh, onLoadMore, setParams} = isModeExp
    ? modeExpUsePaging()
    : usePaging({
        request: apiGetListFollow,
        params: {
          userId,
          typeFollow: TYPE_FOLLOW.follower,
        },
        isInitNotRunRequest: true,
      });

  useEffect(() => {
    setParams({userId, typeFollow: TYPE_FOLLOW.follower});
  }, [userId]);

  return (
    <StyleList
      data={list}
      renderItem={({item}: any) => RenderItem(item)}
      style={{backgroundColor: theme.backgroundColor}}
      keyExtractor={item => item.id}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onLoadMore={onLoadMore}
    />
  );
};

const FollowingScreen = ({userId}: Props) => {
  const theme = Redux.getTheme();
  const isModeExp = Redux.getModeExp();

  const {list, refreshing, onRefresh, onLoadMore, setParams} = isModeExp
    ? modeExpUsePaging()
    : usePaging({
        request: apiGetListFollow,
        params: {
          userId,
          typeFollow: TYPE_FOLLOW.following,
        },
        isInitNotRunRequest: true,
      });

  useEffect(() => {
    setParams({userId, typeFollow: TYPE_FOLLOW.following});
  }, [userId]);

  return (
    <StyleList
      data={list}
      renderItem={({item}: any) => RenderItem(item)}
      style={{backgroundColor: theme.backgroundColor}}
      keyExtractor={item => item.id}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onLoadMore={onLoadMore}
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
      contentContainerStyle={$container}>
      <TabView
        listElements={[follower, following]}
        listIconTabBar={[
          <StyleText i18Text="profile.follower" />,
          <StyleText i18Text="profile.following" />,
        ]}
        initialIndex={initTab === 'following' ? 1 : 0}
      />
    </StyleContainer>
  );
};

const $container: ViewStyle = {
  paddingHorizontal: 0,
};

export default ListFollows;
