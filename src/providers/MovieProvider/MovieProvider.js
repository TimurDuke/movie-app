import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash/function';
import {
    createSession,
    getRequestToken,
    getConfiguration,
    rateMovie,
    fetchMovies,
    fetchMoviesByName,
    authUrl,
    fetchRatedMovies,
    fetchGenres,
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
    currentPage: 1,
    totalPages: 0,
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
    getRequestToken: () => {},
    initializeAuthProcess: () => {},
    authProcess: () => {},
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
            currentPage: 1,
            totalPages: 0,
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
                totalPages: data['total_pages'],
                currentPage: page,
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

    getRequestToken = async () => {
        try {
            const response = await getRequestToken();
            if (!response.ok) {
                throw new Error(`Error, status code: ${response.status}`);
            }

            return await response.json();
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            return null;
        }
    };

    initializeAuthProcess = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const requestToken = urlParams.get('request_token');
        const isDenied = urlParams.get('denied');

        if (Boolean(isDenied)) {
            this.setState(prev => ({
                ...prev,
                isSessionDenied: true,
                isSessionApproved: false,
            }));
            return;
        }

        if (requestToken) {
            try {
                const response = await createSession(requestToken);
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
                    sessionId: data['session_id'],
                }));
            } catch (e) {
                this.authProcess();
            }
        } else {
            this.authProcess();
        }
    };

    authProcess = async () => {
        const token = await this.getRequestToken();

        if (token) {
            window.location.href = authUrl(token['request_token']);
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

                const data = await response.json();

                this.setState(prev => ({ ...prev, ratedMovies: data.results }));
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

    fetchRatedMovies = async () => {
        const { sessionId, isSessionApproved } = this.state;

        if (isSessionApproved) {
            try {
                this.setState(prev => ({ ...prev, isRatedLoading: true }));

                const response = await fetchRatedMovies(sessionId);

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

    render() {
        return (
            <MovieContext.Provider
                value={{
                    ...this.state,
                    getRequestToken: this.getRequestToken,
                    initializeAuthProcess: this.initializeAuthProcess,
                    authProcess: this.authProcess,
                    getConfiguration: this.getConfiguration,
                    searchMovies: this.searchMovies,
                    inputHandler: this.inputHandler,
                    clearInputHandler: this.clearInputHandler,
                    rateMovieHandler: this.rateMovieHandler,
                    fetchRatedMovies: this.fetchRatedMovies,
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
