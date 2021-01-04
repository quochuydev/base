import React, { useEffect } from 'react';
import { message } from 'antd';
import { Form, Input, Alert, Button, Divider } from 'antd';
import axios from '@blog/client/admin/axios';
import useImageUpload from '@blog/client/admin/hooks/useImageUpload';
import useRequestLoading from '@blog/client/admin/hooks/useRequestLoading';

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

const getLoginInfo = () => {
    return axios.get('/user/login-info');
};

const updateUserInfo = (data) => {
    return axios.put('/user/update', data);
};

export default () => {
    const { loading, injectRequestLoading } = useRequestLoading();
    const { setImageUrl, UploadButton, handleUpload } = useImageUpload({
        style: {
            width: '70px',
            height: '70px',
            borderRadius: '50%',
        },
    });
    const [form] = Form.useForm();

    useEffect(() => {
        getLoginInfo().then((res) => {
            const avatar = [
                {
                    uid: -1,
                    status: 'done',
                    url: res.data.avatar,
                },
            ];
            setImageUrl(res.data.avatar);
            form.setFieldsValue({ ...res.data, avatar });
        });
    }, [1]);

    const onFinish = (values) => {
        return injectRequestLoading(updateUserInfo({ ...values, avatar: values.avatar[0].url })).then(() => {
            message.success('onFinish');
        });
    };

    return (
        <Form
            layout="vertical"
            form={form}
            name="UserForm"
            onFinish={onFinish}
            scrollToFirstError
            style={{ maxWidth: '540px', margin: '0 auto', width: '100%' }}
        >
            <Alert message="warning" type="warning" showIcon={true} style={{ marginBottom: '10px' }} />
            <Form.Item
                required={true}
                label="avatar"
                name="avatar"
                valuePropName="fileList"
                getValueFromEvent={handleUpload}
                rules={[{ required: true, message: 'avatar!' }]}
            >
                <UploadButton></UploadButton>
            </Form.Item>
            <Form.Item
                name="userName"
                label="userName"
                extra="userName"
                rules={[{ required: true, message: 'Please input your nickname!', whitespace: true }]}
            >
                <Input size="large" placeholder="userName" />
            </Form.Item>
            <Form.Item
                name="email"
                label="email"
                extra="email"
                rules={[
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
                    {
                        required: true,
                        message: 'Please input your E-mail!',
                    },
                ]}
            >
                <Input size="large" placeholder="email" />
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                <Button loading={loading} type="primary" htmlType="submit">
                    submit
                </Button>
            </Form.Item>
            <Divider />
        </Form>
    );
};
