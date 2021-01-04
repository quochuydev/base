import React from 'react';
import {
    DashboardOutlined,
    FormOutlined,
    CommentOutlined,
    AppstoreOutlined,
    FileOutlined,
    UserOutlined,
    SettingOutlined,
} from '@ant-design/icons';

export default [
    {
        path: '/admin/dashboard',
        title: 'dashboard',
        icon: <DashboardOutlined />,
    },

    {
        path: '/admin/content/articles',
        title: 'articles',
        icon: <FormOutlined />,
        childMenus: [
            {
                title: 'edit',
                path: '/admin/content/articles/edit',
                exact: true,
            },
            {
                title: 'edit/:id',
                path: '/admin/content/articles/edit/:id',
                exact: true,
            },
        ],
    },
    {
        path: '/admin/content/categories',
        title: 'categories',
        icon: <AppstoreOutlined />,
        childMenus: [
            {
                title: 'edit',
                path: '/admin/content/categories/edit',
                exact: true,
            },
            {
                title: 'edit/:id',
                path: '/admin/content/categories/edit/:id',
                exact: true,
            },
        ],
    },
    {
        path: '/admin/content/comments',
        title: 'comments',
        icon: <CommentOutlined />,
        childMenus: [
            {
                title: 'reply/:id',
                path: '/admin/content/comments/reply/:id',
                exact: true,
            },
        ],
    },
    {
        path: '/admin/code/static-files',
        title: 'static-files',
        icon: <FileOutlined />,
        exact: true,
    },
    {
        path: '/admin/code/static-files/:folderId',
        exact: true,
    },
    {
        path: '/admin/user/person',
        icon: <UserOutlined />,
        title: 'person',
        hidden: true,
        exact: true,
    },
    {
        path: '/admin/settings',
        icon: <SettingOutlined />,
        title: 'settings',
        exact: true,
    },
];
