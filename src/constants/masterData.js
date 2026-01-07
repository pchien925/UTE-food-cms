import {
    CATEGORY_KIND_EXPENDITURE,
    CATEGORY_KIND_INCOME,
    DATE_DISPLAY_FORMAT,
    DATE_FORMAT_BASIC,
    DATE_FORMAT_VALUE,
    DATE_SHORT_MONTH_FORMAT,
    DEFAULT_FORMAT,
    DEFAULT_FORMAT_BASIC,
    DEFAULT_FORMAT_ZERO,
    DEFAULT_FORMAT_ZERO_SECOND,
    DISTRICT_KIND,
    FILE_KIND_AVATAR,
    FILE_KIND_DEFAULT,
    FILE_KIND_PRESENTATION,
    FILE_KIND_SYSTEM,
    KIND_ACCOUNT_GROUP,
    KIND_ACCOUNT_PRIVATE,
    KIND_ADMIN,
    PROVINCE_KIND,
    ROLE_ADMIN,
    ROLE_CUSTOMER,
    ROLE_MANAGER,
    STATUS_ACTIVE,
    STATUS_DELETE,
    STATUS_INACTIVE,
    STATUS_PENDING,
    WARD_KIND,
} from '@constants';
import { defineMessages } from 'react-intl';
import { actionMessage, nationKindMessage } from './intl';

const commonMessage = defineMessages({
    statusActive: 'Hoạt động',
    statusLock: 'Khóa',
    statusPending: 'Đang chờ',
    statusInactive: 'Khóa',
    statusDelete: 'Đã xóa',
    income: 'Thu',
    expenditure: 'Chi',
    superAdmin: 'Super Admin',
    admin: 'Quản trị viên',
    manager: 'Quản lý',
    customer: 'Khách hàng',
    member: 'Member',
    user: 'User',
    account: 'Tài khoản',
    accountGroup: 'Nhóm tài khoản',
    meeting: 'Đang họp',
    idle: 'Đã kết thúc',
    public: 'Công khai',
    private: 'Riêng tư',
    guest: 'Khách',
    moderator: 'Moderator',
    orderStatusPending: 'Đang xử lý',
    orderStatusSuccess: 'Thành công',
    orderStatusFailed: 'Thất bại',
    orderStatusRefunded: 'Hoàn tiền',
});

export const languageOptions = [
    { value: 1, label: 'EN' },
    { value: 2, label: 'VN' },
    { value: 3, label: 'Other' },
];

export const kindOption = [
    { value: 1, label: commonMessage.admin },
    { value: 2, label: commonMessage.manager },
    { value: 3, label: commonMessage.customer },
];

export const commonStatus = [
    { value: STATUS_ACTIVE, label: 'Active', color: 'green' },
    { value: STATUS_PENDING, label: 'Pending', color: 'warning' },
    { value: STATUS_INACTIVE, label: 'Inactive', color: 'red' },
];

export const statusOptions = [
    { value: STATUS_ACTIVE, label: commonMessage.statusActive, color: '#00A648' },
    { value: STATUS_PENDING, label: commonMessage.statusPending, color: '#FFBF00' },
    { value: STATUS_INACTIVE, label: commonMessage.statusInactive, color: '#CC0000' },
    { value: STATUS_DELETE, label: commonMessage.statusDelete, color: '#CC0000' },
];

export const orderStatusOptions = [
    {
        value: 1,
        label: commonMessage.orderStatusPending, // Đang xử lý
        color: '#FFBF00',
    },
    {
        value: 2,
        label: commonMessage.orderStatusSuccess, // Thành công
        color: '#00A648',
    },
    {
        value: 3,
        label: commonMessage.orderStatusFailed, // Thất bại
        color: '#CC0000',
    },
    {
        value: 4,
        label: commonMessage.orderStatusRefunded, // Hoàn tiền
        color: '#1890FF',
    },
];

export const foodOptions = [
    { value: STATUS_ACTIVE, label: commonMessage.statusActive, color: '#00A648' },
    { value: STATUS_INACTIVE, label: commonMessage.statusInactive, color: '#CC0000' },
    { value: STATUS_DELETE, label: commonMessage.statusDelete, color: '#CC0000' },
];

export const foodFormOptions = [
    { value: STATUS_ACTIVE, label: commonMessage.statusActive, color: '#00A648' },
    { value: STATUS_INACTIVE, label: commonMessage.statusInactive, color: '#CC0000' },
];

export const comboOptions = [
    { value: STATUS_ACTIVE, label: commonMessage.statusActive, color: '#00A648' },
    { value: STATUS_INACTIVE, label: commonMessage.statusInactive, color: '#CC0000' },
    { value: STATUS_DELETE, label: commonMessage.statusDelete, color: '#CC0000' },
];

