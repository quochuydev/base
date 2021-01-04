import React, { useState, useEffect } from 'react';
import axios from '@blog/client/admin/axios';
import { parseTime } from '@blog/client/libs/time';
import marked from '@blog/client/libs/marked';
import { Form, Input, Button, message } from 'antd';
import Router, { useRouter } from 'next/router';
import BasicLayout from '@blog/client/admin/layouts';

export default () => {
    const [comment, setComment] = useState({
        article: {
            _id: '',
            title: '',
        },
        content: '',
        nickName: '',
        email: '',
        createdAt: '',
    });
    const router = useRouter();
    const [form] = Form.useForm();
    useEffect(() => {
        const { id } = router.query;
        if (id) {
            axios.get('/comments/' + id).then((res) => {
                const comment = res.data;
                form.setFieldsValue({
                    article: comment.article._id,
                });
                setComment(comment);
            });
        }
    }, [1]);

    const publish = (data) => {
        const { id } = router.query;
        Object.assign(data, { reply: id });
        axios.post('/admin/reply-comment/', data).then(() => {
            message.success('publish');
            Router.push('/admin/content/comments');
        });
    };

    return (
        <BasicLayout>
            <div className="main-content">
                <Form form={form} onFinish={publish} style={{ marginTop: '20px' }}>
                    <Form.Item name="article" style={{ display: 'none' }}>
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 10 }} label="nickName：">
                        <span className="ant-form-text">{comment.nickName}</span>
                    </Form.Item>
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 10 }} label="email：">
                        <span className="ant-form-text">{comment.email}</span>
                    </Form.Item>
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 10 }} label="createdAt：">
                        <span className="ant-form-text">{parseTime(comment.createdAt)}</span>
                    </Form.Item>
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 10 }} label="article：">
                        <span className="ant-form-text">{comment.article && comment.article.title}</span>
                    </Form.Item>
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 10 }} label="content">
                        <span
                            className="ant-form-text"
                            dangerouslySetInnerHTML={{ __html: marked(comment.content) }}
                        ></span>
                    </Form.Item>
                    <Form.Item
                        name="content"
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 10 }}
                        label="content"
                        rules={[
                            {
                                required: true,
                                message: 'required',
                                min: 1,
                            },
                        ]}
                    >
                        <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }}></Input.TextArea>
                    </Form.Item>
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 10 }} label="operation：">
                        <Button type="primary" htmlType="submit">
                            submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </BasicLayout>
    );
};
