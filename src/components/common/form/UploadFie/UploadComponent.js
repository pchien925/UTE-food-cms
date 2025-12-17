import React from 'react';
import { Upload } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import useNotification from '@hooks/useNotification';

const { Dragger } = Upload;

const UploadComponent = ({ uploadFile }) => {
  const notification = useNotification();

  const handleBeforeUpload = (file) => {
    const isLt30M = file.size / 1024 / 1024 < 30;
    if (!isLt30M) {
      notification({
        type: 'error',
        title: 'Error',
        message: 'File must be smaller than 30MB!',
      });
    }
    return isLt30M || Upload.LIST_IGNORE;
  };

  return (
    <div style={{ margin: '0', background: '#fafafa', borderRadius: '4px', textAlign: 'center' }}>
      <Dragger
        name="file"
        multiple={false}
        beforeUpload={handleBeforeUpload}
        customRequest={({ file, onSuccess, onError }) => uploadFile(file, onSuccess, onError)}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp"
        showUploadList={false}
      >
        <p className="ant-upload-drag-icon">
          <CloudUploadOutlined style={{ color: '#467fcf' }} />
        </p>
        <p className="ant-upload-text" style={{ color: '#467fcf', fontSize: '16px' }}>
          Nhấp để Tải lên hoặc kéo và thả
        </p>
        <p className="ant-upload-hint">
          Tải lên bất kỳ tài liệu Office hoặc tệp PDF nào (không quá 30 MB). Tùy thuộc vào kích thước tệp, có thể cần thêm thời gian tải lên trước khi có thể sử dụng.
        </p>
      </Dragger>
    </div>
  );
};

export default UploadComponent;
