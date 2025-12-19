import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { showErrorMessage } from '@services/notifyService';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import OptionValueForm from './OptionValueForm';

const OptionValueSavePage = ({ pageOptions }) => {
    const translate = useTranslate();
    const { id, optionId } = useParams();
    const location = useLocation();
    const search = location.search;
    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title, setSubmit } = useSaveBase({
        apiConfig: apiConfig.optionValue,
        options: {
            getListUrl: pageOptions.listPageUrl.replace(':optionId', optionId) + `${search}`,
            objectName: translate.formatMessage(pageOptions.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: id,
                    optionId: optionId,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    optionId: optionId,
                };
            };
            funcs.mappingData = (data) => {
                return {
                    ...data.data,
                };
            };
            funcs.onSaveError = (err) => {
                const errorCode = err?.response?.data?.code;
                if (errorCode === 'ERROR-OPTION-VALUE-0001') {
                    showErrorMessage("Giá trị đã tồn tại!");
                } else {
                    showErrorMessage('Có lỗi xảy ra, vui lòng thử lại sau!');
                }
                setSubmit(false);
            };
        },
    });

    return (
        <PageWrapper loading={loading} routes={pageOptions.renderBreadcrumbs(commonMessage, translate, title, { search, optionId })}>
            <OptionValueForm
                setIsChangedFormValues={setIsChangedFormValues}
                dataDetail={detail ? detail : {}}
                formId={mixinFuncs.getFormId()}
                isEditing={isEditing}
                actions={mixinFuncs.renderActions()}
                onSubmit={onSave}
            />
        </PageWrapper>
    );
};

export default OptionValueSavePage;
