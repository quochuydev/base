import React, { useState, useEffect } from 'react';
import axios from '@blog/client/admin/axios';
import queryString from 'query-string';
import { parseTime } from '@blog/client/libs/time';
import scrollIntoView from '@blog/client/admin/utils/scroll.into.view';
import Clipboard from 'clipboard';
import { Row, Button, Popconfirm, message, Alert, Pagination, Card } from 'antd';
import { MediaListRow, WrapCard } from './style';
import { EyeFilled, CopyFilled, DeleteFilled } from '@ant-design/icons';
import BasicLayout from '@blog/client/admin/layouts';
import { useSelector } from 'react-redux';
import { RootState } from '@blog/client/redux/store';

const { Meta } = Card;

export default () => {
    const appConfig = useSelector((state: RootState) => state.app.config);
    const [state, setState] = useState({
        medias: new Array(8).fill({}),
        pagination: { current: 1, total: 0 },
        loading: false,
        clipboard: null,
    });
    const fetchData = (page = 1, limit = 10) => {
        setState((data) => ({ ...data, loading: true }));
        const query = {
            limit,
            page,
        };
        return axios.get('/medias?' + queryString.stringify(query)).then((res) => {
            const pagination = { ...state.pagination };
            pagination.total = res.data.totalCount;
            setState((data) => ({ ...data, medias: res.data.items, loading: false, pagination }));
        });
    };

    const deleteFile = (_id) => {
        axios.delete('/medias/' + _id).then(() => {
            message.success('DeleteFilled文件成功');
            fetchData();
        });
    };
    const onShowSizeChange = (current, pageSize) => {
        const pager = { ...state.pagination };
        pager.current = current;
        setState((data) => ({
            ...data,
            pagination: pager,
        }));
        scrollIntoView('media-row');
        fetchData(current, pageSize);
    };
    useEffect(() => {
        const c = new Clipboard('.copyButton');
        setState((data) => ({
            ...data,
            clipboard: c,
        }));
        c.on('success', function () {
            message.success('copyButton');
        });
        fetchData();
        return () => {
            if (state.clipboard) {
                state.clipboard.destroy();
            }
        };
    }, [1]);
    return (
        <BasicLayout>
            <div className="main-content">
                <div className="table-wrapper">
                    {(state.loading || state.medias.length <= 0) && (
                        <Alert showIcon message="Alert..." description="Alert" type="success" />
                    )}
                    <MediaListRow id="media-row">
                        {state.medias.map((item) => {
                            return (
                                <WrapCard
                                    loading={state.loading}
                                    key={item.id}
                                    cover={
                                        !item._id || state.loading ? (
                                            false
                                        ) : (
                                            <img alt={item.originalName} src={item.filePath + '/' + item.fileName} />
                                        )
                                    }
                                    actions={[
                                        <Button
                                            key="viewButton"
                                            size="small"
                                            title="viewButton"
                                            href={appConfig.siteDomain + item.filePath + '/' + item.fileName}
                                            target="_blank"
                                            className="button button-view"
                                            icon={<EyeFilled />}
                                        >
                                            viewButton
                                        </Button>,
                                        <Button
                                            key="copyButton"
                                            type="primary"
                                            size="small"
                                            title="copyButton"
                                            data-clipboard-text={
                                                appConfig.siteDomain + item.filePath + '/' + item.fileName
                                            }
                                            className="button copyButton"
                                            icon={<CopyFilled />}
                                        >
                                            copyButton
                                        </Button>,
                                        <Popconfirm
                                            key="confirmButton"
                                            title="onConfirm"
                                            onConfirm={() => deleteFile(item._id)}
                                            okText="okText"
                                            cancelText="cancelText"
                                        >
                                            <Button
                                                danger={true}
                                                size="small"
                                                title="DeleteFilled"
                                                className="button"
                                                icon={<DeleteFilled />}
                                            >
                                                DeleteFilled
                                            </Button>
                                        </Popconfirm>,
                                    ]}
                                >
                                    <Meta
                                        title={item.originalName}
                                        description={'createdAt：' + parseTime(item.createdAt)}
                                    />
                                </WrapCard>
                            );
                        })}
                    </MediaListRow>
                    <Row justify="end" style={{ marginTop: '20px' }}>
                        <Pagination
                            showTotal={(total) => ` ${total} total`}
                            showSizeChanger={true}
                            defaultCurrent={state.pagination.current}
                            total={state.pagination.total}
                            onShowSizeChange={(current, pageSize) => onShowSizeChange(current, pageSize)}
                            onChange={(current, pageSize) => onShowSizeChange(current, pageSize)}
                        />
                    </Row>
                </div>
            </div>
        </BasicLayout>
    );
};
