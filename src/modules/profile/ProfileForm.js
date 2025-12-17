import notFoundImage from '@assets/images/avatar-default.png';
import CropImageField from '@components/common/form/CropImageField';
import TextField from '@components/common/form/TextField';
import { AppConstants } from '@constants';
import apiConfig from '@constants/apiConfig';
import useBasicForm from '@hooks/useBasicForm';
import useFetch from '@hooks/useFetch';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { showErrorMessage } from '@services/notifyService';
import { checkPhone } from '@utils';
import { Card, Form } from 'antd';
import React, { useEffect, useState } from 'react';

const ProfileForm = (props) => {
    const translate = useTranslate();
    const { formId, dataDetail, onSubmit, setIsChangedFormValues, actions } = props;
    const [imageUrl, setImageUrl] = useState(null);
    const { execute: executeUpFile } = useFetch(apiConfig.file.upload);

    const { form, mixinFuncs, onValuesChange } = useBasicForm({
        onSubmit,
        setIsChangedFormValues,
    });
    const uploadFile = (file, onSuccess, onError) => {
        executeUpFile({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: (response) => {
                if (response.result === true) {
                    onSuccess();
                    setImageUrl(response.data.filePath);
                }
                console.log(response);
            },
            onError: (error) => {
                if (error.code == 'ERROR-FILE-FORMAT-INVALID') {
                    showErrorMessage('File upload ảnh không hợp lệ!');
                }
                console.log(error);
            },
        });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataDetail,
        });
        setImageUrl(dataDetail.avatarPath);
    }, [dataDetail]);

    const handleFinish = (values) => {
        return mixinFuncs.handleSubmit({ ...values, avatarPath: imageUrl });
    };

    const checkUserName = (_, value) => {
        if (value) {
            const usernameRegex = /^[a-zA-Z0-9_]{2,20}$/;
            if (!usernameRegex.test(value)) {
                return Promise.reject('Username invalid !');
            }
        }
        return Promise.resolve();
    };
    const checkFullName = (_, value) => {
        if (value) {
            const lowerCaseValue = value.toLowerCase().trim();
            const fullNameRegex =
                /^[a-zàáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ\s]+(?: [a-zàáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]+)*$/u;

            if (!fullNameRegex.test(lowerCaseValue)) {
                return Promise.reject('FullName không hợp lệ, vui lòng nhập lại');
            }
        }
        return Promise.resolve();
    };
    
    return (
        <Card className="card-form" bordered={false} style={{ minHeight: 'calc(100vh - 190px)' }}>
            <Form
                style={{ width: '50%' }}
                labelCol={{ span: 8 }}
                id={formId}
                onFinish={handleFinish}
                form={form}
                layout="horizontal"
                onValuesChange={onValuesChange}
            >
                <CropImageField
                    label={translate.formatMessage(commonMessage.avatar)}
                    name="avatar"
                    imageUrl={imageUrl ? `${AppConstants.avatarRootUrl}${imageUrl}` : notFoundImage}
                    aspect={1 / 1}
                    uploadFile={uploadFile}
                    disabled
                />
                <TextField
                    readOnly
                    label={translate.formatMessage(commonMessage.username)}
                    name="username"
                    rules={[
                        {
                            validator: checkUserName,
                        },
                    ]}
                    disabled
                />
                <TextField
                    label={translate.formatMessage(commonMessage.fullName)}
                    name="fullName"
                    rules={[
                        {
                            validator: checkFullName,
                        },
                    ]}
                    disabled
                />
                <TextField
                    label={translate.formatMessage(commonMessage.phone)}
                    name="phone"
                    rules={[
                        {
                            validator: checkPhone,
                        },
                    ]}
                    disabled
                />
                <TextField
                    label={translate.formatMessage(commonMessage.email)}
                    name="email"
                    disabled
                />
            </Form>
        </Card>
    );
};

export default ProfileForm;
