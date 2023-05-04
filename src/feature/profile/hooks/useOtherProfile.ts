import {apiFollowUser, apiUnFollowUser} from 'api/profile';
import {RELATIONSHIP} from 'asset/enum';
import {useApiImmutable} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {ROOT_SCREEN} from 'navigation/config';
import {ModalAlert} from 'navigation/screen/modals';

const useOtherProfile = (id: number) => {
  const {data, mutate, loading, error} =
    useApiImmutable<TypeGetProfileResponse>({
      path: `/profile/${id}`,
    });

  const isFollowing = data?.relationship === RELATIONSHIP.following;
  const isBlocked = data?.relationship === RELATIONSHIP.block;

  const follow = async () => {
    if (data) {
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
          mutate(
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
        ModalAlert.error();
      }
    }
  };

  const block = async () => {
    console.log('block user: ', id);
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
