import {I18Normalize} from 'utility/I18Next';
import {moderateScale, verticalScale} from 'utility/scale';
import {FEELING, POST_TYPE, TOPIC} from './enum';
import Images from './img/images';
import {ImageSourcePropType} from 'react-native';

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

export const SUPPORT_URL = 'https://www.avatour.life/about-us/support';
export const PRIVACY_URL = 'https://www.avatour.life/about-us/policy';
export const TERMS_URL = 'https://www.avatour.life/about-us/terms';
export const FEEDBACK_URL =
  'https://docs.google.com/forms/d/1Yb-OzSMJbJxG_RZYtPwkKZGjw4AZOsC2IvJlac-1ydI/edit?usp=sharing';
export const LANDING_PAGE_URL = 'https://www.avatour.life/';

export const REPORT_REASONS: {id: number; name: I18Normalize}[] = [
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
export const DYNAMIC_LINK_IOS = '';
export const DYNAMIC_LINK_ANDROID = '';

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

export type TypeTopic = {
  id: number;
  text: I18Normalize;
  icon: ImageSourcePropType;
};
export const LIST_TOPICS: TypeTopic[] = [
  {
    id: TOPIC.food,
    text: 'discovery.travelFood',
    icon: Images.images.travelFood,
  },
  {
    id: TOPIC.camping,
    text: 'discovery.travelCamping',
    icon: Images.images.travelCamping,
  },
  {
    id: TOPIC.backpacking,
    text: 'discovery.travelBackpacking',
    icon: Images.images.travelGreen,
  },
  {
    id: TOPIC.team_building,
    text: 'discovery.travelTeamBuilding',
    icon: Images.images.travelTeamBuilding,
  },
];

export const LIST_TRANSPORTS: Array<{
  id: number;
  text: I18Normalize;
}> = [
  {
    id: TOPIC.transport_motorbike,
    text: 'discovery.motorbike',
  },
  {
    id: TOPIC.transport_car,
    text: 'discovery.car',
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

export const FONT_SIZE = {
  h1: moderateScale(34),
  h2: moderateScale(22),
  f1: moderateScale(18),
  f2: moderateScale(16), // This is root font size
  f3: moderateScale(14),
  f4: moderateScale(12),
  f5: moderateScale(10),
};

export const BORDER_RADIUS = {
  f2: moderateScale(16),
  f3: moderateScale(12),
  f4: moderateScale(8),
};

export const FONT_WEIGHT_MEDIUM = '500';

/**
 * ratio = height / width
 */
export const ratioImageTour = 130 / 200;
export const ratioImageSale = 232 / 319;
export const ratioAvatarLocation = 200 / 341;

export const scrollItemHeight = verticalScale(250);
