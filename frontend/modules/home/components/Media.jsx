import React from 'react';

import { Container, Row, Col } from 'reactstrap';

import featuredMedia from '../../../content/media';

export default class extends React.Component {
    responsive = {
        0: { items: 1 },
        600: { items: 3 },
        1024: { items: 3 },
    };
    renderMedia(media) {
        return (
            <Col md="2" sm="6">
                <img src={media.logo} alt={media.name} />
            </Col>
        );
    }
    render() {
        return (
            <div className="container-fluid callout__media bg-light pb-5 pt-5">
                <Container>
                    <Row className="align-items-center">
                        <Col md="2" sm="12">
                            <h5>Featured In: </h5>
                        </Col>
                        {featuredMedia.map(media => this.renderMedia(media))}
                    </Row>
                </Container>
            </div>
        );
    }
}
