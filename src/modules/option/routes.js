import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import OptionListPage from '.';
import OptionSavePage from './OptionSavePage';
import OptionValueListPage from './optionValue';
import OptionValueSavePage from './optionValue/OptionValueSavePage';
const paths = {
    optionListPage: '/options',
    optionSavePage: '/options/:id',
    optionValueListPage: '/options/:optionId/option-values',
    optionValueSavePage: '/options/:optionId/option-values/:id',
};
export default {
    optionListPage: {
        path: paths.optionListPage,
        auth: true,
        component: OptionListPage,
        permission: [apiConfig.option.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.option,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.option) }];
            },
        },
    },
    optionSavePage: {
        path: paths.optionSavePage,
        component: OptionSavePage,
        separateCheck: true,
        auth: true,
        permission: [apiConfig.option.create.permissionCode, apiConfig.option.update.permissionCode],
        pageOptions: {
            objectName: commonMessage.option,
            listPageUrl: paths.optionListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                const { search } = options;
                return [
                    { breadcrumbName: t.formatMessage(messages.option), path: paths.optionListPage + search },
                    { breadcrumbName: title },
                ];
            },
        },
    },
    optionValueListPage: {
        path: paths.optionValueListPage,
        auth: true,
        component: OptionValueListPage,
        permission: [apiConfig.optionValue.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.optionValue,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.option), path: paths.optionListPage },
                    { breadcrumbName: t.formatMessage(messages.optionValue) },
                ];
            },
        },
    },
    optionValueSavePage: {
        path: paths.optionValueSavePage,
        component: OptionValueSavePage,
        separateCheck: true,
        auth: true,
        permission: [apiConfig.optionValue.create.permissionCode, apiConfig.optionValue.update.permissionCode],
        pageOptions: {
            objectName: commonMessage.optionValue,
            listPageUrl: paths.optionValueListPage,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                const { search, optionId } = options;
                return [
                    { breadcrumbName: t.formatMessage(messages.option), path: paths.optionListPage },
                    { breadcrumbName: t.formatMessage(messages.optionValue), path: paths.optionValueListPage.replace(':optionId', optionId) + search },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};
