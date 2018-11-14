import '../../styles/app.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { Container, Row, Col } from 'reactstrap';

import { withRouter } from 'next/router';
import withTracker from '../../components/withTracker';
import ContactForm from '../../modules/contact/components/ContactForm';

import Head from 'next/head';
import { track } from '../../core/services';

class Page extends React.Component {
    componentDidMount() {
        track('page:brochure-contact:view');
    }

    render() {
        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride | Contact Us</title>
                </Head>
                <Container className="contact mt-5 mb-5">
                    <Row>
                        <Col>
                            <h1>
                                <span>Have a Question? </span>
                                <br />
                                We&#39;re here to help.
                            </h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={4}>
                            <div>
                                <img
                                    alt="Deliver My Ride Location"
                                    className="img-fluid"
                                    src="/static/images/about-riker.jpg"
                                />
                            </div>
                            <div className="contact__address">
                                <span>35 W Huron Street Suite 1000</span>
                                <br />
                                <span>Pontiac, MI 48342</span>
                            </div>
                            <div className="contact__links">
                                <a href="tel:855-675-7301">855-675-7301</a>
                                <a href="mailto:support@delivermyride.com">
                                    support@delivermyride.com
                                </a>
                                <a href="#hs-chat-open">Live Chat</a>
                            </div>
                        </Col>
                        <Col xl={8}>
                            <ContactForm
                                onSubmit={this.props.onSubmit}
                                results={this.props.results}
                            />
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}

export default withRouter(withTracker(Page));
