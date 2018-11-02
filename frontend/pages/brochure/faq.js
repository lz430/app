import '../../styles/app.scss';
import React from 'react';
import PageHero from '../../components/brochure/PageHero';
import { Container, Row, Col } from 'reactstrap';
import Faqs from '../../content/faqs';
import FaqGroup from '../../components/brochure/brochure-faqGroup';

import { filter } from 'ramda';

export default class extends React.Component {
    state = {
        collapse: false,
        active: false,
        category: 'General Questions',
    };

    toggle() {
        this.setState({
            collapse: !this.state.collapse,
            active: !this.state.active,
        });
    }

    getFaqContent() {
        return Faqs.filter(item => item.category === this.state.category);
    }

    faqNavigation = name =>
        this.setState({
            category: name,
        });

    renderNav() {
        const cats = [...new Set(Faqs.map(q => q.category))];
        const catsR = cats.map((name, i) => {
            return (
                <li
                    key={i}
                    onClick={() => this.faqNavigation(name)}
                    className={
                        this.state.category === name ? 'active' : 'not-active'
                    }
                >
                    {name}
                </li>
            );
        });
        return (
            <div>
                <ul className="toc">{catsR}</ul>
            </div>
        );
    }

    render() {
        return (
            <div>
                <PageHero
                    backgroundImage="/static/brochure/About_Us.jpg"
                    title="FAQs"
                    subtitle="A modern way to buy or lease your next vehicle"
                    button="Find your new car"
                />
                <Container className="faq">
                    <Row>
                        <Col sm="3" className="faq__nav">
                            {this.renderNav()}
                        </Col>
                        <Col sm="9">
                            <div className="faq__accordion">
                                {this.getFaqContent().map((item, index) => (
                                    <FaqGroup key={item.title} item={item} />
                                ))}
                            </div>
                        </Col>
                        <Col sm="3">
                            <div className="faq__contact">
                                <h4>
                                    Not finding what you&apos;re looking for?
                                </h4>
                                <a href="tel:855-675-7301">855-675-7301</a>
                                <a href="mailto:support@delivermyride.com">
                                    support%40delivermyride.com
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
