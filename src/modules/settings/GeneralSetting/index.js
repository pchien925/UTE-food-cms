import BaseTable from '@components/common/table/BaseTable';
import { AppConstants, DEFAULT_TABLE_ITEM_SIZE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useListBase from '@hooks/useListBase';
import useTranslate from '@hooks/useTranslate';
import { Button, Card, Switch, Modal, Empty } from 'antd';
import React, { useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { EditOutlined } from '@ant-design/icons';
import useDisclosure from '@hooks/useDisclosure';
import useFetch from '@hooks/useFetch';
import useNotification from '@hooks/useNotification';
import { dataTypeSetting, settingGroups } from '@constants/masterData';
import { actions } from '@store/actions/app';
import { useDispatch } from 'react-redux';
import { commonMessage } from '@locales/intl';
import styles from './GeneralSetting.module.scss';
import routes from '@routes';
import EditGeneralModal from './EditGeneralModal';

const messages = defineMessages({
    objectName: 'Cài đặt BBB',
    createNew: '+',
    deleteSuccess: 'Xoá slider thành công',
    deleteCareer: 'Xoá Lĩnh vực thành công',
    slider: 'Slider',
    revenue: 'Lợi nhuận chia sẻ',
    setting: 'cài đặt',
    updateSuccess: 'Cập nhật {objectName} thành công',
    careerTitle: 'Danh sách lĩnh vực',
    thumbnail: 'Thumbnail',
    deleteConfirm: {
        title: {
            id: 'hook.useListBase.deleteConfirm.title',
            defaultMessage: 'Bạn có chắc chắn muốn xóa {objectName} này không?',
        },
        ok: {
            id: 'hook.useListBase.deleteConfirm.ok',
            defaultMessage: 'Có',
        },
        cancel: {
            id: 'hook.useListBase.deleteConfirm.cancel',
            defaultMessage: 'Không',
        },
    },
});
const GeneralSettingPage = ({ groupName }) => {
    const translate = useTranslate();
    const intl = useIntl();
    const notification = useNotification();
    const [openedGeneralModal, handlersGeneralModal] = useDisclosure(false);

    const [openedRichTextModal, handlersRichTextModal] = useDisclosure(false);
    const [detail, setDetail] = useState();
    const dispatch = useDispatch();

    const { data, mixinFuncs, queryFilter, loading, pagination, changePagination } = useListBase({
        apiConfig: apiConfig.settings,
        options: {
            pageSize: DEFAULT_TABLE_ITEM_SIZE,
            objectName: translate.formatMessage(messages.objectName),
        },
        override: (funcs) => {
            funcs.mappingData = (response) => {
                if (response.result === true) {
                    if (groupName === settingGroups.CAREER) {
                        const data =
                            typeof response.data.content[0].valueData == 'string'
                                ? JSON.parse(response.data.content[0].valueData)
                                : [];
                        return {
                            data: data,
                            total: response.data.totalElements,
                        };
                    }
                    return {
                        data: response?.data?.content,
                        total: response.data.totalElements,
                    };
                }
            };
            funcs.getList = () => {
                const params = mixinFuncs.prepareGetListParams(queryFilter);
                mixinFuncs.handleFetchList({ ...params, groupName });
            };
            funcs.additionalActionColumnButtons = () => ({
                booleanSetting: (item) => {
                    const disabled = !mixinFuncs.hasPermission([apiConfig.settings.update?.permissionCode]);
                    const handleChangeSwitch = (checked) => {
                        executeUpdate({
                            data: {
                                ...item,
                                id: item.id,
                                isSystem: item.isSystem,
                                status: item.status,
                                valueData: checked,
                            },
                            onCompleted: (response) => {
                                if (response.result === true) {
                                    notification({
                                        message: intl.formatMessage(messages.updateSuccess, {
                                            objectName: translate.formatMessage(messages.setting),
                                        }),
                                    });
                                    executeLoading();
                                    executeGetDataSetting({
                                        onCompleted: (response) => {
                                            const dataSetting = response?.data;
                                            dispatch(actions.settingSystem(dataSetting));
                                        },
                                    });
                                }
                            },
                            onError: (err) => {},
                        });
                    };
                    if (item?.dataType == dataTypeSetting.BOOLEAN) {
                        return (
                            <Switch
                                disabled={disabled}
                                onChange={handleChangeSwitch}
                                checked={item.valueData === 'true'}
                                size={'small'}
                            />
                        );
                    }
                },
                editSetting: (item) => {
                    const disabled = !mixinFuncs.hasPermission([apiConfig.settings.update?.permissionCode]);
                    if (item?.dataType != dataTypeSetting.BOOLEAN)
                        return (
                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                disabled={disabled}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDetail(item);
                                    handlersGeneralModal.open();
                                    // if (item?.isSlider) {
                                    //     setIsEditing(true);
                                    //     handlersSliderModal.open();
                                    // } else if (parentData.groupName === 'career') {
                                    //     setIsEditing(true);
                                    //     handlersCareerModal.open();
                                    // } else if (item?.keyName === 'introduce') {
                                    //     handlersIntroduceModal.open();
                                    // } else if (item?.groupName === settingGroups.REVENUE) {
                                    //     setIsEditingRevenue(true);
                                    //     handlersGeneralModal.open();
                                    // } else if (item.isThumbnail) {
                                    //     setIsEditing(true);
                                    //     handlersThumbnailModal.open();
                                    // } else {
                                    //     setIsEditingRevenue(false);
                                    //     handlersGeneralModal.open();
                                    // }
                                }}
                            >
                                <EditOutlined />
                            </Button>
                        );
                },
            });
        },
    });

    const columnBBB = [
        {
            title: <FormattedMessage defaultMessage="Tên" />,
            dataIndex: 'keyName',
            width: 200,
        },
        {
            title: <FormattedMessage defaultMessage="Giá trị" />,
            dataIndex: 'valueData',
            align: 'left',
            render: (valueData, record) => {
                if (valueData > 0) {
                    return (
                        <div
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'normal',
                                wordBreak: 'break-word',
                            }}
                        >
                            {valueData}
                            {localStorage.getItem(routes.settingsPage.keyActiveTab) == settingGroups.REVENUE && '%'}
                        </div>
                    );
                }
                if (record.dataType == dataTypeSetting.RICHTEXT) {
                    const htmlContent = { __html: valueData };
                    return (
                        <div>
                            <span
                                className={styles.customDiv}
                                onClick={() => {
                                    handlersRichTextModal.open();
                                }}
                            >
                                {translate.formatMessage(commonMessage.content)}
                            </span>
                            <Modal
                                open={openedRichTextModal}
                                footer={null}
                                onCancel={() => {
                                    handlersRichTextModal.close();
                                }}
                            >
                                <div dangerouslySetInnerHTML={htmlContent} />
                            </Modal>
                        </div>
                    );
                } else if (record.dataType == dataTypeSetting.UPLOAD) {
                    const fileName = record.option;
                    const fileUrl = valueData || record.valueData;
                    const handleDownload = async (fileUrl, fileName) => {
                        try {
                            const response = await fetch(`${AppConstants.contentRootUrl}${fileUrl}`, {
                                method: 'GET',
                                headers: {
                                    Accept: '*/*',
                                },
                            });

                            if (!response.ok) {
                                throw new Error('Failed to fetch file');
                            }

                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = fileName;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            window.URL.revokeObjectURL(url);

                            notification({
                                type: 'success',
                                title: 'Thành công',
                                message: `Tải về thành công.`,
                            });
                        } catch (error) {
                            notification({
                                type: 'error',
                                title: 'Lỗi',
                                message: 'Tải về thất bại',
                            });
                        }
                    };

                    return (
                        <div
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'normal',
                                wordBreak: 'break-word',
                            }}
                        >
                            <a
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDownload(fileUrl, fileName);
                                }}
                            >
                                {fileName ?? 'Không có file'}
                            </a>
                        </div>
                    );
                }
                return (
                    <div
                        style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                        }}
                    >
                        {valueData}
                    </div>
                );
            },
        },
        mixinFuncs.renderActionColumn(
            {
                booleanSetting: true,
                editSetting: true,
                delete: false,
            },
            { width: '120px' },
        ),
    ];

    const { execute: executeUpdate, loading: loadingUpdate } = useFetch(apiConfig.settings.update, {
        immediate: false,
    });
    const { execute: executeGetDataSetting } = useFetch(apiConfig.settings.settings, {
        immediate: false,
    });
    const {
        data: listSetting,
        loading: dataLoading,
        execute: executeLoading,
    } = useFetch(apiConfig.settings.getList, {
        immediate: false,
        params: { groupName: groupName },
        mappingData: (response) => {
            if (response.result === true) {
                return {
                    data: response.data.content.filter((item) => {
                        return true;
                    }),
                };
            }
        },
    });

    const renderColumn = () => {
        if (groupName == settingGroups.BBB) {
            return columnBBB;
        }
    };

    return (
        <div>
            {groupName === settingGroups.BBB && (
                <Card styles={{ body: { paddingInline: '0px', paddingTop: '0px' } }}>
                    <BaseTable
                        scroll={{ x: null }}
                        onChange={mixinFuncs.changePagination}
                        columns={renderColumn()}
                        dataSource={listSetting ? listSetting?.data : data}
                        loading={loading || dataLoading}
                        pagination={pagination}
                        locale={{
                            emptyText: <Empty description={translate.formatMessage(commonMessage.noData)} />,
                        }}
                    />
                </Card>
            )}
            {detail && (
                <EditGeneralModal
                    open={openedGeneralModal}
                    onCancel={() => handlersGeneralModal.close()}
                    data={detail || {}}
                    executeUpdate={executeUpdate}
                    executeLoading={executeLoading}
                    loadingUpdate={loadingUpdate}
                    width={700}
                    executeGetDataSetting={executeGetDataSetting}
                />
            )}
        </div>
    );
};

export default GeneralSettingPage;
