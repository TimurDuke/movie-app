import React, { Component } from 'react';
import { Button, Card, Flex, Image, Typography } from 'antd';
import PropTypes from 'prop-types';

import './MovieCard.css';

const { Title, Text } = Typography;

const bodyCardStyles = {
    padding: '0',
    height: '100%',
};

const releaseDateStyles = {
    marginBottom: '10px',
};

const genreStyles = {
    background: '#f6f6f6',
    border: '1px solid #ccc',
    margin: '0 10px 10px 0',
};

const titleStyles = {
    margin: '10px 0',
};

const movieInnerStyles = {
    height: '100%',
};

const movieInfoStyles = {
    width: '55%',
    paddingRight: '10px',
};

export default class MovieCard extends Component {
    render() {
        const { title, description, releaseDate } = this.props;

        return (
            <Card className="card" bodyStyle={bodyCardStyles}>
                <Flex style={movieInnerStyles} gap={20}>
                    <Image
                        width="40%"
                        height="100%"
                        src="https://m.media-amazon.com/images/M/MV5BMTIzNDYzMzgtZWMzNS00ODc2LTg2ZmMtOTE2MWZkNzIxMmQ0XkEyXkFqcGdeQXVyNjQ3MDg0MTY@._V1_FMjpg_UX1000_.jpg"
                    />
                    <Flex vertical style={movieInfoStyles}>
                        <Title style={titleStyles} level={4}>
                            {title}
                        </Title>
                        <Text style={releaseDateStyles} type="secondary">
                            {releaseDate}
                        </Text>
                        <Flex>
                            <Button style={genreStyles} type="text">
                                Action
                            </Button>
                            <Button style={genreStyles} type="text">
                                Drama
                            </Button>
                        </Flex>
                        <Text>{description}</Text>
                    </Flex>
                </Flex>
            </Card>
        );
    }
}

MovieCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    releaseDate: PropTypes.string.isRequired,
};
