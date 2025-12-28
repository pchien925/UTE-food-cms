import { SaveOutlined, StopOutlined } from '@ant-design/icons';
import { BaseForm } from '@components/common/form/BaseForm';
import TextField from '@components/common/form/TextField';
import { PROVINCE_KIND } from '@constants';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Button, Col, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';

const NationForm = (props) => {
    const translate = useTranslate();
    const {  formId, dataDetail, onSubmit, isEditing, onCancel, isSubmitting, objectName, kind } = props;
    const [isChangedFormValues, setIsChangedFormValues] = useState(false);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
    }, [dataDetail]);

    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange} style={{ width: '100%', marginTop: 24 }}>
            <Row gutter={16}>
                <Col span={24}>
                    <TextField
                        label={objectName}
                        name="name"
                        required
                    />
                </Col>
            </Row>
            <Row gutter={16}>
                {kind === PROVINCE_KIND && (
                    <Col span={24}>
                        <TextField
                            label={translate.formatMessage(commonMessage.postCode)}
                            name="postalCode"
                            required
                            type="number"
                        />
                    </Col>
                )}
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

export default NationForm;
