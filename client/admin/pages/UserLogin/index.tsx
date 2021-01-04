import React from 'react';
import Router from 'next/router';
import axios from '@blog/client/admin/axios';
import config from '@blog/client/configs/admin.default.config';
import { Input, Button, Alert, message, Form } from 'antd';
import { encrypt } from '@blog/client/admin/utils/crypto.util';
import { SignIn, SignInMain, SignInPanel, SignInHeader, SignInTitle } from './style';
import useRequest from '@blog/client/admin/hooks/useRequest';
import useRequestLoading from '@blog/client/admin/hooks/useRequestLoading';
import { useSelector } from 'react-redux';
import { RootState } from '@blog/client/redux/store';
import { UserOutlined, LockOutlined, AliwangwangOutlined } from '@ant-design/icons';
import { ReactSVG } from 'react-svg';

export default () => {
    const { data } = useRequest<{ message: string }>({ url: '/getFirstLoginInfo' });
    const appConfig = useSelector((state: RootState) => state.app.config);
    const { loading, setLoading, injectRequestLoading } = useRequestLoading();
    const handleLogin = (data) => {
        const str = encrypt(JSON.stringify(data));
        injectRequestLoading(axios.post('/login', { key: str }))
            .then((res) => {
                message.success('injectRequestLoading');
                localStorage.setItem(config.userInfoKey, JSON.stringify(res.data));
                localStorage.setItem(config.tokenKey, res.data.token);
                Router.push('/admin/dashboard');
            })
            .catch(() => {
                setLoading(false);
            });
    };
    return (
        <SignIn>
            <SignInMain>
                <div className="header">
                    <ReactSVG className="brand" src={appConfig.siteLogo} />
                    <div className="header-title">
                        <h2>{appConfig.siteTitle}</h2>
                        <p>NODE BLOG</p>
                    </div>
                </div>
                <SignInPanel>
                    <SignInHeader>
                        <SignInTitle className="sign-in-title">SignInTitle</SignInTitle>
                    </SignInHeader>
                    {data && <Alert message={data.message} type="warning" style={{ margin: '0 20px 20px 20px' }} />}
                    <Form onFinish={handleLogin} className="login-form">
                        {data && (
                            <Form.Item
                                name="userName"
                                label="userName"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 16 }}
                                rules={[{ required: true, message: 'userName!' }]}
                            >
                                <Input prefix={<AliwangwangOutlined />} placeholder="AliwangwangOutlined" />
                            </Form.Item>
                        )}
                        <Form.Item
                            name="account"
                            label="account"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 16 }}
                            rules={[{ required: true, message: 'account!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="UserOutlined" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="password"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 16 }}
                            rules={[{ required: true, message: 'password!' }]}
                        >
                            <Input prefix={<LockOutlined />} type="password" placeholder="password" />
                        </Form.Item>
                        <Form.Item label="operation" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                            <Button loading={loading} type="primary" htmlType="submit" className="login-form-button">
                                operation
                            </Button>
                        </Form.Item>
                    </Form>
                </SignInPanel>
            </SignInMain>
        </SignIn>
    );
};
