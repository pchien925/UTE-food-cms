import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import ComboListPage from '.';
import ComboSavePage from './ComboSavePage';
import ComboGroupListPage from './comboGroup';
import ComboGroupSavePage from './comboGroup/ComboGroupSavePage';

const paths = {
    comboListPage: '/combos',
    comboSavePage: '/combos/:id',
    comboGroupListPage: '/combos/:comboId/combo-groups',
    comboGroupSavePage: '/combos/:comboId/combo-groups/:id',
};
export default {
    comboListPage: {
        path: paths.comboListPage,
        auth: true,
        component: ComboListPage,
        permission: [apiConfig.combo.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.combo,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.combo) }];
            },
        },
    },
    comboSavePage: {
        path: paths.comboSavePage,
        component: ComboSavePage,
        separateCheck: true,
        auth: true,
        permission: [apiConfig.combo.create.permissionCode, apiConfig.combo.update.permissionCode],
        pageOptions: {
            objectName: commonMessage.combo,
            listPageUrl: paths.comboListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.combo), path: paths.comboListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
    comboGroupListPage: {
        path: paths.comboGroupListPage,
        auth: true,
        component: ComboGroupListPage,
        permission: [apiConfig.comboGroup.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.comboGroup,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.combo), path: paths.comboListPage },
                    { breadcrumbName: t.formatMessage(commonMessage.comboGroup) },
                ];
            },
        },
    },
    comboGroupSavePage: {
        path: paths.comboGroupSavePage,
        auth: true,
        component: ComboGroupSavePage,
        separateCheck: true,
        permission: [apiConfig.comboGroup.create.permissionCode, apiConfig.comboGroup.update.permissionCode],
        pageOptions: {
            objectName: commonMessage.comboGroup,
            listPageUrl: paths.comboGroupListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                const { search, comboId } = options;
                return [
                    { breadcrumbName: t.formatMessage(messages.combo), path: paths.comboListPage },
                    {
                        breadcrumbName: t.formatMessage(commonMessage.comboGroup),
                        path: paths.comboGroupListPage.replace(':comboId', comboId) + search,
                    },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};
