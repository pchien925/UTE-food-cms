import { Modal } from 'antd';
import React from 'react';
import NationForm from './NationForm';

const NationSaveModal = ({ open, close, dataDetail, isEditing, onSubmit, isSubmitting, objectName }) => {
    return (
        <Modal
            open={open}
            onCancel={close}
            title={isEditing ? `Chỉnh sửa ${objectName}` : `Thêm mới ${objectName}`}
            footer={null}
            closeIcon={null}
            destroyOnHidden
            maskClosable={false}
            width={680}
        >
            <NationForm
                formId="modal-tag-form"
                dataDetail={dataDetail ? dataDetail : {}}
                isEditing={isEditing}
                isSubmitting={isSubmitting}
                objectName={objectName}
                onSubmit={onSubmit}
                onCancel={close}
            />
        </Modal>
    );
};

export default NationSaveModal;

