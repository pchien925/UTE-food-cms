import React from 'react';
import classNames from 'classnames';
import noDataImage from '@assets/images/no-data.png';
import styles from './Empty.module.scss';
const Empty = ({ label, width = 100, height = 100, className }) => {
    return (
        <div className={classNames(styles.empty, className)}>
            <img draggable={false} alt="no-data" src={noDataImage} width={width} height={height} />
            <div className={styles.text}> {label || 'Không tìm thấy dữ liệu phù hợp'}</div>
        </div>
    );
};
export default Empty;
