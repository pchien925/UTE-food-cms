import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_TABLE_ITEM_SIZE, DISTRICT_KIND, PROVINCE_KIND, WARD_KIND } from '@constants';
import apiConfig from '@constants/apiConfig';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { showErrorMessage, showSuccessMessage } from '@services/notifyService';
import { orderNumber } from '@utils';
import { Button, Empty } from 'antd';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NationSaveModal from './NationSaveModal';

const NationListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const { provinceId, districtId } = useParams();
    const kind = pageOptions?.kind;

    const { data, mixinFuncs, queryFilter, loading, pagination, serializeParams } = useListBase({
        apiConfig: apiConfig.nation,
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

                if (kind === DISTRICT_KIND) params.parentId = provinceId;
                if (kind === WARD_KIND) params.parentId = districtId;

                mixinFuncs.handleFetchList({ ...params, kind });
            };
            funcs.changeFilter = (filter) => {
                const params = { ...filter };

                if (kind === DISTRICT_KIND) params.parentId = provinceId;
                if (kind === WARD_KIND) params.parentId = districtId;

                mixinFuncs.setQueryParams(
                    serializeParams(params),
                );
            };
            funcs.handleDeleteItemError = (error) => {
                if (error.response?.data?.code === 'ERROR-NATION-0001') {
                    showErrorMessage('Không thể xóa, tồn tại khu vực con');
                } else {
                    showErrorMessage("Không thể xóa khu vực!");
                }
            };
            funcs.additionalActionColumnButtons = () => ({
                edit: (record) => {
                    return (
                        <BaseTooltip type="edit" objectName={translate.formatMessage(pageOptions.objectName)}>
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
            });
        },
    });

    const [selectedNation, setSelectedNation] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [opened, { open, close }] = useDisclosure();
    const { execute: executeCreate, loading: loadingCreate } = useFetch(apiConfig.nation.create);
    const { execute: executeUpdate, loading: loadingUpdate } = useFetch(apiConfig.nation.update);

    const handleAdd = () => {
        open();
        setIsEditing(false);
        setSelectedNation({});
    };

    const handleEdit = (dataRow) => {
        setIsEditing(true);
        setSelectedNation(dataRow);
        open();
    };

    const renderActionBar = () => {
        if (!mixinFuncs.hasPermission([apiConfig.nation.create.permissionCode])) return null;
        return (
            <Button type="primary" onClick={handleAdd} icon={<PlusOutlined />}>
                Thêm mới
            </Button>
        );
    };

    const onSubmit = async (values, callback) => {
        const execute = isEditing ? executeUpdate : executeCreate;

        let payload = {
            ...values,
            kind,
        };

        if (isEditing) {
            payload.id = selectedNation?.id;
        }

        switch (kind) {
            case DISTRICT_KIND:
                payload.parentId = provinceId;
                break;

            case WARD_KIND:
                payload.parentId = districtId;
                break;

            default:
                break;
        }
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
                    if (errCode === 'ERROR-NATION-0000') {
                        showErrorMessage('Địa chỉ đã tồn tại');
                    } else {
                        showErrorMessage('Có lỗi xảy ra');
                    }
                }
                callback?.(err);
            },
        });
    };


    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'id',
            align: 'center',
            render: (text, record, index) => {
                return orderNumber(pagination, index);
            },
            width: 70,
        },
        {
            title: translate.formatMessage(pageOptions.objectName),
            dataIndex: 'name',
            render: (name, record) => {
                const redirect = (() => {
                    switch (kind) {
                        case PROVINCE_KIND:
                            return routes.districtListPage.path.replace(':provinceId', record?.id) + `?provinceId=${record?.id}`;
                        case DISTRICT_KIND:
                            return routes.wardListPage.path.replace(':provinceId', provinceId).replace(':districtId', record?.id) + `?provinceId=${provinceId}&districtId=${record?.id}`;
                        default:
                            return null;
                    }
                })();

                return redirect ? (
                    <Button
                        style={{ padding: 0 }}
                        type="link"
                        onClick={() => navigate(redirect)}
                    >
                        {name}
                    </Button>
                ) : (
                    <span>{name}</span>
                );
            },
        },
        kind === PROVINCE_KIND && {
            title: translate.formatMessage(commonMessage.postCode),
            width: 160,
            dataIndex: 'postalCode',
            align: 'center',
        },
        mixinFuncs.renderStatusColumn({ width: 120 }),
        mixinFuncs.renderActionColumn(
            {
                edit: mixinFuncs.hasPermission(apiConfig.nation.update.permissionCode),
                delete: mixinFuncs.hasPermission(apiConfig.nation.delete.permissionCode),
            },
            { width: 160 },
        ),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(pageOptions.objectName),
        },
    ];

    return (
        <PageWrapper routes={pageOptions.renderBreadcrumbs(commonMessage, translate, null, { provinceId })}>
            <ListPage
                searchForm={
                    <div key={kind}>
                        {mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                    </div>
                }
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
            <NationSaveModal
                kind={kind}
                open={opened}
                close={close}
                dataDetail={selectedNation}
                isEditing={isEditing}
                onSubmit={onSubmit}
                isSubmitting={loadingCreate || loadingUpdate}
                objectName={translate.formatMessage(pageOptions.objectName)}
            />
        </PageWrapper>
    );
};

export default NationListPage;
