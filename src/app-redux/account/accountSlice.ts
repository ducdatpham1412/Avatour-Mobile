import {createSlice} from '@reduxjs/toolkit';
import {LANGUAGE_TYPE, THEME_TYPE} from 'asset/enum';

/**
 * STORE THE:   1. INFO OF USER
 *              2. THEME OF EACH ACCOUNT
 *              3. MODE EXP WHEN OPENING APP
 *              4. isLoading: is only used for loading resource in RootScreen to choose *               go to Login or Main
 */
export const initialAccountState = {
  // info account
  login: {
    username: '',
    password: '',
  },
  passport: <TypeGetPassportResponse['data']>{
    profile: {
      id: 0,
      account_type: 0,
      name: '',
      avatar: '',
      description: '',
      followers: 0,
      followings: 0,
      gender: 0,
      location: '',
      lat: 0,
      lng: 0,
      min_cost: 0,
      max_cost: 0,
      duration: 0,
      start_time: 0,
      end_time: 0,
      total_ratings: 0,
      average_stars: 0,
      services: [],
      relationship: 0,
      theme: THEME_TYPE.lightTheme,
      language: LANGUAGE_TYPE.vi,
      birthday: String(new Date(2000, 0, 1)),
      information: {
        facebook: '',
        email: '',
        phone: '',
        bank_account: '',
        bank_code: '',
      },
      status: 0,
    },
    numberNewNotifications: 0,
  },
  // modeExp
  modeExp: false,
};

const accountSlice = createSlice({
  name: 'accountSlice',
  initialState: initialAccountState,
  reducers: {
    updateLogin: (state, action) => {
      state.login = action.payload;
    },

    updatePassport: (state, action) => {
      state.passport = action.payload;
    },

    // set mode experience or not
    setModeExp: (state, action) => {
      state.modeExp = action.payload;
    },
  },
});

export const accountSliceAction = accountSlice.actions;

export default accountSlice.reducer;
