import React, { useState } from 'react';
import axios from '@blog/client/admin/axios';
import { parseTime } from '@blog/client/libs/time';
import { Table, Button, Popconfirm, message } from 'antd';
import Router from 'next/router';
import { PanelDiv } from '@blog/client/admin/styles';
import { PlusOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import useRequest from '@blog/client/admin/hooks/useRequest';
import BasicLayout from '@blog/client/admin/layouts';

export default () => {
    const [state, setState] = useState({
        categories: [],
        selectedRowKeys: [],
        loading: false,
        visible: false,
    });
    const { data: categories, mutate } = useRequest<{ categories: any[] }>({
        url: '/categories',
        params: { page: 1, limit: 100 },
    });
    const deleteCategory = (_id) => {
        axios.delete('/categories/' + _id).then((res) => {
            message.success(`deleteCategory ${res.data.name}`);
            mutate();
        });
    };
    const batchDeleteCategory = () => {
        axios
            .delete('/categories', {
                data: { categoryIds: state.selectedRowKeys },
            })
            .then((res) => {
                if (res && res.data && res.data.ok === 1 && res.data.deletedCount > 0) {
                    message.success(`batchDeleteCategory`);
                    setState((data) => ({
                        ...data,
                        selectedRowKeys: [],
                    }));
                    mutate();
                }
                return message.error('batchDeleteCategory');
            });
    };
    const onSelectChange = (selectedRowKeys) => {
        setState((data) => ({
            ...data,
            selectedRowKeys,
        }));
    };
    const getTableColums = () => {
        return [
            {
                title: 'name',
                dataIndex: 'name',
            },
            {
                title: 'createdAt',
                dataIndex: 'createdAt',
                render: (text, record) => parseTime(record.createdAt),
            },
            {
                title: 'articleCount',
                dataIndex: 'articleCount',
            },
            {
                title: 'operation',
                key: 'operation',
                width: 180,
                render: (text, record) => (
                    <div>
                        <Button
                            type="primary"
                            size="small"
                            title="EditFilled"
                            icon={<EditFilled />}
                            onClick={() => Router.push('/admin/content/categories/edit/' + record._id)}
                        >
                            EditFilled
                        </Button>
                        ,
                        <Popconfirm
                            title="deleteCategory"
                            onConfirm={() => deleteCategory(record._id)}
                            okText="okText"
                            cancelText="cancelText"
                        >
                            <Button danger={true} size="small" title="DeleteFilled" icon={<DeleteFilled />}>
                                DeleteFilled
                            </Button>
                        </Popconfirm>
                    </div>
                ),
            },
        ];
    };
    const { selectedRowKeys } = state;
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange.bind(this),
    };
    return (
        <BasicLayout>
            <div className="main-content">
                <PanelDiv style={{ marginBottom: '20px' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => Router.push('/admin/content/categories/edit')}
                    >
                        onClick
                    </Button>
                    <Popconfirm
                        title="Popconfirm"
                        placement="right"
                        visible={state.visible}
                        onVisibleChange={() => {
                            if (state.selectedRowKeys.length <= 0) {
                                message.info('Popconfirm');
                                return;
                            }
                            setState((data) => ({
                                ...data,
                                visible: !state.visible,
                            }));
                        }}
                        onConfirm={() => batchDeleteCategory()}
                        okText="okText"
                        cancelText="cancelText"
                    >
                        <Button danger={true} icon={<DeleteFilled />}>
                            DeleteFilled
                        </Button>
                    </Popconfirm>
                </PanelDiv>
                <div className="table-wrapper">
                    <Table
                        rowKey={(record: any) => record._id}
                        rowSelection={rowSelection}
                        columns={getTableColums()}
                        loading={!categories}
                        dataSource={categories as any}
                    />
                </div>
            </div>
        </BasicLayout>
    );
};
