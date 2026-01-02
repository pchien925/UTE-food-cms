import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import ComboListPage from '.';
import ComboSavePage from './ComboSavePage';
const paths = {
    comboListPage: '/combos',
    comboSavePage: '/combos/:id',
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
};
