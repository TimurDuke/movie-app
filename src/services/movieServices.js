import { apiKey, movieUrl, requestOptions } from '../config';

export const fetchMovies = page =>
    fetch(
        `${movieUrl}search/movie?query=return&page=${page}`,
        requestOptions('GET')
    );
export const fetchMoviesByName = (searchTerm, page) =>
    fetch(
        `${movieUrl}search/movie?&query=${searchTerm}&page=${page}`,
        requestOptions('GET')
    );

export const fetchRatedMovies = (sessionId, page = 1) =>
    fetch(
        `${movieUrl}guest_session/${sessionId}/rated/movies?language=en-US&page=${page}&api_key=${apiKey}`
    );

export const fetchGenres = () =>
    fetch(`${movieUrl}genre/movie/list?language=en`, requestOptions('GET'));

export const getConfiguration = () =>
    fetch(`${movieUrl}configuration`, requestOptions('GET'));

export const createSession = () =>
    fetch(`${movieUrl}authentication/guest_session/new`, requestOptions('GET'));

export const rateMovie = ({ movieId, sessionId, rating }) =>
    fetch(
        `${movieUrl}movie/${movieId}/rating?guest_session_id=${sessionId}&api_key=${apiKey}`,
        {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ value: rating }),
        }
    );
