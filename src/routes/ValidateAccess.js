import React from 'react';

import { accessRouteTypeEnum, STATUS_INACTIVE } from '@constants';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';

import HasPermission from '@components/common/elements/HasPermission';
import PageUnauthorized from '@components/common/page/unauthorized';
import apiConfig from '@constants/apiConfig';
import { navMenuConfig } from '@constants/menuConfig';
import useFetch from '@hooks/useFetch';
import useValidatePermission from '@hooks/useValidatePermission';
import MainLayout from '@modules/main/MainLayout';
import PublicLayout from '@modules/main/PublicLayout';
import { useDispatch } from 'react-redux';
import routes from '.';
import { getCacheAccessToken, removeCacheToken } from '@services/userService';
import { accountActions } from '@store/actions';
import useBrowserTabChange from '@hooks/useBrowserTabChange';
const ValidateAccess = ({
    authRequire,
    component: Component,
    componentProps,
    isAuthenticated,
    profile,
    layout,
    permissions: routePermissions,
    onValidatePermissions,
    path,
    separate,
    pageOptions,
}) => {
    const location = useLocation();
    const { id } = useParams();
    const validatePermission = useValidatePermission();

    function getInitRoute(navs) {
        return navs
            .map((nav) => {
                const { ...newNav } = { ...nav };

                if (newNav.isSuperAdmin && !profile?.isSuperAdmin) {
                    return null;
                }

                if (newNav.permission || newNav.kind) {
                    if (!validatePermission(newNav.permission, newNav.kind, newNav.excludeKind, newNav.onValidate)) {
                        return null;
                    }
                }

                if (newNav.children) {
                    newNav.children = getInitRoute(nav.children);
                    if (newNav.children.every((item) => item === null)) {
                        return null;
                    }
                }

                return newNav;
            })
            .filter(Boolean);
    }

    const getRedirect = (authRequire) => {
        if (authRequire === accessRouteTypeEnum.NOT_LOGIN && isAuthenticated) {
            const initRoutes = getInitRoute(navMenuConfig);
            if (initRoutes?.length > 0) {
                try {
                    const firstValidRoute = initRoutes.filter(Boolean)[0].children.filter(Boolean)[0];
                    const url = new URL(firstValidRoute.path, window.location.origin);
                    if (firstValidRoute.query) {
                        Object.entries(firstValidRoute.query).forEach(([key, value]) => {
                            const normalizedValue = Array.isArray(value) ? value.join(',') : value;
                            url.searchParams.append(key, normalizedValue);
                        });
                    }
                    return url.pathname + url.search;
                } catch (error) {
                    return routes.profilePage.path;
                }
            }

            return routes.profilePage.path;
        }

        if (authRequire === accessRouteTypeEnum.REQUIRE_LOGIN && !isAuthenticated) {
            return routes.loginPage.path;
        }

        return false;
    };

    const redirect = getRedirect(authRequire);

    if (redirect) {
        return <Navigate state={{ from: location }} key={redirect} to={redirect} replace />;
    }

    // currently, only support custom layout for authRequire route
    const Layout = authRequire ? layout || MainLayout : PublicLayout;
    return (
        <Layout>
            <HasPermission
                onValidate={onValidatePermissions}
                requiredPermissions={routePermissions}
                path={{ name: path, type: id === 'create' ? 'create' : 'update' }}
                separate={separate}
                fallback={<PageUnauthorized />}
            >
                <Component pageOptions={pageOptions} {...(componentProps || {})}>
                    <Outlet />
                </Component>
            </HasPermission>
        </Layout>
    );
};

export default ValidateAccess;
