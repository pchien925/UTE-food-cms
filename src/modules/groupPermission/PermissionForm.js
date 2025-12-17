import SelectField from '@components/common/form/SelectField';
import TextField from '@components/common/form/TextField';
import { formSize, kindOption } from '@constants/masterData';
import useBasicForm from '@hooks/useBasicForm';
import useQueryParams from '@hooks/useQueryParams';
import useTranslate from '@hooks/useTranslate';
import { Card, Checkbox, Col, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

const PermissionForm = (props) => {
    const {
        formId,
        actions,
        dataDetail,
        onSubmit,
        setIsChangedFormValues,
        isEditing,
        permissions,
        size = 'small',
    } = props;
    const [group, setGroup] = useState([]);
    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const translate = useTranslate();
    const kindValues = translate.formatKeys(kindOption, ['label']);
    const { params } = useQueryParams();

    const handleSubmit = (values) => {
        return mixinFuncs.handleSubmit({ ...values });
    };
    const getGroupPermission = () => {
        const { permissions } = props;
        let groups;
        if (permissions && permissions.length > 0) {
            groups = permissions.reduce((r, a) => {
                r[a.nameGroup] = [...(r[a.nameGroup] || []), a];
                return r;
            }, {});
        }
        setGroup(groups);
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
            kind: !isEditing ? +params.get('kind') : dataDetail?.kind,
        });
    }, [dataDetail]);

    useEffect(() => {
        if (permissions.length !== 0) getGroupPermission();
    }, [permissions]);

    return (
        <Form
            style={{ width: formSize[size] ?? size }}
            id={formId}
            onFinish={handleSubmit}
            form={form}
            layout="vertical"
            onValuesChange={onValuesChange}
        >
            <Card className="card-form" bordered={false}>
                <Row gutter={16}>
                    <Col span={12}>
                        <TextField
                            label={<FormattedMessage defaultMessage="Tên" />}
                            required
                            name="name"
                            placeholder="Tên"
                        />
                    </Col>
                    <Col span={12}>
                        <SelectField
                            required
                            label={<FormattedMessage defaultMessage="Loại" />}
                            name="kind"
                            options={kindValues}
                            placeholder="Loại"
                            disabled
                        />
                    </Col>
                    <Col span={12}>
                        <TextField
                            label={
                                <FormattedMessage
                                    defaultMessage="Mô tả"
                                    id="source.src.modules.groupPermission.PermissionForm.78422312"
                                />
                            }
                            placeholder="Mô tả"
                            type="textarea"
                            name="description"
                        />
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="permissions"
                            label={
                                <FormattedMessage
                                    defaultMessage="Nhóm quyền"
                                    id="source.src.modules.groupPermission.PermissionForm.341541490"
                                />
                            }
                            // rules={[{ required: true, message: 'permission' }]}
                        >
                            <Checkbox.Group style={{ width: '100%', display: 'block' }} name="permissions">
                                {group
                                    ? Object.keys(group).map((groupName) => (
                                          <Card
                                              key={groupName}
                                              size="small"
                                              title={groupName}
                                              style={{ width: '100%', marginBottom: '4px' }}
                                          >
                                              <Row>
                                                  {group[groupName].map((permission) => (
                                                      <Col span={8} key={permission.id}>
                                                          <Checkbox value={permission.id}>{permission.name}</Checkbox>
                                                      </Col>
                                                  ))}
                                              </Row>
                                          </Card>
                                      ))
                                    : null}
                            </Checkbox.Group>
                        </Form.Item>
                    </Col>
                </Row>
                <div className="footer-card-form">{actions}</div>
            </Card>
        </Form>
    );
};

export default PermissionForm;
