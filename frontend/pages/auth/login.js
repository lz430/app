import '../../styles/app.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';

import Head from 'next/head';

import { Container, Row, Col } from 'reactstrap';

import LoginForm from '../../apps/user/components/LoginForm';

import Link from 'next/link';

import Page from '../../components/Page';
import { loginUser } from '../../apps/user/actions';
import { withRouter } from 'next/router';
import withTracker from '../../components/withTracker';
import { nextRouterType } from '../../core/types';
import { getUser } from '../../apps/session/selectors';
import LoadingIcon from '../../components/Loading';

class Login extends Page {
    static propTypes = {
        user: PropTypes.object,
        loginUser: PropTypes.func.isRequired,
        router: nextRouterType,
    };

    state = {
        wasSuccess: false,
    };

    handleOnSuccess() {
        this.setState({ wasSuccess: true });
    }

    renderSuccessMessage() {
        return (
            <div className="bg-white border border-light shadow-sm rounded p-5 text-center">
                <LoadingIcon size={4} />
                <br />
                Logging In...
            </div>
        );
    }

    renderAuthError() {
        return (
            <div className="bg-white border border-light shadow-sm rounded">
                <h5 className="text-center mb-5 mt-5">
                    You are already logged in.
                </h5>
            </div>
        );
    }

    renderPageContent() {
        return (
            <React.Fragment>
                <div className="bg-white border border-light shadow-sm rounded">
                    <h5 className="m-0 p-3 text-center">Login</h5>
                    <LoginForm
                        handleOnSuccess={this.handleOnSuccess.bind(this)}
                        loginUser={this.props.loginUser}
                    />
                </div>
                <div className="text-center pt-1">
                    <Link href="/auth/signup" as="/signup" passHref>
                        <a>Create new account</a>
                    </Link>
                </div>
            </React.Fragment>
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
                    <title>Deliver My Ride | Login</title>
                </Head>
                <Container>
                    <Row>
                        <Col md={{ size: 4, offset: 4 }} className="mt-5 mb-5">
                            {content}
                        </Col>
                    </Row>
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
