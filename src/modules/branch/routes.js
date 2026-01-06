import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import BranchListPage from '.';
import BranchSavePage from './BranchSavePage';

const paths = {
    branchListPage: '/branches',
    branchSavePage: '/branches/:id',
};

export default {
    branchListPage: {
        path: paths.branchListPage,
        auth: true,
        component: BranchListPage,
        permission: [apiConfig.branch.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.branch,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.branch) }];
            },
        },
    },
    branchSavePage: {
        path: paths.branchSavePage,
        auth: true,
        component: BranchSavePage,
        separateCheck: true,
        permission: [apiConfig.branch.create.permissionCode, apiConfig.branch.update.permissionCode],
        pageOptions: {
            objectName: commonMessage.branch,
            listPageUrl: paths.branchListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                const { search } = options;
                return [
                    { breadcrumbName: t.formatMessage(messages.branch), path: paths.branchListPage + search },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};
