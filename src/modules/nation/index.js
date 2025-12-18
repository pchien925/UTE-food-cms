import { RightSquareOutlined } from '@ant-design/icons';
import { BaseTooltip } from '@components/common/form/BaseTooltip';
import ListPage from '@components/common/layout/ListPage';
import PageWrapper from '@components/common/layout/PageWrapper';
import BaseTable from '@components/common/table/BaseTable';
import { DEFAULT_TABLE_ITEM_SIZE, PROVINCE_KIND, WARD_KIND } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import routes from '@routes';
import { Button } from 'antd';
import React from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';

const message = defineMessages({
    objectName: 'Nation',
});

const ProvinceListPage = ({ pageOptions }) => {
    const translate = useTranslate();
    const navigate = useNavigate();

    const { data, mixinFuncs, queryFilter, loading, pagination } = useListBase({
        apiConfig: apiConfig.nation,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(message.objectName),
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
                mixinFuncs.handleFetchList({ ...params, kind: PROVINCE_KIND });
            };
            funcs.additionalActionColumnButtons = () => ({
                district: ({ id, name }) => (
                    <BaseTooltip title={translate.formatMessage(commonMessage.district)}>
                        <Button
                            type="link"
                            style={{ padding: 0 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                    routes.nationListPage.path + `/district?provinceId=${id}&provinceName=${name}`,
                                );
                            }}
                        >
                            <RightSquareOutlined />
                        </Button>
                    </BaseTooltip>
                ),
            });
        },
    });

    const columns = [
        {
            title: translate.formatMessage(commonMessage.Province),
            dataIndex: 'name',
            render: (name, record) => (
                <Button type='link' onClick={() => navigate(routes.nationListPage.path + `/district?provinceId=${record.id}&provinceName=${record.name}`)}>
                    {name}
                </Button>
            ),
        },
        {
            title: translate.formatMessage(commonMessage.postCode),
            width: 180,
            dataIndex: 'postalCode',
        },
        mixinFuncs.renderStatusColumn({ width: '120px' }),
        mixinFuncs.renderActionColumn(
            {
                edit: true,
                delete: true,
            },
            { width: '130px' },
        ),
    ];

    const searchFields = [
        {
            key: 'name',
            placeholder: translate.formatMessage(commonMessage.Province),
        },
    ];

    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(commonMessage.Province) }]}>
            <ListPage
                searchForm={mixinFuncs.renderSearchForm({ fields: searchFields, initialValues: queryFilter })}
                actionBar={mixinFuncs.renderActionBar()}
                baseTable={
                    <BaseTable
                        onChange={mixinFuncs.changePagination}
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        pagination={pagination}
                        objectName={translate.formatMessage(message.objectName)}

                    />
                }
            />
        </PageWrapper>
    );
};

export default ProvinceListPage;
