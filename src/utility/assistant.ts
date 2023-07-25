import Clipboard from '@react-native-clipboard/clipboard';
import {TypeBubblePalace, TypeInteractBubble} from 'api/interface';
import {apiLikePost, apiUnLikePost} from 'api/profile';
import Store from 'app-redux/store';
import {
  FEELING,
  GENDER_TYPE,
  GROUP_BUYING_STATUS,
  LANGUAGE_TYPE,
  REACT,
  SIGN_UP_TYPE,
  TYPE_COLOR,
} from 'asset/enum';
import Images from 'asset/img/images';
import {
  LIST_POST_TYPES,
  LIST_TOPICS,
  PRIVATE_AVATAR,
} from 'asset/standardValue';
import Theme, {TypeTheme} from 'asset/theme/Theme';
import Redux from 'hook/useRedux';
import {navigate, push, showSwipeImages} from 'navigation/NavigationService';
import ROOT_SCREEN, {LOGIN_ROUTE} from 'navigation/config/routes';
import {ModalAlert, Toast} from 'navigation/screen/modals';
import {Dispatch, SetStateAction, useState} from 'react';
import {Platform, ViewStyle} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {I18Normalize} from './I18Next';
import {impactLight} from './haptic';
import {logOut} from './authentication';

export const interactBubble = (params: TypeInteractBubble) => {
  navigate(ROOT_SCREEN.interactBubble, params);
};

export const choosePrivateAvatar = (_gender?: number) => {
  const gender =
    _gender || Store.getState().accountSlice.passport.profile.gender;

  switch (gender) {
    case GENDER_TYPE.man:
      return PRIVATE_AVATAR.boy;
    case GENDER_TYPE.woman:
      return PRIVATE_AVATAR.girl;
    case GENDER_TYPE.notToSay:
      return PRIVATE_AVATAR.lgbt;
    default:
      return '';
  }
};

export const isIOS = Platform.OS === 'ios';

export const optionsImagePicker = [
  'common.chooseFromCamera',
  'common.chooseFromLibrary',
  'common.cancel',
];

export function logger(...args: any) {
  if (__DEV__) {
    console.log(...args);
  }
}

export const listGenders: {id: number; name: I18Normalize}[] = [
  {
    id: GENDER_TYPE.man,
    name: 'login.man',
  },
  {
    id: GENDER_TYPE.woman,
    name: 'login.woman',
  },
  {
    id: GENDER_TYPE.notToSay,
    name: 'login.notToSay',
  },
];

export const chooseTextFromIdGender = (id: number | undefined) => {
  const temp = listGenders.find(item => item.id === id);
  return temp?.name || '';
};

export const chooseLanguageFromId = (id: number) => {
  if (id === LANGUAGE_TYPE.en) {
    return 'en';
  }
  if (id === LANGUAGE_TYPE.vi) {
    return 'vi';
  }
  return 'vi';
};

export const modalizeGoToChatTagFromGroup = (params: {chatTagId: string}) => {
  return [
    {
      text: 'profile.screen.goToChatTag',
      action: () => {
        Redux.setChatTagFromNotification(params.chatTagId);
      },
    },
    {
      text: 'common.cancel',
      action: () => null,
    },
  ];
};

export const renderIconGender = (_gender?: number) => {
  const gender =
    _gender === undefined
      ? Store.getState().accountSlice.passport.profile.gender
      : _gender;

  if (gender === GENDER_TYPE.man) {
    return Images.icons.boy;
  }
  if (gender === GENDER_TYPE.woman) {
    return Images.icons.girl;
  }
  if (gender === GENDER_TYPE.notToSay) {
    return Images.icons.lgbt;
  }
  return null;
};

export const onGoToSignUp = () => {
  logOut({
    callApiLogOut: false,
    callBack: () => {
      navigate(LOGIN_ROUTE.signUpForm, {
        typeSignUp: SIGN_UP_TYPE.email,
      });
    },
  });
};

/**
 * MESSAGE
 */

export const reorderListChatTag = (listChatTag: Array<any>, index: number) => {
  const temp = [listChatTag[index]];
  listChatTag.splice(index, 1);
  return temp.concat(listChatTag);
};

