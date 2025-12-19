import { DISTRICT_KIND, PROVINCE_KIND, WARD_KIND } from '@constants';
import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import NationListPage from '.';
const paths = {
    provinceListPage: '/provinces',
    districtListPage: '/provinces/:provinceId/districts',
    wardListPage: '/provinces/:provinceId/districts/:districtId/wards',
};

export default {
    provinceListPage: {
        path: paths.provinceListPage,
        auth: true,
        component: NationListPage,
        permission: [apiConfig.nation.getList.permissionCode],
        pageOptions: {
            kind: PROVINCE_KIND,
            objectName: commonMessage.province,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.province) }];
            },
        },
    },
    districtListPage: {
        path: paths.districtListPage,
        auth: true,
        component: NationListPage,
        permission: [apiConfig.nation.getList.permissionCode],
        pageOptions: {
            kind: DISTRICT_KIND,
            objectName: commonMessage.district,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: t.formatMessage(messages.province), path: paths.provinceListPage },
                    { breadcrumbName: t.formatMessage(messages.district) },
                ];
            },
        },
    },
    wardListPage: {
        path: paths.wardListPage,
        auth: true,
        component: NationListPage,
        permission: [apiConfig.nation.getList.permissionCode],
        pageOptions: {
            kind: WARD_KIND,
            objectName: commonMessage.ward,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                const { provinceId } = options;
                return [
                    { breadcrumbName: t.formatMessage(messages.province), path: paths.provinceListPage },
                    { breadcrumbName: t.formatMessage(messages.district), path: paths.districtListPage.replace(':provinceId', provinceId) + `?provinceId=${provinceId}` },
                    { breadcrumbName: t.formatMessage(messages.ward) },
                ];
            },
        },
    },
};
