import React, { useEffect, useState } from 'react';
import { Input, Form, Button, Switch, message } from 'antd';
import { EditOutlined, SendOutlined, CloseOutlined, CheckOutlined, SoundOutlined } from '@ant-design/icons';
import { useForm } from 'antd/lib/form/util';
import useRequestLoading from '@blog/client/admin/hooks/useRequestLoading';
import axios from '@blog/client/admin/axios';
import { Tip } from './style';

interface Props {
    data?: object;
}

const testEmail = () => {
    return axios.post('/email/test');
};

const updateEmailConfig = (data) => {
    return axios.put('/email', data);
};

export default (props: Props) => {
    const { data } = props;
    const [disabled, setDisabled] = useState(true);
    const { loading, injectRequestLoading } = useRequestLoading();
    const [form] = useForm();
    const onFinish = (values) => {
        injectRequestLoading(updateEmailConfig(values)).then(() => {
            message.success('updateEmailConfig');
        });
    };
    useEffect(() => {
        form.setFieldsValue(data);
    }, [data]);
    return (
        <Form form={form} className="form" layout="vertical" onFinish={onFinish} wrapperCol={{ span: 16 }}>
            <Tip>
                网站邮箱服务通知配置
                {disabled && (
                    <Button
                        type="link"
                        danger={true}
                        onClick={() => {
                            setDisabled(!disabled);
                        }}
                    >
                        <EditOutlined></EditOutlined>EditFilled
                    </Button>
                )}
            </Tip>
            <Form.Item label="smtpHost" name="smtpHost">
                <Input size="large" placeholder="请输入邮箱smtp地址" disabled={disabled} />
            </Form.Item>
            <Form.Item label="smtpAuthUser" name="smtpAuthUser">
                <Input size="large" placeholder="请输入邮箱地址" disabled={disabled} />
            </Form.Item>
            <Form.Item label="smtpAuthpass" name="smtpAuthpass">
                <Input.Password size="large" placeholder="Password" disabled={disabled} />
            </Form.Item>
            <Form.Item name="isEnableSmtp" valuePropName="checked" label="isEnableSmtp" extra="isEnableSmtp">
                <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} disabled={disabled} />
            </Form.Item>
            {!disabled && (
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: '10px' }}>
                        <SendOutlined></SendOutlined>submit
                    </Button>
                    <Button
                        loading={loading}
                        onClick={() => {
                            injectRequestLoading(testEmail()).then((res) => {
                                if (res && res.data === true) {
                                    return message.success('injectRequestLoading');
                                }
                                message.error('injectRequestLoading');
                            });
                        }}
                    >
                        <SoundOutlined />
                        Button
                    </Button>
                </Form.Item>
            )}
        </Form>
    );
};
