import { useSelector } from 'react-redux';

import { storageKeys, UserTypes } from '@constants';
import accountSelectors from '@selectors/account';
import { getCacheAccessToken, removeCacheToken } from '@services/userService';
import { accountActions } from '@store/actions';
import { removeItem } from '@utils/localStorage';
import { useCallback } from 'react';
import useActionLoading from './useActionLoading';
import useFetchAction from './useFetchAction';

const useAuth = () => {
    const profile = useSelector(accountSelectors.selectProfile);
    const token = getCacheAccessToken();
    const immediate = !!token && !profile;

    useFetchAction(
        accountActions.getProfile,
        { immediate },
        {
            onError: (err) => {
                if (err?.response?.data?.result === false) {
                    const errCode = err?.response?.data?.code;
                    if (errCode === 'ERROR') {
                        removeCacheToken();
                        removeItem(storageKeys.USER_KIND);
                    }
                }
            },
        },
    );

    const { loading } = useActionLoading(accountActions.getProfile.type);

    const permissions = profile?.group?.permissions?.map((permission) => permission.action);
    // console.log('permission',permissions);

    const permissionCodes = (profile?.group?.permissions)?.map((permission) => {
        return typeof permission === 'object' ? permission.permissionCode : permission;
    });
    // console.log('PC',permissionCodes);

    const kind = profile?.kind;
    const isSuperAdmin = profile?.isSuperAdmin;
    const isAdmin = useCallback(() => {
        if (kind === UserTypes.ADMIN) return true;
        return false;
    }, [kind]);
    const isEmployee = useCallback(() => {
        if (kind === UserTypes.EMPLOYEE) return true;
        return false;
    }, [kind]);
    const isCustomer = useCallback(() => {
        if (kind === UserTypes.CUSTOMER) return true;
        return false;
    }, [kind]);

    return {
        isAdmin,
        isEmployee,
        isCustomer,
        isAuthenticated: !!profile,
        profile,
        kind,
        permissions,
        permissionCodes,
        token,
        loading: immediate || loading,
        isSuperAdmin,
    };
};

export default useAuth;
