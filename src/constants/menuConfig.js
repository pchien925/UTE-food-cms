import {
    SettingOutlined,
    UsergroupAddOutlined,
    InboxOutlined,
    CoffeeOutlined,
    ApartmentOutlined,
    HistoryOutlined,
} from '@ant-design/icons';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import apiConfig from './apiConfig';

export const navMenuConfig = [
    {
        label: <FormattedMessage defaultMessage="Quản lý người dùng" />,
        key: 'user-management',
        icon: <UsergroupAddOutlined />,
        permission: [apiConfig.account.getList.permissionCode],
        children: [
            {
                label: <FormattedMessage defaultMessage="Quản trị viên" />,
                key: 'admin',
                path: '/admins',
                permission: [apiConfig.account.getList.permissionCode],
                isSuperAdmin: true,
            },
            {
                label: <FormattedMessage defaultMessage="Quản lý" />,
                key: 'manager',
                path: '/managers',
                permission: [apiConfig.account.getList.permissionCode],
            },
            {
                label: <FormattedMessage defaultMessage="Khách hàng" />,
                key: 'customer',
                path: '/customers',
                permission: [apiConfig.account.getList.permissionCode],
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý món ăn" />,
        key: 'food-management',
        icon: <CoffeeOutlined />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Đồ ăn" />,
                key: 'foods',
                path: '/foods',
                permission: [apiConfig.food.getList.permissionCode],
            },
            {
                label: <FormattedMessage defaultMessage="Combo" />,
                key: 'combos',
                path: '/combos',
                permission: [apiConfig.combo.getList.permissionCode],
            },
            {
                label: <FormattedMessage defaultMessage="Lựa chọn" />,
                key: 'options',
                path: '/options',
                permission: [apiConfig.option.getList.permissionCode],
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý chi nhánh" />,
        key: 'branch-management',
        icon: <ApartmentOutlined />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Chi nhánh" />,
                key: 'branches',
                path: '/branches',
                permission: [apiConfig.branch.getList.permissionCode],
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý đơn hàng" />,
        key: 'order-management',
        icon: <HistoryOutlined />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Đơn hàng" />,
                key: 'orders',
                path: '/orders',
                permission: [apiConfig.order.getList.permissionCode],
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý danh mục" />,
        key: 'category-management',
        icon: <InboxOutlined />,
        children: [
            {
                label: <FormattedMessage defaultMessage="Danh mục" />,
                key: 'category',
                path: '/categories',
                permission: [apiConfig.category.getList.permissionCode],
            },
            {
                label: <FormattedMessage defaultMessage="Nhãn" />,
                key: 'tag',
                path: '/tags',
                permission: [apiConfig.tag.getList.permissionCode],
            },
            {
                label: <FormattedMessage defaultMessage="Tỉnh" />,
                key: 'provinces',
                path: '/provinces',
                permission: [apiConfig.tag.getList.permissionCode],
            },
        ],
    },
    {
        label: <FormattedMessage defaultMessage="Quản lý hệ thống" />,
        key: 'system-management',
        icon: <SettingOutlined />,
        permission: [apiConfig.groupPermission.getGroupList.permissionCode],
        children: [
            {
                label: <FormattedMessage defaultMessage="Quyền" />,
                key: 'group-permission',
                path: '/group-permission',
                permission: [apiConfig.groupPermission.getGroupList.permissionCode],
                isSuperAdmin: true,
            },
        ].filter(Boolean),
    },
];
