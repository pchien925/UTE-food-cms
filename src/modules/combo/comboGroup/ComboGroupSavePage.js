import PageWrapper from '@components/common/layout/PageWrapper';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ComboGroupForm from './ComboGroupForm';

const ComboGroupSavePage = ({ pageOptions }) => {
    const translate = useTranslate();
    const { id, comboId } = useParams();
    const location = useLocation();
    const search = location.search;

    const queryParams = new URLSearchParams(location.search);
    const nextOrdering = queryParams.get('nextOrdering');
    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title, setSubmit } = useSaveBase({
        apiConfig: apiConfig.comboGroup,
        options: {
            getListUrl: pageOptions.listPageUrl.replace(':comboId', comboId) + `${search}`,
            objectName: translate.formatMessage(pageOptions.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    ...data,
                    id: id,
                    comboId: comboId,
                    ordering: data.ordering,
                };
            };

            funcs.prepareCreateData = (data) => {
                return {
                    ...data,
                    comboId: comboId,
                    ordering: nextOrdering || 1,
                };
            };

            funcs.mappingData = (response) => {
                if (response.result === true) {
                    return {
                        ...response.data,
                    };
                }
            };
        },
    });

    return (
        <PageWrapper
            loading={loading}
            routes={pageOptions.renderBreadcrumbs(commonMessage, translate, title, { search, comboId })}
        >
            <ComboGroupForm
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

export default ComboGroupSavePage;
