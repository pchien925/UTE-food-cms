import apiConfig from '@constants/apiConfig';
import NationListPage from '.';
import NationSavePage from './NationSavePage';
import DistrictListPage from './district';
import DistrictSavePage from './district/DistrictSavePage';
import VillageListPage from './village';
import VillageSavePage from './village/VillageSavePage';
import { commonMessage } from '@locales/intl';
const paths = {
    provincesListPage: '/provinces',
    provincesSavePage: '/provinces/:id',
};

export default {
    provinceListPage: {
        path: paths.provincesListPage,
        auth: true,
        component: NationListPage,
        permission: [apiConfig.nation.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.province,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.province) }];
            },
        },
    },
    nationListPage: {
        path: '/nations',
        title: 'Nation',
        auth: true,
        component: NationListPage,
    },
    nationSavePage: {
        path: '/nation/:id',
        title: 'Nation Save Page',
        auth: true,
        component: NationSavePage,
    },
    districtListPage: {
        path: '/nations/districts',
        title: 'District List page',
        auth: true,
        component: DistrictListPage,
    },
    districtSavePage: {
        path: '/nations/districts/:id',
        title: 'District Save Page',
        auth: true,
        component: DistrictSavePage,
    },
    villagetListPage: {
        path: '/nations/districts/village',
        title: 'District List page',
        auth: true,
        component: VillageListPage,
    },
    villageSavePage: {
        path: '/nations/districts/villages/:id',
        title: 'District Save Page',
        auth: true,
        component: VillageSavePage,
    },
};
