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
            isSessionApproved: null,
        };

        this.searchInputRef = React.createRef();
    }

    componentDidMount() {
        const { searchMovies } = this.context;

        searchMovies();
    }

    componentDidUpdate(prevProps, prevState) {
        const { isSessionApproved, fetchRatedMovies } = this.context;

        if (isSessionApproved !== prevState.isSessionApproved) {
            this.setState({ isSessionApproved });
            fetchRatedMovies();
        }
    }

    focusOnSearchInput = () => {
        this.searchInputRef.current.focus();
    };

    handlePageChange = page => {
        const { searchMovies } = this.context;

        searchMovies(page);
        this.scrollToTop();
    };

    scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    render() {
        const {
            isLoading,
            searchTerm,
            movies,
            currentPage,
            totalPages,
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
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePageChange={this.handlePageChange}
                    />
                ) : null}
            </>
        );
    }
}
