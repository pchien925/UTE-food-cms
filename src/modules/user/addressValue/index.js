import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import React from 'react';

import { StarFilled } from '@ant-design/icons';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import { FieldTypes } from '@constants/formConfig';
import { statusOptions } from '@constants/masterData';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { orderNumber, priceValue } from '@utils';
import { Empty } from 'antd';
import { useLocation, useParams } from 'react-router-dom';
import { showErrorMessage } from '@services/notifyService';

const AddressValueListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const location = useLocation();
    const { pathname: pagePath } = useLocation();
    const search = location.search;
    const { customerId } = useParams();
    const statusValue = translate.formatKeys(statusOptions, ['label']);

    const { data, mixinFuncs, queryFilter, loading, pagination, serializeParams } = useListBase({
        apiConfig: apiConfig.address,
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
                mixinFuncs.handleFetchList({ ...params, accountId: customerId });
            };
            funcs.changeFilter = (filter) => {
                mixinFuncs.setQueryParams(
                    serializeParams({
                        ...filter,
                        accountId: customerId,
                    }),
                );
            };

            funcs.additionalActionColumnButtons = () => ({});

            funcs.handleDeleteItemError = (error) => {
                const code = error.response.data.code;
                if (code === 'ERROR-ADDRESS-0003') {
                    showErrorMessage('Không thể xóa địa chỉ mặc định!');
                } else {
                    showErrorMessage('Không thể xóa!');
                }
            };
        },
    });

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'id',
            align: 'center',
            width: 70,
            render: (_, record, index) => {
                const number = orderNumber(pagination, index);
                return (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        {record.isDefault ? (
                            <StarFilled style={{ color: '#faad14', fontSize: '16px' }} />
                        ) : (
                            <span>{number}</span>
                        )}
                    </div>
                );
            },
        },
        {
            title: 'Tên người nhận',
            dataIndex: 'recipientName',
            width: 140,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            width: 140,
        },
        {
            title: 'Địa chỉ chi tiết',
            dataIndex: 'addressLine',
            render: (_, record) => {
                const addr = [
                    record.addressLine,
                    record.ward?.name,
                    record.district?.name,
                    record.province?.name,
                ].filter(Boolean);
                return <div>{addr.join(', ')}</div>;
            },
        },
        mixinFuncs.renderStatusColumn({ width: 140 }),
        mixinFuncs.renderActionColumn(
            {
                edit: mixinFuncs.hasPermission([apiConfig.address.update.permissionCode]),
                delete: mixinFuncs.hasPermission([apiConfig.address.delete.permissionCode]),
            },
            { width: 160 },
        ),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.address),
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

export default AddressValueListPage;
