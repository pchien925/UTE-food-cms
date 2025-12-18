import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import React, { useState } from 'react';

import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { showErrorMessage, showSuccessMessage } from '@services/notifyService';
import { orderNumber } from '@utils';
import { Button, Empty } from 'antd';
import TagModal from './TagModal';


const TagListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const [selectedTag, setSelectedTag] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [opened, { open, close }] = useDisclosure();
    const { execute: executeCreate, loading: loadingCreate } = useFetch(apiConfig.tag.create);
    const { execute: executeUpdate, loading: loadingUpdate } = useFetch(apiConfig.tag.update);

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.tag,
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
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);
                mixinFuncs.handleFetchList({ ...params });
            };
            funcs.additionalActionColumnButtons = () => ({
                edit: ({ buttonProps, ...dataRow }) => {
                    return (
                        <BaseTooltip type="edit" objectName={translate.formatMessage(pageOptions.objectName)}>
                            <Button
                                {...buttonProps}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(dataRow);
                                }}
                                type="link"
                                style={{ padding: 0 }}
                            >
                                <EditOutlined color="red" />
                            </Button>
                        </BaseTooltip>
                    );
                },
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
            width: 60,
        },
        { title: translate.formatMessage(commonMessage.tagName), dataIndex: 'name' },
        {
            title: translate.formatMessage(commonMessage.tagColor),
            dataIndex: 'color',
            width: 140,
            align: 'center',
            render: (color) => (
            <span
                style={{
                    display: 'inline-block',
                    width: 36,
                    height: 18,
                    backgroundColor: color,
                    border: '1px solid #d9d9d9',
                }}
            />
        ),
        },
        mixinFuncs.renderActionColumn(
            {
                edit: true,
                delete: true,
            },
            { width: '150px' },
        ),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.tagName),
        },
    ];

    const handleAdd = () => {
        open();
        setIsEditing(false);
        setSelectedTag({});
    };

    const handleEdit = (dataRow) => {
        setIsEditing(true);
        setSelectedTag(dataRow);
        open();
    };

    const renderActionBar = () => {
        if (!mixinFuncs.hasPermission([apiConfig.tag.create.permissionCode])) return null;
        return (
            <Button type="primary" onClick={handleAdd} icon={<PlusOutlined />}>
                Thêm mới
            </Button>
        );
    };

    const onSubmit = async (values, callback) => {
        const execute = isEditing ? executeUpdate : executeCreate;
        const payload = isEditing ? { ...values, id: selectedTag?.id } : { ...values };
        await execute({
            data: payload,
            onCompleted: () => {
                close();
                showSuccessMessage(isEditing ? 'Cập nhật thành công' : 'Thêm mới thành công');
                mixinFuncs.getList();
            },
            onError: (err) => {
                if (err?.response?.data?.result === false) {
                    const errCode = err?.response?.data?.code;
                    if (errCode === 'ERROR-TAG-0001') {
                        showErrorMessage('Dự án đã tồn tại!');
                    } else {
                        showErrorMessage('Có lỗi xảy ra!');
                    }
                }
                callback?.(err);
            },
        });
    };

    return (
        <PageWrapper routes={pageOptions.renderBreadcrumbs(commonMessage, translate)}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={renderActionBar()}
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
            <TagModal
                open={opened}
                close={close}
                dataDetail={selectedTag}
                isEditing={isEditing}
                onSubmit={onSubmit}
                isSubmitting={loadingCreate || loadingUpdate}
            />
        </PageWrapper>
    );
};

export default TagListPage;
