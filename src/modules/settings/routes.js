import apiConfig from '@constants/apiConfig';
import SettingPage from '.';

const paths = {
    settingListPage: '/settings',
};

export default {
    settingsPage: {
        path: paths.settingListPage,
        title: 'Settings',
        auth: true,
        component: SettingPage,
        keyActiveTab: 'activeSettingTab',
        permissions: [apiConfig.settings.getList.permissionCode],
    },
};
