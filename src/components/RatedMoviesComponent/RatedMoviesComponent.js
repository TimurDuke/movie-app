import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class RatedMoviesComponent extends Component {
    componentDidMount() {
        // eslint-disable-next-line no-console
        console.log(this.props.session);
    }

    render() {
        return <div>asd</div>;
    }
}

RatedMoviesComponent.propTypes = {
    session: PropTypes.object.isRequired,
};
