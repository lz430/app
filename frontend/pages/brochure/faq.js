import '../../styles/app.scss';
import React from 'react';
import PageHero from '../../components/brochure/PageHero';
import { Container, Row, Col, Collapse } from 'reactstrap';
import Link from 'next/link';
import Faqs from '../../components/brochure/faqs';
import FaqGroup from '../../components/brochure/brochure-faqGroup';

import { filter } from 'ramda';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = { collapse: false };
    }

    state = {
        collapse: false,
        active: false,
    };

    toggle() {
        this.setState({
            collapse: !this.state.collapse,
            active: !this.state.active,
        });
    }

    handleClickTOC() {}

    getFaqContent() {
        return filter(item => {
            return item.featured;
        }, Faqs);
    }

    render() {
        return (
            <div>
                <PageHero
                    backgroundImage="/static/brochure/About_Us.jpg"
                    title="FAQs"
                />
                <Container className="faq">
                    <Row>
                        <Col sm="3">
                            <ul className="toc">
                                <li onClick={this.handleClickTOC()}>
                                    <a href="#">Purchase</a>
                                </li>
                                <li>
                                    <a href="#">Inventory</a>
                                </li>
                                <li>
                                    <a href="#">Financing</a>
                                </li>
                                <li>
                                    <a href="#">Insurance</a>
                                </li>
                                <li>
                                    <a href="#">Trade-In's</a>
                                </li>
                                <li>
                                    <a href="#">Pricing, Rebates, Incentives</a>
                                </li>
                                <li>
                                    <a href="#">Warranty and Services</a>
                                </li>
                                <li>
                                    <a href="#">Delivery</a>
                                </li>
                            </ul>
                        </Col>
                        <Col sm="9">
                            <div className="faq__accordion">
                                {Object.keys(Faqs).map((key, index) => (
                                    <FaqGroup key={index} item={Faqs[key]} />
                                ))}
                            </div>
                        </Col>
                        <Col sm="3">
                            <div className="faq__contact">
                                <h4>Not finding what you're looking for?</h4>
                                <a href="tel:855-675-7301">855-675-7301</a>
                                <a href="mailto:support@delivermyride.com">
                                    support@delivermyride.com
                                </a>
                                <a href="#hs-chat-open">Live Chat</a>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
