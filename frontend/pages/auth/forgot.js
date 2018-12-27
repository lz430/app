import '../../styles/app.scss';
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Head from 'next/head';
import { Container, Row, Col } from 'reactstrap';

import ForgotForm from '../../modules/forgot/components/ForgotForm';
import Link from 'next/link';
import { getUser } from '../../apps/session/selectors';
import { withRouter } from 'next/dist/lib/router';
import withTracker from '../../components/withTracker';
import PropTypes from 'prop-types';

class Page extends React.Component {
    static propTypes = {
        user: PropTypes.object,
    };

    state = {
        wasSuccess: false,
    };

    handleOnSuccess() {
        this.setState({ wasSuccess: true });
    }

    renderAuthError() {
        return (
            <Row>
                <Col>
                    <h5 className="text-center mb-5 mt-5">
                        You are already logged in.
                    </h5>
                </Col>
            </Row>
        );
    }

    renderSuccessMessage() {
        return (
            <Row>
                <Col>
                    <div>Please check your email</div>
                </Col>
            </Row>
        );
    }

    renderPageContent() {
        return (
            <Row>
                <Col md={{ size: 4, offset: 4 }} className="mt-5 mb-5">
                    <div className="bg-white border border-light rounded shadow-sm">
                        <h4 className="m-0 p-3">Request Password Reset</h4>
                        <ForgotForm
                            handleOnSuccess={this.handleOnSuccess.bind(this)}
                        />
                    </div>

                    <div className="text-center pt-1">
                        <Link href="/auth/login" as="/login" passHref>
                            <a>Back to login</a>
                        </Link>
                    </div>
                </Col>
            </Row>
        );
    }

    render() {
        let content;

        if (this.state.wasSuccess) {
            content = this.renderSuccessMessage();
        } else if (this.props.user) {
            content = this.renderAuthError();
        } else {
            content = this.renderPageContent();
        }

        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride | Forgot Password</title>
                </Head>
                <Container>{content}</Container>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: getUser(state),
    };
};

const mapDispatchToProps = () => {
    return {};
};

export default compose(
    withRouter,
    withTracker,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Page);
