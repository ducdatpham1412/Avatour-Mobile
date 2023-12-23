import Clipboard from '@react-native-clipboard/clipboard';
import {apiLikePost, apiUnLikePost} from 'api/profile';
import Store from 'app-redux/store';
import {
  FEELING,
  GENDER_TYPE,
  JOIN_STATUS,
  LANGUAGE_TYPE,
  TYPE_COLOR,
} from 'asset/enum';
import Images from 'asset/img/images';
import {LIST_POST_TYPES, LIST_TOPICS} from 'asset/standardValue';
import Theme, {TypeTheme} from 'asset/theme/Theme';
import {TypeItemProgress} from 'components';
import {push, showSwipeImages} from 'navigation/NavigationService';
import ROOT_SCREEN from 'navigation/config/routes';
import {checkAuthenticated} from 'navigation/screen/AppModal';
import {ModalAlert, Toast} from 'navigation/screen/modals';
import {Dispatch, SetStateAction} from 'react';
import {Platform, ViewStyle} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {I18Normalize} from './I18Next';
import {impactLight} from './haptic';

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

/**
 * MESSAGE
 */

export const reorderListChatTag = (listChatTag: Array<any>, index: number) => {
  const temp = [listChatTag[index]];
  listChatTag.splice(index, 1);
  return temp.concat(listChatTag);
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
export const $styleTopShadow: ViewStyle = {
  shadowColor: Theme.newTheme.gray_600,
  shadowOpacity: 0.1,
  shadowOffset: {
    width: 0,
    height: -4,
  },
};
export const $styleAllShadow: ViewStyle = {
  shadowOpacity: 0.2,
  shadowRadius: 8,
  shadowOffset: {
    width: 0,
    height: 0.5,
  },
  elevation: 20,
  shadowColor: Theme.newTheme.gray_600,
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

type GoToProfileParams = {
  initValue: TypeGetProfileResponse;
};
export const onGoToProfile = (userId: number, params?: GoToProfileParams) => {
  const myId = Store.getState().accountSlice.passport.profile.id;
  if (userId === myId) {
    push(ROOT_SCREEN.myProfile);
    // push(ROOT_SCREEN.otherProfile, {
    //     id: userId,
    // });
  } else {
    push(ROOT_SCREEN.otherProfile, {
      id: userId,
      initValue: params?.initValue,
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

export const calculateTotalJoins = (group: TypeGroupJoin) => {
  let res = 0;
  group?.members?.forEach(item => {
    res += item?.amount ?? 0;
  });
  return res;
};

type TypeReactPost<T> = {
  type: number;
  setList: Dispatch<SetStateAction<T[]>>;
};

export const onReactPost = <T extends TypeGroupBuying | Tour | TourDetail>(
  postId: number,
  {type, setList}: TypeReactPost<T>,
) => {
  const onAuthenticated = async () => {
    let currentData: T[] = [];
    let currentIsLiked: boolean | undefined;

    let resolve: any;
    const promise = new Promise(rel => {
      resolve = rel;
    });

    try {
      setList(pre => {
        currentData = copyObject(pre);
        return pre.map(item => {
          if (item?.id !== postId) {
            return item;
          }
          currentIsLiked = item?.is_liked;
          resolve?.('');
          return {
            ...item,
            is_liked: !currentIsLiked,
            total_likes: item.total_likes + (currentIsLiked ? -1 : 1),
          };
        });
      });

      await promise;

      if (!currentIsLiked) {
        await apiLikePost({
          type,
          reactedId: postId,
        });
        impactLight();
      } else {
        await apiUnLikePost({
          type,
          reactedId: postId,
        });
      }
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
      setList(currentData);
    }
  };

  checkAuthenticated({
    onAuthenticated,
  });
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
    case JOIN_STATUS.supplierConfirm:
      return {
        text: 'profile.joining',
        color: theme.blue,
      };
    case JOIN_STATUS.overtime:
      return {
        text: 'discovery.arrivalTimePassed',
        color: theme.red,
      };
    case JOIN_STATUS.consumerConfirmed:
      return {
        text: 'profile.waitingConfirm',
        color: theme.p_800,
      };
    case JOIN_STATUS.supplierConfirmBought:
      return {
        text: 'profile.joinedSuccess',
        color: theme.green,
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

export const removeVietnameseTones = (str: string) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, ' ');
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' ',
  );
  return str;
};

/**
 * @param sample: Must be list string had been remove Vietnamese tone and upperCase
 */
export const search = (sample: string[], text: string) => {
  const resIndex: number[] = [];

  const temp = text.split(' ');
  const words = temp
    .map(w => removeVietnameseTones(w.trim().toUpperCase()))
    .filter(w => w !== '');

  sample.forEach((name, index) => {
    for (let i = 0; i < words.length; i++) {
      const checkNotIncluded = !name.includes(removeVietnameseTones(words[i]));
      if (checkNotIncluded) {
        break;
      }
      if (i === words.length - 1) {
        resIndex.push(index);
      }
    }
  });

  return resIndex;
};

export type PriceDeposit = {
  price: number;
  deposit: number;
};
export const calculatePriceDeposit = (
  joinEstimate: TypeJoinEstimate,
): PriceDeposit => {
  const price = joinEstimate.list_personals?.reduce((pre, current) => {
    return pre + current.price;
  }, 0);
  return {
    price,
    deposit: joinEstimate.deposit,
  };
};

export const copyObject = <T extends object>(origin: T) => {
  const temp: T = JSON.parse(JSON.stringify(origin));
  return temp;
};

type UpdateStatusLocation = {
  locationId: number;
  status: number;
};
export const updateStatusLocationInSchedule = (
  schedule: TourDetail['schedule'],
  {locationId, status}: UpdateStatusLocation,
) => {
  return schedule.map(day => {
    const findLocation = day.find(location => location.id === locationId);
    if (!findLocation) {
      return day;
    }
    return day.map(location => {
      if (location.id !== locationId) {
        return location;
      }
      return {
        ...location,
        status: status,
      };
    });
  });
};

const regexURLParams = /[?&]([^=#]+)=([^&#]*)/g;
const regexURL =
  /^([^=#]+):\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/;

const getParams = (pathParam: string) => {
  const params: Record<string, any> = {};
  let match: any = [];
  while ((match = regexURLParams.exec(pathParam))) {
    params[match[1]] = match[2];
  }
  return params;
};

type ParseURL = {
  protocol: string;
  host: string;
  hostname: string;
  port: string | undefined;
  pathname: string | undefined;
  event: string;
  params: Record<string, any>;
  hash: string;
};

export const parseURL = (url: string): ParseURL | null => {
  var match = url.match(regexURL);
  if (!match) {
    return null;
  }
  return {
    protocol: match[1],
    host: match[2],
    hostname: match[3],
    port: match[4],
    pathname: match[5],
    event: match[5].replace('/dl/', ''),
    params: getParams(match[6]),
    hash: match[7],
  };
};

export const renderDeepLink = (params: Pick<ParseURL, 'event' | 'params'>) => {
  let res = `avatour://link.avatour.life/dl/${params.event}`;
  Object.entries(params.params).forEach(([key, value], index) => {
    if (index === 0) {
      res = `${res}?${key}=${value}`;
    } else {
      res = `${res}&${key}=${value}`;
    }
  });
  return res;
};

/**
 * Detect progress order
 */
type ProgressOrderParams = {
  side: 'consumer' | 'shop';
  currentStatus: number;
  theme: TypeTheme;
};

type ProgressOrderResponse = {
  progress: TypeItemProgress[];
  indexFocusing: number;
};

export const detectOrderProgress = ({
  side,
  currentStatus,
  theme,
}: ProgressOrderParams): ProgressOrderResponse => {
  const isAdminConfirmed = currentStatus === JOIN_STATUS.adminConfirm;
  const isOvertime = currentStatus === JOIN_STATUS.overtime;
  const isRejected = currentStatus === JOIN_STATUS.supplierRejected;
  const isUserConfirmed = currentStatus === JOIN_STATUS.consumerConfirmed;
  const isConfirmedBought = currentStatus === JOIN_STATUS.supplierConfirmBought;

  let progress: TypeItemProgress[] = [];

  if (side === 'consumer') {
    let textApproved: I18Normalize = 'notification.approved';
    if (isAdminConfirmed) {
      textApproved = 'notification.waitingConfirmFromShop';
    } else if (isRejected) {
      textApproved = 'discovery.shopNotReceiveOrder';
    }

    progress = [
      {
        text: textApproved,
        focusColor: isRejected ? theme.red : theme.blue,
      },
      {
        text: isOvertime
          ? 'discovery.arrivalTimePassed'
          : 'notification.checkInAtShop',
        focusColor: isOvertime ? theme.red : theme.blue,
      },
      {
        text: isConfirmedBought
          ? 'notification.successOrder'
          : 'profile.waitingConfirm',
        focusColor: isConfirmedBought ? theme.green : theme.blue,
      },
    ];
  } else {
    let textApproved: I18Normalize = 'notification.approved';
    if (isAdminConfirmed) {
      textApproved = 'notification.waitingConfirmFromYou';
    } else if (isRejected) {
      textApproved = 'discovery.notReceiveThisOrder';
    }

    progress = [
      {
        text: textApproved,
        focusColor: isRejected ? theme.red : theme.blue,
      },
      {
        text: isOvertime
          ? 'discovery.arrivalTimePassed'
          : 'notification.userComeToYourShop',
        focusColor: isOvertime ? theme.red : theme.blue,
      },
      {
        text: isConfirmedBought
          ? 'notification.successOrder'
          : 'notification.waitingYouCompleteOrder',
        focusColor: isConfirmedBought ? theme.green : theme.blue,
      },
    ];
  }

  /**
     Index focusing status check:

     adminConfirm           -> 0
     supplierConfirm        -> 1
     supplierRejected      -> 0
     overtime              -> 1
     consumerConfirmed      -> 2
     supplierConfirmBought  -> 2
     */

  let indexFocusing = 0;
  if (currentStatus === JOIN_STATUS.supplierConfirm || isOvertime) {
    indexFocusing = 1;
  } else if (isUserConfirmed || isConfirmedBought) {
    indexFocusing = 2;
  }

  return {
    progress,
    indexFocusing,
  };
};
