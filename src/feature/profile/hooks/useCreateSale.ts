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
import {onGoToSignUp} from 'utility/assistant';
import {getDateTimeNow} from 'utility/format';
import {impactMedium} from 'utility/haptic';

export interface UseCreateSaleParams {
  initValue: {
    postId: number | undefined;
    name: string;
    content: string;
    images: string[];
    prices: TypePrice[];
  };
}

const useCreateSale = ({initValue}: UseCreateSaleParams) => {
  const {
    modeExp,
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

    if (!modeExp) {
      setLoadingCreate(true);
      //   const saleImages = await Promise.all(
      //     images.map(async url => {
      //       const base64 = await ImageUploader.convertUrlToBase64(url);
      //       return base64;
      //     }),
      //   );
      const body: TypeCreateSale = {
        name,
        content,
        images,
        prices,
      };
      try {
        const res = await apiCreateSale(body);
        const newSale: TypeGroupBuying = {
          id: res?.data?.id,
          post_type: POST_TYPE.groupBuying,
          name,
          content,
          images,
          prices,
          total_likes: 0,
          total_comments: 0,
          total_members: 0,
          groups: [],
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
    } else {
      ModalAlert.options({
        i18Content: 'discovery.bubble.goToSignUp',
        onContinue: onGoToSignUp,
      });
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
          dataEdit.data.name = name;
        }
        if (content !== initValue.content) {
          dataEdit.data.content = content;
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

  const onUpdateStatusSale = async (status: number) => {
    if (initValue.postId) {
      try {
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
        if (status == STATUS.active) {
          impactMedium();
        }
        emitAppEvent(APP_EVENT.editSale, {
          post_id: initValue.postId,
          data: {
            status,
          },
        });
      } catch (err) {
        ModalAlert.error({
          content: err,
        });
      }
    }
  };

  return [
    {content, images, prices, name, loadingCreate},
    {
      onConfirmPost,
      onEditPost,
      onGoBack,
      setContent,
      setPrices,
      setName,
      onUpdateStatusSale,
    },
  ] as const;
};

export default useCreateSale;
