import { moveArrayElement } from '@utils';
import React, { useEffect, useState } from 'react';
import useFetch from './useFetch';
import useNotification from './useNotification';
import { arrayMove } from '@dnd-kit/sortable';
import { showErrorMessage } from '@services/notifyService';

const sortColumn = {
    key: 'sort',
    width: 30,
};

function useDragDrop({ data = [], apiConfig, setTableLoading, indexField }) {
    const [sortedData, setSortedData] = useState(
        (data.length > 0 && data.sort((a, b) => a?.[indexField] - b?.[indexField])) || [],
    );
    const [isOrderingChanged, setIsOrderingChanged] = useState(false);

    const { execute: executeOrdering, loading } = useFetch(apiConfig);
    const notification = useNotification();
    const onDragEnd = ({ id: dragId }, { id: hoverId }) => {
        if (dragId == hoverId) return;
        const dragIndex = sortedData.findIndex((item) => item.id == dragId);
        const hoverIndex = sortedData.findIndex((item) => item.id == hoverId);
        const movedData = moveArrayElement(sortedData, dragIndex, hoverIndex);
        setSortedData(movedData);
        setIsOrderingChanged(true);
    };
    const validateNoteOrder = (notes) => {
        for (let i = 0; i < notes.length - 1; i++) {
            const currentNote = notes[i];
            const nextNote = notes[i + 1];

            if (currentNote.endTime > nextNote.startTime) {
                return false;
            }
        }
        return true;
    };
    const onDragEndDnd = ({ active, over }) => {
        console.log({ active, over });
        if (!over) return;
        if (active.id !== over?.id) {
            const isNew = active.id?.startsWith?.('temp-');
            setSortedData((prevState) => {
                const activeIndex = prevState.findIndex((record) => record.id === active?.id);
                const overIndex = prevState.findIndex((record) => record.id === over?.id);
                const returnArray = arrayMove(prevState, activeIndex, overIndex);

                const isValid = validateNoteOrder(returnArray);
                if (isValid) {
                    handleUpdate(returnArray, isNew);
                } else {
                    showErrorMessage('Thứ tự không hợp lệ.');
                    return prevState;
                }

                return returnArray;
            });
        } 
    };
    const handleUpdate = (data = [], isNew) => {
        console.log('data', data);
        let dataUpdate = [];
        const sortList = data.length > 0 ? data : sortedData;
        sortList.map((item, index) => {
            dataUpdate.push({
                id: item.id,
                [indexField]: index,
            });
        });
        if (!isNew)
            executeOrdering({
                data: dataUpdate,
                onCompleted: () => {
                    notification({ type: 'success', message: 'Cập nhật thành công!' });
                },
                onError: (err) => {
                    console.log(err);
                    notification({ type: 'error', message: 'Cập nhật thất bại!' });
                },
            });
        setIsOrderingChanged(false);
    };

    useEffect(() => {
        if (data) setSortedData(data);
        else setSortedData([]);
    }, [data]);

    return { sortedData, onDragEnd, sortColumn, handleUpdate, onDragEndDnd, isOrderingChanged, loading };
}

export default useDragDrop;
