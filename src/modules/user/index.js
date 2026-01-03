import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import { Button, Empty, Tag } from 'antd';
import React from 'react';

import { DeleteOutlined, UserOutlined, EditOutlined, EnvironmentOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import TextField from '@components/common/form/TextField';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE, KIND_CUSTOMER, STATUS_DELETE } from '@constants';
import { FieldTypes } from '@constants/formConfig';
import { statusOptions, userKindOption } from '@constants/masterData';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { useLocation, useNavigate } from 'react-router-dom';
import routes from '@routes';

const UserAdminListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const location = useLocation();
    const navigate = useNavigate();
    const { pathname: pagePath } = useLocation();
    const search = location.search;
    const statusValue = translate.formatKeys(statusOptions, ['label']);
    const userKindValues = translate.formatKeys(userKindOption, ['label']);
    const kind = pageOptions?.kind;

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: {
            getList: apiConfig.account.getList,
            getById: apiConfig.account.getById,
            create: apiConfig.account.create,
            update: apiConfig.account.update,
            delete: apiConfig.account.delete,
        },
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
                mixinFuncs.handleFetchList({ ...params, kind: kind });
            };
            funcs.additionalActionColumnButtons = () => ({
                viewAddress: (record) => {
                    return (
                        <BaseTooltip title={'Xem danh sách địa chỉ'}>
                            <Button
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(
                                        routes.addressListPage.path.replace(':customerId', record?.id) +
                                            `?customerId=${record?.id}`,
                                    );
                                }}
                                style={{ padding: 0 }}
                            >
                                <EnvironmentOutlined />
                            </Button>
                        </BaseTooltip>
                    );
                },
                edit: (record) => {
                    const isDelete = record?.status === STATUS_DELETE;
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.account.update.permissionCode]);
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
                    const hasPerm = mixinFuncs.hasPermission([apiConfig.account.delete.permissionCode]);
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
            title: '#',
            dataIndex: 'avatarPath',
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
        { title: translate.formatMessage(commonMessage.fullName), dataIndex: 'fullName' },
        { title: translate.formatMessage(commonMessage.username), dataIndex: 'username', width: 200 },
        {
            title: translate.formatMessage(commonMessage.email),
            dataIndex: 'email',
            width: '220px',
        },
        {
            title: translate.formatMessage(commonMessage.phone),
            dataIndex: 'phone',
            width: 160,
        },
        {
            title: translate.formatMessage(commonMessage.userKind),
            dataIndex: 'kind',
            width: 160,
            align: 'center',
            render(dataRow) {
                const kind = userKindValues.find((item) => item.value == dataRow);

                return kind ? (
                    <Tag
                        color={kind.color}
                        style={{
                            display: 'inline-block',
                            width: '100%',
                            textAlign: 'center',
                            fontSize: 14,
                        }}
                    >
                        {kind.label}
                    </Tag>
                ) : (
                    <Tag />
                );
            },
        },
        mixinFuncs.renderStatusColumn({ width: 140 }),
        mixinFuncs.renderActionColumn(
            {
                viewAddress: kind === KIND_CUSTOMER,
                edit: true,
                delete: true,
            },
            { width: 160 },
        ),
    ];

    const searchFields = [
        {
            key: 'fullName',
            placeholder: translate.formatMessage(commonMessage.fullName),
        },
        {
            key: 'phone',
            placeholder: translate.formatMessage(commonMessage.phone),
            type: FieldTypes.STRING,
            renderItem: () => <TextField placeholder={translate.formatMessage(commonMessage.phone)} />,
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
                searchForm={
                    <div key={kind}>
                        {mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                    </div>
                }
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

export default UserAdminListPage;
