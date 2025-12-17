import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import UserAdminListPage from '.';
import UserAdminSavePage from './UserAdminSavePage';
import { KIND_ADMIN, KIND_CUSTOMER, KIND_MANAGER } from '@constants';
const paths = {
    adminsListPage: '/admins',
    adminsSavePage: '/admins/:id',
    managerListPage: '/managers',
    managerSavePage: '/managers/:id',
    customerListPage: '/customers',
    customerSavePage: '/customers/:id',
    addressListPage: '/user/address',
    addressSavePage: '/user/address/:id',
};
export default {
    adminListPage: {
        path: paths.adminsListPage,
        auth: true,
        component: UserAdminListPage,
        permission: [apiConfig.account.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.user,
            kind: KIND_ADMIN,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.user) }];
            },
        },
    },
    adminSavePage: {
        path: paths.adminsSavePage,
        component: UserAdminSavePage,
        separateCheck: true,
        auth: true,
        permission: [apiConfig.account.create.permissionCode, apiConfig.account.update.permissionCode],
        pageOptions: {
            objectName: commonMessage.user,
            kind: KIND_ADMIN,
            listPageUrl: paths.adminsListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.user), path: paths.adminsListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
    managerListPage: {
        path: paths.managerListPage,
        auth: true,
        component: UserAdminListPage,
        permission: [apiConfig.account.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.managers,
            kind: KIND_MANAGER,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.managers) }];
            },
        },
    },
    managerSavePage: {
        path: paths.managerSavePage,
        component: UserAdminSavePage,
        separateCheck: true,
        auth: true,
        permission: [apiConfig.account.create.permissionCode, apiConfig.account.update.permissionCode],
        pageOptions: {
            objectName: commonMessage.managers,
            kind: KIND_MANAGER,
            listPageUrl: paths.managerListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.managers), path: paths.managerListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
    customerListPage: {
        path: paths.customerListPage,
        auth: true,
        component: UserAdminListPage,
        permission: [apiConfig.account.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.customer,
            kind: KIND_CUSTOMER,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.customer) }];
            },
        },
    },
    customerSavePage: {
        path: paths.customerSavePage,
        component: UserAdminSavePage,
        separateCheck: true,
        auth: true,
        permission: [apiConfig.account.create.permissionCode, apiConfig.account.update.permissionCode],
        pageOptions: {
            objectName: commonMessage.customer,
            kind: KIND_CUSTOMER,
            listPageUrl: paths.customerListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.customer), path: paths.customerListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};
