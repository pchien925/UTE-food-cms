import { BaseForm } from '@components/common/form/BaseForm';
import NumericField from '@components/common/form/MoneyField';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { STATUS_ACTIVE } from '@constants';
import { foodFormOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { Card, Col, Row } from 'antd';
import React, { useEffect } from 'react';

const OptionValueForm = (props) => {
    const translate = useTranslate();
    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing } = props;
    const statusValue = translate.formatKeys(foodFormOptions, ['label']);
    
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values });
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
    }, [dataDetail]);

    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.optionValueName)}
                            name="name"
                            required
                        />
                    </Col>
                    <Col span={12}>
                        <NumericField
                            label={translate.formatMessage(commonMessage.extraPrice)}
                            name="extraPrice"
                            min={0}
                            addonAfter="₫"
                            defaultValue={0}
                            required
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
                    <Col span={24}>
                        <TextField
                            label={translate.formatMessage(commonMessage.optionDescription)}
                            name="description"
                            type="textarea"
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

export default OptionValueForm;
