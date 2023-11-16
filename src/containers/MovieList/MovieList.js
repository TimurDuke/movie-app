import React, { Component } from 'react';
import { Button, Flex, Tabs } from 'antd';
import { debounce } from 'lodash/function';
import { requestOptions, movieUrl, appUrl } from '../../config';
import ErrorView from '../../components/ErrorView';
import {
    createSession,
    getConfiguration,
    getRequestToken,
} from '../../movieServices/movieServices';
import './MovieList.css';
import MoviesComponent from '../../components/MoviesComponent';
import RatedMoviesComponent from '../../components/RatedMoviesComponent';

export default class MovieList extends Component {
    constructor() {
        super();

        this.state = {
            sessionId: null,
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

        this.debouncedSearchMovies = debounce(this.handleSearch, 500).bind(
            this
        );

        this.searchInputRef = React.createRef();
    }

    componentDidMount() {
        this.initializeAuthProcess();
        this.getConfiguration();
        this.searchMovies();
    }

    handleSearch() {
        this.searchMovies();
    }

    getRequestToken = async () => {
        try {
            const request = await getRequestToken();
            if (!request.ok) {
                throw new Error(`Error, status code: ${request.status}`);
            }

            return await request.json();
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
            return null;
        }
    };

    initializeAuthProcess = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const requestToken = urlParams.get('request_token');

        if (requestToken) {
            try {
                const response = await createSession(requestToken);
                if (!response.ok) {
                    throw new Error(`Error, status code: ${response.status}`);
                }

                const responseData = await response.json();

                this.setState(prev => ({
                    ...prev,
                    sessionId: responseData['session_id'],
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
            window.location.href = `https://www.themoviedb.org/authenticate/${token['request_token']}?redirect_to=${appUrl}`;
        }
    };

    getConfiguration = async () => {
        try {
            const request = await getConfiguration();
            if (!request.ok) {
                throw new Error(`Error, status code: ${request.status}`);
            }

            const response = await request.json();

            this.setState(prev => ({
                ...prev,
                imageProps: {
                    ...prev.imageProps,
                    baseUrl: response.images['secure_base_url'],
                },
            }));
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
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

            const request = await fetch(url, requestOptions('GET'));

            if (!request.ok) {
                throw new Error(`Error, status code: ${request.status}`);
            }

            const response = await request.json();

            this.setState(prev => ({
                ...prev,
                movies: response.results,
                totalPages: response['total_pages'],
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

    items = () => {
        const {
            sessionId,
            movies,
            isLoading,
            searchTerm,
            error,
            currentPage,
            totalPages,
            enteredName,
            imageProps,
        } = this.state;

        return [
            {
                key: '1',
                label: 'Search',
                children: (
                    <Flex className="wrapper-body" wrap="wrap">
                        <MoviesComponent
                            movies={movies}
                            isLoading={isLoading}
                            searchTerm={searchTerm}
                            error={error}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            enteredName={enteredName}
                            imageProps={imageProps}
                            inputHandler={this.inputHandler}
                            clearInputHandler={this.clearInputHandler}
                            handlePageChange={this.handlePageChange}
                        />
                    </Flex>
                ),
            },
            {
                key: '2',
                label: 'Rated',
                children: (
                    <Flex className="wrapper-body" wrap="wrap">
                        <RatedMoviesComponent session={{ id: sessionId }} />
                    </Flex>
                ),
            },
        ];
    };

    render() {
        return (
            <>
                {this.renderedError()}
                <Flex className="wrapper" justify="center">
                    <div className="wrapper-inner">
                        <Tabs defaultActiveKey="1" items={this.items()} />
                    </div>
                </Flex>
            </>
        );
    }
}
