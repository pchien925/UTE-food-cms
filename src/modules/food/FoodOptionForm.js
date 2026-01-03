import { SaveOutlined, StopOutlined } from '@ant-design/icons';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import NumericField from '@components/common/form/NumericField';
import SelectField from '@components/common/form/SelectField';
import apiConfig from '@constants/apiConfig';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { showErrorMessage, showSuccessMessage } from '@services/notifyService';
import { formatNumber } from '@utils';
import { Button, Col, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';

const FoodOptionForm = (props) => {
    const translate = useTranslate();
    const { formId, dataDetail, foodId, onSubmit, open, onCancel, onDone, isEditing, nextOrdering } = props;

    const [isChangedFormValues, setIsChangedFormValues] = useState(false);

    const { execute: executeSave, loading } = useFetch(
        isEditing ? apiConfig.foodOption.update : apiConfig.foodOption.create,
    );

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleFinish = (values) => {
        const selectedOptionId = values.option?.id;

        if (!selectedOptionId) {
            showErrorMessage('Vui lòng chọn tên tùy chọn!');
            return;
        }

        const orderingValue = isEditing ? dataDetail?.ordering : nextOrdering;

        const payload = {
            foodId,
            optionId: selectedOptionId,
            ordering: orderingValue,
            requirementType: parseInt(values.requirementType),
            maxSelect: values.maxSelect,
        };

        if (isEditing) {
            payload.id = dataDetail.id;
        }

        executeSave({
            data: payload,
            onCompleted: (response) => {
                if (response.result === true) {
                    showSuccessMessage(isEditing ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
                    onDone();
                } else {
                    showErrorMessage(response.message || 'Lỗi khi lưu dữ liệu.');
                }
            },
            onError: (err) => {
                showErrorMessage('Lỗi hệ thống: ' + err.message);
            },
        });
    };

    const handleCancel = (e) => {
        e.stopPropagation();
        if (isChangedFormValues) {
            Modal.confirm({
                title: 'Xác nhận hủy',
                content: 'Bạn có chắc chắn muốn hủy không?',
                cancelButtonProps: { danger: true },
                onOk: () => {
                    setIsChangedFormValues(false);
                    onCancel();
                },
                okText: 'Có',
                cancelText: 'Không',
            });
        } else {
            onCancel();
        }
    };
    useEffect(() => {
        form.resetFields();
        setIsChangedFormValues(false);
        if (isEditing && dataDetail) {
            form.setFieldsValue({
                option: {
                    id: dataDetail.option?.id,
                    name: dataDetail.option?.name,
                },
                requirementType: String(dataDetail.requirementType),
                maxSelect: dataDetail.maxSelect,
            });
        } else {
            form.setFieldsValue({
                requirementType: '1',
                maxSelect: 1,
            });
        }
    }, [open, isEditing, dataDetail]);

    return (
        <Modal
            title={isEditing ? 'Chỉnh sửa lựa chọn món' : 'Thêm lựa chọn món'}
            open={open}
            onCancel={onCancel}
            width={600}
            style={{ minHeight: 800 }}
            centered
            footer={null}
            maskClosable={false}
            destroyOnHidden
        >
            <BaseForm
                id={formId}
                onFinish={handleFinish}
                form={form}
                onValuesChange={onValuesChange}
                style={{ width: '100%', marginTop: 24 }}
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <AutoCompleteField
                            label="Tên tùy chọn (Option)"
                            name={['option', 'id']}
                            apiConfig={apiConfig.option.autoComplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.name })}
                            searchParams={(text) => ({ name: text })}
                            required
                            disabled={isEditing}
                        />
                    </Col>

                    <Col span={12}>
                        <SelectField
                            label="Loại yêu cầu"
                            name="requirementType"
                            options={[
                                { value: '1', label: 'Bắt buộc' },
                                { value: '0', label: 'Tùy chọn' },
                            ]}
                            required
                        />
                    </Col>

                    <Col span={12}>
                        <NumericField
                            label="Chọn tối đa"
                            name="maxSelect"
                            min={1}
                            required
                            formatter={(value) => formatNumber(value)}
                        />
                    </Col>
                </Row>

                <div className="footer-card-form" style={{ textAlign: 'right' }}>
                    <Button
                        danger
                        key="cancel"
                        onClick={handleCancel}
                        style={{ marginRight: 8 }}
                        icon={<StopOutlined />}
                    >
                        {translate.formatMessage(commonMessage.cancel)}
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        disabled={!isChangedFormValues}
                        icon={<SaveOutlined />}
                    >
                        {isEditing
                            ? translate.formatMessage(commonMessage.update)
                            : translate.formatMessage(commonMessage.create)}
                    </Button>
                </div>
            </BaseForm>
        </Modal>
    );
};

export default FoodOptionForm;
