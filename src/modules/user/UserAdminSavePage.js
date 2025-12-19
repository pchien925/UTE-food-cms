import PageWrapper from '@components/common/layout/PageWrapper';
import { STATUS_ACTIVE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { showErrorMessage } from '@services/notifyService';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import UserAdminForm from './UserAdminForm';


const UserAdminSavePage = ({ pageOptions }) => {
    const translate = useTranslate();
    const { id } = useParams();
    const location = useLocation();
    const search = location.search;
    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title, setSubmit } = useSaveBase({
        apiConfig: {
            getById: apiConfig.account.getById,
            create: apiConfig.account.create,
            update: apiConfig.account.update,
        },
        options: {
            getListUrl: pageOptions.listPageUrl + `${search}`,
            objectName: translate.formatMessage(pageOptions.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    avatarPath: data.avatarPath,
                    groupId: data.group.id,
                    ...data,
                    kind: pageOptions?.kind,
                    id: id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    kind: pageOptions?.kind,
                    avatarPath: data.avatarPath,
                    status: STATUS_ACTIVE,
                    groupId: data.group.id,
                };
            };
            funcs.mappingData = (data) => {
                return {
                    ...data.data,
                };
            };
            funcs.onSaveError = (err) => {
                const errorCode = err?.response?.data?.code;
                if (errorCode === 'ERROR-ACCOUNT-0006') {
                    showErrorMessage("Tên đăng nhập hoặc email đã tồn tại!");
                } else {
                    showErrorMessage('Có lỗi xảy ra, vui lòng thử lại sau!');
                }
                setSubmit(false);
            };
        },
    });

    return (
        <PageWrapper loading={loading} routes={pageOptions.renderBreadcrumbs(commonMessage, translate, title)}>
            <UserAdminForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
                kind={pageOptions?.kind}
            />
        </PageWrapper>
    );
};

export default UserAdminSavePage;
