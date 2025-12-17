import React, { useEffect, useRef } from 'react';
import Drawer from 'react-modern-drawer';
import close from '@assets/icons/close.svg';

import 'react-modern-drawer/dist/index.css';
import styles from './NavDrawer.module.scss';
const NavDrawer = ({ open, onClose, direction = 'left', children, headerTitle = '' }) => {
    const modalRef = useRef();

    return (
        <Drawer
            open={open}
            style={{ backgroundColor: '#fff', zIndex: 1000 }}
            onClose={onClose}
            direction={direction}
            className={styles.drawer}
            size={350}
        >
            <div>
                <div className={styles.header}>
                    <div className={styles.title}>{headerTitle}</div>
                    <div className={styles.close}>
                        <img style={{ width: '19px', height: '19px' }} src={close} alt="" onClick={onClose} />
                    </div>
                </div>
                {children}
            </div>
        </Drawer>
    );
};

export default NavDrawer;
