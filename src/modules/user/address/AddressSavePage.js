import PageWrapper from '@components/common/layout/PageWrapper';
import { STATUS_ACTIVE } from '@constants';
import apiConfig from '@constants/apiConfig';
import useSaveBase from '@hooks/useSaveBase';
import useTranslate from '@hooks/useTranslate';
import { commonMessage } from '@locales/intl';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import AddressForm from './AddressForm';

const AddressSavePage = ({ pageOptions }) => {
    const translate = useTranslate();
    const { id, customerId } = useParams();
    const location = useLocation();
    const search = location.search;
    const { detail, mixinFuncs, loading, onSave, setIsChangedFormValues, isEditing, title, setSubmit } = useSaveBase({
        apiConfig: apiConfig.address,
        options: {
            getListUrl: pageOptions.listPageUrl.replace(':customerId', customerId),
            objectName: translate.formatMessage(pageOptions.objectName),
        },
        override: (funcs) => {
            funcs.prepareUpdateData = (data) => {
                return {
                    id: id,
                    accountId: customerId,
                    recipientName: data.recipientName,
                    phone: data.phone,
                    addressLine: data.addressLine,
                    isDefault: data.isDefault,
                    status: data.status,

                    provinceId: data.province?.id,
                    districtId: data.district?.id,
                    wardId: data.ward?.id,
                };
            };
            funcs.prepareCreateData = (data) => {
                return {
                    accountId: customerId,
                    recipientName: data.recipientName,
                    phone: data.phone,
                    addressLine: data.addressLine,
                    isDefault: data.isDefault || false,
                    status: STATUS_ACTIVE,

                    provinceId: data.province?.id,
                    districtId: data.district?.id,
                    wardId: data.ward?.id,
                };
            };
            funcs.mappingData = (data) => {
                return {
                    ...data.data,
                };
            };
            funcs.onSaveError = (err) => {};
        },
    });
    return (
        <PageWrapper
            loading={loading}
            routes={pageOptions.renderBreadcrumbs(commonMessage, translate, title, { search, customerId })}
        >
            <AddressForm
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

export default AddressSavePage;
