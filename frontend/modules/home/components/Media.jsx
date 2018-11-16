import React from 'react';

import { Container, Row, Col } from 'reactstrap';

import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

import featuredMedia from '../../../content/media';

export default class extends React.Component {
    responsive = {
        0: { items: 1 },
        600: { items: 3 },
        1024: { items: 3 },
    };
    renderMedia(media) {
        console.log(media);

        return (
            <Col md="4">
                <img src={media.logo} alt={media.name} />
            </Col>
        );
    }
    render() {
        return (
            <div className="container-fluid callout__media bg-light pb-5 pt-5">
                <Container>
                    <Row className="align-items-center">
                        <Col>
                            <h5>Featured In: </h5>
                        </Col>
                    </Row>
                    <Row>
                        {featuredMedia.map(media => this.renderMedia(media))}
                    </Row>
                </Container>
            </div>
        );
    }
}
