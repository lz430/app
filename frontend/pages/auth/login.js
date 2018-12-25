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

class Login extends Page {
    static propTypes = {
        loginUser: PropTypes.func.isRequired,
        router: nextRouterType,
    };

    render() {
        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride | Login</title>
                </Head>
                <Container>
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
                </Container>
            </React.Fragment>
        );
    }
}

const mapStateToProps = () => {
    return {};
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
