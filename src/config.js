export const appUrl = 'http://localhost:3000/';

export const apiToken =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZGY5OThiZTM0MWRjODBhOTFiYzk1NWIwODY2NDg1MiIsInN1YiI6IjY1NGUwZjQ2NWE1ZWQwMDBhZDU4YTY4YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ztrbs7ZoNV-6Gk5IeeEvGoJD0sRQmgKbPmbG88HB-GI';

export const movieUrl = 'https://api.themoviedb.org/3/';

export const accountId = '20694013';

export const requestOptions = (method, body) => ({
    method,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify(body),
});
