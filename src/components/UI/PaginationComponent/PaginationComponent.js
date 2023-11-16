import React, { Component } from 'react';
import { Pagination } from 'antd';
import PropTypes from 'prop-types';

export default class PaginationComponent extends Component {
    render() {
        const { currentPage, totalPages, handlePageChange } = this.props;

        return (
            <Pagination
                style={{ width: '100%', textAlign: 'center' }}
                current={currentPage}
                total={totalPages}
                onChange={handlePageChange}
                showSizeChanger={false}
            />
        );
    }
}

PaginationComponent.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    handlePageChange: PropTypes.func.isRequired,
};
