import React, { Component } from 'react';
import { Button, Card } from 'antd';
import { FrownTwoTone } from '@ant-design/icons';

import './NotFoundMovie.css';
import PropTypes from 'prop-types';

export default class NotFoundMovie extends Component {
    render() {
        const { onRetrySearch, enteredName } = this.props;

        return (
            <Card className="not-found-card">
                <FrownTwoTone className="not-found-icon" twoToneColor="red" />
                <h3 className="not-found-title">
                    The movie{' '}
                    <span className="entered-name">"{enteredName}"</span> was
                    not found.
                </h3>
                <p className="not-found-description">
                    Unfortunately, we couldn't find the movie you were looking
                    for.
                </p>
                <Button
                    onClick={onRetrySearch}
                    size="large"
                    type="primary"
                    danger
                >
                    Search again
                </Button>
            </Card>
        );
    }
}

NotFoundMovie.propTypes = {
    onRetrySearch: PropTypes.func.isRequired,
    enteredName: PropTypes.string.isRequired,
};
