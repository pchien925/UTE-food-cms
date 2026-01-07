import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import OrderListPage from '.';

const paths = {
    orderListPage: '/orders',
};

export default {
    orderListPage: {
        path: paths.orderListPage,
        auth: true,
        component: OrderListPage,
        permission: [apiConfig.order.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.order,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.order) }];
            },
        },
    },
};
