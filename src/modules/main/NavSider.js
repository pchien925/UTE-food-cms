import logo from '@assets/images/logo-ute.png';
import { navMenuConfig } from '@constants/menuConfig';
import useAuth from '@hooks/useAuth';
import useValidatePermission from '@hooks/useValidatePermission';
import { Layout, Menu } from 'antd';
import React, { useMemo } from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import styles from './NavSider.module.scss';

const { Sider } = Layout;

function buildPathWithQuery(path, query) {
    if (!query) return path;
    const queryString = new URLSearchParams(query)?.toString();
    return `${path}?${queryString}`;
}

function flattenMenu(menu) {
    const flat = [];
    function recurse(items) {
        for (const item of items) {
            if (item.children) recurse(item.children);
            flat.push(item);
        }
    }
    recurse(menu);
    return flat;
}

const NavSider = ({ collapsed, onCollapse, width }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const validatePermission = useValidatePermission();
    const { profile } = useAuth();

    const activeNav = useMemo(() => {
        const activeNav = findActiveNav(navMenuConfig);
        return activeNav || { selectedKeys: [], openKeys: [] };
    }, [location.pathname, location.search]);

    function makeNavs(navs) {
        return navs
            .map((nav) => {
                const { isSuperAdmin, ...newNav } = nav;

                if (isSuperAdmin && !profile?.isSuperAdmin) return null;

                if (newNav.permission || newNav.kind) {
                    if (!validatePermission(newNav.permission, newNav.kind)) return null;
                }

                if (newNav.children) {
                    newNav.children = makeNavs(newNav.children);
                    if (newNav.children.every((item) => item === null)) return null;
                }

                return newNav;
            })
            .filter(Boolean);
    }

    function handleMenuItemClick(item) {
        const flatMenu = flattenMenu(navMenuConfig);
        const selectedNav = flatMenu.find((i) => i.key === item.key);

        if (selectedNav) {
            const path = buildPathWithQuery(selectedNav.path, selectedNav.query);
            navigate(path);
        }
    }

    function findActiveNav(navs) {
        for (const nav of navs) {
            if (nav.children) {
                const activeItem = findActiveNav(nav.children);
                if (activeItem) {
                    return {
                        selectedKeys: activeItem.selectedKeys,
                        openKeys: [nav.key, ...activeItem.openKeys],
                    };
                }
            } else {
                const pathMatch = matchPath(nav.path + '/*', location.pathname);
                const searchParams = new URLSearchParams(location.search);

                const queryMatch = Object.entries(nav.query || {}).every(
                    ([key, val]) => searchParams.get(key) === String(val),
                );

                if (pathMatch && queryMatch) {
                    return {
                        selectedKeys: [nav.key],
                        openKeys: [],
                    };
                }
            }
        }
        return null;
    }

    return (
        <Sider
            className={'app-sider ' + styles.sidebar}
            collapsible
            collapsed={collapsed}
            width={width}
            onCollapse={onCollapse}
            trigger={null}
        >
            <div data-collapsed={collapsed} className={styles.logo} style={{ width: '100%' }}>
                <img src={logo} alt="Mira" />
            </div>
            <Menu
                key={location.pathname === '/' ? 'initial' : 'navSider'}
                theme="dark"
                mode="inline"
                className={styles.menu}
                defaultSelectedKeys={activeNav.selectedKeys}
                defaultOpenKeys={activeNav.openKeys}
                selectedKeys={activeNav.selectedKeys}
                items={makeNavs(navMenuConfig)}
                onSelect={handleMenuItemClick}
            />
        </Sider>
    );
};

export default NavSider;
