import React, { PureComponent } from 'react';
import { Button, Card, Flex, Image, Rate, Typography } from 'antd';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import placeholderImage from '../../assets/img/movie_placeholder.png';

import { MovieContext } from '../../providers/MovieProvider/MovieProvider';
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
    fontSize: '14px',
};

const titleStyles = {
    margin: '0',
};

const movieInnerStyles = {
    height: '100%',
    justifyContent: 'space-between',
};

const movieInfoStyles = {
    width: '55%',
    padding: '0 10px 10px 0',
    overflow: 'hidden',
};

const movieInfoMobileStyles = {
    padding: '10px',
    overflow: 'hidden',
};

const titleAndRateBlockStyles = {
    margin: '10px 0',
    gap: '10px',
    alignItems: 'center',
    justifyContent: 'space-between',
};

export default class MovieCard extends PureComponent {
    static contextType = MovieContext;

    constructor(props) {
        super(props);

        this.state = {
            maxDescriptionLength: 0,
            isDesktop: false,
            isMobile: false,
        };

        this.maxTitleLength = 35;
    }

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        const { innerWidth } = window;
        const { maxDescriptionLength } = this.state;

        if (innerWidth > 425) {
            this.setState(prev => ({
                ...prev,
                isDesktop: true,
                isMobile: false,
            }));
        } else if (innerWidth <= 425) {
            this.setState(prev => ({
                ...prev,
                isMobile: true,
                isDesktop: false,
            }));
        }

        if (innerWidth > 1075 && maxDescriptionLength !== 140) {
            this.setState(prev => ({ ...prev, maxDescriptionLength: 140 }));
            return;
        }

        if (
            innerWidth <= 1075 &&
            innerWidth > 550 &&
            maxDescriptionLength !== 120
        ) {
            this.setState(prev => ({ ...prev, maxDescriptionLength: 120 }));
            return;
        }

        if (
            innerWidth <= 550 &&
            innerWidth > 490 &&
            maxDescriptionLength !== 100
        ) {
            this.setState(prev => ({ ...prev, maxDescriptionLength: 100 }));
            return;
        }

