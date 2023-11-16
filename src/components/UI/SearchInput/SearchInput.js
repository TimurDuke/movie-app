import React, { Component } from 'react';
import { Button, Input } from 'antd';
import PropTypes from 'prop-types';
import {
    CloseCircleOutlined,
    LoadingOutlined,
    SearchOutlined,
} from '@ant-design/icons';

class SearchInput extends Component {
    render() {
        const {
            inputHandler,
            size,
            placeHolder,
            loading,
            clearInputHandler,
            value,
            forwardedRef,
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
                    ref={forwardedRef}
                    placeholder={placeHolder}
                    onChange={inputHandler}
                    size={size}
                    value={value}
                    disabled={loading}
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

export default React.forwardRef((props, ref) => (
    <SearchInput {...props} forwardedRef={ref} />
));

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

    // eslint-disable-next-line react/require-default-props
    forwardedRef: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    ]),
};
