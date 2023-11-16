import React, { Component, useEffect } from 'react';
import { Button, notification, Space } from 'antd';
import PropTypes from 'prop-types';

import './Notification.css';

const NotificationManager = ({
    isSuccess,
    isWarning,
    successMessage,
    warningMessage,
    warningActionHandler,
}) => {
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        const btn = (
            <Space>
                <Button
                    type="primary"
                    size="small"
                    onClick={() => warningActionHandler()}
                >
                    Confirm
                </Button>
            </Space>
        );
        if (isSuccess) {
            api.success({
                message: 'Success message',
                description: successMessage,
                duration: 4,
            });
        } else if (isWarning) {
            api.warning({
                message: 'Warning message',
                description: warningMessage,
                btn,
                duration: 7,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [api, isSuccess, isWarning, successMessage, warningMessage]);

    return contextHolder;
};

export default class Notification extends Component {
    render() {
        const {
            isSuccess,
            successMessage,
            isWarning,
            warningMessage,
            warningActionHandler,
        } = this.props;

        return (
            <>
                <NotificationManager
                    isSuccess={isSuccess}
                    successMessage={successMessage}
                    isWarning={isWarning}
                    warningMessage={warningMessage}
                    warningActionHandler={warningActionHandler}
                />
            </>
        );
    }
}

Notification.defaultProps = {
    isSuccess: false,
    isWarning: false,
    successMessage: '',
    warningMessage: '',
    warningActionHandler: () => {},
};

Notification.propTypes = {
    isSuccess: PropTypes.bool,
    isWarning: PropTypes.bool,
    successMessage: PropTypes.string,
    warningMessage: PropTypes.string,
    warningActionHandler: PropTypes.func,
};
