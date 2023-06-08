import {apiCreateSale, apiEditSale} from 'api/discovery';
import {useAppSelector} from 'app-redux/store';
import {APP_EVENT, POST_TYPE, STATUS} from 'asset/enum';
import {emitAppEvent} from 'hook';
import {goBack, navigate} from 'navigation/NavigationService';
import {MAIN_SCREEN, PROFILE_ROUTE, ROOT_SCREEN} from 'navigation/config';
import {ModalAlert} from 'navigation/screen/modals';
import {useState} from 'react';
import isEqual from 'react-fast-compare';
import ImageUploader from 'utility/ImageUploader';
import {onGoToSignUp} from 'utility/assistant';
import {getDateTimeNow} from 'utility/format';

export interface UseCreateSaleParams {
  initValue: {
    postId?: number | undefined;
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
      const saleImages = await Promise.all(
        images.map(async url => {
          const base64 = await ImageUploader.convertUrlToBase64(url);
          return base64;
        }),
      );
      const body: TypeCreateSale = {
        name,
        content,
        images: saleImages,
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
        navigate(PROFILE_ROUTE.myProfile);
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
        const dataEdit: TypeEditSale = {
          post_id: initValue.postId,
          data: {},
        };
        if (content !== initValue.content) {
          dataEdit.data.content = content;
        }
        if (!isEqual(images, initValue.images)) {
          dataEdit.data.images = images;
        }
        if (!isEqual(prices, initValue.prices)) {
          dataEdit.data.prices = prices;
        }
        await apiEditSale(dataEdit);
      } catch (err) {
        ModalAlert.error({
          content: err,
        });
      }
    }
  };

  const onGoBack = () => {
    const temp: typeof initValue = {
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

  const onDeletePrice = (valuePrice: number) => {
    setPrices(pre => pre.filter(item => item.price !== valuePrice));
  };

  return [
    {content, images, prices, name, loadingCreate},
    {
      onConfirmPost,
      onEditPost,
      onGoBack,
      onDeletePrice,
      setContent,
      setPrices,
      setName,
    },
  ] as const;
};

export default useCreateSale;
