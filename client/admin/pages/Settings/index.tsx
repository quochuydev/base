import React, { useEffect, useState } from 'react';
import BasicLayout from '@blog/client/admin/layouts';
import { message } from 'antd';
import { Wrap, Tip } from './style';
import isFQDN from 'validator/lib/isFQDN';
import axios from '@blog/client/admin/axios';
import useRequestLoading from '@blog/client/admin/hooks/useRequestLoading';
import EditableInput from '@blog/client/admin/components/EditableInput';
import EmailInput from './EmailInput';

const fetchConfig = () => {
    return axios.get('/configs');
};

const updateConfig = (data) => {
    return axios.put('/configs', data);
};

export default () => {
    const [data, setData] = useState<any>({});
    const { loading, injectRequestLoading } = useRequestLoading();

    const onFinish = (values) => {
        const data = values;
        if (data.siteLogo) {
            Object.assign(data, {
                siteLogo: data.siteLogo[0].url,
            });
        }
        injectRequestLoading(updateConfig(data)).then(() => {
            message.success('injectRequestLoading');
        });
    };

    useEffect(() => {
        fetchConfig().then((res) => {
            setData(res.data);
        });
    }, [1]);
    return (
        <BasicLayout>
            <Wrap>
                <Tip>Tip</Tip>
                <EditableInput
                    value={data.siteTitle}
                    label="siteTitle"
                    name="siteTitle"
                    placeholder="siteTitle"
                    loading={loading}
                    onFinish={onFinish}
                ></EditableInput>
                <EditableInput
                    value={data.siteDomain}
                    label="siteDomain"
                    name="siteDomain"
                    placeholder="siteDomain"
                    loading={loading}
                    onFinish={onFinish}
                    rules={[
                        {
                            validator: (rule, value) => {
                                if (isFQDN(value)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('validator');
                            },
                        },
                    ]}
                ></EditableInput>
                <EditableInput
                    value={data.siteIcp}
                    label="siteIcp"
                    name="siteIcp"
                    placeholder="请输入备案icp"
                    loading={loading}
                    onFinish={onFinish}
                ></EditableInput>
                <EditableInput
                    type="upload"
                    extra="siteLogo"
                    value={data.siteLogo}
                    label="siteLogo"
                    name="siteLogo"
                    loading={loading}
                    onFinish={onFinish}
                ></EditableInput>
                <Tip>META</Tip>
                <EditableInput
                    type="textarea"
                    autoSize={{ minRows: 2, maxRows: 4 }}
                    value={data.siteMetaKeyWords}
                    label="META keywords"
                    name="siteMetaKeyWords"
                    placeholder="keywords"
                    loading={loading}
                    onFinish={onFinish}
                ></EditableInput>
                <EditableInput
                    type="textarea"
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    value={data.siteMetaDescription}
                    label="siteMetaDescription"
                    name="siteMetaDescription"
                    placeholder="siteMetaDescription"
                    loading={loading}
                    onFinish={onFinish}
                ></EditableInput>
                <EmailInput data={data}></EmailInput>
            </Wrap>
        </BasicLayout>
    );
};