export const comboFormOptions = [
    { value: STATUS_ACTIVE, label: commonMessage.statusActive, color: '#00A648' },
    { value: STATUS_INACTIVE, label: commonMessage.statusInactive, color: '#CC0000' },
];

export const formSize = {
    small: '700px',
    normal: '800px',
    big: '900px',
    bigXl: '1200px',
    full: '70vw',
};

export const nationKindOptions = [
    {
        value: PROVINCE_KIND,
        label: nationKindMessage.province,
    },
    {
        value: DISTRICT_KIND,
        label: nationKindMessage.district,
    },
    {
        value: WARD_KIND,
        label: nationKindMessage.ward,
    },
];

export const kindOptions = [
    { value: CATEGORY_KIND_INCOME, label: commonMessage.income, color: '#00A648' },
    { value: CATEGORY_KIND_EXPENDITURE, label: commonMessage.expenditure, color: '#FFBF00' },
];

export const settingGroups = {
    GENERAL: 'general',
    PAGE: 'page_config',
    REVENUE: 'revenue_config',
    TRAINING: 'training_config',
    BBB: 'bbb_config',
};

export const dataTypeSetting = {
    INT: 'int',
    STRING: 'string',
    BOOLEAN: 'boolean',
    DOUBLE: 'double',
    RICHTEXT: 'richtext',
    DATE: 'date',
    SELECT: 'select',
    UPLOAD: 'upload',
};

export const settingKeyName = {
    MONEY_UNIT: 'money_unit',
    DATE_UNIT: 'date_format',
    DATE_TIME_UNIT: 'date_time_format',
    DECIMAL_SEPARATOR: 'decimal_separator',
    GROUP_SEPARATOR: 'group_separator',
};

export const actionOptions = [
    {
        value: 1,
        label: actionMessage.contactForm,
    },
    { value: 2, label: actionMessage.navigation },
];

export const dateTimeOptions = [
    { value: DEFAULT_FORMAT_BASIC, label: DEFAULT_FORMAT_BASIC },
    { value: DATE_DISPLAY_FORMAT, label: DATE_DISPLAY_FORMAT },
    { value: DEFAULT_FORMAT, label: DEFAULT_FORMAT },
    { value: DEFAULT_FORMAT_ZERO_SECOND, label: DEFAULT_FORMAT_ZERO_SECOND },
    { value: DEFAULT_FORMAT_ZERO, label: DEFAULT_FORMAT_ZERO },
];

export const dateOptions = [
    { value: DATE_FORMAT_BASIC, label: DATE_FORMAT_BASIC },
    { value: DATE_FORMAT_VALUE, label: DATE_FORMAT_VALUE },
    { value: DATE_SHORT_MONTH_FORMAT, label: DATE_SHORT_MONTH_FORMAT },
];

export const kindGroupAccountOptions = [
    { value: KIND_ACCOUNT_GROUP, label: commonMessage.account, color: '#00A648' },
    { value: KIND_ACCOUNT_PRIVATE, label: commonMessage.accountGroup, color: '#FFBF00' },
];

export const userKindOption = [
    {
        value: KIND_ADMIN,
        label: commonMessage.admin,
        color: 'volcano',
    },
    {
        value: ROLE_MANAGER,
        label: commonMessage.manager,
        color: 'gold',
    },
    {
        value: ROLE_CUSTOMER,
        label: commonMessage.customer,
        color: 'blue',
    },
];

export const daysTimeLabel = [{ label: commonMessage.morning }, { label: commonMessage.afternoon }];

export const dayOfWeek = defineMessages({
    monday: 'Thứ 2',
    tuesday: 'Thứ 3',
    wednesday: 'Thứ 4',
    thursday: 'Thứ 5',
    friday: 'Thứ 6',
    saturday: 'Thứ 7',
    sunday: 'Chủ nhật',
});

export const daysOfWeekSchedule = [
    { value: 'monday', label: dayOfWeek.monday },
    { value: 'tuesday', label: dayOfWeek.tuesday },
    { value: 'wednesday', label: dayOfWeek.wednesday },
    { value: 'thursday', label: dayOfWeek.thursday },
    { value: 'friday', label: dayOfWeek.friday },
    { value: 'saturday', label: dayOfWeek.saturday },
    { value: 'sunday', label: dayOfWeek.sunday },
];

export const groupPermissionKinds = [
    {
        value: ROLE_ADMIN,
        label: commonMessage.admin,
    },
    {
        value: ROLE_MANAGER,
        label: commonMessage.manager,
    },
    {
        value: ROLE_CUSTOMER,
        label: commonMessage.customer,
    },
];

export const FILE_KIND = {
    FILE_KIND_SYSTEM,
    FILE_KIND_PRESENTATION,
    FILE_KIND_DEFAULT,
    FILE_KIND_AVATAR,
};
