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
    passport: {
        profile: {
            id: <any>null,
            account_type: 0,
            name: 'Name',
            anonymousName: 'Báoẩndanh',
            description: '',
            avatar: 'https://doffy-production.s3.ap-southeast-1.amazonaws.com/image/__admin_logo.png',
            cover: 'https://doffy-production.s3.ap-southeast-1.amazonaws.com/image/__admin_logo.png',
            followers: 0,
            followings: 0,
            reputations: 0,
            relationship: 0,
            location: '',
        },
        information: {
            facebook: '',
            email: '',
            phone: '',
            gender: 1,
            birthday: new Date(2000, 0, 1),
        },
        setting: {
            theme: THEME_TYPE.lightTheme,
            language: LANGUAGE_TYPE.vi,
            display_avatar: false,
            bank_account: '',
            bank_code: '',
        },
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
