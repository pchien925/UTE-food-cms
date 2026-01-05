import { BaseForm } from '@components/common/form/BaseForm';
import NumericField from '@components/common/form/MoneyField';
import TextField from '@components/common/form/TextField';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { formatNumber } from '@utils';
import { Card, Col, Row } from 'antd';
import React, { useEffect } from 'react';

const ComboGroupForm = (props) => {
    const translate = useTranslate();
    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing } = props;

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
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField label={translate.formatMessage(commonMessage.comboGroup)} name="name" required />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <NumericField
                            label="Chọn tối thiểu"
                            name="minSelect"
                            min={0}
                            max={1}
                            required
                            formatter={(value) => formatNumber(value)}
                        />
                    </Col>
                    <Col span={12}>
                        <NumericField
                            label="Chọn tối đa"
                            name="maxSelect"
                            min={0}
                            max={2}
                            required
                            formatter={(value) => formatNumber(value)}
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

export default ComboGroupForm;
