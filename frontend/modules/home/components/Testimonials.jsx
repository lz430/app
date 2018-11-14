import React from 'react';

import { Container, Row, Col } from 'reactstrap';

import testimonials from '../../../content/testimonials';

import { nextRouterType } from '../../../core/types';
import { track } from '../../../core/services';

export default class extends React.Component {
    trackLinkClick(style, query) {
        track('brochure:style:select', {
            'Brochure Style': style.title,
            'Brochure Strategy': query.purchaseStrategy,
        });
    }

    renderTestimonials(test) {
        return (
            <Col md="4">
                <h3>{test.title}</h3>
                <p>
                    &quot;
                    {test.content}
                    &quot;
                </p>
                <div className="author">
                    <span>{test.author}</span>
                    {/*TODO: Add scroller and other fields in testimonial object*/}
                </div>
            </Col>
        );
    }
    render() {
        return (
            <div className="container-fluid callout__testimonials">
                <Container>
                    <Row>
                        <Col>
                            <h2>What our customers are saying</h2>
                        </Col>
                    </Row>
                    <Row>
                        {testimonials
                            .slice(0, 3)
                            .map(test => this.renderTestimonials(test))}
                    </Row>
                </Container>
            </div>
        );
    }
}
