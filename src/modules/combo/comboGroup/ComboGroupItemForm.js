import { SaveOutlined, StopOutlined } from '@ant-design/icons';
import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import NumericField from '@components/common/form/MoneyField';
import apiConfig from '@constants/apiConfig';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { showErrorMessage, showSuccessMessage } from '@services/notifyService';
import { formatNumber } from '@utils';
import { Button, Col, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';

const ComboGroupItemForm = (props) => {
    const translate = useTranslate();
    const { formId, dataDetail, comboGroupId, onSubmit, open, onCancel, onDone, isEditing, nextOrdering } = props;

    const [isChangedFormValues, setIsChangedFormValues] = useState(false);

    const { execute: executeSave, loading } = useFetch(
        isEditing ? apiConfig.comboGroupItem.update : apiConfig.comboGroupItem.create,
    );

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleFinish = (values) => {
        const payload = {
            comboGroupId: String(comboGroupId),
            foodId: String(values.food?.id),
            ordering: isEditing ? dataDetail?.ordering : nextOrdering,
            extraPrice: values.extraPrice,
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
                food: {
                    id: dataDetail.food?.id,
                    name: dataDetail.food?.name,
                },
                extraPrice: dataDetail.extraPrice,
            });
        } else {
            form.setFieldsValue({
                extraPrice: 0,
            });
        }
    }, [open, isEditing, dataDetail]);

    return (
        <Modal
            title={isEditing ? 'Chỉnh sửa món' : 'Thêm món'}
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
                            label="Tên món ăn"
                            name={['food', 'id']}
                            apiConfig={apiConfig.food.autoComplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.name })}
                            searchParams={(text) => ({ name: text })}
                            required
                            disabled={isEditing}
                        />
                    </Col>

                    <Col span={24}>
                        <NumericField
                            label="Giá cộng thêm"
                            name="extraPrice"
                            min={0}
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

export default ComboGroupItemForm;
