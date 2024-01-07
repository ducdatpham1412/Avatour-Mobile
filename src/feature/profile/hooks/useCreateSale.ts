import {apiCreateSale, apiEditSale, apiUpdateStatusSale} from 'api/discovery';
import {useAppSelector} from 'app-redux/store';
import {APP_EVENT, POST_TYPE, STATUS} from 'asset/enum';
import {useDetailSale} from 'feature/common/hooks';
import {emitAppEvent} from 'hook';
import {goBack, navigate} from 'navigation/NavigationService';
import {PROFILE_ROUTE} from 'navigation/config';
import {ModalAlert} from 'navigation/screen/modals';
import {useState} from 'react';
import isEqual from 'react-fast-compare';
import useSWRMutation from 'swr/mutation';
import {getDateTimeNow} from 'utility/format';

export interface UseCreateSaleParams {
  postId: number | undefined;
  name: string;
  content: string;
  images: string[];
  prices: TypePrice[];
  userId: number | undefined;
}

const useCreateSale = (initValue: UseCreateSaleParams) => {
  const {
    passport: {profile},
  } = useAppSelector(state => state.accountSlice);
  const [, {mutate}] = useDetailSale(initValue.postId, {
    revalidateAll: false,
  });

  const [name, setName] = useState(initValue.name);
  const [content, setContent] = useState(initValue.content);
  const [images] = useState(initValue.images);
  const [prices, setPrices] = useState(initValue.prices);

  const [loadingCreate, setLoadingCreate] = useState(false);

  const onConfirmPost = async () => {
    if (!prices?.length || loadingCreate) {
      return;
    }

    setLoadingCreate(true);
    //   const saleImages = await Promise.all(
    //     images.map(async url => {
    //       const base64 = await ImageUploader.convertUrlToBase64(url);
    //       return base64;
    //     }),
    //   );
    const trimName = name.trim();
    const trimContent = content.trim();

    const body: TypeCreateSale = {
      name: trimName,
      content: trimContent,
      images,
      prices,
      userId: initValue.userId,
    };
    try {
      const res = await apiCreateSale(body);
      const newSale: TypeGroupBuying = {
        id: res?.data?.id,
        post_type: POST_TYPE.groupBuying,
        name: trimName,
        content: trimContent,
        images,
        prices,
        total_likes: 0,
        total_comments: 0,
        total_members: 0,
        creator: profile.id,
        creator_name: profile.name,
        creator_avatar: profile.avatar,
        creator_location: profile.location,
        created: getDateTimeNow(),
        is_liked: false,
        status: STATUS.active,
      };
      emitAppEvent(APP_EVENT.createNewSale, {
        newSale,
      });
      ModalAlert.success({
        i18Content: 'profile.createSaleSuccess',
        onClose: () => navigate(PROFILE_ROUTE.myProfile),
      });
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    } finally {
      setLoadingCreate(false);
    }
  };

  const onEditPost = async () => {
    if (initValue?.postId) {
      try {
        setLoadingCreate(true);
        const dataEdit: TypeEditSale = {
          post_id: initValue.postId,
          data: {},
        };
        if (name !== initValue.name) {
          dataEdit.data.name = name.trim();
        }
        if (content !== initValue.content) {
          dataEdit.data.content = content.trim();
        }
        // if (!isEqual(images, initValue.images)) {
        //   dataEdit.data.images = images;
        // }

        await apiEditSale(dataEdit);
        emitAppEvent(APP_EVENT.editSale, {
          post_id: initValue.postId,
          data: dataEdit.data,
        });
        await mutate(
          pre => {
            if (pre) {
              return {
                ...pre,
                ...dataEdit.data,
              };
            }
          },
          {revalidate: false},
        );

        ModalAlert.success({
          i18Content: 'alert.successChange',
          onClose: goBack,
        });
      } catch (err) {
        ModalAlert.error({
          content: err,
        });
      } finally {
        setLoadingCreate(false);
      }
    }
  };

  const onGoBack = () => {
    const temp: typeof initValue = {
      postId: initValue.postId,
      name,
      content,
      images,
      prices,
      userId: initValue.userId,
    };
    if (!isEqual(temp, initValue)) {
      ModalAlert.options({
        i18Content: 'common.wantToDiscard',
        onContinue: goBack,
      });
    } else {
      goBack();
    }
  };

  const {trigger: updateStatus, isMutating: loadingUpdateStatus} =
    useSWRMutation(
      'api.updateStatusSale',
      async (_, {arg: status}: {arg: number}) => {
        if (initValue.postId) {
          await apiUpdateStatusSale(initValue.postId, status);
          await mutate(
            pre => {
              if (pre) {
                return {
                  ...pre,
                  status,
                };
              }
            },
            {revalidate: false},
          );
          emitAppEvent(APP_EVENT.editSale, {
            post_id: initValue.postId,
            data: {
              status,
            },
          });
        }
      },
    );

  return [
    {content, images, prices, name, loadingCreate, loadingUpdateStatus},
    {
      onConfirmPost,
      onEditPost,
      onGoBack,
      setContent,
      setPrices,
      setName,
      updateStatus,
    },
  ] as const;
};

export default useCreateSale;
