import TextField from '@components/common/form/TextField';
import { Card, Col, Form, Modal, Row, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseForm } from '@components/common/form/BaseForm';
import useNotification from '@hooks/useNotification';
import { defineMessages } from 'react-intl';
import { useIntl } from 'react-intl';
import useTranslate from '@hooks/useTranslate';
import { STATUS_ACTIVE } from '@constants';
import SelectField from '@components/common/form/SelectField';
import { generateUniqueId } from '@utils';

const messages = defineMessages({
    objectName: 'Lĩnh vực',
    update: 'Cập nhật',
    create: 'Thêm mới',
    updateSuccess: 'Cập nhật {objectName} thành công',
    createSuccess: 'Thêm mới {objectName} thành công',
});

const selectOptionsLevel2 = [
    { value: 'salary', label: 'Salary' },
    { value: 'skill', label: 'Skill' },
    { value: 'bonus', label: 'Bonus' },
];

const selectOptionsLevel3 = {
    salary: ['title', 'description'],
    skill: ['title', 'description'],
    bonus: ['title'],
};

const CareerModal = ({
    open,
    onCancel,
    title,
    detail,
    reload,
    executeUpdate,
    executeLoading,
    careerData,
    parentData,
    isEditing,
    breadcrumb,
    setBreadcrumb,
    currentData,
    ...props
}) => {
    const [form] = Form.useForm();
    const [isChangeValues, setIsChangeValues] = useState(false);
    const notification = useNotification();
    const intl = useIntl();
    const translate = useTranslate();
    const findAndAddToParent = (array, breadcrumb, newElement) => {
        const targetKey = breadcrumb[breadcrumb.length - 1]; // Lấy keyName của phần tử cuối cùng trong breadcrumb
        const recursiveSearch = (items) => {
            if (breadcrumb?.length > 1) {
                for (const item of items) {
                    if (item.keyName === targetKey.keyName && item.id === targetKey.id) {
                        // Nếu tìm thấy phần tử cha, thêm phần tử mới vào value của nó
                        if (Array.isArray(item.value)) {
                            item.value.push({ ...newElement, id: generateUniqueId(), value: newElement.value || [] });
                        } else {
                            item.value = [newElement];
                        }
                        return true;
                    }

                    if (Array.isArray(item.value)) {
                        const found = recursiveSearch(item.value);
                        if (found) return true;
                    }
                }
            } else {
                items.push({ ...newElement, id: generateUniqueId(), value: [] });
                return true;
            }
            return false;
        };

        recursiveSearch(array);
    };

    const findAndUpdate = (array, breadcrumb, element) => {
        const targetKey = breadcrumb[breadcrumb.length - 1];
        const recursiveSearch = (items) => {
            if (breadcrumb?.length > 1) {
                for (const item of items) {
                    if (item.keyName === targetKey.keyName && item.id === targetKey.id) {
                        if (Array.isArray(item.value)) {
                            const index = item.value.findIndex((obj) => obj.id === detail?.id);
                            const itemCurrent = item.value.find((obj) => obj.id === detail?.id);
                            item.value.splice(index, 1, { ...element, id: detail?.id, value: element?.value || [] });
                        }
                        return true;
                    }

                    if (Array.isArray(item.value)) {
                        const found = recursiveSearch(item.value);
                        if (found) return true;
                    }
                }
            } else {
                const index = items.findIndex((obj) => obj.id === detail?.id);
                const itemCurrent = items.find((obj) => obj.id === detail?.id);
                items.splice(index, 1, { ...element, id: itemCurrent?.id, value: itemCurrent?.value || [] });
                return true;
            }
            return false;
        };

        recursiveSearch(array);
    };
    const updateSetting = (values) => {
        var updateData = careerData;
        if (isEditing) {
            findAndUpdate(updateData, breadcrumb, values);
        } else {
            // careerData.push(values);
            findAndAddToParent(updateData, breadcrumb, values);
        }
        const currentBreadcrumb = [...breadcrumb];

        executeUpdate({
            data: {
                id: parentData?.id,
                status: STATUS_ACTIVE,
                valueData: JSON.stringify(updateData),
                // valueData: JSON.stringify(exportDefault),
            },
            onCompleted: async (response) => {
                if (response.result === true) {
                    onCancel();
                    notification({
                        message: intl.formatMessage(isEditing ? messages.updateSuccess : messages.createSuccess, {
                            objectName: translate.formatMessage(messages.objectName),
                        }),
                    });
                    executeLoading();
                    setIsChangeValues(false);
                    //reload();
                    form.resetFields();
                    let newData = updateData;
                    breadcrumb.forEach((crumb) => {
                        const found = newData.find((item) => item.keyName === crumb.keyName && item.id === crumb.id);
                        if (found && Array.isArray(found.value)) {
                            newData = found.value;
                        }
                    });

                    //setCurrentData(newData);
                    //setBreadcrumb([{ id: '1', keyName: 'Danh sách lĩnh vực' }]);
                    //setBreadcrumb(currentBreadcrumb);
                }
            },
            onError: (err) => {
                //setBreadcrumb([{ id: '1', keyName: 'Danh sách lĩnh vực' }]);
                setBreadcrumb(currentBreadcrumb);
            },
        });
    };

    const handleFormChange = () => {
        setIsChangeValues(true);
    };

    useEffect(() => {
        if (isEditing) {
            form.setFieldsValue({
                ...detail,
            });
        } else {
            const nullData = Object.keys(detail).reduce((acc, key) => {
                acc[key] = null;
                return acc;
            }, {});
            nullData.action = 1;
            form.setFieldsValue({ ...nullData });
        }
    }, [detail, isEditing]);
    const handleOnCancel = () => {
        if (!isEditing) {
            const nullData = Object.keys(detail).reduce((acc, key) => {
                acc[key] = null;
                return acc;
            }, {});
            form.setFieldsValue({ ...nullData });
        }
        onCancel();
    };

    const existingFields = currentData.map((item) => item.keyName);
    const availableOptions = selectOptionsLevel2.filter((option) => !existingFields.includes(option.value));

    return (
        <Modal
            centered
            open={open}
            onCancel={handleOnCancel}
            footer={null}
            title={
                (isEditing ? intl.formatMessage(messages.update) : intl.formatMessage(messages.create)) +
                ' ' +
                intl.formatMessage(messages.objectName)
            }
            {...props}
        >
            <Card className="card-form" bordered={false}>
                <BaseForm form={form} onFinish={updateSetting} size="100%" onValuesChange={handleFormChange}>
                    <Row gutter={16}>
                        <Col span={24}>
                            {breadcrumb?.length === 2 ? (
                                <SelectField
                                    name="keyName"
                                    label={<FormattedMessage defaultMessage="Lĩnh vực" />}
                                    required
                                    allowClear={false}
                                    options={availableOptions.map((option) => ({
                                        label: option.label,
                                        value: option.value,
                                    }))}
                                />
                            ) : breadcrumb?.length === 3 ? (
                                (() => {
                                    // Lấy giá trị cuối cùng của breadcrumb
                                    const lastBreadcrumb = breadcrumb[breadcrumb.length - 1]?.keyName;
                                    const fields = selectOptionsLevel3[lastBreadcrumb] || [];
                                    // Loại bỏ các trường đã chọn
                                    const filteredFields = fields.filter((field) => !existingFields.includes(field));

                                    return (
                                        <SelectField
                                            name="keyName"
                                            label={<FormattedMessage defaultMessage="Lĩnh vực" />}
                                            required
                                            allowClear={false}
                                            options={filteredFields.map((field) => ({
                                                label: field.charAt(0).toUpperCase() + field.slice(1),
                                                value: field,
                                            }))}
                                        />
                                    );
                                })()
                            ) : (
                                <TextField
                                    label={<FormattedMessage defaultMessage="Lĩnh vực" />}
                                    name="keyName"
                                    required
                                />
                            )}
                        </Col>
                    </Row>
                    {breadcrumb?.length == 3 && (
                        <Row gutter={16}>
                            <Col span={24}>
                                <TextField
                                    required
                                    label={<FormattedMessage defaultMessage="Nôi dung" />}
                                    name="value"
                                    type="textarea"
                                />
                            </Col>
                        </Row>
                    )}
                    <div style={{ float: 'right' }}>
                        <Button key="submit" type="primary" htmlType="submit" disabled={!isChangeValues}>
                            {isEditing ? intl.formatMessage(messages.update) : intl.formatMessage(messages.create)}
                        </Button>
                    </div>
                </BaseForm>
            </Card>
        </Modal>
    );
};

export default CareerModal;
