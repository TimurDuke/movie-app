import React, { Component } from 'react';
import MovieList from './containers/MovieList';
import MovieProvider from './providers/MovieProvider';

export default class App extends Component {
    render() {
        return (
            <MovieProvider>
                <MovieList />
            </MovieProvider>
        );
    }
}
