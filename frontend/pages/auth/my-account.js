import '../../styles/app.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';

import Head from 'next/head';

import { Container, Row, Col } from 'reactstrap';

import Page from '../../components/Page';
import { withRouter } from 'next/router';
import withTracker from '../../components/withTracker';
import { nextRouterType } from '../../core/types';
import { getUser } from '../../apps/session/selectors';
import { logoutUser } from '../../apps/user/actions';

class MyAccount extends Page {
    static propTypes = {
        user: PropTypes.object,
        logoutUser: PropTypes.func.isRequired,
        router: nextRouterType,
    };

    state = {
        loggingOut: false,
    };

    handleLogout() {
        this.setState({ loggingOut: true });
        this.props.logoutUser();
    }

    renderAuthError() {
        return (
            <Row>
                <Col>
                    <h5 className="text-center mb-5 mt-5">
                        You must be logged in to view this page.
                    </h5>
                </Col>
            </Row>
        );
    }

    renderPageContent() {
        return (
            <Row>
                <Col md={{ size: 6, offset: 3 }}>
                    <div className="bg-white border border-light shadow-sm rounded">
                        <h4 className="m-0 p-3">
                            {this.props.user.first_name}{' '}
                            {this.props.user.last_name}
                        </h4>
                        <div className="pl-3 pr-3 pb-3">
                            <div>{this.props.user.email}</div>
                        </div>
                    </div>
                    <div className="mt-2 text-center">
                        {this.state.loggingOut && <span>Logging out...</span>}
                        {!this.state.loggingOut && (
                            <a
                                className="cursor-pointer"
                                onClick={() => this.handleLogout()}
                            >
                                Logout
                            </a>
                        )}
                    </div>
                </Col>
            </Row>
        );
    }

    render() {
        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride | My Account</title>
                </Head>
                <Container className="mt-5 mb-5">
                    {!this.props.user && this.renderAuthError()}
                    {!!this.props.user && this.renderPageContent()}
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
        logoutUser: () => {
            return dispatch(logoutUser());
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
)(MyAccount);
