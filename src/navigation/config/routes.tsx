const ROOT_SCREEN = {
    loginRoute: '@ROOT_SCREEN/loginRoute',
    mainScreen: '@ROOT_SCREEN/mainScreen',
    chatRoute: '@ROOT_SCREEN/chatRoute',
    // others
    alert: '@ROOT_SCREEN/alert',
    alertYesNo: '@ROOT_SCREEN/alertYesNo',
    interactBubble: '@ROOT_SCREEN/interactBubble',
    swipeImages: '@ROOT_SCREEN/swipeImage',
    reportUser: '@ROOT_SCREEN/reportUser',
    webView: '@ROOT_SCREEN/webview',
    picker: '@ROOT_SCREEN/picker',
    otherProfile: '@ROOT_SCREEN/otherProfile',
    listFollows: '@ROOT_SCREEN/listFollows',
    detailBubble: '@ROOT_SCREEN/detailBubble',
    detailGroupBuying: '@ROOT_SCREEN/detailGroupBuying',
    myProfile: '@ROOT_SCREEN/myProfile',
    editProfile: '@ROOT_SCREEN/editProfile',
    postsArchived: '@ROOT_SCREEN/postsArchived',
    upgradeAccount: '@ROOT_SCREEN/upgradeAccount',
    editHistory: '@ROOT_SCREEN/editHistory',
    updateBankAccount: '@ROOT_SCREEN/updateBankAccount',
};
/**
 * ||
 * ||
 */
const LOGIN_ROUTE = {
    starter: '@LOGIN_ROUTE/starter',
    choosingLoginOrEnjoy: '@LOGIN_ROUTE/choosingLoginOrEnjoy',
    loginScreen: '@LOGIN_ROUTE/loginScreen',
    confirmOpenAccount: '@LOGIN_ROUTE/confirmOpenAccount',
    // THIS BLOCK IS FOR SIGN_UP FORM
    signUpType: '@LOGIN_ROUTE/signUpType',
    signUpForm: '@LOGIN_ROUTE/signUpForm',
    editBasicInformation: '@LOGIN_ROUTE/editBasicInformation',
    // ------------------------------
    // THIS BLOCK IF FOR FORGET_PASSWORD
    forgetPasswordType: '@LOGIN_ROUTE/forgetPasswordType',
    forgetPasswordSend: '@LOGIN_ROUTE/forgetPasswordSend',
    forgetPasswordConfirm: '@LOGIN_ROUTE/forgetPasswordConfirm',
    forgetPasswordForm: '@LOGIN_ROUTE/forgetPasswordForm',
    // ------------------------------
    sendOTP: '@LOGIN_ROUTE/sendOTP',
    agreeTermOfService: '@LOGIN_ROUTE/agreeTermOfService',
};
const MAIN_SCREEN = {
    discoveryRoute: '@MAIN_SCREEN/discoveryRoute',
    favorite: '@MAIN_SCREEN/favorite',
    reputation: '@MAIN_SCREEN/reputation',
    profileRoute: '@MAIN_SCREEN/profileRoute',
    settingRoute: '@MAIN_SCREEN/settingRoute',
    notificationRoute: '@MAIN_SCREEN/notificationRoute',
};

/**
 * ||
 * ||
 */
const DISCOVERY_ROUTE = {
    discoveryScreen: '@DISCOVERY_ROUTE/discoveryScreen',
    detailGroupBuying: '@DISCOVERY_ROUTE/detailGroupBuying',
    searchScreen: '@DISCOVERY_ROUTE/searchScreen',
};

const MESS_ROUTE = {
    messScreen: '@MESS_ROUTE/messScreen',
    chatDetail: '@MESS_ROUTE/chatDetail',
    chatDetailGroup: '@MESS_ROUTE/chatDetailGroup',
    chatDetailSetting: '@MESS_ROUTE/chatDetailSetting',
};

const PROFILE_ROUTE = {
    myProfile: '@PROFILE_ROUTE/myProfile',
    editProfile: '@PROFILE_ROUTE/editProfile',
    settingRoute: '@PROFILE_ROUTE/settingRoute',
    createPostPreview: '@PROFILE_ROUTE/createPostPreview',
    createPostPickImg: '@PROFILE_ROUTE/createPostPickImg',
    detailGroupBuying: '@PROFILE_ROUTE/detailGroupBuying',
    createGroupBuying: '@PROFILE_ROUTE/createGroupBuying',
    updatePrices: '@PROFILE_ROUTE/updatePrice',
};
/**
 * ||
 * || Setting live inside profile_screen
 */
const SETTING_ROUTE = {
    settingScreen: '@SETTING_ROUTE/settingScreen',
    security: '@SETTING_ROUTE/security',
    confirmLockAccount: '@SETTING_ROUTE/confirmLockAccount',
    confirmDeleteAccount: '@SETTING_ROUTE/confirmdeleteAccount',
    personalInformation: '@SETTING_ROUTE/personalInformation',
    sendOTPChangeInfo: '@SETTING_ROUTE/sendOTPChangeInfo',
    enterPassword: '@SETTING_ROUTE/enterPassword',
    aboutUs: '@SETTING_ROUTE/aboutUs',
    setTheme: '@SETTING_ROUTE/setTheme',
};

const REPUTATION_ROUTE = {
    reviewCommunity: '@REPUTATION_ROUTE/reviewCommunity',
    topReviewers: '@REPUTATION_ROUTE/topReviewers',
};

const FAVORITE_ROUTE = {
    favoriteScreen: '@FAVORITE_ROUTE/favoriteScreen',
    detailGroupBuying: '@FAVORITE_ROUTE/detailGroupBuying',
};

export {LOGIN_ROUTE, MAIN_SCREEN};
export {
    DISCOVERY_ROUTE,
    PROFILE_ROUTE,
    SETTING_ROUTE,
    MESS_ROUTE,
    REPUTATION_ROUTE,
    FAVORITE_ROUTE,
};
export default ROOT_SCREEN;
