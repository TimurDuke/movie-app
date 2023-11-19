import React, { Component } from 'react';
import { Button, Typography } from 'antd';
import { MovieContext } from '../../providers/MovieProvider/MovieProvider';

const { Title } = Typography;

class RatedMoviesEmpty extends Component {
    static contextType = MovieContext;

    render() {
        const { authProcess, isSessionApproved } = this.context;

        return (
            <Title level={4} style={{ textAlign: 'center' }}>
                The "Rated Movies" list is empty.
                {!isSessionApproved ? (
                    <>
                        <div>
                            To rate movies, you need to confirm the session.
                        </div>
                        <Button
                            style={{ marginTop: '15px' }}
                            type="primary"
                            size="middle"
                            onClick={() => authProcess()}
                        >
                            Confirm session
                        </Button>
                    </>
                ) : null}
            </Title>
        );
    }
}

export default RatedMoviesEmpty;
