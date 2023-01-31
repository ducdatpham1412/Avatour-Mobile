/* eslint-disable no-shadow */
import {Platform} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {FEELING, POST_TYPE, TOPIC} from './enum';
import Config from './env';
import Images from './img/images';

export const standValue = {
  USERNAME_MIN_LENGTH: 7,
  USERNAME_MAX_LENGTH: 20,
  PASSWORD_MIN_LENGTH: 7,
  PASSWORD_MAX_LENGTH: 20,
  COUNT_DOWN: 20,
  OTP_LENGTH: 4,
};

export const STAND_FONT_SIZE = {
  small: 15,
  medium: 20,
  big: 25,
  large: 28,
};

export enum COVER_SIZE {
  width = 1500,
  height = 565,
}

export enum AVATAR_SIZE {
  width = 2000,
  height = 2000,
}

export const SIZE_LOADING_LIMIT = 20;

export enum PRIVATE_AVATAR {
  girl = 'https://doffy.s3.ap-southeast-1.amazonaws.com/image/__admin_girl.png',
  boy = 'https://doffy.s3.ap-southeast-1.amazonaws.com/image/__admin_boy.png',
  lgbt = 'https://doffy.s3.ap-southeast-1.amazonaws.com/image/__admin_lgbt.png',
}

export const DEFAULT_IMAGE_BACKGROUND =
  'https://doffy-production.s3.ap-southeast-1.amazonaws.com/admin/background.png';

export const TIMING_BUBBLE_FLY = 40000;

export const SUPPORT_URL = 'https://www.doffy.xyz/about-us/support';
export const PRIVACY_URL = 'https://www.doffy.xyz/about-us/policy';
export const TERMS_URL = 'https://www.doffy.xyz/about-us/terms';
export const FEEDBACK_URL =
  'https://docs.google.com/forms/d/1Yb-OzSMJbJxG_RZYtPwkKZGjw4AZOsC2IvJlac-1ydI/edit?usp=sharing';
export const LANDING_PAGE_URL = 'https://www.doffy.xyz/';
export const REPORT_REASONS = [
  {
    id: 0,
    name: 'discovery.report.offensiveLanguage',
  },
  {
    id: 1,
    name: 'discovery.report.dangerousAction',
  },
  {
    id: 2,
    name: 'discovery.report.spamRuining',
  },
  {
    id: 3,
    name: 'discovery.report.insultToMe',
  },
  {
    id: 4,
    name: 'discovery.report.otherReason',
  },
];

export const DELAY_LONG_PRESS = 150;

export const DYNAMIC_LINK_SHARE = 'https://doffy.page.link';
export const DYNAMIC_LINK_IOS = Config.IOS_APP_ID;
export const DYNAMIC_LINK_ANDROID = Config.ANDROID_APP_ID;

export const ANDROID_APP_LINK =
  'https://play.google.com/store/apps/details?id=com.doffy.android.production';

export const MAX_NUMBER_IMAGES_POST = 10;

export const NUMBER_STARS = [0, 1, 2, 3, 4];

export const LIST_FEELINGS: Array<{
  id: number;
  text: I18Normalize;
  icon: any;
}> = [
  {
    id: FEELING.nice,
    text: 'profile.post.nice',
    icon: Images.icons.nice,
  },
  {
    id: FEELING.cute,
    text: 'profile.post.cute',
    icon: Images.icons.cute,
  },
  {
    id: FEELING.wondering,
    text: 'profile.post.wondering',
    icon: Images.icons.wondering,
  },
  {
    id: FEELING.cry,
    text: 'profile.post.cry',
    icon: Images.icons.cry,
  },
  {
    id: FEELING.angry,
    text: 'profile.post.angry',
    icon: Images.icons.angry,
  },
];

export const LIST_TOPICS: Array<{
  id: number;
  text: I18Normalize;
  icon: any;
}> = [
  {
    id: TOPIC.camping,
    text: 'discovery.travelCamping',
    icon: Images.images.travelCamping,
  },
  {
    id: TOPIC.volunteer,
    text: 'discovery.travelVolunteer',
    icon: Images.images.travelVolunteer,
  },
  {
    id: TOPIC.teamBuilding,
    text: 'discovery.travelTeamBuilding',
    icon: Images.images.travelTeamBuilding,
  },
  {
    id: TOPIC.food,
    text: 'discovery.travelFood',
    icon: Images.images.travelFood,
  },
  {
    id: TOPIC.culture,
    text: 'discovery.travelCulture',
    icon: Images.images.travelCulture,
  },
  {
    id: TOPIC.green,
    text: 'discovery.travelGreen',
    icon: Images.images.travelGreen,
  },
  {
    id: TOPIC.sightseeing,
    text: 'discovery.travelSightSeeing',
    icon: Images.images.travelVisit,
  },
  {
    id: TOPIC.all,
    text: 'discovery.travelAll',
    icon: Images.images.travelAll,
  },
];

export const LIST_POST_TYPES: Array<{
  id: number;
  text: I18Normalize;
  icon: any;
}> = [
  {
    id: POST_TYPE.review,
    text: 'profile.createReviewPost',
    icon: Images.icons.star,
  },
  {
    id: POST_TYPE.groupBuying,
    text: 'profile.createGroupBuying',
    icon: Images.icons.house,
  },
];

export enum FONT_SIZE {
  big = '17@ms',
  normal = '14@ms',
  small = '11@ms',
  tiny = '8@ms',
}
export const LINE_HEIGHT = {
  normal: Platform.select({
    ios: '17@ms',
    android: '17@ms',
  }),
};

export const ratioImageGroupBuying = 1; // height / width
