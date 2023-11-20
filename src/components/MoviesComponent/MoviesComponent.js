import React, { Component } from 'react';
import SearchInput from '../UI/SearchInput';
import NotFoundMovie from '../UI/NotFoundMovie';
import PaginationComponent from '../UI/PaginationComponent';
import { MovieContext } from '../../providers/MovieProvider/MovieProvider';
import { renderedCards } from '../../utils/moviesUtils';

export default class MoviesComponent extends Component {
    static contextType = MovieContext;

    constructor(props) {
        super(props);

        this.state = {
            isRatedByUserLoading: false,
        };

        this.searchInputRef = React.createRef();
    }

    componentDidMount() {
        const { searchMovies } = this.context;

        searchMovies();
    }

    componentDidUpdate(prevProps, prevState) {
        const { isRatedByUserLoading, fetchRatedMovies } = this.context;

        if (isRatedByUserLoading !== prevState.isRatedByUserLoading) {
            this.setState(prev => ({ ...prev, isRatedByUserLoading }));
            fetchRatedMovies();
        }
    }

    focusOnSearchInput = () => {
        this.searchInputRef.current.focus();
    };

    handlePageChange = page => {
        const { searchMovies, scrollToTop } = this.context;

        searchMovies(page);
        scrollToTop();
    };

    render() {
        const {
            isLoading,
            searchTerm,
            movies,
            currentMoviePage,
            totalMovieCount,
            enteredName,
            errors: { isError },
            inputHandler,
            clearInputHandler,
        } = this.context;

        return (
            <>
                <SearchInput
                    ref={this.searchInputRef}
                    size="large"
                    placeHolder="Type to search..."
                    inputHandler={inputHandler}
                    value={searchTerm}
                    loading={isLoading}
                    clearInputHandler={clearInputHandler}
                />
                {renderedCards({ isLoading, isError, movies })}
                {movies.length === 0 && !isLoading && !isError ? (
                    <NotFoundMovie
                        onRetrySearch={this.focusOnSearchInput}
                        enteredName={enteredName}
                    />
                ) : null}
                {movies.length !== 0 ? (
                    <PaginationComponent
                        currentPage={currentMoviePage}
                        totalPages={totalMovieCount}
                        handlePageChange={this.handlePageChange}
                    />
                ) : null}
            </>
        );
    }
}
