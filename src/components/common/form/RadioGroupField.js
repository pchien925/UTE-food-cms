import { Form, Radio } from 'antd';
import React from 'react';
import useFormField from '@hooks/useFormField';

const RadioGroupField = ({ label, name, options, className, onChange, ...rest }) => {
    const { rules } = useFormField({ name, ...rest });

    return (
        <Form.Item
            label={label}
            name={name}
            rules={rules}
            className={className}
            style={rest.fieldStyle}
            labelCol={rest.labelCol}
        >
            <Radio.Group onChange={onChange} options={options} optionType="default" {...rest} />
        </Form.Item>
    );
};

export default RadioGroupField;
