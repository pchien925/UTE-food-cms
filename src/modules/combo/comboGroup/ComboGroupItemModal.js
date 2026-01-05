import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import React, { useEffect, useState } from 'react';

import { DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import DragDropTableV2 from '@components/common/table/DragDropTableV2';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import useDragDrop from '@hooks/useDragDrop';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Button, Col, Empty, Modal, Row } from 'antd';
import { useLocation } from 'react-router-dom';
import ComboGroupItemForm from './ComboGroupItemForm';

const ComboGroupItemModal = ({ open, onCancel, comboGroupId }) => {
    const translate = useTranslate();
    const location = useLocation();
    const { pathname: pagePath } = useLocation();
    const search = location.search;

    const [openForm, setOpenForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [detailData, setDetailData] = useState(null);

    const { data, mixinFuncs, queryFilter, loading, pagination, serializeParams } = useListBase({
        apiConfig: apiConfig.comboGroupItem,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: 'Combo Group Item',
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
            funcs.getList = () => {
                if (!comboGroupId) return;
                const params = mixinFuncs.prepareGetListParams(queryFilter);
                mixinFuncs.handleFetchList({ ...params, comboGroupId });
            };
            funcs.changeFilter = (filter) => {
                mixinFuncs.setQueryParams(
                    serializeParams({
                        ...filter,
                        comboGroupId,
                    }),
                );
            };
            funcs.getCreateLink = () => {
                if (pagination.total >= 5) {
                    return null;
                }
                return `${pagePath}/create${search}`;
            };
            funcs.additionalActionColumnButtons = () => ({
                edit: (record) => {
                    return (
                        <BaseTooltip>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(record);
                                }}
                                type="link"
                                style={{ padding: 0 }}
                            >
                                <EditOutlined />
                            </Button>
                        </BaseTooltip>
                    );
                },
                delete: (record) => {
                    return (
                        <BaseTooltip>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    mixinFuncs.showDeleteItemConfirm(record?.id);
                                }}
                                type="link"
                                style={{ padding: 0 }}
                            >
                                <DeleteOutlined style={{ color: 'red' }} />
                            </Button>
                        </BaseTooltip>
                    );
                },
            });
        },
    });

    useEffect(() => {
        if (open && comboGroupId) {
            mixinFuncs.getList();
        }
    }, [open, comboGroupId]);

    const {
        sortedData,
        sortColumn,
        onDragEndDnd,
        loading: sortLoading,
    } = useDragDrop({
        data: data,
        apiConfig: apiConfig.comboGroupItem.updateSort,
        setTableLoading: () => {},
        indexField: 'ordering',
    });

    const handleCreate = () => {
        setIsEditing(false);
        setDetailData(null);
        setOpenForm(true);
    };

    const handleEdit = (record) => {
        setIsEditing(true);
        setDetailData(record);
        setOpenForm(true);
    };

    const handleFormDone = () => {
        setOpenForm(false);
        mixinFuncs.getList();
    };

    const isMaxOptionsReached = (pagination.total || 0) >= 5;

    const columns = [
        sortedData?.length > 1 && sortColumn,
        {
            title: '#',
            dataIndex: ['food', 'imageUrl'],
            width: 80,
            align: 'center',
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
        {
            title: 'Tên món ăn',
            dataIndex: ['food', 'name'],
        },
        {
            title: 'Giá cộng thêm',
            dataIndex: 'extraPrice',
            align: 'center',
            width: 180,
        },
        mixinFuncs.renderActionColumn(
            {
                edit: true,
                delete: true,
            },
            { width: 160 },
        ),
    ];

    return (
        <Modal
            title="Danh sách món ăn"
            open={open}
            onCancel={onCancel}
            width={1000}
            footer={null}
            centered
            style={{ body: { minHeight: '600px' } }}
        >
            <div style={{ minHeight: 500 }}>
                <Row justify="end" style={{ marginBottom: 16 }}>
                    <Col>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleCreate}
                            disabled={isMaxOptionsReached} // Disable nếu >= 5
                        >
                            Thêm mới
                        </Button>
                    </Col>
                </Row>
                <DragDropTableV2
                    onDragEnd={(active, over) => onDragEndDnd({ active, over })}
                    onChange={mixinFuncs.changePagination}
                    pagination={pagination}
                    dataSource={sortedData}
                    columns={columns}
                    loading={loading || sortLoading}
                    rowKey={(record) => record.id}
                    scroll={{ x: 'max-content' }}
                    locale={{
                        emptyText: <Empty description={translate.formatMessage(commonMessage.noData)} />,
                    }}
                />
            </div>

            <ComboGroupItemForm
                open={openForm}
                onCancel={() => setOpenForm(false)}
                onDone={handleFormDone}
                comboGroupId={comboGroupId}
                isEditing={isEditing}
                dataDetail={detailData}
                setIsChangedFormValues={() => {}}
                nextOrdering={(pagination.total || 0) + 1}
            />
        </Modal>
    );
};

export default ComboGroupItemModal;
