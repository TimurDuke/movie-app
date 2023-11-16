import { movieUrl, requestOptions } from '../config';

export const getConfiguration = () =>
    fetch(`${movieUrl}configuration`, requestOptions('GET'));
export const getRequestToken = () =>
    fetch(
        'https://api.themoviedb.org/3/authentication/token/new',
        requestOptions('GET')
    );
export const createSession = requestToken =>
    fetch(
        `https://api.themoviedb.org/3/authentication/session/new`,
        requestOptions('POST', { request_token: requestToken })
    );
