import AutoCompleteField from '@components/common/form/AutoCompleteField';
import { BaseForm } from '@components/common/form/BaseForm';
import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { STATUS_ACTIVE } from '@constants';
import apiConfig from '@constants/apiConfig';
import { statusOptions } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { checkFullName, checkPhone } from '@utils';
import { Card, Checkbox, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';

const AddressForm = (props) => {
    const translate = useTranslate();
    const { formId, actions, dataDetail, onSubmit, setIsChangedFormValues, isEditing } = props;
    const statusValue = translate.formatKeys(statusOptions, ['label']);

    const [provinceId, setProvinceId] = useState(null);
    const [districtId, setDistrictId] = useState(null);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values });
    };

    useEffect(() => {
        if (!isEditing) {
            form.setFieldsValue({
                status: STATUS_ACTIVE,
            });
        }
    }, [isEditing]);

    useEffect(() => {
        if (dataDetail.province?.id) {
            setProvinceId(dataDetail.province.id);
        }
        if (dataDetail.district?.id) {
            setDistrictId(dataDetail.district.id);
        }

        form.setFieldsValue({
            ...dataDetail,
        });
    }, [dataDetail, form]);

    return (
        <BaseForm id={formId} onFinish={handleSubmit} form={form} onValuesChange={onValuesChange}>
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label="Tên người nhận"
                            name="recipientName"
                            rules={[
                                {
                                    required: true,
                                    validator: checkFullName,
                                },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={translate.formatMessage(commonMessage.phone)}
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    validator: checkPhone,
                                },
                            ]}
                        />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            label={translate.formatMessage(commonMessage.province)}
                            name={['province', 'id']}
                            apiConfig={apiConfig.nation?.autoComplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.name })}
                            rules={[{ required: true }]}
                            initialSearchParams={{ kind: 3 }}
                            searchParams={(text) => ({
                                name: text,
                                kind: 3,
                            })}
                            onChange={(value) => {
                                setProvinceId(value);
                                form.resetFields([
                                    ['district', 'id'],
                                    ['ward', 'id'],
                                ]);
                                setDistrictId(null);
                            }}
                        />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            key={provinceId}
                            label={translate.formatMessage(commonMessage.district)}
                            name={['district', 'id']}
                            apiConfig={apiConfig.nation?.autoComplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.name })}
                            rules={[{ required: true }]}
                            disabled={!provinceId}
                            initialSearchParams={{ kind: 2, parentId: provinceId }}
                            searchParams={(text) => ({
                                name: text,
                                kind: 2,
                            })}
                            onChange={(value) => {
                                setDistrictId(value);
                                form.resetFields([['ward', 'id']]);
                            }}
                        />
                    </Col>
                    <Col span={12}>
                        <AutoCompleteField
                            key={districtId}
                            label={translate.formatMessage(commonMessage.ward)}
                            name={['ward', 'id']}
                            apiConfig={apiConfig.nation?.autoComplete}
                            mappingOptions={(item) => ({ value: item.id, label: item.name })}
                            rules={[{ required: true }]}
                            disabled={!districtId}
                            initialSearchParams={{ kind: 1, parentId: districtId }}
                            searchParams={(text) => ({
                                name: text,
                                kind: 1,
                            })}
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label="Địa chỉ chi tiết (Số nhà, đường,...)"
                            name="addressLine"
                            rules={[{ required: true }]}
                            placeholder="VD: 43/10d, đường số 8..."
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            name="status"
                            label="Trạng thái"
                            allowClear={false}
                            disabled={!isEditing}
                            options={statusValue}
                            rules={[{ required: true }]}
                        />
                    </Col>
                    <Col span={12} style={{ display: 'flex', alignItems: 'center', marginTop: 30 }}>
                        <Form.Item name="isDefault" valuePropName="checked">
                            <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
                        </Form.Item>
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </BaseForm>
    );
};

export default AddressForm;
