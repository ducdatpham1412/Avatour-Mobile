import {apiFollowUser, apiUnFollowUser} from 'api/profile';
import {apiBlockUser, apiUnBlockUser} from 'api/setting';
import {APP_EVENT, RELATIONSHIP} from 'asset/enum';
import {emitAppEvent, useApi} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {ROOT_SCREEN} from 'navigation/config';
import {ModalAlert} from 'navigation/screen/modals';
import useSWRMutation from 'swr/mutation';
import {impactLight} from 'utility/haptic';

interface Params {
  initValue?: TypeGetProfileResponse;
  revalidateAll?: boolean;
}

const useOtherProfile = (id: number | null, params?: Params) => {
  const {data, mutate, loading, validating, error} =
    useApi<TypeGetProfileResponse>({
      path: id ? `/profile/${id}` : null,
      config: {
        fallbackData: params?.initValue,
        revalidateAll: params?.revalidateAll,
      },
    });

  const isFollowing = data?.relationship === RELATIONSHIP.following;
  const isBlocked = data?.relationship === RELATIONSHIP.block;

  const {trigger: follow, isMutating: loadingFollow} = useSWRMutation(
    ['api.Follow', data?.id],
    async () => {
      if (data?.id) {
        impactLight();
        if (!isFollowing) {
          await apiFollowUser(data.id);
          await mutate(
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
          emitAppEvent(APP_EVENT.followUser, {
            event: 'follow',
            userId: data.id,
          });
        } else {
          await apiUnFollowUser(data.id);
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
          emitAppEvent(APP_EVENT.followUser, {
            event: 'un-follow',
            userId: data.id,
          });
        }
      }
    },
  );

  const {trigger: block} = useSWRMutation(['api.Block', data?.id], async () => {
    if (data) {
      const agree = async () => {
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
        }
      };

      ModalAlert.options({
        i18Content: 'alert.sureToBlock',
        onContinue: agree,
      });
    }
  });

  const report = () => {
    if (data) {
      navigate(ROOT_SCREEN.reportUser, {
        idUser: data?.id,
      });
    }
  };

  return [
    {data, isFollowing, isBlocked, loading, validating, error, loadingFollow},
    {follow, block, report, mutate},
  ] as const;
};

export default useOtherProfile;
