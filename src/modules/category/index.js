import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import React from 'react';

import { UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import DragDropTableV2 from '@components/common/table/DragDropTableV2';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import { FieldTypes } from '@constants/formConfig';
import { foodOptions } from '@constants/masterData';
import useDragDrop from '@hooks/useDragDrop';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Empty } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

const CategoryListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const location = useLocation();
    const { pathname: pagePath } = useLocation();
    const search = location.search;
    const statusValue = translate.formatKeys(foodOptions, ['label']);
    const navigate = useNavigate();

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.category,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(pageOptions.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        data: response.data.content,
                        total: response.data.totalElements,
                    };
                }
            };
            funcs.getCreateLink = () => {
                return `${pagePath}/create${search}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}${search}`;
            };
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);
                mixinFuncs.handleFetchList({ ...params });
            };
        },
    });

    const { sortedData, sortColumn, onDragEndDnd, loading: sortLoading } = useDragDrop({
        data: data,
        apiConfig: apiConfig.category.updateSort,
        setTableLoading: () => {},
        indexField: 'ordering',
    });
    const columns = [
        sortColumn,
        {
            title: '#',
            dataIndex: 'imageUrl',
            align: 'center',
            width: 100,
            render: (avatar) => {
                return (
                    <AvatarField
                        size="large"
                        icon={<UserOutlined />}
                        src={avatar ? `${AppConstants.avatarRootUrl}${avatar}` : null}
                    />
                );
            },
        },
        { title: translate.formatMessage(commonMessage.categoryName), dataIndex: 'name' },
        mixinFuncs.renderStatusColumn({ width: 140 }),
        mixinFuncs.renderActionColumn(
            {
                edit: mixinFuncs.hasPermission([apiConfig.category.update.permissionCode]),
                delete: mixinFuncs.hasPermission([apiConfig.category.delete.permissionCode]),
            },
            { width: 160 },
        ),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.categoryName),
        },
        {
            key: 'status',
            placeholder: translate.formatMessage(commonMessage.status),
            type: FieldTypes.SELECT,
            options: statusValue,
            submitOnChanged: true,
        },
    ];

    return (
        <PageWrapper routes={pageOptions.renderBreadcrumbs(commonMessage, translate)}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <DragDropTableV2
                            onDragEnd={(active, over) => onDragEndDnd({ active, over })}
                            onChange={mixinFuncs.changePagination}
                            pagination={pagination}
                            loading={loading || sortLoading}
                            dataSource={sortedData}
                            columns={columns}
                            rowKey={(record) => record.id}
                            locale={{
                                emptyText: <Empty description={translate.formatMessage(commonMessage.noData)} />,
                            }}
                        />
                }
            />
        </PageWrapper>
    );
};

export default CategoryListPage;
