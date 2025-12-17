import { BaseForm } from '@components/common/form/BaseForm';
import NumericField from '@components/common/form/NumericField';
import RichTextField from '@components/common/form/RichTextField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import UploadComponent from '@components/common/form/UploadFie/UploadComponent';
import { AppConstants, formSize } from '@constants';
import apiConfig from '@constants/apiConfig';
import { dataTypeSetting, FILE_KIND, settingGroups } from '@constants/masterData';
import { timeZoneOptions } from '@constants/timeZone';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useNotification from '@hooks/useNotification';
import useTranslate from '@hooks/useTranslate';
import routes from '@routes';
import { actions } from '@store/actions/app';
import { Button, Col, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

const messages = defineMessages({
    objectName: 'cài đặt',
    update: 'Cập nhật',
    updateSuccess: 'Cập nhật {objectName} thành công',
});
const EditGeneralModal = ({
    open,
    onCancel,
    onOk,
    title,
    data,
    executeUpdate,
    executeLoading,
    executeGetDataSetting,
    executeLoadingRevenue,
    isEditingRevenue,
    loadingUpdate,
    ...props
}) => {
    const { form, mixinFuncs, onValuesChange } = useBasicForm({});
    const [isChanged, setChange] = useState(false);
    const notification = useNotification();
    const intl = useIntl();
    const translate = useTranslate();
    const dispatch = useDispatch();
    const { execute: executeUpload } = useFetch(apiConfig.file.upload);
    const [fileUrl, setFileUrl] = useState(data?.valueData);
    const [fileName, setFileName] = useState(data?.option);
    const updateSetting = async (values) => {
        await executeUpdate({
            data: {
                id: data.id,
                isSystem: data.isSystem,
                status: data.status,
                valueData:
                    data.dataType === dataTypeSetting.UPLOAD
                        ? fileUrl
                        : data.dataType === dataTypeSetting.SELECT
                          ? values?.valueData.join(',')
                          : values?.valueData,
                groupName: data.groupName,
                keyName: data.keyName,
                dataType: data.dataType,
                option: data.dataType === dataTypeSetting.UPLOAD ? fileName : data.option,
                description: data.description,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onCancel();
                    notification({
                        message: intl.formatMessage(messages.updateSuccess, {
                            objectName: translate.formatMessage(messages.objectName),
                        }),
                    });
                    executeLoading();
                    executeGetDataSetting({
                        onCompleted: (response) => {
                            const dataSetting = response?.data;
                            dispatch(actions.settingSystem(dataSetting));
                        },
                    });
                    setChange(false);
                }
            },
            onError: (err) => {},
        });
    };

    const uploadFile = (file, onSuccess, onError) => {
        executeUpload({
            data: {
                type: 'DOCUMENT',
                file: file,
                kind: FILE_KIND.FILE_KIND_DEFAULT,
            },
            onCompleted: (response) => {
                if (response?.result === true) {
                    onSuccess();
                    notification({
                        type: 'success',
                        title: 'Thành công',
                        message: `Tải lên file thành công`,
                    });
                    setFileUrl(response.data.fileUrl);
                    setFileName(response.data.originalFileName);
                    handleInputChange();
                }
            },
            onError: (error) => {
                onError({ event: error });
                notification({
                    type: 'error',
                    title: 'Lỗi',
                    message: `Lỗi khi tải lên file`,
                });
            },
        });
    };

    const handleDownload = async (fileUrl, fileName) => {
        try {
            const response = await fetch(fileUrl, {
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

    const handleInputChange = () => {
        setChange(true);
    };

    useEffect(() => {
        // form.setFields(data);
        form.setFieldsValue({
            ...data,
            valueData: data.dataType === dataTypeSetting.SELECT ? data.valueData?.split(',') : data.valueData,
        });
    }, [data]);

    const renderField = () => {
        const dataType = data.dataType;
        if (dataType == dataTypeSetting.INT || dataType == dataTypeSetting.DOUBLE) {
            return (
                <Col span={24}>
                    <NumericField
                        label={<FormattedMessage defaultMessage="Nội dung" />}
                        name="valueData"
                        min={0}
                        max={localStorage.getItem(routes.settingsPage.keyActiveTab) == settingGroups.REVENUE && 100}
                        formatter={(value) =>
                            localStorage.getItem(routes.settingsPage.keyActiveTab) == settingGroups.REVENUE
                                ? `${value}%`
                                : `${value}`
                        }
                        parser={(value) => value.replace('%', '')}
                        onChange={handleInputChange}
                    />
                </Col>
            );
        } else if (dataType == dataTypeSetting.RICHTEXT) {
            return (
                <Col span={24}>
                    <RichTextField
                        style={{ height: 500, marginBottom: 70, width: formSize.editor }}
                        label={<FormattedMessage defaultMessage="Nội dung" />}
                        name="valueData"
                        baseURL={AppConstants.contentRootUrl}
                        form={form}
                        setIsChangedFormValues={handleInputChange}
                    />
                </Col>
            );
        } else if (data?.keyName == 'timezone') {
            return (
                <Col span={24}>
                    <SelectField
                        label={<FormattedMessage defaultMessage="Nội dung" />}
                        name="valueData"
                        options={timeZoneOptions}
                        required
                        form={form}
                        onChange={(value) => {
                            handleInputChange();
                        }}
                    />
                </Col>
            );
        } else if (dataType == dataTypeSetting.SELECT) {
            const option = typeof data?.option !== 'string' ? data?.option : JSON.parse(data?.option);
            return (
                <Col span={24}>
                    <SelectField
                        label={<FormattedMessage defaultMessage="Nội dung" />}
                        name="valueData"
                        options={option}
                        required
                        form={form}
                        mode={'multiple'}
                        onChange={(value) => {
                            handleInputChange();
                        }}
                    />
                </Col>
            );
        } else if (dataType === dataTypeSetting.UPLOAD) {
            return (
                <div style={{ width: '100%' }}>
                    <UploadComponent uploadFile={uploadFile} />
                    {fileUrl && (
                        <a
                            style={{
                                display: 'block',
                                textAlign: 'center',
                                marginTop: 10,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                handleDownload(fileUrl, fileName);
                            }}
                            title={fileName}
                        >
                            {fileName}
                        </a>
                    )}
                </div>
            );
        } else {
            return (
                <Col span={24}>
                    <TextField
                        label={<FormattedMessage defaultMessage="Nội dung" />}
                        name="valueData"
                        onChange={handleInputChange}
                    />
                </Col>
            );
        }
    };
    const onCancelModal = () => {
        onCancel();
        setChange(false);
    };

    return (
        <Modal
            maskClosable={false}
            centered
            open={open}
            onCancel={onCancelModal}
            footer={null}
            title={data?.keyName}
            {...props}
        >
            <BaseForm form={form} onFinish={updateSetting} size="100%">
                <Row gutter={16}>{renderField()}</Row>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        key="submit"
                        style={{ marginTop: data.dataType === dataTypeSetting.UPLOAD ? 6 : 0 }}
                        type="primary"
                        htmlType="submit"
                        disabled={!isChanged || loadingUpdate}
                    >
                        {intl.formatMessage(messages.update)}
                    </Button>
                </div>
            </BaseForm>
        </Modal>
    );
};

export default EditGeneralModal;
