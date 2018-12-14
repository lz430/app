import React from 'react';

import { Container, Row, Col } from 'reactstrap';

import featuredMedia from '../../../content/media';
import StaticImage from '../../../components/StaticImage';

export default class extends React.Component {
    renderMedia(media) {
        return (
            <Col md="2" sm="6" key={media.name}>
                <a
                    href={media.link}
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                >
                    <StaticImage path={media.logo} alt={media.name} />
                </a>
            </Col>
        );
    }

    render() {
        return (
            <div className="container-fluid callout__media bg-light pb-5 pt-5">
                <Container>
                    <Row className="align-items-center justify-content-center">
                        {featuredMedia.map(media => this.renderMedia(media))}
                    </Row>
                </Container>
            </div>
        );
    }
}
