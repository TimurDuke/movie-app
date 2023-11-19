import React, { Component } from 'react';
import { Button, Flex, Tabs } from 'antd';
import ErrorView from '../../components/UI/ErrorView';
import MoviesComponent from '../../components/MoviesComponent';
import RatedMoviesComponent from '../../components/RatedMoviesComponent';
import Notification from '../../components/UI/Notification';
import { MovieContext } from '../../providers/MovieProvider/MovieProvider';

import './MovieList.css';
import RatedMoviesEmpty from '../../components/RatedMoviesComponent/RatedMoviesEmpty';

export default class MovieList extends Component {
    static contextType = MovieContext;

    componentDidMount() {
        const { initializeAuthProcess, getConfiguration } = this.context;

        initializeAuthProcess();
        getConfiguration();
    }

    renderedError = () => {
        const {
            isLoading,
            errors: { isError, errorMessage },
            searchMovies,
        } = this.context;

        if (!isLoading && isError) {
            return (
                <ErrorView
                    title="Request error!"
                    description={
                        <>
                            {errorMessage}
                            <Button
                                style={{ marginLeft: '10px' }}
                                onClick={() => searchMovies()}
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
        const { ratedMovies } = this.context;

        let ratedComponent;

        if (ratedMovies.length === 0) {
            ratedComponent = <RatedMoviesEmpty />;
        } else {
            ratedComponent = (
                <Flex className="wrapper-body" wrap="wrap">
                    <RatedMoviesComponent />
                </Flex>
            );
        }

        return [
            {
                key: '1',
                label: 'Search',
                children: (
                    <Flex className="wrapper-body" wrap="wrap">
                        <MoviesComponent />
                    </Flex>
                ),
            },
            {
                key: '2',
                label: 'Rated',
                children: ratedComponent,
            },
        ];
    };

    render() {
        const {
            isSessionDenied,
            isSessionApproved,
            authProcess,
            isRatedByUserLoading,
            isRatedError,
        } = this.context;

        return (
            <>
                {this.renderedError()}
                <Flex className="wrapper" justify="center">
                    <div className="wrapper-inner">
                        <Notification
                            isSuccess={isSessionApproved}
                            successMessage="You have successfully confirmed your session."
                            isWarning={isSessionDenied}
                            warningMessage="You have not confirmed your session. If you want to rate movies, you need to confirm your session."
                            warningActionHandler={() => authProcess()}
                        />
                        <Notification
                            isSuccess={isRatedByUserLoading && !isRatedError}
                            successMessage="You have successfully rated the movie."
                        />
                        <Tabs
                            defaultActiveKey="1"
                            destroyInactiveTabPane
                            items={this.items()}
                        />
                    </div>
                </Flex>
            </>
        );
    }
}
