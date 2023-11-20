import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash/function';
import {
    createSession,
    rateMovie,
    fetchMovies,
    fetchMoviesByName,
    fetchRatedMovies,
    fetchGenres,
    getConfiguration,
} from '../../services/movieServices';

export const MovieContext = createContext({
    movies: [],
    ratedMovies: [],
    ratedMap: null,
    genresMap: null,
    isLoading: false,
    isRatedLoading: false,
    isRatedByUserLoading: false,
    isSessionDenied: false,
    isSessionApproved: false,
    sessionId: null,
    searchTerm: '',
    enteredName: '',
    currentMoviePage: 1,
    currentRatedMoviePage: 1,
    totalRatedMovieCount: 0,
    totalMovieCount: 0,
    imageProps: {
        baseUrl: '',
        posterSize: 'w500',
    },
    errors: {
        errorMessage: null,
        errorRatedMessage: null,
        isError: false,
        isRatedError: false,
    },
    handleSearch: () => {},
    searchMovies: () => {},
    initializeAuthProcess: () => {},
    getConfiguration: () => {},
    rateMovieHandler: () => {},
    fetchRatedMovies: () => {},
    inputHandler: () => {},
    clearInputHandler: () => {},
});

export default class MovieProvider extends Component {
    constructor() {
        super();

        this.state = {
            movies: [],
            ratedMovies: [],
            ratedMap: null,
            genresMap: null,
            isLoading: false,
            isRatedLoading: false,
            isRatedByUserLoading: false,
            isSessionDenied: false,
            isSessionApproved: false,
            sessionId: null,
            searchTerm: '',
            enteredName: '',
            currentMoviePage: 1,
            currentRatedMoviePage: 1,
            totalMovieCount: 0,
            totalRatedMovieCount: 0,
            imageProps: {
                baseUrl: '',
                posterSize: 'w500',
            },
            errors: {
                errorMessage: null,
                errorRatedMessage: null,
                isError: false,
                isRatedError: false,
            },
        };

        this.debouncedSearchMovies = debounce(this.handleSearch, 500).bind(
            this
        );
    }

    handleSearch() {
        this.searchMovies();
    }

    searchMovies = async (page = 1) => {
        const { searchTerm } = this.state;

        try {
            this.setState(prev => ({
                ...prev,
                isLoading: true,
                enteredName: searchTerm,
            }));

            let response;

            if (searchTerm) {
                response = await fetchMoviesByName(searchTerm, page);
            } else {
                response = await fetchMovies(page);
            }

            const responseGenres = await fetchGenres();

            if (!response.ok && !responseGenres.ok) {
                throw new Error(`Error, status code: ${response.status}`);
            }

            const data = await response.json();
            const genresData = await responseGenres.json();

            const genresMap = {};
            genresData['genres'].forEach(genre => {
                genresMap[genre.id] = genre.name;
            });

            this.setState(prev => ({
                ...prev,
                movies: data.results,
                genresMap,
                totalMovieCount: data['total_results'],
                currentMoviePage: page,
            }));
        } catch (e) {
            this.setState(prev => ({
                ...prev,
                errors: { isError: true, errorMessage: e.message },
            }));
        } finally {
            this.setState(prev => ({ ...prev, isLoading: false }));
        }
    };

    initializeAuthProcess = async () => {
        try {
            const response = await createSession();
            if (!response.ok) {
                throw new Error(`Error, status code: ${response.status}`);
            }

            const data = await response.json();

            this.setState(prev => ({
                ...prev,
                isSessionDenied: false,
                isSessionApproved: true,
            }));

            this.setState(prev => ({
                ...prev,
                sessionId: data['guest_session_id'],
            }));
        } catch (e) {
            this.setState(prev => ({
                ...prev,
                isSessionDenied: true,
                isSessionApproved: false,
            }));
        }
    };

    getConfiguration = async () => {
        try {
            const response = await getConfiguration();
            if (!response.ok) {
                throw new Error(`Error, status code: ${response.status}`);
            }

            const data = await response.json();

            this.setState(prev => ({
                ...prev,
                imageProps: {
                    ...prev.imageProps,
                    baseUrl: data.images['secure_base_url'],
                },
            }));
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
        }
    };

    rateMovieHandler = async ({ rating, movieId }) => {
        const { sessionId } = this.state;

        if (sessionId) {
            try {
                this.setState(prev => ({
                    ...prev,
                    isRatedByUserLoading: true,
                }));

                const response = await rateMovie({
                    movieId,
                    sessionId,
                    rating,
                });

                if (!response.ok) {
                    throw new Error(`Error, status code: ${response.status}`);
                }
            } catch (e) {
                this.setState(prev => ({
                    ...prev,
                    errors: {
                        isRatedError: true,
                        errorRatedMessage: e.message,
                    },
                }));
            } finally {
                this.setState(prev => ({
                    ...prev,
                    isRatedByUserLoading: false,
                }));
            }
        }
    };

    fetchRatedMovies = async (page = 1) => {
        const { sessionId, isSessionApproved } = this.state;

        if (isSessionApproved) {
            try {
                this.setState(prev => ({ ...prev, isRatedLoading: true }));

                const response = await fetchRatedMovies(sessionId, page);

                if (!response.ok) {
                    throw new Error(`Error, status code: ${response.status}`);
                }

                const data = await response.json();

                const ratedMap = {};

                data.results.forEach(movie => {
                    ratedMap[movie.id] = movie.rating;
                });

                this.setState(prev => ({
                    ...prev,
                    ratedMovies: data.results,
                    ratedMap,
                    totalRatedMovieCount: data['total_results'],
                    currentRatedMoviePage: page,
                }));
            } catch (e) {
                this.setState(prev => ({
                    ...prev,
                    errors: {
                        isRatedError: true,
                        errorRatedMessage: e.message,
                    },
                }));
            } finally {
                this.setState(prev => ({ ...prev, isRatedLoading: false }));
            }
        }
    };

    inputHandler = e => {
        const searchTerm = e.target.value;

        this.setState(prev => ({ ...prev, searchTerm }));
        this.debouncedSearchMovies();
    };

    clearInputHandler = () => {
        this.setState(prev => ({ ...prev, searchTerm: '' }));
        this.debouncedSearchMovies();
    };

    scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    render() {
        return (
            <MovieContext.Provider
                value={{
                    ...this.state,
                    initializeAuthProcess: this.initializeAuthProcess,
                    getConfiguration: this.getConfiguration,
                    searchMovies: this.searchMovies,
                    rateMovieHandler: this.rateMovieHandler,
                    fetchRatedMovies: this.fetchRatedMovies,
                    inputHandler: this.inputHandler,
                    clearInputHandler: this.clearInputHandler,
                    scrollToTop: this.scrollToTop,
                }}
            >
                {this.props.children}
            </MovieContext.Provider>
        );
    }
}

MovieProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
