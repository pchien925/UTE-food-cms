import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import { showErrorMessage } from '@services/notifyService';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import FoodForm from './FoodForm';

const FoodSavePage = ({ pageOptions }) => {
    const translate = useTranslate();
    const { id } = useParams();
    const location = useLocation();
    const search = location.search;
    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title, setSubmit } = useSaveBase({
        apiConfig: {
            getById: apiConfig.food.getById,
            create: apiConfig.food.create,
            update: apiConfig.food.update,
        },
        options: {
            getListUrl: pageOptions.listPageUrl + `${search}`,
            objectName: pageOptions.objectName,
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: id,
                    categoryId: data.category?.id,
                    status: data.status,
                };
            };

            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    categoryId: data.category?.id,
                };
            };

            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        ...response.data,
                    };
                }
            };

            funcs.onSaveError = (err) => {
                console.log('Lỗi Save:', err);
                const msg = err?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau!';
                const validationErrors = err?.response?.data?.data;
                if (Array.isArray(validationErrors) && validationErrors.length > 0) {
                    showErrorMessage(validationErrors[0].errorMessage);
                } else {
                    showErrorMessage(msg);
                }
                setSubmit(false);
            };
        },
    });

    return (
        <PageWrapper loading={loading} routes={pageOptions.renderBreadcrumbs(commonMessage, translate, title)}>
            <FoodForm
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

export default FoodSavePage;
