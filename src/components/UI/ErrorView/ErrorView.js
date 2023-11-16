import React, { Component } from 'react';
import { Alert } from 'antd';
import PropTypes from 'prop-types';

export default class ErrorView extends Component {
    render() {
        const { title, description, isClosable } = this.props;

        return (
            <Alert
                style={{
                    position: 'absolute',
                    top: '20%',
                    left: '50%',
                    translate: '-50% 0',
                    width: '50%',
                    zIndex: '100',
                }}
                message={title}
                showIcon
                description={description}
                type="error"
                closable={isClosable}
            />
        );
    }
}

ErrorView.defaultProps = {
    isClosable: false,
};

ErrorView.propTypes = {
    title: PropTypes.string.isRequired,
    isClosable: PropTypes.bool,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
        .isRequired,
};
