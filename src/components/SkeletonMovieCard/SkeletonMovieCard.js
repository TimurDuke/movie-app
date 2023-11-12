import React, { Component } from 'react';
import { Card, Skeleton, Space } from 'antd';

import './SkeletonMovieCard.css';

const { Button, Input, Image } = Skeleton;

class SkeletonMovieCard extends Component {
    render() {
        return (
            <>
                <Card
                    className="card"
                    bodyStyle={{ height: '100%', padding: '0' }}
                >
                    <Space>
                        <div className="left-block">
                            <Image active style={{ height: '100%' }} />
                        </div>
                        <div className="right-block">
                            <Skeleton
                                title={{ width: '50%' }}
                                paragraph={{ rows: 1 }}
                                active
                            />
                            <Button
                                style={{ marginBottom: 12 }}
                                active
                                size="small"
                            />
                            <div className="description">
                                <Input active size="default" />
                                <Input active size="default" />
                                <Input active size="default" />
                            </div>
                        </div>
                    </Space>
                </Card>
            </>
        );
    }
}

export default SkeletonMovieCard;
