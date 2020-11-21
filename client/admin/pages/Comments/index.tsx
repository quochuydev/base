import React, { useEffect, useState } from 'react';
import axios from '@blog/client/admin/axios';
import queryString from 'query-string';
import marked from '@blog/client/libs/marked';
import { timeAgo } from '@blog/client/libs/time';
import { Table, Button, Popconfirm, message } from 'antd';
import {
    Wrap,
    ReplyListItem,
    UserAvatar,
    ReplyContent,
    ReplyInfo,
    BaseInfo,
    MarkdownText,
    UserAction,
    Tip,
} from './style';
import { gernateAvatarImage } from '@blog/client/common/helper.util';
import scrollIntoView from '@blog/client/admin/utils/scroll.into.view';
import Router from 'next/router';
import { PanelDiv } from '@blog/client/admin/styles';
import { DeleteFilled, EditFilled, SendOutlined, CommentOutlined, BranchesOutlined } from '@ant-design/icons';
import BasicLayout from '@blog/client/admin/layouts';

export default () => {
    const [state, setState] = useState({
        pagination: { current: 1, total: 0 },
        comments: [],
        selectedRowKeys: [],
        loading: false,
        visiable: false,
    });

    const fetchData = (page = 1, limit = 10) => {
        setState((data) => ({
            ...data,
            loading: true,
        }));
        const query = {
            limit,
            page,
        };
        axios.get('/comments?' + queryString.stringify(query)).then((res) => {
            const pagination = { ...state.pagination };
            pagination.total = res.data.totalCount;
            setState((data) => ({
                ...data,
                comments: res.data.items,
                loading: false,
                pagination,
            }));
            scrollIntoView('comments-panel');
        });
    };
    const deleteComment = (_id) => {
        axios.delete('/comments/' + _id).then(() => {
            message.success('deleteComment');
            fetchData();
        });
    };
    const batchDeleteComment = () => {
        axios
            .delete('/comments', {
                data: { commentIds: state.selectedRowKeys },
            })
            .then((res) => {
                if (res && res.data && res.data.ok === 1 && res.data.deletedCount > 0) {
                    message.success('deleteComment！');
                    setState((data) => ({
                        ...data,
                        selectedRowKeys: [],
                    }));
                    return fetchData();
                }
                return message.error('batchDeleteComment');
            });
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
    }, [1]);
    const getTableColums = () => {
        return [
            {
                title: 'nickName',
                dataIndex: 'nickName',
                width: 160,
            },
            {
                title: 'email',
                dataIndex: 'email',
                width: 100,
            },
            {
                title: 'createdAt',
                dataIndex: 'createdAt',
                width: 140,
                render: (text, record) => timeAgo(record.createdAt),
            },
            {
                title: 'article',
                dataIndex: 'article',
                render: (text, record) => (record.article && record.article.title) || '--',
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
                            onClick={() => Router.push('/admin/content/comments/reply/' + record._id)}
                        >
                            回复
                        </Button>
                        ,
                        <Popconfirm
                            title="onConfirm"
                            onConfirm={() => deleteComment(record._id)}
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
    const expandedRowKeys = state.comments.map((item) => item._id);
    return (
        <BasicLayout>
            <Wrap className="main-content">
                <PanelDiv className="panel" id="comments-panel">
                    <Popconfirm
                        title="onConfirm"
                        placement="right"
                        visible={state.visiable}
                        onVisibleChange={() => {
                            if (state.selectedRowKeys.length <= 0) {
                                message.info('onConfirm');
                                return;
                            }
                            setState((data) => ({
                                ...data,
                                visiable: !state.visiable,
                            }));
                        }}
                        onConfirm={() => batchDeleteComment()}
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
                        rowKey={(record) => record._id}
                        rowSelection={rowSelection}
                        columns={getTableColums()}
                        loading={state.loading}
                        dataSource={state.comments}
                        onChange={(pagination) => handleTableChange(pagination)}
                        pagination={{
                            showTotal: (total) => ` ${total} `,
                        }}
                        expandedRowRender={(record) => {
                            return (
                                <React.Fragment>
                                    {record.reply && (
                                        <div>
                                            <Tip className="tip">
                                                <BranchesOutlined />
                                                BranchesOutlined
                                            </Tip>
                                            <ReplyListItem>
                                                <UserAvatar>
                                                    <img src={gernateAvatarImage(record.reply.nickName)} />
                                                </UserAvatar>
                                                <ReplyContent>
                                                    <ReplyInfo>
                                                        <BaseInfo>
                                                            <div className="reply-author">{record.reply.nickName}</div>
                                                            <a className="reply-time">
                                                                {timeAgo(record.reply.createdAt)}
                                                            </a>
                                                        </BaseInfo>
                                                        <UserAction>
                                                            <Button
                                                                size="small"
                                                                icon={<SendOutlined />}
                                                                onClick={() => {
                                                                    Router.push(
                                                                        '/admin/content/comments/reply/' +
                                                                            record.reply._id
                                                                    );
                                                                }}
                                                            >
                                                                回复
                                                            </Button>
                                                        </UserAction>
                                                    </ReplyInfo>
                                                    <MarkdownText
                                                        className="markdown-body"
                                                        dangerouslySetInnerHTML={{
                                                            __html: marked(record.reply.content),
                                                        }}
                                                    ></MarkdownText>
                                                </ReplyContent>
                                            </ReplyListItem>
                                        </div>
                                    )}

                                    <div style={{ padding: '0 20px' }}>
                                        <Tip className="tip">
                                            <CommentOutlined />
                                            CommentOutlined
                                        </Tip>
                                        <div
                                            className="markdown-body"
                                            dangerouslySetInnerHTML={{
                                                __html: marked(record.content),
                                            }}
                                        ></div>
                                    </div>
                                </React.Fragment>
                            );
                        }}
                        expandedRowKeys={expandedRowKeys}
                    />
                </div>
            </Wrap>
        </BasicLayout>
    );
};
