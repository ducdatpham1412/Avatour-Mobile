import {apiFollowUser, apiUnFollowUser} from 'api/profile';
import {apiBlockUser, apiUnBlockUser} from 'api/setting';
import {RELATIONSHIP} from 'asset/enum';
import {Mutex, withTimeout} from 'async-mutex';
import {useApi} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {ROOT_SCREEN} from 'navigation/config';
import {ModalAlert} from 'navigation/screen/modals';

const useOtherProfile = (id: number) => {
  const mutex = withTimeout(new Mutex(), 30000);
  const {data, mutate, loading, error} = useApi<TypeGetProfileResponse>({
    path: `/profile/${id}`,
    config: {
      revalidateAll: true,
    },
  });

  const isFollowing = data?.relationship === RELATIONSHIP.following;
  const isBlocked = data?.relationship === RELATIONSHIP.block;

  const follow = async () => {
    if (data) {
      if (mutex.isLocked()) {
        return;
      }
      const release = await mutex.acquire();
      try {
        if (!isFollowing) {
          await apiFollowUser(data?.id);
          mutate(
            pre => {
              if (pre) {
                return {
                  ...pre,
                  followers: pre.followers + 1,
                  relationship: RELATIONSHIP.following,
                };
              }
            },
            {revalidate: false},
          );
        } else {
          await apiUnFollowUser(data?.id);
          await mutate(
            pre => {
              if (pre) {
                return {
                  ...pre,
                  followers: pre.followers - 1,
                  relationship: RELATIONSHIP.notFollowing,
                };
              }
            },
            {revalidate: false},
          );
        }
      } catch (err) {
        ModalAlert.error({
          content: err,
        });
      } finally {
        release();
      }
    }
  };

  const block = () => {
    if (data) {
      if (mutex.isLocked()) {
        return;
      }

      const agree = async () => {
        const release = await mutex.acquire();
        try {
          if (isBlocked) {
            await apiUnBlockUser(data?.id);
            await mutate();
          } else {
            await apiBlockUser(data?.id);
            await mutate(
              pre => {
                if (pre) {
                  return {
                    ...pre,
                    relationship: RELATIONSHIP.block,
                  };
                }
              },
              {revalidate: false},
            );
          }
        } catch (err) {
          ModalAlert.error({
            content: err,
          });
        } finally {
          release();
        }
      };

      ModalAlert.options({
        i18Content: 'alert.sureToBlock',
        onContinue: agree,
      });
    }
  };

  const report = () => {
    if (data) {
      navigate(ROOT_SCREEN.reportUser, {
        idUser: data?.id,
      });
    }
  };

  return [
    {data, isFollowing, isBlocked, loading, error},
    {follow, block, report},
  ] as const;
};

export default useOtherProfile;
