import { accountId, appUrl, movieUrl, requestOptions } from '../config';

export const authUrl = requestToken =>
    `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${appUrl}`;

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

export const fetchRatedMovies = sessionId =>
    fetch(
        `${movieUrl}account/${accountId}/rated/movies?session_id=${sessionId}`,
        requestOptions('GET')
    );

export const fetchGenres = () =>
    fetch(`${movieUrl}genre/movie/list?language=en`, requestOptions('GET'));

export const getConfiguration = () =>
    fetch(`${movieUrl}configuration`, requestOptions('GET'));

export const getRequestToken = () =>
    fetch(`${movieUrl}authentication/token/new`, requestOptions('GET'));

export const createSession = requestToken =>
    fetch(
        `${movieUrl}authentication/session/new`,
        requestOptions('POST', { request_token: requestToken })
    );

export const rateMovie = ({ movieId, sessionId, rating }) =>
    fetch(
        `${movieUrl}movie/${movieId}/rating?session_id=${sessionId}`,
        requestOptions('POST', { value: rating })
    );
