import React from 'react';

import { Container, Row, Col } from 'reactstrap';
import Link from 'next/link';

import styles from '../../../content/styles';

import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { nextRouterType } from '../../../core/types';
import { track } from '../../../core/services';

export default class extends React.Component {
    static propTypes = {
        router: nextRouterType,
    };

    responsive = {
        0: { items: 2 },
        600: { items: 3 },
        1024: { items: 4 },
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
                    className="__category m-2 text-center"
                >
                    <h5>{style.title}</h5>
                    <div className="icon">
                        <img
                            src="https://source.unsplash.com/220x125?car"
                            className="img-fluid"
                        />
                    </div>
                    <div>
                        <span className="cta">See All</span>
                    </div>
                </a>
            </Link>
        );
    }
    render() {
        return (
            <div className="container-fluid callout__categories">
                <Container>
                    <AliceCarousel
                        ref={el => (this.Carousel = el)}
                        duration={400}
                        autoPlay={false}
                        startIndex={1}
                        fadeOutAnimation={true}
                        mouseDragEnabled={true}
                        playButtonEnabled={false}
                        autoPlayInterval={2000}
                        autoPlayDirection="rtl"
                        responsive={this.responsive}
                        disableAutoPlayOnAction={true}
                        onSlideChange={this.onSlideChange}
                        onSlideChanged={this.onSlideChanged}
                        dotsDisabled={true}
                    >
                        {styles.map(style => this.renderStyle(style))}
                    </AliceCarousel>
                    <Row>
                        <Col className="text-center mt-5">
                            <Link href="/deal-list" as="/filter" passHref>
                                <a className="btn btn-primary">
                                    Browse All Cars
                                </a>
                            </Link>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
