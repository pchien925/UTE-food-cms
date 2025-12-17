import { Button, Card, Col, Form, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { BaseForm } from '../BaseForm';
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import { PermissionKind } from '@constants';
import { showErrorMessage, showSuccessMessage } from '@services/notifyService';
import SelectField from '../SelectField';
import { kindGroupAccountOptions } from '@constants/masterData';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';

const ModalPermissionCreate = (props) => {
    const { open, close, title, name, label, apiGetList, getList } = props;
    const [form] = Form.useForm();

    const queryParameters = new URLSearchParams(window.location.search);
    const translate = useTranslate();
    const accountGroupId = queryParameters.get('accountGroupId');
    const subjectId = queryParameters.get('subjectId');
    const kindValues = translate.formatKeys(kindGroupAccountOptions, ['label']);
    const [kind, setKind] = useState(null);

    const { execute: createAccountGroupPermission } = useFetch(apiConfig.accountGroupPermission.create);
    const { execute: createAccountBookPermission } = useFetch(apiConfig.accountBook.create);

    const { execute: getAccountList, data: accountList } = useFetch(apiConfig.account.autocomplete, {
        immediate: true,

        mappingData: ({ data }) => data?.content?.map((item) => ({ value: item.id, label: item.fullName })),
    });

    const { execute: getAccountGroupList, data: accountGroupList } = useFetch(apiConfig.accountGroup.autocomplete, {
        immediate: false,
        mappingData: ({ data }) => data?.content?.map((item) => ({ value: item.id, label: item.name })),
    });

    useEffect(() => {
        if (open) {
            // form.setFieldValue('permissionKind', 2);
            setKind(PermissionKind.GROUP);
            getAccountGroupList({
                params: {
                    ignoreBookId: subjectId,
                },
            });
            getAccountList({
                params: {
                    ignoreBookId: subjectId,
                    ignoreAccountGroupId: accountGroupId,
                },
            });
        }
    }, [open]);

    const handleSubmit = (values) => {
        if (accountGroupId) {
            createAccountGroupPermission({
                data: {
                    ...values,
                    accountGroupId,
                },
                onCompleted: (res) => {
                    showSuccessMessage(res.message);
                    getList();
                },
                onError: (err) => {
                    showErrorMessage(err.message);
                },
            });
        } else if (subjectId) {
            createAccountBookPermission({
                data: {
                    ...values,
                    subjectId,
                    permissionKind: values?.permissionKind || kind,
                },
                onCompleted: (res) => {
                    showSuccessMessage(res.message);
                    getList();
                },
                onError: (err) => {
                    showErrorMessage(err.message);
                },
            });
        }
        close();
        form.resetFields();
    };

    const handleCancel = () => {
        close();
        form.resetFields();
    };

    return (
        <Modal title={<span>{title}</span>} open={open} onCancel={handleCancel} footer={null}>
            <BaseForm
                form={form}
                onFinish={(values) => {
                    handleSubmit(values);
                }}
            >
                <div className="card-form" style={{ width: '60%' }}>
                    <Row gutter={10}>
                        {subjectId && (
                            <Col span={24}>
                                <SelectField
                                    name="permissionKind"
                                    label="Loại"
                                    options={kindValues}
                                    onChange={(value) => setKind(value)}
                                    defaultValue={PermissionKind.GROUP}
                                />
                            </Col>
                        )}
                        <Col span={24}>
                            {subjectId ? (
                                <>
                                    {' '}
                                    {kind == PermissionKind.GROUP ? (
                                        <SelectField required name={name} label={label} options={accountGroupList} />
                                    ) : (
                                        <SelectField
                                            required
                                            name={'accountId'}
                                            label={translate.formatMessage(commonMessage.account)}
                                            options={accountList}
                                        />
                                    )}
                                </>
                            ) : (
                                accountGroupId && (
                                    <SelectField required name={name} label={label} options={accountList} />
                                )
                            )}
                        </Col>
                    </Row>
                    <Row justify={'end'}>
                        <Button key="submit" htmlType="submit" type="primary" style={{ marginLeft: 5 }}>
                            {'Add'}
                        </Button>
                    </Row>
                </div>
            </BaseForm>
        </Modal>
    );
};

export default ModalPermissionCreate;
