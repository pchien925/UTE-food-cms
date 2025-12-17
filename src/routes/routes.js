import React from 'react';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import AppNavigate from '@modules/main/AppNavigate';
import ValidateAccess from './ValidateAccess';

import Loading from '@components/common/loading';
import useAuth from '@hooks/useAuth';
import useFirstActiveRoute from '@hooks/useFirstActiveRoute';
import routes from '.';

const routesArray = Object.values(routes);

const AppRoutes = () => {
    const { isAuthenticated, loading: loadingProfile, profile } = useAuth();
    const defaultPath = useFirstActiveRoute({ profile });

    const renderRoute = (route) => {
        const Component = route.component;
        return (
            <Route
                key={route.path || 'not-found'}
                path={route.path}
                index={route.index}
                element={
                    loadingProfile ? (
                        <Loading show />
                    ) : (
                        <ValidateAccess
                            permissions={route.permission}
                            separate={route.separateCheck}
                            onValidatePermissions={route.validatePermissions}
                            authRequire={route.auth}
                            component={Component}
                            componentProps={route.componentProps}
                            isAuthenticated={isAuthenticated}
                            profile={profile}
                            layout={route.layout}
                            path={route.path}
                            pageOptions={route.pageOptions}
                        />
                    )
                }
            />
        );
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to={defaultPath} replace />} />
                <Route element={<AppNavigate />}>{routesArray.map(renderRoute)}</Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
