import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import CategoryListPage from '.';
import CategorySavePage from './CategorySavePage';
const paths = {
    categoryListPage: '/categories',
    categorySavePage: '/categories/:id',
};
export default {
    categoryListPage: {
        path: paths.categoryListPage,
        auth: true,
        component: CategoryListPage,
        permission: [apiConfig.category.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.category,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.category) }];
            },
        },
    },
    categorySavePage: {
        path: paths.categorySavePage,
        component: CategorySavePage,
        separateCheck: true,
        auth: true,
        permission: [apiConfig.category.create.permissionCode, apiConfig.category.update.permissionCode],
        pageOptions: {
            objectName: commonMessage.category,
            listPageUrl: paths.categoryListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                const { search } = options;
                return [
                    { breadcrumbName: t.formatMessage(messages.option), path: paths.categoryListPage + search },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};
