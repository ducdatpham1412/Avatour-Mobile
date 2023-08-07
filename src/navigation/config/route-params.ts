import {APP_EVENT, SOCKET_EVENT} from 'asset/enum';
import {ParamsCreateTour} from 'feature/profile/hooks';
import {I18Normalize} from 'utility/I18Next';
import ROOT_SCREEN, {
  DISCOVERY_ROUTE,
  LOGIN_ROUTE,
  MAIN_SCREEN,
  PROFILE_ROUTE,
  REPUTATION_ROUTE,
  SETTING_ROUTE,
  TOUR_ROUTE,
} from './routes';

export type AllRoutes =
  | ROOT_SCREEN
  | LOGIN_ROUTE
  | MAIN_SCREEN
  | DISCOVERY_ROUTE
  | PROFILE_ROUTE
  | SETTING_ROUTE
  | REPUTATION_ROUTE
  | TOUR_ROUTE;

export type AppParamsList = {
  [key: string]: any;
  [ROOT_SCREEN.otherProfile]: {
    id: number;
    showHeader?: boolean;
    initTabIndex?: number;
  };
  [ROOT_SCREEN.listFollows]: {
    userId: number;
    name: string;
    initTab?: 'follower' | 'following';
  };
  [ROOT_SCREEN.detailBubble]: {
    bubbleId?: string;
    bubble?: TypeBubblePalace;
    displayComment?: boolean;
    displayLike?: boolean;
  };
  [ROOT_SCREEN.detailGroupBuying]: {
    item?: TypeGroupBuying;
    itemId?: string;
    setList?: any;
    isFromTopGroupBuying?: boolean;
  };
  [ROOT_SCREEN.swipeImages]: {
    listImages: Array<{url: string}>;
    initIndex?: number;
    allowSaveImage?: boolean;
  };
  [ROOT_SCREEN.reportUser]: {
    idUser: number;
    nameUser?: string;
  };
  [PROFILE_ROUTE.createPostPreview]: {
    itemNew?: {
      images: Array<string>;
      isVideo: boolean;
      userReviewed?: {
        id: number;
        name: string;
        avatar: string;
      };
    };
    itemEdit?: TypeBubblePalace;
    itemDraft?: TypeBubblePalace;
    itemError?: TypeCreatePostRequest;
  };
  [PROFILE_ROUTE.createPostPickImg]: {
    userReviewed?: {
      id: number;
      name: string;
      avatar: string;
    };
    mode: 'sale' | 'review';
  };
  [PROFILE_ROUTE.createSale]: {
    itemNew?: {
      images: Array<string>;
      isVideo: boolean;
    };
    itemEdit?: TypeGroupBuying;
    itemDraft?: TypeGroupBuying;
    itemError?: TypeCreateSale;
  };
  [ROOT_SCREEN.chatDetail]: {
    itemChatTag: TypeChatTagResponse;
    setListChatTags: any;
  };
  [ROOT_SCREEN.chatDetailSetting]: {
    itemChatTag: TypeChatTagResponse;
  };
  [ROOT_SCREEN.editHistory]: {
    postId: string;
  };
  [DISCOVERY_ROUTE.searchScreen]: {
    services?: number;
    search?: string;
  };
  [ROOT_SCREEN.webView]: {
    title: I18Normalize;
    linkWeb: string;
  };
  [LOGIN_ROUTE.sendOTP]: {
    paramsOTP: TypeRequestOTPRequest;
  };
  [LOGIN_ROUTE.confirmOpenAccount]: {
    username: string;
  };
  [LOGIN_ROUTE.agreeTermOfService]: {
    itemLoginSuccess: TypeItemLoginSuccess;
  };
  [LOGIN_ROUTE.editBasicInformation]: {
    itemLoginSuccess: TypeItemLoginSuccess;
    isLoginSocial?: boolean;
  };
  [LOGIN_ROUTE.forgetPasswordSend]: {
    username: string;
  };
  [LOGIN_ROUTE.forgetPasswordForm]: {
    username: string;
    code: string;
  };
  [ROOT_SCREEN.detailSale]: {
    saleId?: number;
    sale?: TypeGroupBuying;
  };
  [ROOT_SCREEN.detailMeJoin]: {
    saleId: number;
    joinId?: number;
    joinPersonal?: TypeJoinPersonal; // for see detail a join personal
    mode:
      | 'go-to-deposit'
      | 'go-to-deposit-from-profile'
      | 'see-detail'
      | 'see-detail-from-sale'
      | 'go-from-scan';
  };
  [SETTING_ROUTE.enterPassword]: {
    newInfo?: {
      email?: string;
      phone?: string;
    };
    mode: 'change-information' | 'lock-account' | 'delete-account';
  };
  [ROOT_SCREEN.detailTour]: {
    tourId: number;
    itemTour?: TourDetail;
  };
  [PROFILE_ROUTE.myProfile]: {
    initIndex?: 'shop' | 'order' | 'favorite' | 'review';
  };
  [ROOT_SCREEN.myProfile]: {
    initIndex?: 'shop' | 'order' | 'favorite' | 'review';
  };
  [ROOT_SCREEN.goToDeposit]: {
    joinEstimate: TypeJoinEstimate;
  };
  [ROOT_SCREEN.scanResult]: {
    mode: 'join-result';
  } & {
    shop_id: number;
  };
  [ROOT_SCREEN.joinsHistory]: {
    saleId: number;
    mode: 'go-from-sale' | 'go-from-notification';
  };
  [ROOT_SCREEN.listJoining]: {
    list: TypeJoinPersonalAndSale[];
  };
  [PROFILE_ROUTE.createTour]: {
    itemTour: Omit<TourDetail, 'id'> & {id: ParamsCreateTour};
  };
  [ROOT_SCREEN.editSalePrice]: {
    saleId: number;
    prices: TypePrice[];
  };
};

export type AppEventList = {
  [APP_EVENT.reactSale]: {
    saleId: number;
    type: 'like' | 'dislike';
  };
  [APP_EVENT.reactTour]: {
    tourId: number;
    type: 'like' | 'dislike';
  };
  [APP_EVENT.createNewSale]: {
    newSale: TypeGroupBuying;
  };
  [APP_EVENT.editSale]: {
    post_id: number;
    data: Partial<TypeGroupBuying>;
  };
};

export type SocketOnList = {
  [SOCKET_EVENT.joinSuccess]: {
    sale_id: number;
  };
};

export type SocketEmitList = {};
