import React, { Component } from 'react';
import { Typography } from 'antd';
import { MovieContext } from '../../providers/MovieProvider/MovieProvider';

const { Title } = Typography;

class RatedMoviesEmpty extends Component {
    static contextType = MovieContext;

    componentDidMount() {
        const { fetchRatedMovies } = this.context;
        fetchRatedMovies();
    }

    render() {
        return (
            <Title level={4} style={{ textAlign: 'center' }}>
                The "Rated Movies" list is empty.
            </Title>
        );
    }
}

export default RatedMoviesEmpty;