        if (innerWidth <= 490 && maxDescriptionLength !== 70) {
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

    getGenreNames = (genreIds, genresMap) =>
        genreIds.map(id => ({ id, name: genresMap[id] }));

    getRateColor = rating => {
        if (rating >= 0 && rating < 3) {
            return '#E90000';
        }
        if (rating >= 3 && rating < 5) {
            return '#E97E00';
        }
        if (rating >= 5 && rating < 7) {
            return '#E9D100';
        }
        if (rating >= 7) {
            return '#66E900';
        }

        return 'Invalid rating';
    };

    render() {
        let { description, releaseDate, title } = this.props;
        const { id, image, userRating, genreIds } = this.props;
        const { maxDescriptionLength, isDesktop, isMobile } = this.state;
        const {
            imageProps: { baseUrl, posterSize },
            rateMovieHandler,
            ratedMap,
            isSessionApproved,
        } = this.context;

        const genreNames = this.getGenreNames(genreIds, this.context.genresMap);
        releaseDate = this.formattedDate(releaseDate);
        description = this.textTruncate(description, maxDescriptionLength);
        title = this.textTruncate(title, this.maxTitleLength);

        const finalImage = image
            ? `${baseUrl}${posterSize}${image}`
            : placeholderImage;

        let movieRating = null;

        if (ratedMap) {
            movieRating = ratedMap[id];
        }

        const rating = userRating || movieRating;

        return (
            <>
                {isDesktop && (
                    <Card className="card" bodyStyle={bodyCardStyles}>
                        <Flex style={movieInnerStyles} gap={20}>
                            <Image width="40%" height="100%" src={finalImage} />
                            <Flex vertical style={movieInfoStyles}>
                                <Flex style={titleAndRateBlockStyles}>
                                    <Title
                                        style={titleStyles}
                                        className={
                                            rating ? 'title-rating' : 'title'
                                        }
                                        level={this.innerWidth > 550 ? 4 : 5}
                                    >
                                        {title}
                                    </Title>
                                    {rating ? (
                                        <div
                                            className="badge"
                                            style={{
                                                borderColor: `${this.getRateColor(
                                                    rating
                                                )}`,
                                            }}
                                        >
                                            {rating}
                                        </div>
                                    ) : null}
                                </Flex>
                                {releaseDate && (
                                    <Text
                                        style={releaseDateStyles}
                                        type="secondary"
                                    >
                                        {releaseDate}
                                    </Text>
                                )}
                                <Flex wrap="wrap">
                                    {genreNames.length !== 0 &&
                                        genreNames.map(genre => (
                                            <Button
                                                key={genre.id}
                                                style={genreStyles}
                                                size="small"
                                                type="text"
                                            >
                                                {genre.name}
                                            </Button>
                                        ))}
                                </Flex>
                                <Text>{description}</Text>
                                {isSessionApproved ? (
                                    <Rate
                                        onChange={value =>
                                            rateMovieHandler({
                                                rating: value,
                                                movieId: id,
                                            })
                                        }
                                        style={{
                                            display: 'flex',
                                            flexGrow: '1',
                                            alignItems: 'flex-end',
                                        }}
                                        count={10}
                                        allowHalf
                                        value={rating}
                                        disabled={rating}
                                    />
                                ) : null}
                            </Flex>
                        </Flex>
                    </Card>
                )}
                {isMobile && (
                    <Card className="card" bodyStyle={bodyCardStyles}>
                        <Flex style={movieInnerStyles} gap={20}>
                            <Flex vertical style={movieInfoMobileStyles}>
                                <Flex
                                    style={{
                                        width: '100%',
                                        justifyContent: 'space-between',
                                        marginBottom: '15px',
                                    }}
                                >
                                    <Image
                                        width="25%"
                                        height="100%"
                                        src={finalImage}
                                    />
                                    <Flex vertical style={{ width: '70%' }}>
                                        <Flex style={titleAndRateBlockStyles}>
                                            <Title
                                                style={titleStyles}
                                                className={
                                                    rating
                                                        ? 'title-rating'
                                                        : 'title'
                                                }
                                                level={5}
                                            >
                                                {title}
                                            </Title>
                                            {rating ? (
                                                <div
                                                    className="badge"
                                                    style={{
                                                        borderColor: `${this.getRateColor(
                                                            rating
                                                        )}`,
                                                    }}
                                                >
                                                    {rating}
                                                </div>
                                            ) : null}
                                        </Flex>
                                        {releaseDate && (
                                            <Text
                                                style={releaseDateStyles}
                                                type="secondary"
                                            >
                                                {releaseDate}
                                            </Text>
                                        )}
                                        <Flex wrap="wrap">
                                            {genreNames.length !== 0 &&
                                                genreNames.map(genre => (
                                                    <Button
                                                        key={genre.id}
                                                        style={genreStyles}
                                                        size="small"
                                                        type="text"
                                                    >
                                                        {genre.name}
                                                    </Button>
                                                ))}
                                        </Flex>
                                    </Flex>
                                </Flex>
                                <Text>{description}</Text>
                                {isSessionApproved ? (
                                    <Rate
                                        onChange={value =>
                                            rateMovieHandler({
                                                rating: value,
                                                movieId: id,
                                            })
                                        }
                                        style={{
                                            display: 'flex',
                                            flexGrow: '1',
                                            alignItems: 'flex-end',
                                            justifyContent: 'flex-end',
                                            padding: '5px',
                                        }}
                                        count={10}
                                        allowHalf
                                        value={rating}
                                        disabled={rating}
                                    />
                                ) : null}
                            </Flex>
                        </Flex>
                    </Card>
                )}
            </>
        );
    }
}

MovieCard.defaultProps = {
    releaseDate: null,
    image: null,
    userRating: null,
};

MovieCard.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    genreIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    image: PropTypes.string,
    releaseDate: PropTypes.string,
    userRating: PropTypes.number,
};
