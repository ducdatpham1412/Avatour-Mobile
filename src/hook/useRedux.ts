import {TypeChatTagResponse} from 'api/interface';
import {
  accountSliceAction,
  initialAccountState,
} from 'app-redux/account/accountSlice';
import {
  ReduxPostCreatedHandle,
  logicSliceAction,
} from 'app-redux/account/logicSlice';
import FindmeStore, {RootState, useAppSelector} from 'app-redux/store';
import {THEME_TYPE} from 'asset/enum';
import Theme from 'asset/theme/Theme';
import dayjs from 'dayjs';
import {useSelector} from 'react-redux';

interface LoginType {
  username?: string;
  password?: string;
}

interface TypeBubblePalaceUpdate {
  id?: string;
  postType?: number;
  topic?: Array<number>;
  feeling?: number | null;
  location?: string | null;
  link?: string | null;
  userReviewed?: {
    id: number;
    name: string;
    avatar: string;
    location: string;
    description: string;
  };
  content?: string;
  images?: Array<string>;
  stars?: number;
  totalLikes?: number;
  totalComments?: number;
  totalSaved?: number;
  creator?: number;
  creatorName?: string;
  creatorAvatar?: string;
  created?: string;
  isLiked?: boolean;
  isSaved?: boolean;
  isDraft?: boolean;
  relationship?: number;
}

export const Redux = {
  /** ----------------------------
   * IN LOGIC SLICE
   * ----------------------------
   */
  getIsLoading: () =>
    useSelector((state: RootState) => state.logicSlice.isLoading),

  getResource: () =>
    useSelector((state: RootState) => state.logicSlice.resource),

  getListChatTag: (): Array<TypeChatTagResponse> =>
    useSelector((state: RootState) => state.logicSlice.listChatTag),
  getChatTagFocusing: () =>
    useSelector((state: RootState) => state.logicSlice.chatTagFocusing),

  getToken: () => useSelector((state: RootState) => state.logicSlice.token),

  getBubblePalaceAction: () =>
    useSelector((state: RootState) => state.logicSlice.bubblePalaceAction),

  getNumberNewMessages: () =>
    useSelector((state: RootState) => state.logicSlice.numberNewMessages),

  getBorderMessRoute: () =>
    useSelector((state: RootState) => state.logicSlice.borderMessRoute),

  getShouldRenderOtherProfile: () =>
    useSelector(
      (state: RootState) => state.logicSlice.shouldRenderOtherProfile,
    ),
  getChatTagFromNotification: () =>
    useSelector((state: RootState) => state.logicSlice.chatTagFromNotification),
  getBubbleFocusing: () =>
    useSelector((state: RootState) => state.logicSlice.bubbleFocusing),
  getNumberNewNotifications: () =>
    useSelector((state: RootState) => state.logicSlice.numberNewNotifications),
  getCreatedPostHandling: () =>
    useAppSelector(state => state.logicSlice.postCreatedHandling),

  // SET METHOD
  setIsLoading: (status: boolean) => {
    FindmeStore.dispatch(logicSliceAction.setIsLoading(status));
  },

  updateResource: (update: TypeResourceResponse['data']) => {
    const newResource = {
      ...FindmeStore.getState().logicSlice.resource,
      ...update,
    };
    FindmeStore.dispatch(logicSliceAction.setResource(newResource));
  },

  updateListChatTag: (newList: any) => {
    FindmeStore.dispatch(logicSliceAction.setListChatTag(newList));
  },
  setChatTagFocusing: (value: string) => {
    FindmeStore.dispatch(logicSliceAction.setChatTagFocusing(value));
  },

  setToken: (newToken: string | null) => {
    FindmeStore.dispatch(logicSliceAction.setToken(newToken));
  },

  setNumberNewMessage: (value: number) => {
    FindmeStore.dispatch(logicSliceAction.setNumberNewMessages(value));
  },

  setBorderMessRoute: (color: string) => {
    FindmeStore.dispatch(logicSliceAction.setBorderMessRoute(color));
  },

  setShouldRenderOtherProfile: (value: boolean) => {
    FindmeStore.dispatch(logicSliceAction.setShouldRenderOtherProfile(value));
  },

  setChatTagFromNotification: (value: string | undefined) => {
    FindmeStore.dispatch(logicSliceAction.setChatTagFromNotification(value));
  },

  updateBubbleFocusing: (value: TypeBubblePalaceUpdate) => {
    FindmeStore.dispatch(
      logicSliceAction.setBubbleFocusing({
        ...FindmeStore.getState().logicSlice.bubbleFocusing,
        ...value,
      }),
    );
  },
  setNumberNewNotifications: (value: number) => {
    FindmeStore.dispatch(logicSliceAction.setNumberNewNotification(value));
  },
  setPostCreatedHandling: (value: ReduxPostCreatedHandle) => {
    FindmeStore.dispatch(logicSliceAction.setPostCreatedHandling(value));
  },
  setIsLogOut: (value: boolean) => {
    FindmeStore.dispatch(logicSliceAction.setIsLogOut(value));
  },
  setScrollMainAndChatEnable: (value: boolean) => {
    FindmeStore.dispatch(logicSliceAction.setScrollMainAndChatEnable(value));
  },

  /**
   *
   */
  /** ----------------------------
   * IN ACCOUNT SLICE
   * ----------------------------
   */
  getLogin: () => FindmeStore.getState().accountSlice.login,

  getPassport: () =>
    useSelector((state: RootState) => state.accountSlice.passport),

  getTheme: () => {
    return Theme.newTheme;
  },

  getThemeKeyboard: () => {
    const {theme} = FindmeStore.getState().accountSlice.passport.setting;
    return theme === THEME_TYPE.darkTheme ? 'dark' : 'light';
  },

  getModeExp: () =>
    useSelector((state: RootState) => state.accountSlice.modeExp),
  getIstLogOut: () =>
    useSelector((state: RootState) => state.logicSlice.isLogOut),

  // SET METHOD
  updateLogin: (update: LoginType) => {
    const {username, password} = FindmeStore.getState().accountSlice.login;
    FindmeStore.dispatch(
      accountSliceAction.updateLogin({
        username: update?.username || username,
        password: update?.password || password,
      }),
    );
  },

  // profile
  updatePassport: (newProfile: DeepPartial<TypeReduxPassport>) => {
    const current = FindmeStore.getState().accountSlice.passport;
    const tempBirthday = newProfile.information?.birthday;

    const temp: TypeReduxPassport = {
      profile: {...current.profile, ...newProfile.profile},
      information: {
        ...current.information,
        ...newProfile.information,
        birthday: tempBirthday
          ? String(dayjs(tempBirthday))
          : current.information.birthday,
      },
      setting: {...current.setting, ...newProfile.setting},
    };

    FindmeStore.dispatch(accountSliceAction.updatePassport(temp));
  },

  setTheme: (updateTheme: number) => {
    Redux.updatePassport({
      setting: {
        theme: updateTheme,
        // language: 0,
        // bank_code: '',
        // bank_account: '',
      },
    });
  },

  setModeExp: (value: boolean) => {
    FindmeStore.dispatch(accountSliceAction.setModeExp(value));
  },
};

export const setPostCreatedHandling = (value: ReduxPostCreatedHandle) => {
  FindmeStore.dispatch(logicSliceAction.setPostCreatedHandling(value));
};

export default Redux;
