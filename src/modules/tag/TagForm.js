import { SaveOutlined, StopOutlined } from '@ant-design/icons';
import { BaseForm } from '@components/common/form/BaseForm';
import ColorPickerField from '@components/common/form/ColorPickerField';
import TextField from '@components/common/form/TextField';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Button, Col, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';

const TagForm = (props) => {
    const translate = useTranslate();
    const { formId, dataDetail, onSubmit, isEditing, onCancel, isSubmitting } = props;
    const [isChangedFormValues, setIsChangedFormValues] = useState(false);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
        override: (funcs) => {
            funcs.handleCallBackAfterSubmitForm = (response) => {
                if (response?.response?.data?.result === false) {
                    const errCode = response?.response?.data?.code;
                    if (errCode === 'ERROR-TAG-0001') {
                        form.setFields([
                            {
                                name: 'name',
                                errors: ['Dự án đã tồn tại'],
                            },
                        ]);
                    }
                }
            };
        },
    });
    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({
            ...values,
        });
    };
    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
    }, [dataDetail]);
    return (
        <BaseForm
            form={form}
            id={formId}
            onFinish={handleSubmit}
            onValuesChange={onValuesChange}
            style={{ width: '100%' }}
        >
            <Row gutter={16}>
                <Col span={24}>
                    <TextField
                        label={translate.formatMessage(commonMessage.tagName)}
                        name="name"
                        placeholder={translate.formatMessage(commonMessage.tagName)}
                        rules={[
                            {
                                required: true,
                                message: translate.formatMessage(commonMessage.required),
                            },
                        ]}
                    />
                </Col>
                <Col span={12}>
                    <ColorPickerField
                        label={translate.formatMessage(commonMessage.tagColor)}
                        name="color"
                        rules={[
                            {
                                required: true,
                                message: translate.formatMessage(commonMessage.required),
                            },
                        ]}
                        fieldProps={{
                            width: '100%',
                            height: 24,
                        }}
                    />
                </Col>
            </Row>
            <div className="footer-card-form">
                <Row justify="end" gutter={12}>
                    <Col>
                        <Button
                            danger
                            key="cancel"
                            onClick={(e) => {
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
                            }}
                            icon={<StopOutlined />}
                        >
                            Hủy
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            key="submit"
                            htmlType="submit"
                            type="primary"
                            loading={isSubmitting}
                            disabled={!isChangedFormValues}
                            icon={<SaveOutlined />}
                        >
                            {isEditing ? 'Cập nhật' : 'Thêm'}
                        </Button>
                    </Col>
                </Row>
            </div>
        </BaseForm>
    );
};

export default TagForm;
