import React from 'react';
import { Card, List } from 'antd';
import styled from '@emotion/styled';
import { timeAgo } from '@blog/client/libs/time';

const LoginLogPanelCard = styled(Card)``;

interface Props {
    loading: boolean;
    recentAdminLogs: any[];
}

export default (props: Props) => {
    const { recentAdminLogs = [], loading = false } = props;
    return (
        <LoginLogPanelCard style={{ marginBottom: 14 }} bordered={false} title="operation" loading={loading}>
            <div>
                {recentAdminLogs.map((item: any) => (
                    <List.Item key={item._id} style={{ borderBottom: '1px solid #ccc' }}>
                        <List.Item.Meta
                            title={<span>{item.data}</span>}
                            description={
                                <span title={item.updatedAt}>
                                    {timeAgo(item.createdAt)} · {item.type}
                                </span>
                            }
                        />
                    </List.Item>
                ))}
            </div>
        </LoginLogPanelCard>
    );
};
