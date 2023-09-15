import {apiFollowUser, apiGetListFollow} from 'api/profile';
import {updatePassport} from 'app-redux';
import Store, {useAppSelector} from 'app-redux/store';
import {FONT_WEIGHT_MEDIUM} from 'asset';
import {APP_EVENT, RELATIONSHIP, TYPE_FOLLOW} from 'asset/enum';
import {verticalMargin} from 'asset/metrics';
import {Separator, TabView} from 'components';
import {StyleContainer, StyleText} from 'components/base';
import StyleList from 'components/base/StyleList';
import {useAppEvent, useSafeArea, useTheme} from 'hook';
import usePaging from 'hook/usePaging';
import {AppParamsList} from 'navigation/config';
import ROOT_SCREEN from 'navigation/config/routes';
import React, {useCallback, useEffect, useRef} from 'react';
import {TextStyle, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {scale} from 'utility/scale';
import ItemFollow from './components/ItemFollow';
import {useOtherProfile} from './hooks';
import {ModalAlert} from 'navigation/screen/modals';
import {copyObject} from 'utility/assistant';
import {impactLight} from 'utility/haptic';

interface Props {
  profile: TypeGetProfileResponse;
  type: 'follower' | 'following';
}

const FollowerScreen = ({profile, type}: Props) => {
  const {bottom} = useSafeArea();
  const {id: myId} = useAppSelector(
    state => state.accountSlice.passport.profile,
  );
  const [, {mutate}] = useOtherProfile(profile.id, {
    initValue: profile,
  });

  const isMyProfile = useRef(false);
  isMyProfile.current = myId === profile.id;

  const {
    list,
    setList,
    refreshing,
    onRefresh,
    onLoadMore,
    initLoading,
    loadingMore,
    data,
  } = usePaging<TypeFollow>({
    request: apiGetListFollow,
    params: {
      userId: profile.id,
      type: type === 'follower' ? TYPE_FOLLOW.follower : TYPE_FOLLOW.following,
    },
  });

  useAppEvent(APP_EVENT.followUser, e => {
    setList(pre => {
      return pre.map(p => {
        if (p.id !== e.userId) {
          return p;
        }
        return {
          ...p,
          relationship:
            e.event === 'follow'
              ? RELATIONSHIP.following
              : RELATIONSHIP.notFollowing,
        };
      });
    });
  });

  useEffect(() => {
    if (data?.totalItems) {
      if (isMyProfile.current) {
        updatePassport({
          profile:
            type === 'follower'
              ? {
                  followers: data?.totalItems,
                }
              : {
                  followings: data?.totalItems,
                },
        });
      } else {
        mutate(
          pre => {
            if (pre) {
              if (type === 'follower') {
                return {
                  ...pre,
                  followers: data?.totalItems,
                };
              }
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
  }, [data?.totalItems, type]);

  const onFollow = async (item: TypeFollow) => {
    let savedList: TypeFollow[] = [];
    try {
      setList(pre => {
        savedList = copyObject(pre);
        return pre.map(p => {
          if (p.id !== item.id) {
            return p;
          }
          return {
            ...p,
            relationship: RELATIONSHIP.following,
          };
        });
      });
      impactLight();
      await apiFollowUser(item.id);
      const currentProfile = Store.getState().accountSlice.passport.profile;
      updatePassport({
        profile: {
          followings: currentProfile.followings + 1,
        },
      });
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
      setList(savedList);
    }
  };

  const renderItem = useCallback(({item}: {item: TypeFollow}) => {
    return <ItemFollow item={item} onFollow={() => onFollow(item)} />;
  }, []);

  return (
    <StyleList
      data={list}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onLoadMore={onLoadMore}
      initLoading={initLoading}
      loadingMore={loadingMore}
      contentContainerStyle={[$contentContainer, {paddingBottom: bottom}]}
      ItemSeparatorComponent={Separator}
    />
  );
};

/**
 * Boss here
 */
const ListFollows = ({
  route,
}: RouteParams<AppParamsList[ROOT_SCREEN.listFollows]>) => {
  const {initTab, profile} = route.params;
  const {modeExp} = useAppSelector(state => state.accountSlice);
  const theme = useTheme();

  const follower = () => {
    if (modeExp) {
      return null;
    }
    return <FollowerScreen profile={profile} type="follower" />;
  };

  const following = () => {
    if (modeExp) {
      return null;
    }
    return <FollowerScreen profile={profile} type="following" />;
  };

  return (
    <StyleContainer
      headerProps={{
        title: profile.name as I18Normalize,
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
  paddingHorizontal: scale(40),
};
const $titleTabBar: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $contentContainer: ViewStyle = {
  paddingHorizontal: scale(24),
  paddingTop: verticalMargin,
};

export default ListFollows;
