import apiConfig from '@constants/apiConfig';
import { commonMessage } from '@locales/intl';
import FoodListPage from '.';
import FoodSavePage from './FoodSavePage';
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
    foodSavePage: {
        path: paths.foodSavePage,
        component: FoodSavePage,
        separateCheck: true,
        auth: true,
        permission: [apiConfig.food.create.permissionCode, apiConfig.food.update.permissionCode],
        pageOptions: {
            objectName: 'Đồ ăn',
            listPageUrl: paths.foodListPage, 
            renderBreadcrumbs: (messages, t, title, options = {}) => {
                return [
                    { breadcrumbName: 'Món ăn', path: paths.foodListPage },
                    { breadcrumbName: title },
                ];
            },
        },
    },
};
