import React, { Component } from 'react';
import { Button, Card, Flex, Image, Typography } from 'antd';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import placeholderImage from '../../assets/img/movie_placeholder.png';

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
    justifyContent: 'space-between',
};

const movieInfoStyles = {
    width: '55%',
    paddingRight: '10px',
};

export default class MovieCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            maxDescriptionLength: 0,
        };

        this.innerWidth = window.innerWidth;
        this.maxTitleLength = 35;
    }

    componentDidMount() {
        this.handleResize(this.innerWidth);
    }

    handleResize = innerWidth => {
        if (innerWidth > 550) {
            this.setState(prev => ({ ...prev, maxDescriptionLength: 150 }));
        } else if (innerWidth <= 550) {
            this.setState(prev => ({ ...prev, maxDescriptionLength: 120 }));
        } else if (innerWidth <= 440) {
            this.setState(prev => ({ ...prev, maxDescriptionLength: 100 }));
        } else if (innerWidth <= 340) {
            this.setState(prev => ({ ...prev, maxDescriptionLength: 70 }));
        }
    };

    formattedDate = date => {
        if (date !== '') {
            return format(new Date(date), 'MMMM d, yyyy');
        }

        return null;
    };

    textTruncate = (text, maxLength) => {
        if (text.length >= maxLength) {
            const truncated = text
                .slice(0, maxLength + 1)
                .split(' ')
                .slice(0, -1)
                .join(' ');
            return truncated.length ? `${truncated}...` : '';
        }

        return text;
    };

    render() {
        let { description, releaseDate, title } = this.props;
        const { image, baseUrl, posterSize } = this.props;
        const { maxDescriptionLength } = this.state;

        releaseDate = this.formattedDate(releaseDate);
        description = this.textTruncate(description, maxDescriptionLength);
        title = this.textTruncate(title, this.maxTitleLength);

        const finalImage = image
            ? `${baseUrl}${posterSize}${image}`
            : placeholderImage;

        return (
            <Card className="card" bodyStyle={bodyCardStyles}>
                <Flex style={movieInnerStyles} gap={20}>
                    <Image width="40%" height="100%" src={finalImage} />
                    <Flex vertical style={movieInfoStyles}>
                        <Title
                            style={titleStyles}
                            level={this.innerWidth > 550 ? 4 : 5}
                        >
                            {title}
                        </Title>
                        {releaseDate && (
                            <Text style={releaseDateStyles} type="secondary">
                                {releaseDate}
                            </Text>
                        )}
                        <Flex>
                            <Button
                                style={genreStyles}
                                size={
                                    this.innerWidth > 550 ? 'middle' : 'small'
                                }
                                type="text"
                            >
                                Action
                            </Button>
                            <Button
                                style={genreStyles}
                                size={
                                    this.innerWidth > 550 ? 'middle' : 'small'
                                }
                                type="text"
                            >
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

MovieCard.defaultProps = {
    releaseDate: null,
    image: null,
};

MovieCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string,
    baseUrl: PropTypes.string.isRequired,
    posterSize: PropTypes.string.isRequired,
    releaseDate: PropTypes.string,
};
