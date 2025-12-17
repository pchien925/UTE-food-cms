import Quill from 'quill';
import apiConfig from '@constants/apiConfig';
import notFoundImage from '@assets/images/avatar-default.png';
import React, { forwardRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import QuillImageDropAndPaste from 'quill-image-drop-and-paste';
import { Modal } from 'antd';
import useFetch from '@hooks/useFetch';
Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);
import RowInsert from '@assets/icons/row-insert.svg';
import RowInsertBottom from '@assets/icons/row-insert-bottom.svg';
import RowInsertTop from '@assets/icons/row-insert-top.svg';
import ColumnInsertLeft from '@assets/icons/column-insert-left.svg';
import ColumnInsertRight from '@assets/icons/column-insert-right.svg';
import ColumnRemove from '@assets/icons/column-remove.svg';
import RowRemove from '@assets/icons/row-remove.svg';
import TableDelete from '@assets/icons/delete-table.svg';
// import 'quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
Quill.register('modules/imageResize', ImageResize);

var icons = Quill.import('ui/icons');
icons['insertTable'] = `<img style="width:18px" src=${RowInsert} class="fm_editor_icon">`;
icons['insertRowBelow'] = `<img style="width:18px" src=${RowInsertBottom}>`;
icons['insertRowAbove'] = `<img style="width:18px" src=${RowInsertTop}>`;
icons['insertColumnLeft'] = `<img style="width:18px" src=${ColumnInsertLeft}>`;
icons['insertColumnRight'] = `<img style="width:18px" src=${ColumnInsertRight}>`;
icons['deleteColumn'] = `<img style="width:18px" src=${ColumnRemove}>`;
icons['deleteRow'] = `<img style="width:18px" src=${RowRemove}>`;
icons['deleteTable'] = `<img style="width:18px" src=${TableDelete}>`;

const Editor = forwardRef(({ value, readOnly, defaultValue, onChange, onSelectionChange, style, baseURL, uploadImageApi = apiConfig.file.upload, theme = "snow" }, ref) => {
    const containerRef = useRef(null);
    const quillRef = useRef(null); // Create a ref to store the Quill instance
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onChange);
    const onSelectionChangeRef = useRef(onSelectionChange);
    const table = useRef(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(null);

    const handleAvatarClick = (avatarURL) => {
        setSelectedAvatar(avatarURL);
        if (avatarURL) {
            setIsModalVisible(true);
        }
    };

    useLayoutEffect(() => {
        onTextChangeRef.current = onChange;
        onSelectionChangeRef.current = onSelectionChange;
    });


    var quill;

    useEffect(() => {
        const container = containerRef.current;
        const editorContainer = container.appendChild(container.ownerDocument.createElement('div'));

        quill = new Quill(editorContainer, {
            theme: theme,
            modules: {
                imageResize: !readOnly && {
                    parchment: Quill.import('parchment'),
                    modules: ['Resize', 'DisplaySize'],
                },
                toolbar: {
                    container: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                        ['link', 'image'],
                        [{ color: [] }, { background: [] }],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
                        ['clean'],
                        // Định nghĩa nút cho bảng
                        ['table'],
                        [
                            'insertTable',
                            'insertRowAbove',
                            'insertRowBelow',
                            'insertColumnLeft',
                            'insertColumnRight',
                            'deleteRow',
                            'deleteColumn',
                            'deleteTable',
                        ],
                    ],
                    // Handler cho các nút bảng
                    handlers: {
                        insertTable: function () {
                            table.current.insertTable(2, 2);
                        },
                        insertRowAbove: function () {
                            table.current.insertRowAbove();
                        },
                        insertRowBelow: function () {
                            table.current.insertRowBelow();
                        },
                        insertColumnLeft: function () {
                            table.current.insertColumnLeft();
                        },
                        insertColumnRight: function () {
                            table.current.insertColumnRight();
                        },
                        deleteRow: function () {
                            table.current.deleteRow();
                        },
                        deleteColumn: function () {
                            table.current.deleteColumn();
                        },
                        deleteTable: function () {
                            table.current.deleteTable();
                        },
                        image: imageHandler,
                    },

                },
                imageDropAndPaste: {
                    handler: imagePastHandler,
                },
                table: true, // Kích hoạt module table
            },
        });
        async function imagePastHandler(imageDataUrl, type, imageData) {
            const file = imageData.toFile();
            const range = quill.getSelection();
            quill.deleteText(range.index - 1, 1);
            if (file) uploadToServer(file);
        }

        quillRef.current = quill; // Store the Quill instance in ref
        table.current = quillRef.current.getModule('table');
        if (defaultValueRef.current) {
            quill.setContents(defaultValueRef.current);
        }
        quill.on('text-change', (delta, oldDelta, source) => {
            const content = quill.root.innerHTML;
            onTextChangeRef.current?.(content);
        });

        quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
            onSelectionChangeRef.current?.(...args);
        });

        return () => {
            quillRef.current = null;
            container.innerHTML = '';
        };
    }, []);
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
    }, [quill]);
    const { execute: executeUploadImage } = useFetch(uploadImageApi);

    const uploadToServer = (file) => {
        executeUploadImage({
            data: {
                type: 'LOGO',
                file: file,
            },
            onCompleted: ({ data }) => {
                insertToEditor(data.filePath);
            },
            onError: (err) => {
                console.warn('Upload image error');
            },
        });
    };

    const insertToEditor = (url) => {
        try {
            // push image url to rich editor.
            const range = quill.getSelection();
            quill.insertEmbed(range.index, 'image', baseURL + url);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (quillRef.current) {
            quill.root.addEventListener('click', (event) => {
                if (event.target.tagName === 'IMG') {
                    // Xử lý sự kiện khi click vào hình ảnh
                    handleAvatarClick(event.target?.src);
                }
            });
        }
        
    }, [quillRef]);

    // Effect to update Quill content when `value` prop changes
    useEffect(() => {
        if (quillRef.current && !!defaultValue && defaultValue != 'undefined' && defaultValue != '<p>undefined</p>') {
            const currentContent = quillRef.current.getSemanticHTML();
            if (currentContent !== defaultValue) {
                quillRef.current.root.innerHTML = defaultValue;
            }
        }
        else{
            quillRef.current.root.innerHTML = '';
        }
    }, [defaultValue]);

    useEffect(() => {
        if (quill) {
            quill.enable(!readOnly);
        }
    }, [readOnly]);
    return <>
        <div ref={containerRef} style={style} ></div>

        <Modal
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
            centered
            closable={false}
            width={800}
        >
            <img alt="Avatar" src={selectedAvatar ? selectedAvatar : notFoundImage} style={{ width: '100%' }} />
        </Modal></>;
});

Editor.displayName = 'Editor';

export default Editor;
