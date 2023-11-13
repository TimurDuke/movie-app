import React, { Component } from 'react';
import { Button, Input } from 'antd';
import PropTypes from 'prop-types';
import {
    CloseCircleOutlined,
    LoadingOutlined,
    SearchOutlined,
} from '@ant-design/icons';

export default class SearchInput extends Component {
    render() {
        const {
            inputHandler,
            size,
            placeHolder,
            loading,
            clearInputHandler,
            value,
        } = this.props;

        let suffixIcon;

        if (value !== '') {
            if (loading) {
                suffixIcon = <LoadingOutlined />;
            }
            suffixIcon = <CloseCircleOutlined onClick={clearInputHandler} />;
        } else {
            suffixIcon = <SearchOutlined />;
        }

        return (
            <>
                <Input
                    placeholder={placeHolder}
                    onChange={inputHandler}
                    size={size}
                    value={value}
                    suffix={
                        <Button
                            type="secondary"
                            icon={suffixIcon}
                            loading={loading}
                        />
                    }
                />
            </>
        );
    }
}

SearchInput.defaultProps = {
    size: 'middle',
    placeHolder: '',
};

SearchInput.propTypes = {
    inputHandler: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    clearInputHandler: PropTypes.func.isRequired,
    size: PropTypes.string,
    placeHolder: PropTypes.string,
};
