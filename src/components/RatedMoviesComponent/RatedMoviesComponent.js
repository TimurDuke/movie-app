import React, { Component } from 'react';
import { Typography } from 'antd';
import { MovieContext } from '../../providers/MovieProvider/MovieProvider';
import { renderedCards } from '../../utils/moviesUtils';

const { Title } = Typography;

export default class RatedMoviesComponent extends Component {
    static contextType = MovieContext;

    componentDidMount() {
        const { fetchRatedMovies } = this.context;

        fetchRatedMovies();
    }

    render() {
        const { isRatedLoading, isRatedError, ratedMovies } = this.context;

        return (
            <>
                {ratedMovies.length !== 0 ? (
                    renderedCards({
                        isLoading: isRatedLoading,
                        isError: isRatedError,
                        movies: ratedMovies,
                    })
                ) : (
                    <Title level={4} style={{ textAlign: 'center' }}>
                        The "Rated Movies" list is empty. To rate movies, you
                        need to confirm the session.
                    </Title>
                )}
            </>
        );
    }
}
