import React, { Component } from 'react';
import { Alert, Flex } from 'antd';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { debounce } from 'lodash/function';
import { getOptions, movieUrl } from '../../config';
import MovieCard from '../../components/MovieCard';
import SkeletonMovieCard from '../../components/SkeletonMovieCard';
import SearchInput from '../../components/SearchInput';
import PaginationComponent from '../../components/PaginationComponent';
import './MovieList.css';

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
            imageProps: {
                baseUrl: '',
                posterSize: 'w500',
            },
        };

        this.getMovieCount = 20;
        this.debouncedSearchMovies = debounce(this.handleSearch, 500).bind(
            this
        );
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
            this.setState(prev => ({ ...prev, isLoading: true }));

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
                isLoading: false,
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

    render() {
        const {
            isLoading,
            error: { isError, errorMessage },
            movies,
            currentPage,
            totalPages,
        } = this.state;

        const imageUrl = `${this.state.imageProps.baseUrl}${this.state.imageProps.posterSize}`;

        const movieCards = !isLoading ? (
            <CardView movies={movies} imageUrl={imageUrl} />
        ) : null;

        let skeletonCards;
        if (isLoading && !isError) {
            const cardsCount = Array.from({ length: this.getMovieCount });

            skeletonCards = cardsCount.map(() => (
                <SkeletonMovieCard key={crypto.randomUUID()} />
            ));
        }

        const errorNotice =
            !isLoading && isError ? (
                <ErrorView title="Request error!" description={errorMessage} />
            ) : null;

        return (
            <>
                {errorNotice}
                <Flex className="wrapper" justify="center">
                    <Flex className="wrapper-inner" wrap="wrap">
                        <SearchInput
                            size="large"
                            placeHolder="Type to search..."
                            inputHandler={this.inputHandler}
                            value={this.state.searchTerm}
                            loading={this.state.isLoading}
                            clearInputHandler={this.clearInputHandler}
                        />
                        {movieCards}
                        {skeletonCards}
                        {movies.length !== 0 && (
                            <PaginationComponent
                                currentPage={currentPage}
                                totalPages={totalPages}
                                handlePageChange={this.handlePageChange}
                            />
                        )}
                    </Flex>
                </Flex>
            </>
        );
    }
}

const ErrorView = ({ title, description }) => (
    <Alert
        style={{
            position: 'absolute',
            top: '0',
            left: '50%',
            translate: '-50% 0',
            width: '400px',
        }}
        message={title}
        showIcon
        description={description}
        type="error"
        closable
    />
);

const CardView = ({ movies, imageUrl }) =>
    movies?.map(movie => {
        const maxDescriptionLength = 150;
        let description = movie['overview'];
        const releaseDate = movie['release_date'];
        // Date format
        const formattedDate =
            releaseDate !== ''
                ? format(new Date(releaseDate), 'MMMM d, yyyy')
                : null;

        // Description truncate
        if (description.length >= maxDescriptionLength) {
            const truncated = description
                .slice(0, maxDescriptionLength + 1)
                .split(' ')
                .slice(0, -1)
                .join(' ');
            description = truncated.length ? `${truncated} ...` : '';
        }

        return (
            <MovieCard
                key={movie['id']}
                title={movie['title']}
                description={description}
                releaseDate={formattedDate}
                imageUrl={imageUrl}
                image={movie['poster_path']}
            />
        );
    });

CardView.propTypes = {
    movies: PropTypes.arrayOf(PropTypes.object).isRequired,
    imageUrl: PropTypes.string.isRequired,
};

ErrorView.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};
