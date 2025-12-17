import { Form } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import useFormField from '@hooks/useFormField';
import ReactQuill, { Quill } from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6
import useFetch from '@hooks/useFetch';
import apiConfig from '@constants/apiConfig';
import ImageResize from 'quill-image-resize-module-react';
import QuillImageDropAndPaste from 'quill-image-drop-and-paste';
import { AppConstants } from '@constants';

ReactQuill.Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);
Quill.register('modules/imageResize', ImageResize);
const AlignStyle = ReactQuill.Quill.import('attributors/style/align');
ReactQuill.Quill.register(AlignStyle, true);
function Counter(quill, options) {
    const container = document.querySelector(options.container);
    quill.on(Quill.events.TEXT_CHANGE, () => {
        const text = quill.getText();
        if (options.maxLength) {
            container.innerText = 'Remaining characters: ' + `${options.maxLength - text.length}` + ' characters';
        }
    });
}

Quill.register('modules/counter', Counter);
const Parchment = Quill.import('parchment');

const customFontFamilyAttributor = new Parchment.Attributor.Style('custom-family-attributor', 'font-family');
const customSizeAttributor = new Parchment.Attributor.Style('custom-size-attributor', 'font-size');
const customColorAttributor = new Parchment.Attributor.Style('custom-color-attributor', 'color');

const ListItemBlot = Quill.import('formats/list/item');

const sizeConfig = {
    small: '12px',
    normal: '16px',
    large: '24px',
    huge: '40px',
};
class CustomListItem extends ListItemBlot {
    optimize(context) {
        super.optimize(context);

        if (this.children.length >= 1) {
            const child = this.children.head;
            const attributes = child?.attributes?.attributes;

            if (attributes) {
                for (const key in attributes) {
                    const element = attributes[key];
                    let name = element.attrName;
                    var value = element.value(child.domNode);
                    if (name === 'size') {
                        value = sizeConfig[value] || '16px';
                    }
                    if (name === 'color') super.format('custom-color-attributor', value);
                    else if (name === 'font-family') super.format('custom-family-attributor', value);
                    else if (name === 'size') super.format('custom-size-attributor', value);
                }
            }
            // else {
            //     super.format('custom-color-attributor', false);
            //     super.format('custom-family-attributor', false);
            //     super.format('custom-size-attributor', false);
            // }
        }
    }
}

Quill.register(customColorAttributor, true);
Quill.register(customFontFamilyAttributor, true);
Quill.register(customSizeAttributor, true);
Quill.register(CustomListItem, true);

function getLoader() {
    const div = document.createElement('div');
    div.className = 'loader-container';
    div.innerHTML = "<div class='loader'>Loading...</div>";
    return div;
}

const formats = [
    'header',
    'font',
    'size',
    'color',
    'background',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'align',
    'list',
    'bullet',
    'indent',
    'image',
];

const RichTextField = (props) => {
    const {
        label,
        disabled,
        name,
        required,
        style,
        labelAlign,
        formItemProps,
        uploadImageApi = apiConfig.file.upload,
    } = props;

    const quillRef = useRef();

    const { execute: executeUploadImage } = useFetch(uploadImageApi);

    const imageHandler = useCallback(() => {
        const selectLocalImage = () => {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
            input.click();

            // Listen upload local image and save to server
            input.onchange = () => {
                const file = input.files[0];

                // file type is only image.
                if (/^image\//.test(file.type)) {
                    uploadToServer(file);
                } else {
                    console.warn('You could only upload images.');
                }
            };
        };
        selectLocalImage();
    }, []);
    const uploadToServer = (file) => {
        executeUploadImage({
            data: {
                type: 'AVATAR',
                file: file,
            },
            onCompleted: ({ data }) => {
                insertToEditor(AppConstants.contentRootUrl + data.filePath);
            },
            onError: (err) => {
                console.log(err);
                console.warn('Upload image error  rich text field !!');
            },
        });
    };

    const insertToEditor = (url) => {
        const editor = quillRef.current.getEditor();

        editor.focus();

        const range = editor.getSelection();

        const index = range ? range.index : editor.getLength();

        console.log('Inserted image at:', range, url);
        editor.insertEmbed(index, 'image', url);
    };

    const modules = useMemo(() => {
        return {
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, false] }],
                    [{ color: [] }, { background: [] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
                    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                    ['image'],
                    ['clean'],
                ],
                handlers: {
                    image: imageHandler,
                },
            },
            imageDropAndPaste: {
                handler: imagePastHandler,
            },
            clipboard: {
                matchVisual: false,
            },
        };
    }, []);

    const { rules } = useFormField(props);

    async function imagePastHandler(imageDataUrl, type, imageData) {
        const file = imageData.toFile();
        if (file) uploadToServer(file);
    }

    // const imageHandler = () => {
    //     const { uploadFile, baseUrlImage, t } = props;
    //     const _this3 = quillRef.editor;
    //     let fileInput = _this3.container.querySelector('input.ql-image[type=file]');
    //     if (fileInput == null) {
    //         fileInput = document.createElement('input');
    //         fileInput.setAttribute('type', 'file');
    //         fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
    //         fileInput.classList.add('ql-image');
    //         fileInput.addEventListener('change', function () {
    //             if (fileInput.files != null && fileInput.files[0] != null) {
    //                 const size = fileInput.files[0].size;
    //                 const file = fileInput.files[0];
    //                 if (size < LIMIT_IMAGE_SIZE) {
    //                     const loader = getLoader();
    //                     _this3.container.appendChild(loader);
    //                     _this3.container.classList.add('disabled');
    //                     _this3.container.firstChild.setAttribute('contenteditable', false);
    //                     uploadFile({
    //                         params: { fileObjects: { file }, type: UploadFileTypes.AVATAR },
    //                         others: baseUrlImage ? { path: baseUrlImage + '/v1/file/upload' } : null,
    //                         onCompleted: (result) => {
    //                             const index = _this3.getSelection(true).index;
    //                             if (baseUrlImage) {
    //                                 _this3.insertEmbed(
    //                                     index,
    //                                     'image',
    //                                     `${baseUrlImage + '/v1/file/download'}${result.data.filePath}`,
    //                                 );
    //                             } else {
    //                                 _this3.insertEmbed(
    //                                     index,
    //                                     'image',
    //                                     `${AppConstants.mediaRootUrl}${result.data.filePath}`,
    //                                 );
    //                             }
    //                             _this3.setSelection(index + 1);
    //                             fileInput.value = '';
    //                             _this3.container.removeChild(loader);
    //                             _this3.container.classList.remove('disabled');
    //                             _this3.container.firstChild.setAttribute('contenteditable', true);
    //                             _this3.container.firstChild.focus();
    //                         },
    //                         onError: (err) => {
    //                             if (err && err.message) {
    //                                 showErrorMessage(err.message);
    //                             }
    //                             _this3.container.removeChild(loader);
    //                             _this3.container.classList.remove('disabled');
    //                             _this3.container.firstChild.setAttribute('contenteditable', true);
    //                             _this3.container.firstChild.focus();
    //                         },
    //                     });
    //                 } else {
    //                     showErrorMessage(t('imageTooLarge'));
    //                 }
    //             }
    //         });
    //         _this3.container.appendChild(fileInput);
    //     }
    //     fileInput.click();
    // };

    return (
        <Form.Item
            {...formItemProps}
            required={required}
            labelAlign={labelAlign}
            name={name}
            label={label}
            rules={rules}
            initialValue=""
        >
            <ReactQuill style={style} formats={formats} modules={modules} readOnly={disabled} ref={quillRef} />
        </Form.Item>
    );
};

export default RichTextField;
