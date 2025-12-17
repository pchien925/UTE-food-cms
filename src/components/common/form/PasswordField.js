import React from 'react';
import { Form, Input } from 'antd';
import useFormField from '@hooks/useFormField';

const PasswordField = (props) => {
  const {
    label,
    name,
    className,
    disabled,
    onBlur,
    validateStatus,
    help,
    style,
    onChange,
    readOnly,
    initialValue,
    defaultValue,
    prefix,
    suffix,
    addonAfter,
    size,
    fieldProps,
  } = props;

  const getMaxLengthMsg = () => {
    const { maxLength, maxLengthMsg } = props;
    return maxLengthMsg || `Số ký tự không thể nhiều hơn ${maxLength}`;
  };

  const getMinLengthMsg = () => {
    const { minLength, minLengthMsg } = props;
    return minLengthMsg || `Số ký tự không thể ít hơn ${minLength}`;
  };

  const getPasswordRules = () => {
    const { maxLength, minLength } = props;
    const rules = [];
    if (maxLength) {
      rules.push({ max: maxLength, message: getMaxLengthMsg() });
    }
    if (minLength) {
      rules.push({ min: minLength, message: getMinLengthMsg() });
    }
    return rules;
  };

  const { rules, placeholder } = useFormField(props);

  return (
    <Form.Item
      className={className}
      label={label}
      name={name}
      validateStatus={validateStatus}
      initialValue={initialValue}
      help={help}
      rules={[...rules, ...getPasswordRules()]} // nhớ trải rules
    >
      <Input.Password
        onChange={onChange}
        style={style}
        size={size}
        placeholder={placeholder}
        disabled={disabled}
        onBlur={onBlur}
        readOnly={readOnly}
        defaultValue={defaultValue}
        prefix={prefix}
        suffix={suffix}
        addonAfter={addonAfter}
        {...fieldProps}
      />
    </Form.Item>
  );
};

export default PasswordField;
