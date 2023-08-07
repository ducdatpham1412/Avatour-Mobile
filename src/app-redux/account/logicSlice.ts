import {createSlice} from '@reduxjs/toolkit';

export type ReduxPostCreatedHandle = {
  status: 'loading' | 'success' | 'error' | 'done';
  data: TypeCreatePostRequest | TypeCreateSale | undefined;
};

export interface TypeHotLocation {
  location: string;
  total_posts: number;
  images: Array<string>;
}

export interface TypePriceResource {
  id: number;
  value: null | Array<number | string>;
  text: null | string;
}

export interface TypePurchaseResource {
  product_id: string;
  value: number;
}

export const initialLogicState = {
  isLoading: false,

  token: null, // is set from active user in async, to handle SocketProvider

  listChatTag: <Array<TypeChatTagResponse>>[],
  chatTagFocusing: '', // this flag to check if socket do action update chat tag hasNewMessage

  isLogOut: false,
  borderMessRoute: 'yellow',

  // notification
  numberNewMessages: 0,
  chatTagFromNotification: undefined,
  numberNewNotifications: 0,

  // is use when user block other and OtherProfile should re-render
  shouldRenderOtherProfile: true,
  scrollMainAndChatEnable: true,

  postCreatedHandling: <ReduxPostCreatedHandle>{
    status: 'done',
  },

  gestureHandle: {
    searchScreen: true,
  },

  searchParams: <TypeSearchParams>{},

  resource: <TypeResourceResponse['data']>{},
};

const logicSlice = createSlice({
  name: 'logicAppSlice',
  initialState: initialLogicState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setResource: (state, action) => {
      state.resource = action.payload;
    },
    setListChatTag: (state, action) => {
      state.listChatTag = action.payload;
    },
    setChatTagFocusing: (state, action) => {
      state.chatTagFocusing = action.payload;
    },
    setNumberNewMessages: (state, action) => {
      state.numberNewMessages = action.payload;
    },
    setChatTagFromNotification: (state, action) => {
      state.chatTagFromNotification = action.payload;
    },
    setBorderMessRoute: (state, action) => {
      state.borderMessRoute = action.payload;
    },
    setShouldRenderOtherProfile: (state, action) => {
      state.shouldRenderOtherProfile = action.payload;
    },
    setNumberNewNotification: (state, action) => {
      state.numberNewNotifications = action.payload;
    },
    setPostCreatedHandling: (state, action) => {
      state.postCreatedHandling = action.payload;
    },
    setIsLogOut: (state, action) => {
      state.isLogOut = action.payload;
    },
    setScrollMainAndChatEnable: (state, action) => {
      state.scrollMainAndChatEnable = action.payload;
    },
    setGestureHandle: (state, action) => {
      state.gestureHandle = action.payload;
    },
    setSearchParams: (state, action) => {
      state.searchParams = action.payload;
    },
  },
});

export const logicSliceAction = logicSlice.actions;

export default logicSlice.reducer;
