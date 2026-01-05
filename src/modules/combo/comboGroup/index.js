import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import React, { useState } from 'react';

import { DeleteOutlined, EditOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import DragDropTableV2 from '@components/common/table/DragDropTableV2';
import { DEFAULT_TABLE_ITEM_SIZE, STATUS_DELETE } from '@constants';
import useDragDrop from '@hooks/useDragDrop';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Button, Empty } from 'antd';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ComboGroupItemModal from './ComboGroupItemModal';

const ComboGroupListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const location = useLocation();
    const { pathname: pagePath } = useLocation();
    const search = location.search;
    const { comboId } = useParams();
    const navigate = useNavigate();

    const [openItemModal, setOpenItemModal] = useState(false);
    const [selectedComboGroupId, setSelectedComboGroupId] = useState(null);

    const { data, mixinFuncs, queryFilter, loading, pagination, serializeParams } = useListBase({
        apiConfig: apiConfig.comboGroup,
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
                const nextOrdering = (pagination.total || 0) + 1;
                const searchParams = new URLSearchParams(search);
                searchParams.set('nextOrdering', nextOrdering);
                return `${pagePath}/create?${searchParams.toString()}`;
            };
            funcs.getItemDetailLink = (dataRow) => {
                return `${pagePath}/${dataRow.id}${search}`;
            };
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);
                mixinFuncs.handleFetchList({ ...params, comboId });
            };
            funcs.changeFilter = (filter) => {
                mixinFuncs.setQueryParams(
                    serializeParams({
                        ...filter,
                        comboId,
                    }),
                );
            };
            funcs.additionalActionColumnButtons = () => ({
                viewItem: (record) => {
                    return (
                        <BaseTooltip title="Xem danh sách món ăn">
                            <Button
                                style={{ padding: 0 }}
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedComboGroupId(record.id);
                                    setOpenItemModal(true);
                                }}
                            >
                                <UnorderedListOutlined style={{ color: '#fa8c16' }} />
                            </Button>
                        </BaseTooltip>
                    );
                },
                edit: (record) => {
                    const isDelete = record?.status === STATUS_DELETE;
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.comboGroup.update.permissionCode]);
                    return (
                        <BaseTooltip>
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
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.comboGroup.delete.permissionCode]);
                    return (
                        <BaseTooltip>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    mixinFuncs.showDeleteItemConfirm(record?.id);
                                }}
                                type="link"
                                style={{ padding: 0 }}
                                disabled={!hasPerm || record?.isSuperAdmin || isDelete}
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

    const {
        sortedData,
        sortColumn,
        onDragEndDnd,
        loading: sortLoading,
    } = useDragDrop({
        data: data,
        apiConfig: apiConfig.comboGroup.updateSort,
        setTableLoading: () => {},
        indexField: 'ordering',
    });

    const isMaxOptionsReached = (pagination.total || 0) >= 5;

    const columns = [
        sortedData?.length > 1 && sortColumn,
        {
            title: translate.formatMessage(commonMessage.comboGroup),
            dataIndex: 'name',
        },
        {
            title: 'Chọn tối thiểu',
            dataIndex: 'minSelect',
            align: 'center',
            width: 150,
        },
        {
            title: 'Chọn tối đa',
            dataIndex: 'maxSelect',
            align: 'center',
            width: 150,
        },
        {
            title: 'Số món ăn',
            dataIndex: 'items',
            align: 'center',
            width: 120,
            render: (items) => {
                return items?.length || 0;
            },
        },
        mixinFuncs.renderActionColumn(
            {
                viewItem: true,
                edit: true,
                delete: true,
            },
            { width: 160 },
        ),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.comboGroup),
        },
    ];

    return (
        <PageWrapper routes={pageOptions.renderBreadcrumbs(commonMessage, translate)}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={!isMaxOptionsReached && mixinFuncs.renderActionBar()}
                baseTable={
                    <DragDropTableV2
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={sortedData}
                        onDragEnd={onDragEndDnd}
                        loading={loading}
                        rowKey={(record) => record.id}
                        pagination={pagination}
                        locale={{
                            emptyText: <Empty description={translate.formatMessage(commonMessage.noData)} />,
                        }}
                    />
                }
            />
            <ComboGroupItemModal
                open={openItemModal}
                onCancel={() => setOpenItemModal(false)}
                comboGroupId={selectedComboGroupId}
            />
        </PageWrapper>
    );
};
export default ComboGroupListPage;
