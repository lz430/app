import React from 'react';

import { Container, Row, Col } from 'reactstrap';

import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

import testimonials from '../../../content/testimonials';

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
            <div className="container-fluid callout__testimonials bg-light pb-5 pt-5">
                <Container>
                    <Row>
                        <Col>
                            <h2>What our customers are saying</h2>
                        </Col>
                    </Row>
                    <Row>
                        <AliceCarousel
                            ref={el => (this.Carousel = el)}
                            duration={600}
                            autoPlay={true}
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
                            {testimonials.map(test =>
                                this.renderTestimonials(test)
                            )}
                        </AliceCarousel>
                    </Row>
                </Container>
            </div>
        );
    }
}
