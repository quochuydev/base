import React from 'react';
import { Form, Input, Button, message, Popconfirm } from 'antd';
import axios from '@blog/client/admin/axios';
import { encrypt } from '@blog/client/admin/utils/crypto.util';
import { useForm } from 'antd/lib/form/util';

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const resetPassword = (data) => {
    return axios.put('/user/reset-password', data);
};

export default () => {
    const [form] = useForm();
    return (
        <Form
            form={form}
            layout="vertical"
            name="passwrodForm"
            scrollToFirstError
            style={{ maxWidth: '540px', margin: '0 auto', width: '100%' }}
            onFinish={(data) => {
                const password = data.password;
                const str = encrypt(JSON.stringify({ password }));
                resetPassword({ key: str }).then(() => {
                    message.success('resetPassword');
                });
            }}
        >
            <Form.Item
                name="password"
                label="password"
                extra="password"
                rules={[
                    {
                        required: true,
                        message: 'required!',
                    },
                ]}
                hasFeedback
            >
                <Input.Password size="large" placeholder="password" />
            </Form.Item>
            <Form.Item
                name="confirm"
                label="confirm"
                extra="confirm"
                dependencies={['password']}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'message!',
                    },
                    ({ getFieldValue }) => ({
                        validator(rule, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject('validator!');
                        },
                    }),
                ]}
            >
                <Input.Password size="large" placeholder="Password" />
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                <Popconfirm title="submit" okText="okText" cancelText="cancelText" onConfirm={() => form.submit()}>
                    <Button type="primary" danger={true}>
                        submit
                    </Button>
                </Popconfirm>
            </Form.Item>
        </Form>
    );
};
