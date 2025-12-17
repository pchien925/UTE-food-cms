import { Card, Flex, Spin } from 'antd';
import React from 'react';

import styles from './ListPage.module.scss';
import classNames from 'classnames';

function ListPage({ searchForm, actionBar, baseTable, loading = false, children, title, style, ...props }) {
    return (
        <Card className={styles.baseListPage} style={style}>
            <Spin spinning={loading}>
                <div className={classNames(styles.baseListPageList, props?.baseListPageListClassName)}>
                    <Flex className={props?.actionBarWrapperClassName} justify="space-between" align="center">
                        {searchForm && <div className={styles.searchForm}>{searchForm}</div>}
                        <div className={styles.title}>{title}</div>
                        <div className={classNames(props?.actionBarClassName)}>{actionBar}</div>
                    </Flex>
                    <div className={classNames(styles.actionBar, props?.actionBarClassName)}>{baseTable}</div>
                </div>
                <div>{children}</div>
            </Spin>
        </Card>
    );
}

export default ListPage;
