import React, { Component } from 'react';
import { Flex } from 'antd';
import { format } from 'date-fns';
import MovieCard from '../../components/MovieCard';
import { apiToken, movieUrl } from '../../config';
import './MovieList.css';

export default class MovieList extends Component {
    constructor() {
        super();

        this.state = {
            movies: [],
        };
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
            const res = await fetch(
                `${movieUrl}search/movie?query=return&page=1`,
                options
            );
            const body = await res.json();
            const resMovies = body.results.slice(0, 6);

            this.setState(prev => ({ ...prev, movies: resMovies }));
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Error fetching data:', e);
        }
    }

    render() {
        return this.state.movies.length ? (
            <Flex className="wrapper" justify="center">
                <Flex className="wrapper-inner" wrap="wrap">
                    {this.state.movies.map(movie => {
                        const maxLength = 200;
                        const releaseDate = movie['release_date'];
                        let description = movie['overview'];
                        const formattedDate = format(
                            new Date(releaseDate),
                            'MMMM d, yyyy'
                        );

                        if (description.length >= maxLength) {
                            const truncated = description
                                .slice(0, maxLength + 1)
                                .split(' ')
                                .slice(0, -1)
                                .join(' ');
                            description = truncated.length
                                ? `${truncated} ...`
                                : '';
                        }

                        return (
                            <MovieCard
                                key={movie.id}
                                title={movie.title}
                                description={description}
                                releaseDate={formattedDate}
                            />
                        );
                    })}
                </Flex>
            </Flex>
        ) : (
            <p style={{ textAlign: 'center' }}>Loading...</p>
        );
    }
}
