import {apiFollowUser, apiUnFollowUser} from 'api/profile';
import {RELATIONSHIP} from 'asset/enum';
import {useApi} from 'hook';
import useSWRMutation from 'swr/mutation';

type Params = {
  postId: number;
  type: 'sale' | 'tour';
};

const useLikes = (params: Params | undefined) => {
  const {data, loading, validating, mutate} = useApi<TypeUserLike[]>({
    path: params ? `/profile/like/${params.postId}` : null,
    params: {
      type: params?.type,
    },
    config: {
      revalidateAll: true,
    },
  });

  const {trigger: followUnFollow, isMutating: loadingFollow} = useSWRMutation(
    'api.followInLikes',
    async (_, {arg: userLike}: {arg: TypeUserLike}) => {
      const currentFollowed =
        userLike.creator?.relationship === RELATIONSHIP.following;

      if (currentFollowed) {
        await apiUnFollowUser(userLike.creator?.id);
      } else {
        await apiFollowUser(userLike.creator?.id);
      }

      await mutate(
        pre => {
          if (pre) {
            return pre.map(item => {
              if (item.id !== userLike.id) {
                return item;
              }
              return {
                ...item,
                creator: {
                  ...item.creator,
                  relationship: currentFollowed
                    ? RELATIONSHIP.notFollowing
                    : RELATIONSHIP.following,
                },
              };
            });
          }
        },
        {revalidate: false},
      );
    },
  );

  return [
    {data, loading, validating, loadingFollow},
    {mutate, followUnFollow: followUnFollow},
  ] as const;
};

export default useLikes;