export const modeExpUsePaging = () => {
  const [list, setList] = useState<Array<any>>([]);

  return {
    list,
    noMore: true,
    refreshing: false,
    loadingMore: false,
    error: '',
    onRefresh: () => null,
    onLoadMore: () => null,
    setParams: () => null,
    setList,
  };
};

export const chooseColorGradient = (params: {
  listGradients: TypeGradient;
  colorChoose: number;
}) => {
  const {listGradients, colorChoose} = params;
  let color = listGradients.talking;
  switch (colorChoose) {
    case TYPE_COLOR.talking:
      color = listGradients.talking;
      break;
    case TYPE_COLOR.movie:
      color = listGradients.movie;
      break;
    case TYPE_COLOR.technology:
      color = listGradients.technology;
      break;
    case TYPE_COLOR.gaming:
      color = listGradients.gaming;
      break;
    case TYPE_COLOR.animal:
      color = listGradients.animal;
      break;
    case TYPE_COLOR.travel:
      color = listGradients.travel;
      break;
    case TYPE_COLOR.fashion:
      color = listGradients.fashion;
      break;
    case TYPE_COLOR.other:
      color = listGradients.other;
      break;
    default:
      color = listGradients.talking;
  }
  return color;
};

export function sleep(milliseconds: number) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

export const $styleDropShadow: ViewStyle = {
  shadowColor: Theme.newTheme.gray_600,
  shadowOpacity: 0.1,
  shadowOffset: {
    width: 0,
    height: 4,
  },
};

export const chooseIconFeeling = (feeling: number) => {
  switch (feeling) {
    case FEELING.nice:
      return Images.icons.nice;
    case FEELING.cute:
      return Images.icons.cute;
    case FEELING.wondering:
      return Images.icons.wondering;
    case FEELING.cry:
      return Images.icons.cry;
    case FEELING.angry:
      return Images.icons.angry;
    default:
      return null;
  }
};

export const chooseTextTopic = (topic: number | null): I18Normalize => {
  return LIST_TOPICS.find(item => item.id === topic)?.text || 'common.null';
};

export const chooseIconTopic = (topic: number) => {
  return LIST_TOPICS.find(item => item.id === topic)?.icon || null;
};

export const chooseIconPostType = (postType: number) => {
  return LIST_POST_TYPES.find(item => item.id === postType)?.icon || null;
};

export const fakeBubbleFocusing: TypeBubblePalace = {
  id: '',
  postType: 0,
  topic: [0],
  feeling: 0,
  location: '',
  link: '',
  content: '',
  images: [],
  stars: 0,
  totalLikes: 0,
  totalComments: 0,
  totalSaved: 0,
  creator: 0,
  creatorName: '',
  creatorAvatar: '',
  created: '',
  isLiked: false,
  isSaved: false,
  isDraft: false,
  relationship: 0,
};

export const onGoToProfile = (userId: number, params = {}) => {
  const isModeExp = Store.getState().accountSlice.modeExp;
  if (isModeExp) {
    return;
  }
  const myId = Store.getState().accountSlice.passport.profile.id;
  if (userId === myId) {
    push(ROOT_SCREEN.myProfile);
    // push(ROOT_SCREEN.otherProfile, {
    //     id: userId,
    // });
  } else {
    push(ROOT_SCREEN.otherProfile, {
      id: userId,
      ...params,
    });
  }
};

export const seeDetailImage = (params: {
  images: Array<string>;
  initIndex?: number;
}) => {
  const {images, initIndex = 0} = params;
  showSwipeImages({
    listImages: images.map(item => ({url: item})),
    initIndex,
    allowSaveImage: true,
  });
};

export const borderWidthTiny = Platform.select({
  ios: moderateScale(0.25),
  android: moderateScale(0.5),
});

export const chosenBlurType: any = Platform.select({
  ios: 'ultraThinMaterialLight',
  android: 'xlight',
});

type RenderPersonalOptions = {
  maxNumber: number;
};

