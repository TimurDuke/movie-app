import React, { Component } from 'react';
import { MovieContext } from '../../providers/MovieProvider/MovieProvider';
import { renderedCards } from '../../utils/moviesUtils';

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
                {renderedCards({
                    isLoading: isRatedLoading,
                    isError: isRatedError,
                    movies: ratedMovies,
                })}
            </>
        );
    }
}
