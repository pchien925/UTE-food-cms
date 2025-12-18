import TagForm from '@modules/tag/TagForm';
import { Modal } from 'antd';
import React from 'react';

const TagModal = ({ open, close, dataDetail, isEditing, onSubmit, isSubmitting }) => {
    return (
        <Modal
            open={open}
            onCancel={close}
            title={isEditing ? 'Chỉnh sửa dự án' : 'Thêm mới dự án'}
            footer={null}
            destroyOnHidden
            maskClosable={false}
        >
            <TagForm
                dataDetail={dataDetail}
                isEditing={isEditing}
                onSubmit={onSubmit}
                setIsChangedFormValues={() => {}}
                formId="modal-tag-form"
                onCancel={close}
                isSubmitting={isSubmitting}
            />
        </Modal>
    );
};

export default TagModal;
