import React from 'react';

import { Container, Row, Col } from 'reactstrap';

import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

import testimonials from '../../../content/testimonials';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/pro-regular-svg-icons';

export default class extends React.Component {
    responsive = {
        0: { items: 1 },
        600: { items: 3 },
        1024: { items: 3 },
    };

    renderTestimonials(test) {
        var logo = test.logo.trim() == '';

        return (
            <Col className="individual">
                <p>
                    &quot;
                    {test.content}
                    &quot;
                </p>
                <div>
                    <span className="author">{test.author}</span>
                    {logo ? '' : <img src={test.logo} />}
                </div>
            </Col>
        );
    }

    render() {
        return (
            <div className="container-fluid callout__testimonials bg-focus bg-white pb-5 pt-5">
                <Container>
                    <Row>
                        <Col>
                            <h2>What our customers are saying</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
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
                                    key="testimonials-carousel"
                                    ref={el => (this.Carousel = el)}
                                    duration={600}
                                    autoPlay={false}
                                    startIndex={1}
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
                                    {testimonials.map(test =>
                                        this.renderTestimonials(test)
                                    )}
                                </AliceCarousel>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
