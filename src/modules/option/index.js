import BaseTable from '@components/common/table/BaseTable';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import React from 'react';

import { UserOutlined, FileTextOutlined } from '@ant-design/icons';
import AvatarField from '@components/common/form/AvatarField';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import { FieldTypes } from '@constants/formConfig';
import { foodOptions } from '@constants/masterData';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Empty } from 'antd';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import routes from '@routes';

const OptionListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const location = useLocation();
    const { pathname: pagePath } = useLocation();
    const search = location.search;
    const statusValue = translate.formatKeys(foodOptions, ['label']);
    const navigate = useNavigate();

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.option,
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
                viewValues: (record) => {
                    return (
                        <BaseTooltip title={"Xem danh sách giá trị"}>
                            <Button
                                type="link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(routes.optionValueListPage.path.replace(':optionId', record?.id) + `?optionId=${record?.id}`);
                                }}
                                style={{ padding: 0 }}
                            >
                                <FileTextOutlined />
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
            dataIndex: 'image',
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
        { title: translate.formatMessage(commonMessage.optionName), dataIndex: 'name' },
        mixinFuncs.renderStatusColumn({ width: 140 }),
        mixinFuncs.renderActionColumn(
            {
                viewValues: mixinFuncs.hasPermission([apiConfig.optionValue.getList.permissionCode]),
                edit: mixinFuncs.hasPermission([apiConfig.option.update.permissionCode]),
                delete: mixinFuncs.hasPermission([apiConfig.option.delete.permissionCode]),
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

export default OptionListPage;
