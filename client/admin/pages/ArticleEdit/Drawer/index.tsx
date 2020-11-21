import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Select, Button, Drawer } from 'antd';
import axios from '@blog/client/admin/axios';
import EditableTagGroup from '@blog/client/admin/components/EditableTagGroup';
import { DeleteFilled, SendOutlined } from '@ant-design/icons';
import useImageUpload from '@blog/client/admin/hooks/useImageUpload';

import { DrawerContent } from './style';

const Option = Select.Option;
const { TextArea } = Input;

export default ({ visible, onCancel, formData }) => {
    const { setImageUrl, UploadButton, handleUpload } = useImageUpload({
        style: {
            width: '100%',
            minHeight: '80px',
        },
    });
    const [categories, setCategories] = useState([]);
    const [form] = Form.useForm();

    const prevVisibleRef = useRef();
    useEffect(() => {
        prevVisibleRef.current = visible;
    }, [visible]);
    const prevVisible = prevVisibleRef.current;

    useEffect(() => {
        if (formData) {
            setImageUrl(formData.imgUrl);
        }
        if (!visible && prevVisible) {
            form.resetFields();
        }
    }, [visible]);

    useEffect(() => {
        axios.get('/categories/').then((res) => {
            setCategories(res.data);
        });
    }, [1]);

    const categoryOptions =
        categories &&
        categories.map((category) => (
            <Option key={category._id} value={category._id}>
                {category.name}
            </Option>
        ));

    return (
        <Drawer
            width="340px"
            title="onCancel"
            placement="right"
            onClose={() => {
                if (onCancel) {
                    onCancel(false);
                }
            }}
            visible={visible}
        >
            <DrawerContent>
                <Form layout="vertical" form={form} name="articleConfigForm" initialValues={formData}>
                    <Form.Item
                        required={true}
                        label="handleUpload"
                        name="screenshot"
                        valuePropName="fileList"
                        getValueFromEvent={handleUpload}
                        rules={[{ required: true, message: 'handleUpload!' }]}
                    >
                        <UploadButton></UploadButton>
                    </Form.Item>
                    <Form.Item name="category" label="category" rules={[{ required: true, message: 'category!' }]}>
                        <Select placeholder="category">{categoryOptions}</Select>
                    </Form.Item>
                    <Form.Item name="tags" label="tags">
                        <EditableTagGroup />
                    </Form.Item>
                    <Form.Item
                        name="summary"
                        label="summary"
                        rules={[{ required: true, message: 'summary!', max: 800 }]}
                    >
                        <TextArea placeholder="summary" rows={4}></TextArea>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" type="link">
                            <SendOutlined />
                            SendOutlined
                        </Button>
                        <Button type="link" danger>
                            <DeleteFilled />
                            DeleteFilled
                        </Button>
                    </Form.Item>
                </Form>
            </DrawerContent>
        </Drawer>
    );
};
