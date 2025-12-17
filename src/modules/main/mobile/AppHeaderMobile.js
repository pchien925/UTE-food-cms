import { ReactComponent as IconLog } from '@assets/icons/logout.svg';
import useAuth from '@hooks/useAuth';
import { removeCacheToken } from '@services/userService';
import { accountActions } from '@store/actions';
import { IconChevronsLeft, IconFilter, IconMenu2 } from '@tabler/icons-react';
import React, { Children, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import NavDrawer from './NavDrawer';
import styles from './AppHeader.module.scss';
import { renderImageUrl } from '@utils';

const AppHeaderMobile = ({ children, title, setOpenFilter = () => {}, showFilter, activeBack = false }) => {
    const intl = useIntl();
    const params = useLocation();
    const [open, setOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const { profile, permissionCodes } = useAuth();
    const dispatch = useDispatch();

    const onLogout = () => {
        Modal.confirm({
            title: 'Đăng xuất',
            content: 'Bạn có chắc chắn muốn đăng xuất?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            centered: true,
            className: styles.confirmModal,
            onOk: () => {
                removeCacheToken();
                dispatch(accountActions.logout());
            },
        });
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        const rootElement = document.getElementById('root');
        if (open) {
            rootElement.classList.add('no-scroll');
        } else {
            rootElement.classList.remove('no-scroll');
        }
        return () => {
            rootElement.classList.remove('no-scroll');
        };
    }, [open]);

    const [active, setActive] = useState('dashboard');
    let Title = null;
    Children.forEach(children, (child) => {
        if (child.type === AppHeaderMobile.Title) Title = child;
    });

    return (
        <div className={styles.appHeader} id="">
            <div className={styles.headerContainer}>
                {activeBack ? (
                    <IconChevronsLeft
                        style={{ cursor: 'pointer', color: '#38abf1' }}
                        onClick={() => navigate(-1)}
                        size={34}
                    />
                ) : (
                    <IconMenu2
                        style={{ cursor: 'pointer', color: '#38abf1' }}
                        className={styles.hamburger}
                        alt=""
                        onClick={() => setOpen(true)}
                    />
                )}
                <div className={styles.headerTitle} style={{ fontSize: 20, fontWeight: 600, marginRight: '8px' }}>
                    {children}
                </div>
                {showFilter ? (
                    <div className={styles.headerContact}>
                        <IconFilter color="#38abf1" width={30} height={30} onClick={() => setOpenFilter(true)} />
                    </div>
                ) : (
                    <div className={styles.headerContact}></div>
                )}
            </div>

            <NavDrawer open={open} onClose={() => setOpen(false)} headerTitle="Menu">
                <ul className={styles.siderMenu}>
                    <div className={styles.headerTitlee} onClick={() => navigate('/profile')}>
                        <div>
                            <img className={styles.logo} alt="avatar" src={renderImageUrl(profile?.avatarPath)} />
                        </div>
                        <div className={styles.profile}>
                            <div className={styles.title}>{profile.fullName}</div>
                            <div className={styles.title1}>{profile.email}</div>
                        </div>
                    </div>
                    <div style={{ width: '100%' }} />
                    <Link className={styles.link} onClick={onLogout}>
                        <div className={styles.item}>
                            <span style={{ marginRight: 13, stroke: 'red' }}>
                                <IconLog style={{ paddingBottom: '1px' }} width={20} />
                            </span>
                            <span style={{ color: 'red' }}>Đăng xuất</span>
                        </div>
                    </Link>
                </ul>
            </NavDrawer>
        </div>
    );
};

function Title({ children }) {
    return children;
}

AppHeaderMobile.Title = Title;

export default AppHeaderMobile;
