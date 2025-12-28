import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import FoodListPage from '.';
const paths = {
    foodListPage: '/foods',
    foodSavePage: '/foods/:id',
};
export default {
    foodListPage: {
        path: paths.foodListPage,
        auth: true,
        component: FoodListPage,
        permission: [apiConfig.food.getList.permissionCode],
        pageOptions: {
            objectName: commonMessage.food,
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [{ breadcrumbName: t.formatMessage(messages.food) }];
            },
        },
    },
};
