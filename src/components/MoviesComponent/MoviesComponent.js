import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SearchInput from '../SearchInput';
import NotFoundMovie from '../NotFoundMovie';
import PaginationComponent from '../PaginationComponent';
import MovieCard from '../MovieCard';
import SkeletonMovieCard from '../SkeletonMovieCard';

export default class MoviesComponent extends Component {
    constructor(props) {
        super(props);

        this.getMovieCount = 20;
        this.searchInputRef = React.createRef();
    }

    renderedCards = () => {
        const {
            isLoading,
            movies,
            imageProps: { baseUrl, posterSize },
            error: { isError },
        } = this.props;

        if (!isLoading && movies.length !== 0) {
            return movies.map(movie => {
                const {
                    id,
                    title,
                    poster_path: posterPath,
                    overview: description,
                    release_date: releaseDate,
                } = movie;

                return (
                    <MovieCard
                        key={id}
                        title={title}
                        description={description}
                        releaseDate={releaseDate}
                        baseUrl={baseUrl}
                        posterSize={posterSize}
                        image={posterPath}
                    />
                );
            });
        }

        if (isLoading && !isError) {
            const cardsCount = Array.from(
                { length: this.getMovieCount },
                (_, index) => index
            );
            return cardsCount.map(index => <SkeletonMovieCard key={index} />);
        }

        return null;
    };

    focusOnSearchInput = () => {
        this.searchInputRef.current.focus();
    };

    render() {
        const {
            isLoading,
            searchTerm,
            movies,
            currentPage,
            totalPages,
            enteredName,
            error: { isError },
            inputHandler,
            clearInputHandler,
            handlePageChange,
        } = this.props;

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
                {this.renderedCards()}
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
                        handlePageChange={handlePageChange}
                    />
                ) : null}
            </>
        );
    }
}

MoviesComponent.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    searchTerm: PropTypes.string.isRequired,
    movies: PropTypes.arrayOf(PropTypes.object).isRequired,
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    enteredName: PropTypes.string.isRequired,
    error: PropTypes.object.isRequired,
    imageProps: PropTypes.object.isRequired,
    inputHandler: PropTypes.func.isRequired,
    clearInputHandler: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
};
