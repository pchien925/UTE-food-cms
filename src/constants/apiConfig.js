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
    tag: {
        getList: {
            baseURL: `${apiUrl}api/tag/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'TAG_L',
        },
        getById: {
            baseURL: `${apiUrl}api/tag/get/:id`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'TAG_V',
        },
        create: {
            baseURL: `${apiUrl}api/tag/create`,
            method: 'POST',
            headers: baseHeader,
            permissionCode: 'TAG_C',
        },
        update: {
            baseURL: `${apiUrl}api/tag/update`,
            method: 'PUT',
            headers: baseHeader,
            permissionCode: 'TAG_U',
        },
        delete: {
            baseURL: `${apiUrl}api/tag/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            permissionCode: 'TAG_D',
        },
        autoComplete: {
            baseURL: `${apiUrl}api/tag/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    nation: {
        getList: {
            baseURL: `${apiUrl}api/nation/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'NAT_L',
        },
        getById: {
            baseURL: `${apiUrl}api/nation/get/:id`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'NAT_V',
        },
        create: {
            baseURL: `${apiUrl}api/nation/create`,
            method: 'POST',
            headers: baseHeader,
            permissionCode: 'NAT_C',
        },
        update: {
            baseURL: `${apiUrl}api/nation/update`,
            method: 'PUT',
            headers: baseHeader,
            permissionCode: 'NAT_U',
        },
        delete: {
            baseURL: `${apiUrl}api/nation/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            permissionCode: 'NAT_D',
        },
        autoComplete: {
            baseURL: `${apiUrl}api/nation/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    option: {
        getList: {
            baseURL: `${apiUrl}api/option/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'OPT_L',
        },
        getById: {
            baseURL: `${apiUrl}api/option/get/:id`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'OPT_V',
        },
        create: {
            baseURL: `${apiUrl}api/option/create`,
            method: 'POST',
            headers: baseHeader,
            permissionCode: 'OPT_C',
        },
        update: {
            baseURL: `${apiUrl}api/option/update`,
            method: 'PUT',
            headers: baseHeader,
            permissionCode: 'OPT_U',
        },
        delete: {
            baseURL: `${apiUrl}api/option/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            permissionCode: 'OPT_D',
        },
        autoComplete: {
            baseURL: `${apiUrl}api/option/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    optionValue: {
        getList: {
            baseURL: `${apiUrl}api/option-value/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'OPV_L',
        },
        getById: {
            baseURL: `${apiUrl}api/option-value/get/:id`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'OPV_V',
        },
        create: {
            baseURL: `${apiUrl}api/option-value/create`,
            method: 'POST',
            headers: baseHeader,
            permissionCode: 'OPV_C',
        },
        update: {
            baseURL: `${apiUrl}api/option-value/update`,
            method: 'PUT',
            headers: baseHeader,
            permissionCode: 'OPV_U',
        },
        delete: {
            baseURL: `${apiUrl}api/option-value/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            permissionCode: 'OPV_D',
        },
        autoComplete: {
            baseURL: `${apiUrl}api/option-value/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    address: {
        getList: {
            baseURL: `${apiUrl}api/address/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'ADD_L',
        },
        getById: {
            baseURL: `${apiUrl}api/address/get/:id`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'ADD_V',
        },
        create: {
            baseURL: `${apiUrl}api/address/create`,
            method: 'POST',
            headers: baseHeader,
            permissionCode: 'ADD_C',
        },
        update: {
            baseURL: `${apiUrl}api/address/update`,
            method: 'PUT',
            headers: baseHeader,
            permissionCode: 'ADD_U',
        },
        delete: {
            baseURL: `${apiUrl}api/address/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            permissionCode: 'ADD_D',
        },
        autoComplete: {
            baseURL: `${apiUrl}api/address/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    food: {
        getList: {
            baseURL: `${apiUrl}api/food/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'FOOD_L',
        },
        getById: {
            baseURL: `${apiUrl}api/food/get/:id`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'FOOD_V',
        },
        create: {
            baseURL: `${apiUrl}api/food/create`,
            method: 'POST',
            headers: baseHeader,
            permissionCode: 'FOOD_C',
        },
        update: {
            baseURL: `${apiUrl}api/food/update`,
            method: 'PUT',
            headers: baseHeader,
            permissionCode: 'FOOD_U',
        },
        delete: {
            baseURL: `${apiUrl}api/food/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            permissionCode: 'FOOD_D',
        },
        autoComplete: {
            baseURL: `${apiUrl}api/food/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    combo: {
        getList: {
            baseURL: `${apiUrl}api/combo/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'COM_L',
        },
        getById: {
            baseURL: `${apiUrl}api/combo/get/:id`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'COM_V',
        },
        create: {
            baseURL: `${apiUrl}api/combo/create`,
            method: 'POST',
            headers: baseHeader,
            permissionCode: 'COM_C',
        },
        update: {
            baseURL: `${apiUrl}api/combo/update`,
            method: 'PUT',
            headers: baseHeader,
            permissionCode: 'COM_U',
        },
        delete: {
            baseURL: `${apiUrl}api/combo/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            permissionCode: 'COM_D',
        },
        autoComplete: {
            baseURL: `${apiUrl}api/combo/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
    },
    category: {
        getList: {
            baseURL: `${apiUrl}api/category/list`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'CAT_L',
        },
        getById: {
            baseURL: `${apiUrl}api/category/get/:id`,
            method: 'GET',
            headers: baseHeader,
            permissionCode: 'CAT_V',
        },
        create: {
            baseURL: `${apiUrl}api/category/create`,
            method: 'POST',
            headers: baseHeader,
            permissionCode: 'CAT_C',
        },
        update: {
            baseURL: `${apiUrl}api/category/update`,
            method: 'PUT',
            headers: baseHeader,
            permissionCode: 'CAT_U',
        },
        delete: {
            baseURL: `${apiUrl}api/category/delete/:id`,
            method: 'DELETE',
            headers: baseHeader,
            permissionCode: 'CAT_D',
        },
        autoComplete: {
            baseURL: `${apiUrl}api/category/auto-complete`,
            method: 'GET',
            headers: baseHeader,
        },
        updateSort: {
            baseURL: `${apiUrl}api/category/update-sort`,
            method: 'PUT',
            headers: baseHeader,
            permissionCode: 'CAT_U',
        },
    },
};

export default apiConfig;
