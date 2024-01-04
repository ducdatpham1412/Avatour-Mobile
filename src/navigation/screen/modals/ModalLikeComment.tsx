import {APP_EVENT, RELATIONSHIP} from 'asset/enum';
import {Metrics, safePaddingNotZero, verticalMargin} from 'asset/metrics';
import {AppModalize} from 'components';
import {StyleList} from 'components/base';
import {ItemUserLiked} from 'feature/profile/components';
import {useLikes} from 'feature/profile/hooks';
import {useAppEvent, useSafeArea} from 'hook';
import React, {
  ElementRef,
  ForwardedRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {ViewStyle} from 'react-native';
import {onGoToProfile} from 'utility/assistant';
import {impactLight} from 'utility/haptic';
import {scale} from 'utility/scale';
import {ModalAlert} from '.';

type Refs = {
  postId: number;
  type: 'sale' | 'tour';
};

const ModalLikeComment = (
  _: any,
  ref: ForwardedRef<TypeShowModalize<Refs>>,
) => {
  const {paddingBottom} = useSafeArea();

  const [params, setParams] = useState<Refs>();
  const [{data, loading, validating, loadingFollow}, {mutate, followUnFollow}] =
    useLikes(params);

  const modalRef = useRef<ElementRef<typeof AppModalize>>(null);
  const idLoadingFollow = useRef<number>();

  useAppEvent(APP_EVENT.followUser, e => {
    mutate(
      pre => {
        if (pre) {
          const checkIncluded = pre.find(item => item.creator?.id === e.userId);
          if (!checkIncluded) {
            return pre;
          }

          return pre.map(item => {
            if (item.creator?.id !== e.userId) {
              return item;
            }
            return {
              ...item,
              creator: {
                ...item.creator,
                relationship:
                  e.event === 'follow'
                    ? RELATIONSHIP.following
                    : RELATIONSHIP.notFollowing,
              },
            };
          });
        }
      },
      {revalidate: false},
    );
  });

  useImperativeHandle(
    ref,
    () => ({
      show: v => {
        setParams(v);
        modalRef.current?.show();
      },
      hide: () => {
        modalRef.current?.hide();
      },
    }),
    [],
  );

  const renderItem = useCallback(
    ({item}: {item: TypeUserLike}) => {
      return (
        <ItemUserLiked
          item={item}
          onPress={() => onGoToProfile(item.creator.id)}
          onPressFollow={async () => {
            try {
              idLoadingFollow.current = item.id;
              impactLight();
              await followUnFollow(item);
            } catch (err) {
              ModalAlert.error({
                content: err,
              });
            } finally {
              idLoadingFollow.current = undefined;
            }
          }}
          loading={loadingFollow && idLoadingFollow.current === item.id}
        />
      );
    },
    [loadingFollow, followUnFollow],
  );

  return (
    <AppModalize
      ref={modalRef}
      modalHeight={Metrics.height * 0.8}
      containerStyle={$container}>
      <StyleList
        data={data ?? []}
        renderItem={renderItem}
        contentContainerStyle={[$content, {paddingBottom}]}
        keyExtractor={item => String(item?.id)}
        initLoading={loading}
        refreshing={validating}
        onRefresh={mutate}
      />
    </AppModalize>
  );
};

const $container: ViewStyle = {
  paddingHorizontal: scale(20),
};
const $content: ViewStyle = {
  gap: verticalMargin,
  paddingTop: safePaddingNotZero,
};

export default forwardRef(ModalLikeComment);
