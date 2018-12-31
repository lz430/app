import '../../styles/app.scss';
import React from 'react';

import { compose } from 'redux';
import { connect } from 'react-redux';

import Head from 'next/head';
import { Container, Row, Col } from 'reactstrap';

import SignupForm from '../../apps/user/components/SignupForm';
import Link from 'next/link';
import { getUser } from '../../apps/session/selectors';
import { withRouter } from 'next/dist/lib/router';
import withTracker from '../../components/withTracker';
import Page from '../../components/Page';
import PropTypes from 'prop-types';
import { nextRouterType } from '../../core/types';

class Signup extends Page {
    static propTypes = {
        user: PropTypes.object,
        router: nextRouterType,
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
                    <div>
                        Thanks for creating an account <br />
                        <Link href="/auth/login" as="/login" passHref>
                            <a>Click here to login</a>
                        </Link>
                    </div>
                </Col>
            </Row>
        );
    }

    renderPageContent() {
        return (
            <Row>
                <Col md={{ size: 4, offset: 4 }} className="mt-5 mb-5">
                    <div className="bg-white border border-light rounded shadow-sm">
                        <h5 className="m-0 p-3 text-center">Signup</h5>
                        <SignupForm
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
        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride | Signup</title>
                </Head>
                <Container>
                    {this.props.user && this.renderAuthError()}
                    {!this.props.user &&
                        !this.state.wasSuccess &&
                        this.renderPageContent()}
                    {this.state.wasSuccess && this.renderSuccessMessage()}
                </Container>
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
)(Signup);
