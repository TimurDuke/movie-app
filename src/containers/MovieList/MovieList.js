import React, { Component } from 'react';
import { Alert, Flex } from 'antd';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import MovieCard from '../../components/MovieCard';
import { apiToken, movieUrl } from '../../config';
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
        };

        this.getMovieCount = 6;
    }

    async componentDidMount() {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${apiToken}`,
            },
        };

        try {
            this.setState(prev => ({ ...prev, isLoading: true }));
            const res = await fetch(
                `${movieUrl}search/movie?query=return&page=1`,
                options
            );

            if (!res.ok) {
                throw new Error(`Error, status code: ${res.status}`);
            }

            const body = await res.json();
            const resMovies = body.results.slice(0, this.getMovieCount);

            this.setState(prev => ({
                ...prev,
                movies: resMovies,
                isLoading: false,
            }));
        } catch (e) {
            this.setState(prev => ({
                ...prev,
                isLoading: false,
                error: { isError: true, errorMessage: e.message },
            }));
        }
    }

    render() {
        const {
            isLoading,
            error: { isError, errorMessage },
            movies,
        } = this.state;

        const card = !isLoading ? <CardView movies={movies} /> : null;
        const cardSkeleton = isLoading && !isError ? <p>qwe</p> : null;

        const errorNotice =
            !isLoading && isError ? (
                <ErrorView title="Request error!" description={errorMessage} />
            ) : null;

        return (
            <>
                {errorNotice}
                <Flex className="wrapper" justify="center">
                    <Flex className="wrapper-inner" wrap="wrap">
                        {card}
                        {cardSkeleton}
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

const CardView = ({ movies }) =>
    movies.map(movie => {
        const maxLength = 200;
        const releaseDate = movie['release_date'];
        let description = movie['overview'];
        const formattedDate = format(new Date(releaseDate), 'MMMM d, yyyy');

        if (description.length >= maxLength) {
            const truncated = description
                .slice(0, maxLength + 1)
                .split(' ')
                .slice(0, -1)
                .join(' ');
            description = truncated.length ? `${truncated} ...` : '';
        }

        return (
            <MovieCard
                key={movie.id}
                title={movie.title}
                description={description}
                releaseDate={formattedDate}
            />
        );
    });

CardView.propTypes = {
    movies: PropTypes.arrayOf(PropTypes.object).isRequired,
};

ErrorView.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};
