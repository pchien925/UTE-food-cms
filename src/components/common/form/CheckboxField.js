import React from 'react';
import { Form, Checkbox } from 'antd';
import useFormField from '@hooks/useFormField';

function CheckboxField({
    label,
    name,
    required,
    optionLabel,
    onChange,
    disabled,
    formItemProps,
    fieldProps,
    ...props
}) {
    const { rules } = useFormField(props);

    return (
        <Form.Item {...formItemProps} required={required} name={name} rules={rules} valuePropName="checked">
            <Checkbox {...fieldProps} onChange={onChange} disabled={disabled}>
                {optionLabel || label}
            </Checkbox>
        </Form.Item>
    );
}

export default CheckboxField;
