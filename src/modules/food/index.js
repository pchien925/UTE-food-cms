import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import React, { useState } from 'react';

import { DeleteOutlined, EditOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE, STATUS_DELETE } from '@constants';
import { FieldTypes } from '@constants/formConfig';
import { foodOptions } from '@constants/masterData';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { formatMoneyValue } from '@utils';
import { Button, Empty, Tag } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import FoodOptionModal from './FoodOptionModal';

const FoodListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const location = useLocation();
    const { pathname: pagePath } = useLocation();
    const search = location.search;
    const statusValue = translate.formatKeys(foodOptions, ['label']);
    const navigate = useNavigate();
    const [openOptionModal, setOpenOptionModal] = useState(false);
    const [selectedFoodId, setSelectedFoodId] = useState(null);

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.food,
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
                viewOption: (record) => {
                    return (
                        <BaseTooltip title="Xem danh sách tùy chọn">
                            <Button
                                style={{ padding: 0 }}
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedFoodId(record.id);
                                    setOpenOptionModal(true);
                                }}
                            >
                                <UnorderedListOutlined style={{ color: '#fa8c16' }} />
                            </Button>
                        </BaseTooltip>
                    );
                },
                edit: (record) => {
                    const isDelete = record?.status === STATUS_DELETE;
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.food.update.permissionCode]);
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
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.food.delete.permissionCode]);
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
    const columns = [
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
        { title: translate.formatMessage(commonMessage.foodName), dataIndex: 'name' },
        {
            title: translate.formatMessage(commonMessage.basePrice),
            dataIndex: 'basePrice',
            width: 140,
            align: 'center',
            render: (basePrice) => {
                return <span>{formatMoneyValue(basePrice)}</span>;
            },
        },
        {
            title: translate.formatMessage(commonMessage.cookingTime),
            dataIndex: 'cookingTime',
            width: 140,
            align: 'center',
            render: (cookingTime) => {
                return <span>{cookingTime}p</span>;
            },
        },
        {
            title: translate.formatMessage(commonMessage.category),
            dataIndex: ['category', 'name'],
            width: 180,
        },
        {
            title: translate.formatMessage(commonMessage.tag),
            dataIndex: 'tags',
            width: 140,
            align: 'center',
            render: (tags = []) => (
                <>
                    {tags.map((tag) => (
                        <Tag
                            key={tag.id}
                            color={tag.color}
                            style={{
                                marginBottom: 4,
                                width: '100%',
                                textAlign: 'center',
                                fontSize: 14,
                            }}
                        >
                            {tag.name}
                        </Tag>
                    ))}
                </>
            ),
        },
        mixinFuncs.renderStatusColumn({ width: 140 }),
        mixinFuncs.renderActionColumn(
            {
                viewOption: true,
                edit: true,
                delete: true,
            },
            { width: 160 },
        ),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.foodName),
        },
        {
            key: 'tagIds',
            placeholder: translate.formatMessage(commonMessage.tag),
            type: FieldTypes.AUTOCOMPLETE,
            apiConfig: apiConfig.tag.autoComplete,
            mappingOptions: (item) => ({
                value: item.id,
                label: item.name,
            }),
            searchParams: (text) => ({ name: text }),
            submitOnChanged: true,
            colSpan: 6,
            fieldProps: {
                mode: 'multiple',
                maxCount: 2,
                maxTagCount: 'responsive',
                notFoundContent: (
                    <Empty
                        style={{ width: '80%', height: '80%', margin: '0 auto' }}
                        description={translate.formatMessage(commonMessage.noData)}
                    />
                ),
            },
        },
        {
            key: 'categoryId',
            placeholder: translate.formatMessage(commonMessage.category),
            type: FieldTypes.AUTOCOMPLETE,
            apiConfig: apiConfig.category.autoComplete,
            mappingOptions: (item) => ({
                value: item.id,
                label: item.name,
            }),
            searchParams: (text) => ({ name: text }),
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
            <FoodOptionModal
                open={openOptionModal}
                onCancel={() => setOpenOptionModal(false)}
                foodId={selectedFoodId}
            />
        </PageWrapper>
    );
};

export default FoodListPage;
