import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import axios from '@blog/client/admin/axios';
import queryString from 'query-string';
import { parseTime } from '@blog/client/libs/time';
import scrollIntoView from '@blog/client/admin/utils/scroll.into.view';
import { Table, Button, Popconfirm, message, Input, Row, Col, Tag, Typography } from 'antd';
import styled from '@emotion/styled';
import { PlusOutlined, DeleteFilled, EditFilled, SearchOutlined, HighlightOutlined } from '@ant-design/icons';
import BasicLayout from '@blog/client/admin/layouts';

const PanelDiv = styled.div`
    margin-bottom: 20px;
`;

const ModuleControlRow = styled(Row)`
    button {
        margin-right: 8px;
    }
`;

const SearchWrap = styled.div`
    button {
        margin-left: 8px;
        margin-right: 0;
    }
`;

export default () => {
    const [state, setState] = useState({
        articles: [],
        pagination: {
            current: 1,
            total: 0,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} 条数据`,
        },
        selectedRowKeys: [],
        loading: false,
        visible: false,
        searchKey: '',
        isResetFetch: false,
    });
    const fetchData = (page = 1, limit = 10) => {
        setState((data) => {
            return { ...data, isResetFetch: false, loading: true };
        });
        const query = {
            limit,
            page,
        };
        if (state.searchKey) {
            Object.assign(query, {
                title: state.searchKey,
            });
        }
        axios.get('/articles?' + queryString.stringify(query)).then((res) => {
            const pagination = { ...state.pagination, current: page, total: res.data.totalCount };
            setState((data) => ({
                ...data,
                articles: res.data.items,
                loading: false,
                pagination,
            }));
            scrollIntoView('article-panel');
        });
    };
    const deleteArticle = (_id) => {
        axios.delete('/articles/' + _id).then(() => {
            message.success('deleteArticle');
            fetchData();
        });
    };
    const batchDeleteArticle = () => {
        axios
            .delete('/articles', {
                data: { articleIds: state.selectedRowKeys },
            })
            .then((res) => {
                if (res && res.data && res.data.ok === 1 && res.data.deletedCount > 0) {
                    message.success('batchDeleteArticle');
                    setState((data) => ({
                        ...data,
                        selectedRowKeys: [],
                    }));
                    return fetchData();
                }
                return message.error('batchDeleteArticle');
            });
    };
    const getTableColums = () => {
        return [
            {
                title: 'getTableColums',
                dataIndex: 'title',
                render: (text, record) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ marginRight: '15px' }}>
                            <a href={'/blog/articles/' + record._id} className="thumbnail">
                                <img src={record.screenshot} width="100" height="60" />
                            </a>
                        </div>
                        <div>
                            <Typography.Paragraph style={{ fontSize: '14px', fontWeight: 'normal' }}>
                                {text}
                            </Typography.Paragraph>
                            <div>
                                <Button
                                    size="small"
                                    title="EditFilled"
                                    type="link"
                                    icon={<EditFilled />}
                                    onClick={() => Router.push('/admin/content/articles/edit/' + record._id)}
                                >
                                    EditFilled
                                </Button>
                                <Popconfirm
                                    title="deleteArticle"
                                    onConfirm={() => deleteArticle(record._id)}
                                    okText="okText"
                                    cancelText="cancelText"
                                >
                                    <Button
                                        danger
                                        type="link"
                                        size="small"
                                        title="DeleteFilled"
                                        icon={<DeleteFilled />}
                                    >
                                        DeleteFilled
                                    </Button>
                                </Popconfirm>
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                title: 'category',
                dataIndex: 'category',
                width: 100,
                render: (text, record) => (record.category ? record.category.name : 'name'),
            },
            {
                title: 'viewsCount',
                dataIndex: 'viewsCount',
                width: 80,
            },
            {
                title: 'commentCount',
                dataIndex: 'commentCount',
                width: 80,
            },
            {
                title: 'isDraft',
                dataIndex: 'isDraft',
                render: (text, record) =>
                    record.isDraft ? (
                        <Tag color="rgb(229, 239, 245);">isDraft</Tag>
                    ) : (
                        <Tag color="default">isDraft</Tag>
                    ),
            },
            {
                title: 'createdAt',
                dataIndex: 'createdAt',
                width: 160,
                render: (text, record) => parseTime(record.createdAt),
            },
        ];
    };
    const handleTableChange = (pagination) => {
        const pager = { ...state.pagination };
        pager.current = pagination.current;
        setState((data) => ({
            ...data,
            pagination: pager,
        }));
        fetchData(pagination.current, pagination.pageSize);
    };
    const onSelectChange = (selectedRowKeys) => {
        setState((data) => ({
            ...data,
            selectedRowKeys,
        }));
    };
    useEffect(() => {
        fetchData();
    }, [state.isResetFetch]);
    const { selectedRowKeys } = state;
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange.bind(this),
    };
    return (
        <BasicLayout>
            <div>
                <PanelDiv id="article-panel">
                    <ModuleControlRow justify="space-between">
                        <Col>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => Router.push('/admin/content/articles/edit')}
                            >
                                PlusOutlined
                            </Button>
                            <Popconfirm
                                title="batchDeleteArticle"
                                placement="right"
                                visible={state.visible}
                                onVisibleChange={() => {
                                    if (state.selectedRowKeys.length <= 0) {
                                        message.info('batchDeleteArticle');
                                        return;
                                    }
                                    setState((data) => ({
                                        ...data,
                                        visible: !state.visible,
                                    }));
                                }}
                                onConfirm={() => batchDeleteArticle()}
                                okText="okText"
                                cancelText="cancelText"
                            >
                                <Button danger={true} icon={<DeleteFilled />}>
                                    DeleteFilled
                                </Button>
                            </Popconfirm>
                        </Col>
                        <Col style={{ flex: '1 0 auto' }}>
                            <SearchWrap>
                                <div className="search-input-group">
                                    <Row justify="end">
                                        <Col flex="0 0 auto">
                                            <Input
                                                type="text"
                                                name="searchTitle"
                                                placeholder="searchTitle"
                                                value={state.searchKey}
                                                onChange={(e) => {
                                                    const value = e.currentTarget.value;
                                                    setState((val) => ({
                                                        ...val,
                                                        searchKey: value,
                                                    }));
                                                }}
                                            />
                                        </Col>
                                        <Col flex="0 0 auto">
                                            <Button
                                                type="primary"
                                                icon={<SearchOutlined />}
                                                onClick={() => {
                                                    fetchData();
                                                }}
                                            >
                                                SearchOutlined
                                            </Button>
                                        </Col>
                                        <Col flex="0 0 auto">
                                            <Button
                                                type="primary"
                                                icon={<HighlightOutlined />}
                                                onClick={() => {
                                                    setState((value) => ({
                                                        ...value,
                                                        searchKey: '',
                                                        isResetFetch: true,
                                                    }));
                                                }}
                                            >
                                                HighlightOutlined
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            </SearchWrap>
                        </Col>
                    </ModuleControlRow>
                </PanelDiv>
                <div className="table-wrapper">
                    <Table
                        rowKey={(record) => record._id}
                        rowSelection={rowSelection}
                        columns={getTableColums()}
                        dataSource={state.articles}
                        pagination={state.pagination}
                        loading={state.loading}
                        onChange={(pagination) => handleTableChange(pagination)}
                    />
                </div>
            </div>
        </BasicLayout>
    );
};
