import DefaultAvatar from '@assets/images/avatar-default.png';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import CropImageField from '@components/common/form/CropImageField';
import PasswordField from '@components/common/form/PasswordField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { AppConstants, STATUS_ACTIVE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { statusOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { showErrorMessage, showSuccessMessage } from '@services/notifyService';
import { checkEmail, checkFullName, checkPassword, checkPhone, checkUserName } from '@utils';
import { Card, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';

const UserAdminForm = (props) => {
    const translate = useTranslate();
    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing, kind } = props;
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [imageUrl, setImageUrl] = useState(null);
    const statusValue = translate.formatKeys(statusOptions, ['label']);
    
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const uploadFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setImageUrl(response.data.filePath);
                    setIsChangedFormValues(true);
                    showSuccessMessage('Upload file thành công !');
                }
            },
            onError: (error) => {
                if (error.code == 'ERROR-FILE-FORMAT-INVALID') {
                    showErrorMessage('File upload không hợp lệ !');
                }
            },
        });
    };

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values, avatarPath: imageUrl });
    };
    
    useEffect(() => {
        if (!isEditing){
            form.setFieldsValue({
                status: STATUS_ACTIVE,
            });
        }
    }, [isEditing]);

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
        setImageUrl(dataDetail.avatarPath);
    }, [dataDetail]);

    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <CropImageField
                            label={translate.formatMessage(commonMessage.avatar)}
                            name="avatarPath"
                            imageUrl={imageUrl ? `${AppConstants.avatarRootUrl}${imageUrl}` : DefaultAvatar}
                            aspect={1 / 1}
                            uploadFile={uploadFile}
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.username)}
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    validator: checkUserName,
                                },
                            ]}
                            disabled={isEditing}
                        />
                    </Col>
                    <Col span={12}>
                        <PasswordField
                            label={translate.formatMessage(commonMessage.password)}
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    validator: checkPassword,
                                },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.fullName)}
                            name="fullName"
                            rules={[
                                {
                                    required: true,
                                    validator: checkFullName,
                                },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.phone)}
                            name="phone"
                            rules={[
                                {
                                    required: true,  
                                    validator: checkPhone,
                                },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.email)}
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    validator: checkEmail,
                                },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            name={['group', 'id']}
                            label="Nhóm quyền"
                            allowClear={false}
                            apiConfig={apiConfig.groupPermission.autoComplete}
                            initialSearchParams={{ kind }}
                            optionsParams={{ kind }}
                            mappingOptions={(item) => {
                                return { label: item.name, value: item.id };
                            }
                        }
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            name='status'
                            label="Trạng thái"
                            allowClear={false}
                            disabled={!isEditing}
                            options={statusValue}
                            required
                        />
                    </Col>
                </Row>
                <div className="footer-card-form">
                    {actions}
                </div>
            </Card>
        </BaseForm>
    );
};

export default UserAdminForm;
