import '../../styles/app.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { Container, Row, Col } from 'reactstrap';

import { compose } from 'redux';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import withTracker from '../../components/withTracker';
import { submitContactForm } from '../../modules/contact/actions';
import ContactForm from '../../modules/contact/components/ContactForm';

import Head from 'next/head';

class Contact extends React.Component {
    static propTypes = {
        results: PropTypes.object,
        onSubmit: PropTypes.func.isRequired,
    };

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

const mapStateToProps = state => {
    return {
        results: state.pages.contact.results,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSubmit: (values, actions) => {
            return dispatch(submitContactForm(values, actions));
        },
    };
};

export default compose(
    withRouter,
    withTracker,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Contact);
