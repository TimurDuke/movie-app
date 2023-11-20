export const apiKey = 'cdf998be341dc80a91bc955b08664852';

export const apiToken =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZGY5OThiZTM0MWRjODBhOTFiYzk1NWIwODY2NDg1MiIsInN1YiI6IjY1NGUwZjQ2NWE1ZWQwMDBhZDU4YTY4YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ztrbs7ZoNV-6Gk5IeeEvGoJD0sRQmgKbPmbG88HB-GI';

export const movieUrl = 'https://api.themoviedb.org/3/';

export const requestOptions = (method, body) => ({
    method,
    headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify(body),
});
