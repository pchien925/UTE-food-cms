import PageWrapper from '@components/common/layout/PageWrapper';
import useTranslate from '@hooks/useTranslate';
import { Card, Tabs } from 'antd';
import React, { useState } from 'react';
import { defineMessages } from 'react-intl';
import GeneralSettingPage from './GeneralSetting';
import { settingGroups } from '@constants/masterData';
import routes from '@routes';

const message = defineMessages({
    generalSetting: 'Cài đặt',
    pageSetting: 'Cài đặt trang',
    generalRevenue: 'Lợi nhuận chia sẻ',
    trainingConfig: 'Cấu hình đào tạo',
    landingConfig: 'Cấu hình trang landing',
    careerConfig: 'Lĩnh vực',
    workingTime: 'Thời gian làm việc',
});

const SettingPage = () => {
    const translate = useTranslate();
    const [activeTab, setActiveTab] = useState(
        localStorage.getItem(routes.settingsPage.keyActiveTab)
            ? localStorage.getItem(routes.settingsPage.keyActiveTab)
            : settingGroups.BBB,
    );
    return (
        <PageWrapper routes={[{ breadcrumbName: translate.formatMessage(message.generalSetting) }]}>
            <Card className="card-form" bordered={false}>
                <Tabs
                    type="card"
                    onTabClick={(key) => {
                        setActiveTab(key);
                        localStorage.setItem(routes.settingsPage.keyActiveTab, key);
                    }}
                    activeKey={activeTab}
                    items={[
                        {
                            key: settingGroups.BBB,
                            label: 'Cài đặt BBB',
                            children: activeTab == settingGroups.BBB && (
                                <GeneralSettingPage groupName={settingGroups.BBB} />
                            ),
                        },
                        // {
                        //     key: settingGroups.PAGE,
                        //     label: translate.formatMessage(message.pageSetting),
                        //     children: activeTab == settingGroups.PAGE && (
                        //         <GeneralSettingPage groupName={settingGroups.PAGE} />
                        //     ),
                        // },
                        // {
                        //     key: settingGroups.REVENUE,
                        //     label: translate.formatMessage(message.generalRevenue),
                        //     children: activeTab == settingGroups.REVENUE &&  <GeneralSettingPage groupName={settingGroups.REVENUE} />,
                        // },
                        // {
                        //     key: settingGroups.TRAINING,
                        //     label: translate.formatMessage(message.trainingConfig),
                        //     children: activeTab == settingGroups.TRAINING && (
                        //         <GeneralSettingPage groupName={settingGroups.TRAINING} />
                        //     ),
                        // },
                        // {
                        //     key: settingGroups.LANDING,
                        //     label: translate.formatMessage(message.landingConfig),
                        //     children: activeTab == settingGroups.LANDING && (
                        //         <GeneralSettingPage groupName={settingGroups.LANDING} />
                        //     ),
                        // },
                        // {
                        //     key: settingGroups.CAREER,
                        //     label: translate.formatMessage(message.careerConfig),
                        //     children: activeTab == settingGroups.CAREER && (
                        //         <GeneralSettingPage groupName={settingGroups.CAREER} />
                        //     ),
                        // },
                        // {
                        //     key: settingGroups.WORK_TIME,
                        //     label: translate.formatMessage(message.workingTime),
                        //     children: activeTab == settingGroups.WORK_TIME && (
                        //         <GeneralSettingPage groupName={settingGroups.WORK_TIME} />
                        //     ),
                        // },
                    ]}
                />
            </Card>
        </PageWrapper>
    );
};

export default SettingPage;
