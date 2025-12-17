import { AppConstants, apiUrl } from '.';

const baseHeader = {
    'Content-Type': 'application/json',
};

const multipartFormHeader = {
    'Content-Type': 'multipart/form-data',
};

const apiConfig = {
    auth: {
        login: {
            baseURL: `${apiUrl}api/auth/login`,
            method: 'POST',
            headers: baseHeader,
        },
    },
    account: {
        getProfile: {
            baseURL: `${apiUrl}api/account/profile`,
            method: 'GET',
            headers: baseHeader,
        },
        updateProfile: {
            baseURL: `${apiUrl}api/account/update-profile`,
            method: 'PUT',
            headers: baseHeader,
        },
        updateProfileAdmin: {
            baseURL: `${apiUrl}api/account/update-profile-admin`,
            method: 'PUT',
            headers: baseHeader,
        },
        getById: {
            baseURL: `${apiUrl}api/account/get/:id`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'ACC_V',
        },
        logout: {
            baseURL: `${apiUrl}api/account/logout`,
            method: 'GET',
            headers: baseHeader,
        },
        getList: {
            baseURL: `${apiUrl}api/account/list`,
            method: `GET`,
            headers: baseHeader,
            permissionCode: 'ACC_L',
        },
        createAdmin: {
            baseURL: `${apiUrl}api/account/create_admin`,
            method: `POST`,
            headers: baseHeader,
            permissionCode: 'ACC_C_AD',
        },
        updateAdmin: {
            baseURL: `${apiUrl}api/account/update_admin`,
            method: `PUT`,
            headers: baseHeader,
            permissionCode: 'ACC_U_AD',
        },
        create: {
            baseURL: `${apiUrl}api/account/create`,
            method: `POST`,
            headers: baseHeader,
            permissionCode: 'ACC_C',
        },
        update: {
            baseURL: `${apiUrl}api/account/update`,
            method: `PUT`,
            headers: baseHeader,
            permissionCode: 'ACC_U',
        },
        delete: {
            baseURL: `${apiUrl}api/account/delete/:id`,
            method: `DELETE`,
            headers: baseHeader,
            permissionCode: 'ACC_D',
        },
        exportExcel: {
            baseURL: `${apiUrl}api/account/export-to-excel-key`,
            method: `GET`,
            headers: baseHeader,
        },
        getMyKey: {
            baseURL: `${apiUrl}api/account/my-key`,
            method: `GET`,
            headers: baseHeader,
        },
        clearKey: {
            baseURL: `${apiUrl}api/account/clear-key`,
            method: `GET`,
            headers: baseHeader,
        },
        autocomplete: {
            baseURL: `${apiUrl}api/account/auto-complete`,
            method: `GET`,
            headers: baseHeader,
        },
        synchronize: {
            baseURL: `${apiUrl}api/account/synchronize-admin`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'ACC_S',
        },
        changePassword: {
            baseURL: `${apiUrl}api/account/change-password`,
            method: `PUT`,
            headers: baseHeader,
            // permissionCode: 'ACC_CP',
        },
    },
    file: {
        download_video_resource: {
            baseURL: `${AppConstants.mediaRootUrl}api/file/download-video-resource`,
            method: 'GET',
            headers: multipartFormHeader,
        },
        upload_video: {
            baseURL: `${AppConstants.mediaRootUrl}api/file/upload-video`,
            method: 'POST',
            headers: multipartFormHeader,
            permissionCode: 'FILE_U_V',
        },
        upload: {
            baseURL: `${AppConstants.mediaRootUrl}api/file/upload`,
            method: 'POST',
            headers: multipartFormHeader,
            permissionCode: 'FILE_U',
        },
        image: {
            baseURL: `${AppConstants.mediaRootUrl}admin/api/image/upload`,
            method: 'POST',
            headers: multipartFormHeader,
        },
        video: {
            baseURL: `${AppConstants.mediaRootUrl}admin/api/video/upload`,
            method: 'POST',
            headers: multipartFormHeader,
        },
    },
    settings: {
        getSettingsList: {
            baseURL: `${apiUrl}api/setting/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'SET_L',
        },
        getList: {
            baseURL: `${apiUrl}api/setting/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'SET_L',
        },
        getById: {
            baseURL: `${apiUrl}api/setting/get/:id`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'SET_V',
        },
        create: {
            baseURL: `${apiUrl}api/setting/create`,
            method: 'POST',
            headers: baseHeader,
            permissionCode: 'SET_C',
        },
        update: {
            baseURL: `${apiUrl}api/setting/update`,
            method: 'PUT',
            headers: baseHeader,
            permissionCode: 'SET_U',
        },
        delete: {
            baseURL: `${apiUrl}api/setting/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
        },
        autocomplete: {
            baseURL: `${apiUrl}api/setting/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
        getByKey: {
            baseURL: `${apiUrl}api/setting/find-by-key`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'SET_V',
        },
    },
    notification: {
        getList: {
            baseURL: `${apiUrl}api/notification/list`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        getById: {
            baseURL: `${apiUrl}api/notification/get/:id`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        create: {
            baseURL: `${apiUrl}api/notification/create`,
            method: 'POST',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        update: {
            baseURL: `${apiUrl}api/notification/update`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        delete: {
            baseURL: `${apiUrl}api/notification/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        autocomplete: {
            baseURL: `${apiUrl}api/notification/auto-complete`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        myNotification: {
            baseURL: `${apiUrl}api/notification/my-notification`,
            method: 'GET',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        changeState: {
            baseURL: `${apiUrl}api/notification/read`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        readAll: {
            baseURL: `${apiUrl}api/notification/read-all`,
            method: 'PUT',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
        deleteAll: {
            baseURL: `${apiUrl}api/notification/delete-all`,
            method: 'DELETE',
            headers: baseHeader,
            isRequiredTenantId: true,
        },
    },
    groupPermission: {
        getGroupList: {
            baseURL: `${apiUrl}api/group/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'GR_L',
        },
        getList: {
            baseURL: `${apiUrl}api/group/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'GR_L',
        },
        getPermissionList: {
            baseURL: `${apiUrl}api/permission/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'PER_L',
        },
        getById: {
            baseURL: `${apiUrl}api/group/get/:id`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'GR_V',
        },
        create: {
            baseURL: `${apiUrl}api/group/create`,
            method: 'POST',
            headers: baseHeader,
            permissionCode: 'GR_C',
        },
        update: {
            baseURL: `${apiUrl}api/group/update`,
            method: 'PUT',
            headers: baseHeader,
            permissionCode: 'GR_U',
        },
        delete: {
            baseURL: `${apiUrl}api/group/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            permissionCode: 'GR_D',
        },
        getGroupListCombobox: {
            baseURL: `${apiUrl}api/group/list_combobox`,
            method: 'GET',
            headers: baseHeader,
        },
        autoComplete: {
            baseURL: `${apiUrl}api/group/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    management: {
        reset: {
            baseURL: `${apiUrl}api/management/reset-data`,
            method: 'DELETE',
            headers: baseHeader,
            permissionCode: 'MAG_RES',
        },
    },
};

export default apiConfig;
