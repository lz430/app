import '../../styles/app.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';

import Head from 'next/head';

import { Container, Row, Col } from 'reactstrap';

import LoginForm from '../../modules/login/components/LoginForm';

import Link from 'next/link';

import Page from '../../components/Page';
import { loginUser } from '../../apps/user/actions';
import { withRouter } from 'next/router';
import withTracker from '../../components/withTracker';
import { nextRouterType } from '../../core/types';
import { getUser } from '../../apps/session/selectors';

class Login extends Page {
    static propTypes = {
        user: PropTypes.object,
        loginUser: PropTypes.func.isRequired,
        router: nextRouterType,
    };

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

    renderPageContent() {
        return (
            <Row>
                <Col md={{ size: 4, offset: 4 }} className="mt-5 mb-5">
                    <div className="bg-white border border-light shadow-sm rounded">
                        <h5 className="m-0 p-3 text-center">Login</h5>
                        <LoginForm loginUser={this.props.loginUser} />
                    </div>
                    <div className="text-center pt-1">
                        <Link href="/auth/signup" as="/signup" passHref>
                            <a>Create new account</a>
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
                    <title>Deliver My Ride | Login</title>
                </Head>
                <Container>
                    {this.props.user && this.renderAuthError()}
                    {!this.props.user && this.renderPageContent()}
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

const mapDispatchToProps = dispatch => {
    return {
        loginUser: (values, actions) => {
            return dispatch(loginUser(values, actions));
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
)(Login);
