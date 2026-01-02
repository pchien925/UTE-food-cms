import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import React from 'react';

import { UserOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import { FieldTypes } from '@constants/formConfig';
import { comboOptions } from '@constants/masterData';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { formatMoneyValue } from '@utils';
import { Empty, Tag } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

const ComboListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const location = useLocation();
    const { pathname: pagePath } = useLocation();
    const search = location.search;
    const statusValue = translate.formatKeys(comboOptions, ['label']);
    const navigate = useNavigate();

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.combo,
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
        { title: translate.formatMessage(commonMessage.comboName), dataIndex: 'name' },
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
                edit: mixinFuncs.hasPermission([apiConfig.combo.update.permissionCode]),
                delete: mixinFuncs.hasPermission([apiConfig.combo.delete.permissionCode]),
            },
            { width: 160 },
        ),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.comboName),
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
        </PageWrapper>
    );
};

export default ComboListPage;
