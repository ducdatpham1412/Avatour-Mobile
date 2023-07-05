import {ReactNode} from 'react';
import {I18Normalize} from 'utility/I18Next';
import ROOT_SCREEN, {
  DISCOVERY_ROUTE,
  TOUR_ROUTE,
  LOGIN_ROUTE,
  MAIN_SCREEN,
  MESS_ROUTE,
  PROFILE_ROUTE,
  REPUTATION_ROUTE,
  SETTING_ROUTE,
} from './routes';
import {APP_EVENT} from 'asset/enum';

export type AllRoutes =
  | ROOT_SCREEN
  | LOGIN_ROUTE
  | MAIN_SCREEN
  | DISCOVERY_ROUTE
  | MESS_ROUTE
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
  [ROOT_SCREEN.interactBubble]: {
    userId: number;
    name: string;
    avatar: string;
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
  [PROFILE_ROUTE.updatePrices]: {
    item: TypeGroupBuying;
    onUpdatePrice(value: TypeGroupBuying): void;
  };
  [MESS_ROUTE.chatDetail]: {
    itemChatTag: TypeChatTagResponse;
    setListChatTags: any;
  };
  [MESS_ROUTE.chatDetailSetting]: {
    itemChatTag: TypeChatTagResponse;
  };
  [ROOT_SCREEN.editHistory]: {
    postId: string;
  };
  [DISCOVERY_ROUTE.searchScreen]: {
    services?: number;
    search?: string;
  };
  [ROOT_SCREEN.alert]: {
    notice: I18Normalize;
    actionClickOk?(): void;
    moreNotice?: I18Normalize;
    moreAction?(): void;
  };
  [ROOT_SCREEN.alertYesNo]: {
    i18Title: I18Normalize;
    agreeText?: I18Normalize;
    refuseText?: I18Normalize;
    i18Params?: object;
    agreeChange(): void;
    refuseChange(): void;
    headerNode?: ReactNode;
    displayButton?: boolean;
    touchOutBack?: boolean;
    agreeButtonOpacity?: number;
  };
  [ROOT_SCREEN.webView]: {
    title: I18Normalize;
    linkWeb: string;
  };
  [ROOT_SCREEN.picker]: {
    data: Array<any>;
    renderItem(item: any): ReactNode;
    // itemHeight is calculated by style of each item in "renderItem"
    itemHeight: number;
    onSetItemSelected: Function;
    initIndex?: number;
    onCancel?(): void;
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
    joinPersonal?: TypeJoinPersonal; // for see detail a join personal
    mode:
      | 'go-to-deposit'
      | 'go-to-deposit-from-profile'
      | 'see-detail'
      | 'see-detail-from-sale';
  };
  [SETTING_ROUTE.enterPassword]: {
    newInfo: {
      email?: string;
      phone?: string;
    };
  };
  [SETTING_ROUTE.sendOTPChangeInfo]: {
    name: string;
    newInfo: {
      email?: string;
      phone?: string;
    };
    paramsOTP: TypeRequestOTPRequest;
  };
  [ROOT_SCREEN.detailTour]: {
    tourId?: number;
    tour?: Tour;
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
  [APP_EVENT.tourEditMode]: {
    isEditMode: boolean;
    tourId: number;
  };
  [APP_EVENT.tourSave]: {
    dayIndex: number;
    tourId: number;
    schedule: TypeGetProfileResponse[];
  };
  [APP_EVENT.tourUpdateSchedule]: {
    dayIndex: number;
    schedule: TypeGetProfileResponse[];
  };
  [APP_EVENT.createNewSale]: {
    newSale: TypeGroupBuying;
  };
};
