import React, { Component } from 'react';
import notFoundImage from '@assets/images/bg_404.png';

import styles from './PageNotFound.module.scss';
import { Button } from 'antd';

class PageNotFound extends Component {
    render() {
        return (
            <div className={styles.pageNotFound}>
                <img alt="not-found-background" src={notFoundImage} />
                <Button
                    type="primary"
                    className={styles.btnRedirect}
                    onClick={() => {
                        window.location.href = '/';
                    }}
                >
                    Quay về trang chủ
                </Button>
            </div>
        );
    }
}

export default PageNotFound;
