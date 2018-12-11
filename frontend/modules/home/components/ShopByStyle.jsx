import React from 'react';

import { Container, Row, Col, Button } from 'reactstrap';
import Link from 'next/link';

import styles from '../../../content/styles';

import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { nextRouterType } from '../../../core/types';
import { track } from '../../../core/services';

import { faArrowLeft, faArrowRight } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class extends React.Component {
    static propTypes = {
        router: nextRouterType,
    };

    responsive = {
        0: { items: 1 },
        576: { items: 1 },
        768: { items: 2 },
        992: { items: 2 },
        1200: { items: 3 },
    };

    state = {
        items: [],
    };

    trackLinkClick(style, query) {
        track('brochure:style:select', {
            'Brochure Style': style.title,
            'Brochure Strategy': query.purchaseStrategy,
        });
    }

    renderStyle(style) {
        const query = {
            entity: 'model',
            sort: 'payment',
            filters: style.query,
            purchaseStrategy: 'finance',
        };

        return (
            <Link
                key={style.title}
                href={{ pathname: '/deal-list', query: query }}
                as={{ pathname: '/filter', query: query }}
                passHref
            >
                <a
                    onClick={() => this.trackLinkClick(style, query)}
                    className="style__item text-center"
                    style={{ backgroundImage: 'url(' + style.icon + ')' }}
                >
                    <h5>{style.title}</h5>

                    <div className="cta">
                        <span>See All</span>
                    </div>
                </a>
            </Link>
        );
    }

    render() {
        return (
            <div className="container-fluid callout__categories">
                <Container>
                    <div className="carousel">
                        <div
                            onClick={() => this.Carousel._slidePrev()}
                            className="fancy-carousel-control fancy-carousel-control-prev"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </div>
                        <div
                            onClick={() => this.Carousel._slideNext()}
                            className="fancy-carousel-control fancy-carousel-control-next"
                        >
                            <FontAwesomeIcon icon={faArrowRight} />
                        </div>
                        <AliceCarousel
                            ref={el => (this.Carousel = el)}
                            duration={400}
                            autoPlay={false}
                            startIndex={0}
                            fadeOutAnimation={true}
                            mouseDragEnabled={false}
                            playButtonEnabled={false}
                            autoPlayInterval={2000}
                            autoPlayDirection="rtl"
                            responsive={this.responsive}
                            disableAutoPlayOnAction={true}
                            onSlideChange={this.onSlideChange}
                            onSlideChanged={this.onSlideChanged}
                            dotsDisabled={true}
                            buttonsDisabled={true}
                        >
                            {styles.map(style => this.renderStyle(style))}
                        </AliceCarousel>
                    </div>
                    <Row>
                        <Col className="text-center mt-5">
                            <Link href="/deal-list" as="/filter" passHref>
                                <Button
                                    tag="a"
                                    color="primary"
                                    className="shadow-sm font-weight-bold"
                                >
                                    Browse All Cars
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
