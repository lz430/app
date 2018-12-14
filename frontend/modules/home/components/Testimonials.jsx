import React from 'react';
import { Container, Row, Col } from 'reactstrap';

import testimonials from '../../../content/testimonials';

export default class extends React.Component {
    renderTestimonials(test) {
        return (
            <Col md={3} className="individual">
                <p>
                    &quot;
                    {test.content}
                    &quot;
                </p>
                <div>
                    <span className="author">{test.author}</span>
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
                        {testimonials.map(test =>
                            this.renderTestimonials(test)
                        )}
                    </Row>
                </Container>
            </div>
        );
    }
}
