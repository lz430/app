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

class Contact extends React.Component {
    static propTypes = {
        results: PropTypes.object,
        onSubmit: PropTypes.func.isRequired,
    };

    render() {
        return (
            <Container className="mb-5">
                <Row>
                    <Col>
                        <h1>
                            Have a Question? <br />
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
                        <div>
                            35 W Huron Street
                            <br />
                            Suite 1000
                            <br />
                            Pontiac, MI 48342
                        </div>
                        <div>
                            <a href="tel:855-675-7301">855-675-7301</a>
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
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withTracker
)(Contact);
