enum ROOT_SCREEN {
  loginRoute = '@ROOT_SCREEN/loginRoute',
  mainScreen = '@ROOT_SCREEN/mainScreen',
  chatRoute = '@ROOT_SCREEN/chatRoute',
  // others
  alert = '@ROOT_SCREEN/alert',
  alertYesNo = '@ROOT_SCREEN/alertYesNo',
  interactBubble = '@ROOT_SCREEN/interactBubble',
  swipeImages = '@ROOT_SCREEN/swipeImage',
  reportUser = '@ROOT_SCREEN/reportUser',
  webView = '@ROOT_SCREEN/webview',
  picker = '@ROOT_SCREEN/picker',
  otherProfile = '@ROOT_SCREEN/otherProfile',
  listFollows = '@ROOT_SCREEN/listFollows',
  followers = '@ROOT_SCREEN/followers',
  followings = '@ROOT_SCREEN/followings',
  detailBubble = '@ROOT_SCREEN/detailBubble',
  detailGroupBuying = '@ROOT_SCREEN/detailGroupBuying',
  myProfile = '@ROOT_SCREEN/myProfile',
  editProfile = '@ROOT_SCREEN/editProfile',
  postsArchived = '@ROOT_SCREEN/postsArchived',
  upgradeAccount = '@ROOT_SCREEN/upgradeAccount',
  editHistory = '@ROOT_SCREEN/editHistory',
  joinsHistory = '@ROOT_SCREEN/joinsHistory',
  updateBankAccount = '@ROOT_SCREEN/updateBankAccount',
  detailSale = '@ROOT_SCREEN/detailSale',
  detailMeJoin = '@ROOT_SCREEN/detailMeJoin',
  detailTour = '@ROOT_SCREEN/detailTour',
  goToDeposit = '@ROOT_SCREEN/goToDeposit',
  scanResult = '@ROOT_SCREEN/scanResult',
  messScreen = '@ROOT_SCREEN/messScreen',
  chatDetail = '@ROOT_SCREEN/chatDetail',
  chatDetailGroup = '@ROOT_SCREEN/chatDetailGroup',
  chatDetailSetting = '@ROOT_SCREEN/chatDetailSetting',
}
/**
 * ||
 * ||
 */
enum LOGIN_ROUTE {
  starter = '@LOGIN_ROUTE/starter',
  choosingLoginOrEnjoy = '@LOGIN_ROUTE/choosingLoginOrEnjoy',
  loginScreen = '@LOGIN_ROUTE/loginScreen',
  confirmOpenAccount = '@LOGIN_ROUTE/confirmOpenAccount',
  // THIS BLOCK IS FOR SIGN_UP FORM
  signUpType = '@LOGIN_ROUTE/signUpType',
  signUpForm = '@LOGIN_ROUTE/signUpForm',
  editBasicInformation = '@LOGIN_ROUTE/editBasicInformation',
  // ------------------------------
  // THIS BLOCK IF FOR FORGET_PASSWORD
  forgetPasswordType = '@LOGIN_ROUTE/forgetPasswordType',
  forgetPasswordSend = '@LOGIN_ROUTE/forgetPasswordSend',
  forgetPasswordConfirm = '@LOGIN_ROUTE/forgetPasswordConfirm',
  forgetPasswordForm = '@LOGIN_ROUTE/forgetPasswordForm',
  // ------------------------------
  sendOTP = '@LOGIN_ROUTE/sendOTP',
  agreeTermOfService = '@LOGIN_ROUTE/agreeTermOfService',
}
enum MAIN_SCREEN {
  discoveryRoute = '@MAIN_SCREEN/discoveryRoute',
  favorite = '@MAIN_SCREEN/favorite',
  reputation = '@MAIN_SCREEN/reputation',
  profileRoute = '@MAIN_SCREEN/profileRoute',
  settingRoute = '@MAIN_SCREEN/settingRoute',
  notificationRoute = '@MAIN_SCREEN/notificationRoute',
}

/**
 * ||
 * ||
 */
enum DISCOVERY_ROUTE {
  discoveryScreen = '@DISCOVERY_ROUTE/discoveryScreen',
  detailGroupBuying = '@DISCOVERY_ROUTE/detailGroupBuying',
  searchScreen = '@DISCOVERY_ROUTE/searchScreen',
}

enum PROFILE_ROUTE {
  myProfile = '@PROFILE_ROUTE/myProfile',
  createPostPreview = '@PROFILE_ROUTE/createPostPreview',
  createPostPickImg = '@PROFILE_ROUTE/createPostPickImg',
  detailGroupBuying = '@PROFILE_ROUTE/detailGroupBuying',
  createSale = '@PROFILE_ROUTE/createSale',
  updatePrices = '@PROFILE_ROUTE/updatePrice',
  listMyRequests = '@PROFILE_ROUTE/listMyRequest',
  myQRCode = '@PROFILE_ROUTE/myQRCode',
  createTour = '@PROFILE_ROUTE/createTour',
}
/**
 * ||
 * || Setting live inside profile_screen
 */
enum SETTING_ROUTE {
  settingScreen = '@SETTING_ROUTE/settingScreen',
  security = '@SETTING_ROUTE/security',
  confirmLockAccount = '@SETTING_ROUTE/confirmLockAccount',
  confirmDeleteAccount = '@SETTING_ROUTE/confirmdeleteAccount',
  personalInformation = '@SETTING_ROUTE/personalInformation',
  sendOTPChangeInfo = '@SETTING_ROUTE/sendOTPChangeInfo',
  enterPassword = '@SETTING_ROUTE/enterPassword',
  aboutUs = '@SETTING_ROUTE/aboutUs',
  extendSetting = '@SETTING_ROUTE/extendSetting',
}

enum REPUTATION_ROUTE {
  reviewCommunity = '@REPUTATION_ROUTE/reviewCommunity',
  topReviewers = '@REPUTATION_ROUTE/topReviewers',
}

enum TOUR_ROUTE {
  favoriteScreen = '@TOUR_ROUTE/favoriteScreen',
  detailGroupBuying = '@TOUR_ROUTE/detailGroupBuying',
}

export {LOGIN_ROUTE, MAIN_SCREEN};
export {
  DISCOVERY_ROUTE,
  PROFILE_ROUTE,
  SETTING_ROUTE,
  REPUTATION_ROUTE,
  TOUR_ROUTE,
};
export default ROOT_SCREEN;
