import '../../styles/app.scss';
import React, { Component } from 'react';
import PageHero from '../../components/brochure/PageHero';
import { Container, Row, Col } from 'reactstrap';
import { MediumAndUp, SmallAndDown } from '../../components/Responsive';
import Faqs from '../../content/faqs';
import FaqGroup from '../../components/brochure/brochure-faqGroup';
import withTracker from '../../components/withTracker';
import { withRouter } from 'next/router';
import Head from 'next/head';
import { track } from '../../core/services';

class Page extends Component {
    state = {
        collapse: false,
        active: false,
        category: 'General Questions',
    };

    componentDidMount() {
        track('page:brochure-faq:view');
    }

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
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride | FAQs</title>
                </Head>
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
                            <MediumAndUp>
                                <div className="faq__contact">
                                    <h4>
                                        Not finding what you&apos;re looking
                                        for?
                                    </h4>
                                    <a href="tel:855-675-7301">855-675-7301</a>
                                    <a href="mailto:support@delivermyride.com">
                                        support@delivermyride.com
                                    </a>
                                    <a href="#hs-chat-open">Live Chat</a>
                                </div>
                            </MediumAndUp>
                        </Col>
                        <Col sm="9">
                            <div className="faq__accordion">
                                {this.getFaqContent().map(item => (
                                    <FaqGroup key={item.title} item={item} />
                                ))}
                            </div>
                            <SmallAndDown>
                                <div className="faq__contact">
                                    <h4>
                                        Not finding what you&apos;re looking
                                        for?
                                    </h4>
                                    <a href="tel:855-675-7301">855-675-7301</a>
                                    <a href="mailto:support@delivermyride.com">
                                        support@delivermyride.com
                                    </a>
                                    <a href="#hs-chat-open">Live Chat</a>
                                </div>
                            </SmallAndDown>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}

export default withRouter(withTracker(Page));
