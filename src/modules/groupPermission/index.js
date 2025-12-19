import { DeleteOutlined } from '@ant-design/icons';
import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import React from 'react';

import { BaseTooltip } from '@components/common/form/BaseTooltip';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { DEFAULT_TABLE_ITEM_SIZE, UserTypes } from '@constants';
import { FieldTypes } from '@constants/formConfig';
import { groupPermissionKinds } from '@constants/masterData';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { showErrorMessage } from '@services/notifyService';
import { Button, Empty } from 'antd';
import { FormattedMessage } from 'react-intl';

const GroupPermissionListPage = () => {
    const translate = useTranslate();
    const groupPermissionKindOptions = translate.formatKeys(groupPermissionKinds, ['label']);
    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.groupPermission,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: 'quyền',
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
                mixinFuncs.handleFetchList({ kind: UserTypes.ADMIN, ...params });
            };
            funcs.handleDeleteItemError = (error) => {
                const err = error.response.data;
                if (err?.result === false) {
                    const errCode = err.code;
                    if (errCode === 'ERROR-GROUP-0004') {
                        showErrorMessage('Quyền này đang được sử dụng, không thể xóa');
                    }
                } else {
                    showErrorMessage('Có lỗi xảy ra khi xóa');
                }
            };
            const getCreateLink = funcs.getCreateLink;
            funcs.getCreateLink = () => {
                return getCreateLink() + `?kind=${queryFilter.kind || UserTypes.ADMIN}`;
            };

            const getItemDetailLink = funcs.getItemDetailLink;
            funcs.getItemDetailLink = (dataRow) => {
                return getItemDetailLink(dataRow) + `?kind=${queryFilter.kind || UserTypes.ADMIN}`;
            };
            funcs.additionalActionColumnButtons = () => ({
                delete: ({ id, buttonProps, ...dataRow }) => {
                    if (dataRow?.isSystemRole) return null;
                    const disabled = !(
                        !dataRow.isSystemRole &&
                        mixinFuncs.hasPermission([apiConfig.groupPermission.delete.permissionCode])
                    );
                    return (
                        <BaseTooltip type="delete" objectName={'quyền'}>
                            <Button
                                {...buttonProps}
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    mixinFuncs.showDeleteItemConfirm(id);
                                }}
                                disabled={disabled}
                                style={{ padding: 0 }}
                            >
                                <DeleteOutlined style={{ color: disabled ? '' : 'red' }} />
                            </Button>
                        </BaseTooltip>
                    );
                },
            });
        },
    });

    const columns = [
        { title: translate.formatMessage(commonMessage.Name), dataIndex: 'name', width: '40%' },
        { title: translate.formatMessage(commonMessage.description), dataIndex: 'description' },
        mixinFuncs.renderActionColumn(
            {
                edit: mixinFuncs.hasPermission([apiConfig.groupPermission.update.permissionCode]),
                delete: true,
            },
            { width: '130px' },
        ),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.Name),
            colSpan: 4,
        },
        {
            key: 'kind',
            placeholder: translate.formatMessage(commonMessage.kind),
            colSpan: 4,
            type: FieldTypes.SELECT,
            submitOnChanged: true,
            options: groupPermissionKindOptions,
        },
    ];

    return (
        <PageWrapper routes={[{ breadcrumbName: <FormattedMessage defaultMessage="Quyền" /> }]}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({
                    fields: searchFields,
                    initialValues: { kind: groupPermissionKindOptions[0].value, ...queryFilter },
                })}
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

export default GroupPermissionListPage;
