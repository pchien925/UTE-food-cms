import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import React from 'react';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_TABLE_ITEM_SIZE, STATUS_DELETE } from '@constants';
import { FieldTypes } from '@constants/formConfig';
import { orderStatusOptions } from '@constants/masterData';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { formatMoneyValue } from '@utils';
import { Button, Empty, Tag } from 'antd';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const location = useLocation();
    const { pathname: pagePath } = useLocation();
    const search = location.search;
    const statusValue = translate.formatKeys(orderStatusOptions, ['label']);
    const navigate = useNavigate();

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.order,
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
            funcs.additionalActionColumnButtons = () => ({
                edit: (record) => {
                    const isDelete = record?.status === STATUS_DELETE;
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.branch.update.permissionCode]);
                    return (
                        <BaseTooltip type="edit" objectName={translate.formatMessage(pageOptions.objectName)}>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(mixinFuncs.getItemDetailLink(record), {
                                        state: { action: 'edit', prevPath: location.pathname },
                                    });
                                }}
                                type="link"
                                style={{ padding: 0 }}
                                disabled={!hasPerm || isDelete}
                            >
                                <EditOutlined />
                            </Button>
                        </BaseTooltip>
                    );
                },
                delete: (record) => {
                    const isDelete = record?.status === STATUS_DELETE;
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.branch.delete.permissionCode]);
                    return (
                        <BaseTooltip type="delete" objectName={translate.formatMessage(pageOptions.objectName)}>
                            <Button
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    mixinFuncs.showDeleteItemConfirm(record.id);
                                }}
                                disabled={!hasPerm || record?.isSuperAdmin || isDelete}
                                style={{ padding: 0 }}
                            >
                                <DeleteOutlined
                                    style={{ color: !hasPerm || record?.isSuperAdmin || isDelete ? '' : 'red' }}
                                />
                            </Button>
                        </BaseTooltip>
                    );
                },
            });
        },
    });

    const columns = [
        {
            title: 'Ngày tạo',
            dataIndex: 'createdDate',
            width: 200,
            render: (value) =>
                value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '-',
        },
        {
            title: 'Mã đơn hàng',
            dataIndex: 'code',
            width: 220,
        },
        {
            title: 'Chi nhánh',
            dataIndex: 'branchName',
        },
        {
            title: 'Tạm tính',
            dataIndex: 'subAmount',
            align: 'right',
            render: (value) => <span>{formatMoneyValue(value)}</span>,
            width: 160,
        },
        {
            title: 'Phí ship',
            dataIndex: 'shippingFee',
            align: 'right',
            render: (value) => <span>{formatMoneyValue(value)}</span>,
            width: 160,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            align: 'right',
            render: (value) => <span>{formatMoneyValue(value)}</span>,
            width: 160,
        },
        {
            title: 'Trạng thái đơn',
            dataIndex: 'orderStatus',
            align: 'center',
            width: 140,
            render: (status) => {
                const statusMap = {
                    1: { text: 'Đang xử lý', color: 'processing' },
                    2: { text: 'Thành công', color: 'success' },
                    3: { text: 'Thất bại', color: 'error' },
                    4: { text: 'Hoàn tiền', color: 'warning' },
                };

                const currentStatus = statusMap[status] || {
                    text: 'Unknown',
                    color: 'default',
                };

                return (
                    <Tag
                        color={currentStatus.color}
                        style={{
                            display: 'inline-block',
                            width: 160,
                            textAlign: 'center',
                            fontSize: 14,
                        }}
                    >
                        <div style={{ padding: '0 4px' }}>
                            {currentStatus.text}
                        </div>
                    </Tag>
                );
            },
        },
        {
            title: 'Thanh toán',
            dataIndex: 'paymentStatus',
            align: 'center',
            width: 160,
            render: (status) => {
                const statusMap = {
                    1: { text: 'Chưa thanh toán', color: 'processing' },
                    2: { text: 'Đã thanh toán', color: 'success' },
                    3: { text: 'Đã hoàn tiền', color: 'warning' },
                };

                const currentStatus = statusMap[status] || {
                    text: 'Không xác định',
                    color: 'default',
                };

                return (
                    <Tag 
                        color={currentStatus.color} 
                        style={{
                            display: 'inline-block',
                            width: 160,
                            textAlign: 'center',
                            fontSize: 14,
                        }}
                    >
                        {currentStatus.text}
                    </Tag>
                );
            },
        },
        
        mixinFuncs.renderActionColumn(
            {
                edit: false,
                delete: false,
            },
            { width: 160 },
        ),
    ];

    const searchFields = [
        {
            key: 'branchId',
            placeholder: translate.formatMessage(commonMessage.brandName),
            type: FieldTypes.AUTOCOMPLETE,
            apiConfig: apiConfig.branch.getList,
            mappingOptions: (item) => ({
                value: item.id,
                label: item.name,
            }),
            searchParams: (text) => ({ name: text }),
            colSpan: 6,
            submitOnChanged: true,
            fieldProps: {
                notFoundContent: (
                    <Empty
                        style={{ width: '80%', height: '80%', margin: '0 auto' }}
                        description={translate.formatMessage(commonMessage.noData)}
                    />
                ),
            },
        },
        {
            key: 'code',
            placeholder: 'Mã đơn hàng',
        },
        {
            key: 'orderStatus',
            placeholder: 'Trạng thái đơn',
            type: FieldTypes.SELECT,
            options: statusValue,
            colSpan: 6,
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

export default OrderListPage;
