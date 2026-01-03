import DefaultAvatar from '@assets/images/avatar-default.png';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import CropImageField from '@components/common/form/CropImageField';
import TextField from '@components/common/form/TextField';
import NumericField from '@components/common/form/MoneyField';
import { AppConstants, STATUS_ACTIVE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { showErrorMessage, showSuccessMessage } from '@services/notifyService';
import { checkPrice, formatNumber } from '@utils';
import { Card, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';

const FoodForm = (props) => {
    const translate = useTranslate();
    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing } = props;
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);
    const [imageUrl, setImageUrl] = useState(null);

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
        return mixinFuncs.handleSubmit({ ...values, imageUrl: imageUrl });
    };

    useEffect(() => {
        if (!isEditing) {
            form.setFieldsValue({
                status: STATUS_ACTIVE,
                ordering: 0,
            });
        }
    }, [isEditing]);

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
        setImageUrl(dataDetail.imageUrl);
    }, [dataDetail]);

    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <CropImageField
                            label={translate.formatMessage(commonMessage.food)}
                            name="imageUrl"
                            imageUrl={imageUrl ? `${AppConstants.foodRootUrl}${imageUrl}` : DefaultAvatar}
                            aspect={1 / 1}
                            uploadFile={uploadFile}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.foodName)}
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên món ăn' }]}
                        />
                    </Col>

                    <Col span={12}>
                        <NumericField
                            label={translate.formatMessage(commonMessage.basePrice)}
                            name="basePrice"
                            min={0}
                            rules={[{ required: true, message: 'Vui lòng nhập giá bán' }, { validator: checkPrice }]}
                            formatter={(value) => formatNumber(value)}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <NumericField
                            label={translate.formatMessage(commonMessage.cookingTime)}
                            name="cookingTime"
                            type="number"
                            min={1}
                            required
                        />
                    </Col>

                    <Col span={12}>
                        <AutoCompleteField
                            label="Danh mục"
                            name={['category', 'id']}
                            required
                            allowClear={false}
                            apiConfig={apiConfig.category.autoComplete}
                            mappingOptions={(item) => ({ label: item.name, value: item.id })}
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <TextField
                            label={translate.formatMessage(commonMessage.description)}
                            name="description"
                            type="textarea"
                            rows={4}
                        />
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default FoodForm;
