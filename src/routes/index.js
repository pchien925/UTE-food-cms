import PageNotAllowed from '@components/common/page/PageNotAllowed';
import PageNotFound from '@components/common/page/PageNotFound';
import apiConfig from '@constants/apiConfig';
import GroupPermissionListPage from '@modules/groupPermission';
import PermissionSavePage from '@modules/groupPermission/PermissionSavePage';
import LoginPage from '@modules/login/index';
import ProfilePage from '@modules/profile/index';
import adminsRoutes from '@modules/user/routes';
import tagsRoutes from '@modules/tag/routes';
import nationsRoutes from '@modules/nation/routes';
import optionsRoutes from '@modules/option/routes';
import foodsRoutes from '@modules/food/routes';
import combosRoutes from '@modules/combo/routes';
import branchesRoutes from '@modules/branch/routes';
import ordersRoutes from '@modules/order/routes';
import categoriesRoutes from '@modules/category/routes';
/*
    auth
        + null: access login and not login
        + true: access login only
        + false: access not login only
*/
const routes = {
    pageNotAllowed: {
        path: '/not-allowed',
        component: PageNotAllowed,
        auth: null,
        title: 'Page not allowed',
    },
    // homePage: {
    //     path: '/',
    //     component: Dashboard,
    //     auth: false,
    //     title: 'Home',
    // },
    loginPage: {
        path: '/login',
        component: LoginPage,
        auth: false,
        title: 'Login page',
    },
    profilePage: {
        path: '/profile',
        component: ProfilePage,
        auth: true,
        title: 'Profile page',
    },
    groupPermissionPage: {
        path: '/group-permission',
        component: GroupPermissionListPage,
        auth: true,
        title: 'Profile page',
        permission: [apiConfig.groupPermission.getGroupList.permissionCode],
    },
    groupPermissionSavePage: {
        path: '/group-permission/:id',
        component: PermissionSavePage,
        auth: true,
        title: 'Profile page',
        permission: [apiConfig.groupPermission.getById.permissionCode, apiConfig.groupPermission.update.permissionCode],
    },
    ...adminsRoutes,
    ...tagsRoutes,
    ...nationsRoutes,
    ...optionsRoutes,
    ...foodsRoutes,
    ...combosRoutes,
    ...branchesRoutes,
    ...categoriesRoutes,
    ...ordersRoutes,
    // keep this at last
    notFound: {
        component: PageNotFound,
        auth: null,
        title: 'Page not found',
        path: '*',
    },
};

export default routes;