export const renderPersonalJoinsFromGroups = (
  listGroups: TypeGroupBuying['groups'],
  options: RenderPersonalOptions,
) => {
  const listPersonalJoins: TypePersonalJoin[] = [];
  listGroups?.every?.(group => {
    group?.members?.every?.((join: any) => {
      if (listPersonalJoins.length < options.maxNumber) {
        listPersonalJoins.push(join);
        return true;
      }
      return false;
    });
    if (listPersonalJoins.length < options.maxNumber) {
      return true;
    }
    return false;
  });
  return listPersonalJoins;
};

export const calculateTotalJoins = (group: TypeGroupJoin) => {
  let res = 0;
  group?.members?.forEach(item => {
    res += item?.amount ?? 0;
  });
  return res;
};

type TypeReactPost = {
  isLiked: boolean;
  setList: Dispatch<SetStateAction<TypeGroupBuying[]>>;
};
export const onReactSale = async (
  postId: number,
  {isLiked, setList}: TypeReactPost,
) => {
  let currentTotalLikes = 0;
  try {
    setList(pre => {
      return pre.map(item => {
        if (item?.id !== postId) {
          return item;
        }
        currentTotalLikes = item?.total_likes;
        return {
          ...item,
          is_liked: !isLiked,
          total_likes: currentTotalLikes + (isLiked ? -1 : 1),
        };
      });
    });
    if (!isLiked) {
      await apiLikePost({
        type: REACT.sale,
        reactedId: postId,
      });
    } else {
      await apiUnLikePost({
        type: REACT.sale,
        reactedId: postId,
      });
    }
  } catch (err) {
    ModalAlert.error({
      content: err,
    });
    setList(pre => {
      return pre.map(item => {
        if (item?.id !== postId) {
          return item;
        }
        return {
          ...item,
          is_liked: isLiked,
          total_likes: currentTotalLikes,
        };
      });
    });
  }
};

export const isDict = (v: any) =>
  typeof v === 'object' &&
  v !== null &&
  !(v instanceof Array) &&
  !(v instanceof Date);

export const detectFromStyle = (style: any, keySearch: string) => {
  let res: number | null | string = null;

  if (style instanceof Array) {
    const testStyle = [...style];
    testStyle.reverse();
    testStyle.every(element => {
      const width = detectFromStyle(element, keySearch);
      if (width !== null) {
        res = width;
        return false;
      }
      return true;
    });
  } else if (isDict(style)) {
    for (const [key, value] of Object.entries(style as object)) {
      if (key === keySearch) {
        res = value;
        break;
      }
    }
  }

  return res;
};

export const copy = (text: string) => {
  impactLight();
  Clipboard.setString(text);
  const content = `(${text.slice(0, 10)}${text.length > 10 ? '...' : ''})`;
  Toast.show({
    title: 'common.copied',
    content,
  });
};

type RenderStatus = {
  text: I18Normalize;
  color: string;
};

export const renderJoinStatus = (
  status: number,
  theme: TypeTheme,
): RenderStatus => {
  switch (status) {
    case GROUP_BUYING_STATUS.bought:
      return {
        text: 'profile.joinedSuccess',
        color: theme.green,
      };
    case GROUP_BUYING_STATUS.notBought:
      return {
        text: 'profile.joining',
        color: theme.blue,
      };
    case GROUP_BUYING_STATUS.requestBought:
      return {
        text: 'profile.waitingConfirm',
        color: theme.p_800,
      };
    case GROUP_BUYING_STATUS.notBoughtButOvertime:
      return {
        text: 'discovery.arrivalTimePassed',
        color: theme.red,
      };
    default:
      return {
        text: 'common.null',
        color: theme.white,
      };
  }
};

export const removePrefixPhone = (phone: string) => phone.replace('(+84) ', '');

export const takePriceRange = (listPrice: TypePrice[], amount: number) => {
  const listSorts = listPrice.sort((pre, next) => {
    if (pre.number_people < next.number_people) {
      return -1;
    }
    return 0;
  });

  const minPrice = listSorts[listSorts.length - 1].price;
  const maxPrice = listSorts[0].price;

  return {
    min: minPrice * amount,
    max: maxPrice * amount,
  };
};
