import React, { Component } from 'react';
import { MovieContext } from '../../providers/MovieProvider/MovieProvider';
import { renderedCards } from '../../utils/moviesUtils';
import PaginationComponent from '../UI/PaginationComponent';

export default class RatedMoviesComponent extends Component {
    static contextType = MovieContext;

    componentDidMount() {
        const { fetchRatedMovies } = this.context;

        fetchRatedMovies();
    }

    handlePageChange = page => {
        const { fetchRatedMovies, scrollToTop } = this.context;

        fetchRatedMovies(page);
        scrollToTop();
    };

    render() {
        const {
            isRatedLoading,
            isRatedError,
            ratedMovies,
            currentRatedMoviePage,
            totalRatedMovieCount,
        } = this.context;

        return (
            <>
                {renderedCards({
                    isLoading: isRatedLoading,
                    isError: isRatedError,
                    movies: ratedMovies,
                })}
                {ratedMovies.length !== 0 ? (
                    <PaginationComponent
                        currentPage={currentRatedMoviePage}
                        totalPages={totalRatedMovieCount}
                        handlePageChange={this.handlePageChange}
                    />
                ) : null}
            </>
        );
    }
}
