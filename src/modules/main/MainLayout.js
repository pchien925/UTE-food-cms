import { Layout } from 'antd';
import React, { Fragment, useState } from 'react';

import AppHeader from './AppHeader';
import NavSider from './NavSider';

import { brandName } from '@constants';
import useDevices from '@hooks/useDevices';
import useTranslate from '@hooks/useTranslate';
import { defineMessages } from 'react-intl';
import styles from './MainLayout.module.scss';
import AppBody from './mobile/AppBody';
import useAuth from '@hooks/useAuth';

const { Content, Footer } = Layout;

const SIDEBAR_WIDTH_EXPAND = 320;

const message = defineMessages({
    copyRight: ' <strong>{brandName} </strong>- © Copyright {year}. All Rights Reserved.',
});

const MainLayout = ({ children }) => {
    const { isMobile } = useDevices();
    const { profile, isSuperAdmin } = useAuth();
    const role = profile?.kind;
    const [collapsed, setCollapsed] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false);
    const translate = useTranslate();
    const toggleCollapsed = () => setCollapsed((prev) => !prev);
    const toggleDrawer = () => setOpenDrawer((prev) => !prev);

    return (
        <Fragment>
            {(isMobile && !isSuperAdmin) ? (
                <div className={styles.masterLayout}>
                    <AppBody width="100%" className={styles.mainMobile}>
                        {children}
                    </AppBody>
                </div>
            ) : (
                <Layout hasSider>
                    <NavSider collapsed={collapsed} onCollapse={toggleCollapsed} width={SIDEBAR_WIDTH_EXPAND} />
                    <Layout>
                        <AppHeader collapsed={collapsed} onCollapse={toggleCollapsed} />
                        <Content className={styles.appContent}>
                        <div className={styles.wrapper}>{children}</div>
                        <Footer className={styles.appFooter}>
                            {translate.formatMessage(message.copyRight, {
                            strong: (chunk) => <strong>{chunk}</strong>,
                            brandName,
                            year: new Date().getFullYear(),
                            })}
                        </Footer>
                        </Content>
                    </Layout>
                </Layout>
            )}
        </Fragment>
    );
};

export default MainLayout;
