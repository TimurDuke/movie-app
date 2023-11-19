import React from 'react';
import MovieCard from '../components/MovieCard';
import SkeletonMovieCard from '../components/UI/SkeletonMovieCard';

export const renderedCards = ({ isLoading, isError, movies }) => {
    if (!isLoading && movies && movies.length !== 0) {
        return movies.map(movie => {
            const {
                id,
                title,
                poster_path: posterPath,
                overview: description,
                release_date: releaseDate,
                rating: userRating,
                genre_ids: genreIds,
            } = movie;

            return (
                <MovieCard
                    key={id}
                    id={id}
                    title={title}
                    description={description}
                    releaseDate={releaseDate}
                    image={posterPath}
                    userRating={userRating}
                    genreIds={genreIds}
                />
            );
        });
    }

    if (isLoading && !isError) {
        const cardsCount = Array.from({ length: 20 }, (_, index) => index);
        return cardsCount.map(index => <SkeletonMovieCard key={index} />);
    }

    return null;
};
