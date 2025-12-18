import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import TagListPage from '.';
const paths = {
    tagsListPage: '/tags',
    tagsSavePage: '/tags/:id',
};
export default {
    tagListPage: {
        path: paths.tagsListPage,
        auth: true,
        component: TagListPage,
        permission: [apiConfig.tag.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.tag,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.tag) }];
            },
        },
    },
    // tagSavePage: {
    //     path: paths.adminsSavePage,
    //     component: UserAdminSavePage,
    //     separateCheck: true,
    //     auth: true,
    //     permission: [apiConfig.account.create.permissionCode, apiConfig.account.update.permissionCode],
    //     pageOptions: {
    //         objectName: commonMessage.user,
    //         listPageUrl: paths.adminsListPage,
    //         renderBreadcrumbs: (messages, t, title, options = {}) => {
    //             return [
    //                 { breadcrumbName: t.formatMessage(messages.user), path: paths.adminsListPage },
    //                 { breadcrumbName: title },
    //             ];
    //         },
    //     },
    // },
};
