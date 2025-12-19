import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import React from 'react';

import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import { FieldTypes } from '@constants/formConfig';
import { foodOptions } from '@constants/masterData';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { orderNumber, priceValue } from '@utils';
import { Empty } from 'antd';
import { useLocation, useParams } from 'react-router-dom';

const OptionValueListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const location = useLocation();
    const { pathname: pagePath } = useLocation();
    const search = location.search;
    const { optionId } = useParams();
    const statusValue = translate.formatKeys(foodOptions, ['label']);

    const { data, mixinFuncs, queryFilter, loading, pagination, serializeParams } = useListBase({
        apiConfig: apiConfig.optionValue,
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
                mixinFuncs.handleFetchList({ ...params, optionId });
            };
            funcs.changeFilter = (filter) => {
                mixinFuncs.setQueryParams(
                    serializeParams({
                        ...filter,
                        optionId,
                    }),
                );
            };
            funcs.additionalActionColumnButtons = () => ({
                // delete: (record) => {
                //     const hasPerm = mixinFuncs.hasPermission([apiConfig.account.delete.permissionCode]);
                //     return (
                //         <BaseTooltip type="delete" objectName={'Người dùng'}>
                //             <Button
                //                 type="link"
                //                 onClick={(e) => {
                //                     e.stopPropagation();
                //                     mixinFuncs.showDeleteItemConfirm(record.id);
                //                 }}
                //                 disabled={!hasPerm || record?.isSuperAdmin}
                //                 style={{ padding: 0 }}
                //             >
                //                 <DeleteOutlined style={{ color: (!hasPerm || record?.isSuperAdmin) ? '' : 'red' }}/>
                //             </Button>
                //         </BaseTooltip>
                //     );
                // },
            });
        },
    });
    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'id',
            align: 'center',
            render: (text, record, index) => {
                return orderNumber(pagination, index);
            },
            width: 70,
        },
        { title: translate.formatMessage(commonMessage.optionValueName), dataIndex: 'name' },
        { 
            title: translate.formatMessage(commonMessage.extraPrice), 
            dataIndex: 'extraPrice', 
            width: 140,
            align: 'center',
            render: (price) => {
                return (
                    <span>{priceValue(price)}</span>
                );
            },
        },
        mixinFuncs.renderStatusColumn({ width: 140 }),
        mixinFuncs.renderActionColumn(
            {
                edit: mixinFuncs.hasPermission([apiConfig.optionValue.update.permissionCode]),
                delete: mixinFuncs.hasPermission([apiConfig.optionValue.delete.permissionCode]),
            },
            { width: 160 },
        ),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.optionName),
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
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        rowKey={(record) => record.id}
                        pagination={pagination}
                        locale={{
                            emptyText: <Empty description={translate.formatMessage(commonMessage.noData)} />,
                        }}
                    />
                }
            />
        </PageWrapper>
    );
};

export default OptionValueListPage;
