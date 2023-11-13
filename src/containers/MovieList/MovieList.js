import React, { Component } from 'react';
import { Button, Flex } from 'antd';
import { debounce } from 'lodash/function';
import { getOptions, movieUrl } from '../../config';
import MovieCard from '../../components/MovieCard';
import SkeletonMovieCard from '../../components/SkeletonMovieCard';
import SearchInput from '../../components/SearchInput';
import PaginationComponent from '../../components/PaginationComponent';
import NotFoundMovie from '../../components/NotFoundMovie';
import './MovieList.css';
import ErrorView from '../../components/ErrorView';

export default class MovieList extends Component {
    constructor() {
        super();

        this.state = {
            movies: [],
            isLoading: false,
            error: {
                errorMessage: null,
                isError: false,
            },
            currentPage: 1,
            totalPages: 0,
            searchTerm: '',
            enteredName: '',
            imageProps: {
                baseUrl: '',
                posterSize: 'w500',
            },
        };

        this.getMovieCount = 20;
        this.debouncedSearchMovies = debounce(this.handleSearch, 500).bind(
            this
        );

        this.searchInputRef = React.createRef();
    }

    async componentDidMount() {
        this.getConfiguration();
        this.searchMovies();
    }

    handleSearch() {
        this.searchMovies();
    }

    getConfiguration = async () => {
        try {
            const res = await fetch(`${movieUrl}configuration`, getOptions);
            const body = await res.json();

            this.setState(prev => ({
                ...prev,
                imageProps: {
                    ...prev.imageProps,
                    baseUrl: body.images['secure_base_url'],
                },
            }));
        } catch (e) {
            this.setState(prev => ({
                ...prev,
                error: { isError: true, errorMessage: e.message },
            }));
        }
    };

    searchMovies = async (page = 1) => {
        const { searchTerm } = this.state;

        try {
            this.setState(prev => ({
                ...prev,
                isLoading: true,
                enteredName: searchTerm,
            }));

            let url;

            if (searchTerm) {
                url = `${movieUrl}search/movie?&query=${searchTerm}&page=${page}`;
            } else {
                url = `${movieUrl}search/movie?query=return&page=${page}`;
            }

            const res = await fetch(url, getOptions);

            if (!res.ok) {
                throw new Error(`Error, status code: ${res.status}`);
            }

            const body = await res.json();

            this.setState(prev => ({
                ...prev,
                movies: body.results,
                totalPages: body['total_pages'],
                currentPage: page,
            }));
        } catch (e) {
            this.setState(prev => ({
                ...prev,
                error: { isError: true, errorMessage: e.message },
            }));
        } finally {
            this.setState(prev => ({ ...prev, isLoading: false }));
        }
    };

    inputHandler = e => {
        const searchTerm = e.target.value;

        this.setState(prev => ({ ...prev, searchTerm }));
        this.debouncedSearchMovies();
    };

    handlePageChange = page => {
        this.searchMovies(page);
        this.scrollToTop();
    };

    scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    clearInputHandler = () => {
        this.setState(prev => ({ ...prev, searchTerm: '' }));
        this.debouncedSearchMovies();
    };

    focusOnSearchInput = () => {
        this.searchInputRef.current.focus();
    };

    renderedCards = () => {
        const {
            isLoading,
            movies,
            imageProps: { baseUrl, posterSize },
            error: { isError },
        } = this.state;

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

    renderedError = () => {
        const {
            isLoading,
            error: { isError, errorMessage },
        } = this.state;
        if (!isLoading && isError) {
            return (
                <ErrorView
                    title="Request error!"
                    description={
                        <>
                            {errorMessage}
                            <Button
                                style={{ marginLeft: '10px' }}
                                onClick={this.searchMovies}
                                size="small"
                                type="primary"
                                danger
                            >
                                Try again
                            </Button>
                        </>
                    }
                />
            );
        }

        return null;
    };

    render() {
        const {
            isLoading,
            movies,
            currentPage,
            totalPages,
            enteredName,
            error: { isError },
        } = this.state;

        return (
            <>
                {this.renderedError()}
                <Flex className="wrapper" justify="center">
                    <Flex className="wrapper-inner" wrap="wrap">
                        <SearchInput
                            ref={this.searchInputRef}
                            size="large"
                            placeHolder="Type to search..."
                            inputHandler={this.inputHandler}
                            value={this.state.searchTerm}
                            loading={this.state.isLoading}
                            clearInputHandler={this.clearInputHandler}
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
                                handlePageChange={this.handlePageChange}
                            />
                        ) : null}
                    </Flex>
                </Flex>
            </>
        );
    }
}
