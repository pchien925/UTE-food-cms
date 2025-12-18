import { commonMessage } from '@locales/intl';

export const apiUrl = process.env.REACT_APP_API;
export const enableExposure = process.env.REACT_APP_ENABLE_EXPOSURE === 'true';

export const ADMIN_LOGIN_TYPE = 'password';

export const fixedPath = {
    privacy: `${apiUrl}${process.env.REACT_APP_PRIVACY_PATH}`,
    help: `${apiUrl}${process.env.REACT_APP_HELP_PATH}`,
    aboutUs: `${apiUrl}${process.env.REACT_APP_ABOUT_US_PATH}`,
};

export const brandName = 'UTE Food System';

export const appName = 'ute-food-cms';

export const storageKeys = {
    USER_ACCESS_TOKEN: `${appName}-user-access-token`,
    USER_REFRESH_TOKEN: `${appName}-user-refresh-token`,
    USER_KIND: `${appName}-user-kind`,
};

export const AppConstants = {
    apiRootUrl: process.env.REACT_APP_API,
    contentRootUrl: `${process.env.REACT_APP_API}v1/file/download`,
    avatarRootUrl: `${process.env.REACT_APP_API}v1/file/download`,
    mediaRootUrl: `${process.env.REACT_APP_API}`,
    langKey: 'vi',
};

export const THEMES = {
    DARK: 'dark',
    LIGHT: 'light',
};

export const defaultLocale = 'vi';
export const locales = ['en', 'vi'];

export const DATE_DISPLAY_FORMAT = 'DD-MM-YYYY HH:mm';
export const DATE_SHORT_MONTH_FORMAT = 'DD MMM YYYY';
export const TIME_FORMAT_DISPLAY = 'HH:mm';
export const DATE_FORMAT_VALUE = 'DD/MM/YYYY';
export const DATE_FORMAT_DISPLAY = 'DD/MM/YYYY';
export const DATE_FORMAT_BASIC = 'dd.MM.yyyy';
export const DATE_FORMAT_BASIC_FIX = 'DD.MM.YYYY';
export const DEFAULT_FORMAT = 'DD/MM/YYYY HH:mm:ss';
export const DEFAULT_FORMAT_ZERO_SECOND = 'DD/MM/YYYY HH:mm:00';
export const DEFAULT_FORMAT_ZERO = 'DD/MM/YYYY 00:00:00';
export const DEFAULT_FORMAT_BASIC = 'dd.MM.yyyy HH:mm:ss';
export const DEFAULT_FORMAT_BASIC_FIX = 'DD.MM.YYYY HH:mm:ss';

export const DATE_FORMAT_ZERO_TIME = 'DD/MM/YYYY 00:00:00';
export const DATE_FORMAT_END_OF_DAY_TIME = 'DD/MM/YYYY 23:59:59';

export const navigateTypeEnum = {
    PUSH: 'PUSH',
    POP: 'POP',
    REPLACE: 'REPLACE',
};

export const accessRouteTypeEnum = {
    NOT_LOGIN: false,
    REQUIRE_LOGIN: true,
    BOTH: null,
};

export const UploadFileTypes = {
    AVATAR: 'AVATAR',
    LOGO: 'LOGO',
    DOCUMENT: 'DOCUMENT',
};

export const LIMIT_IMAGE_SIZE = 512000;

export const SORT_DATE = 3;

export const KIND_ADMIN = 1;
export const KIND_MANAGER = 2;
export const KIND_CUSTOMER = 3;

export const STATUS_PENDING = 0;
export const STATUS_ACTIVE = 1;
export const STATUS_INACTIVE = -1;
export const STATUS_DELETE = -2;

export const CATEGORY_KIND_INCOME = 1;
export const CATEGORY_KIND_EXPENDITURE = 2;

export const DEFAULT_TABLE_ISPAGED = 1;
export const DEFAULT_TABLE_ISPAGED_0 = 0;
export const DEFAULT_TABLE_ITEM_SIZE = 20;
export const DEFAULT_TABLE_ITEM_SIZE_10 = 10;
export const DEFAULT_TABLE_PAGE_START = 0;
export const DEFAULT_TABLE_ITEM_SIZE_ALL = 1000;

export const TASK_PENDING = 1;
export const TASK_DONE = 2;

export const KEY_KIND_SERVER = 1;
export const KEY_KIND_GOOGLE = 2;

export const LECTURE_STATE_INIT = 0;
export const LECTURE_STATE_PROCESSED = 1;

export const commonStatus = {
    PENDING: 0,
    ACTIVE: 1,
    INACTIVE: -1,
    DELETE: -2,
};

export const UserTypes = {
    ADMIN: 1,
    CUSTOMER: 2,
    EMPLOYEE: 3,
};

export const commonStatusColor = {
    [commonStatus.ACTIVE]: 'green',
    [commonStatus.PENDING]: 'warning',
    [commonStatus.INACTIVE]: 'red',
    [commonStatus.DELETE]: 'red',
};

export const categoryKind = {
    news: 1,
};

export const GROUP_KIND_ADMIN = 1;
export const GROUP_KIND_MANAGER = 2;
export const GROUP_KIND_USER = 3;

export const groupPermissionKindsOptions = [
    { label: 'Admin', value: GROUP_KIND_ADMIN },
    { label: 'Manager', value: GROUP_KIND_MANAGER },
    { label: 'User', value: GROUP_KIND_USER },
];

export const isSystemSettingOptions = [
    { label: commonMessage.showSystemSettings, value: 1 },
    { label: commonMessage.hideSystemSettings, value: 0 },
];

export const PROVINCE_KIND = 3;
export const DISTRICT_KIND = 2;
export const WARD_KIND = 1;

export const SettingTypes = {
    Money: 'Money',
    Timezone: 'Timezone',
    System: 'System',
};

export const secretKey = 'olcj02baltvgf8co';

export const CurrentcyPositions = {
    FRONT: 0,
    BACK: 1,
};

export const PermissionKind = {
    ITEM: 1,
    GROUP: 2,
};

export const WidthDialogDetail = '60%';

export const LECTURE_SECTION = 1;
export const LECTURE_LESSION = 2;
export const LECTURE_VIDEO = 3;

export const VIDEO_LOADING = 0;
export const VIDEO_SUCCESS = 1;

export const SSO_LOGIN_PASSWORD = 'SSO_LOGIN_PASSWORD';
export const SSO_LOGIN_TOTP = 'SSO_LOGIN_TOTP';
export const SSO_LOGIN_QR_SCAN = 'SSO_LOGIN_QR_SCAN';

export const KIND_ACCOUNT_GROUP = 1;
export const KIND_ACCOUNT_PRIVATE = 2;
export const RELOAD_LIST_DURATION = 10000;

export const ROLE_ADMIN = 1;
export const ROLE_MANAGER = 2;
export const ROLE_CUSTOMER = 3;
export const ROLE_GUEST = 4;

export const MEETING_ROOM_PRIVATE = 0;
export const MEETING_ROOM_PUBLIC = 1;

export const formSize = {
    small: '600px',
    normal: '700px',
    big: '1200px',
    editor: '1000px',
};

export const TAG_UNIMPORTANT = 0;
export const TAG_IMPORTANT = 1;

export const FILE_KIND_SYSTEM = 1;
export const FILE_KIND_PRESENTATION = 2;
export const FILE_KIND_DEFAULT = 3;
export const FILE_KIND_AVATAR = 4;
