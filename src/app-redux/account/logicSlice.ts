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

  borderMessRoute: 'yellow',

  newNotifications: 0,

  postCreatedHandling: <ReduxPostCreatedHandle>{
    status: 'done',
  },

  gestureHandle: {
    searchScreen: true,
  },

  searchParams: <TypeSearchParams>{},

  resource: <TypeResource>{},
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
    setBorderMessRoute: (state, action) => {
      state.borderMessRoute = action.payload;
    },
    setNewNotification: (state, action) => {
      state.newNotifications = action.payload;
    },
    setPostCreatedHandling: (state, action) => {
      state.postCreatedHandling = action.payload;
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
