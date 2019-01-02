import '../../styles/app.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { compose } from 'redux';
import { connect } from 'react-redux';

import Head from 'next/head';

import { Container, Row, Col, Breadcrumb, BreadcrumbItem } from 'reactstrap';

import Page from '../../components/Page';
import { withRouter } from 'next/router';
import withTracker from '../../components/withTracker';
import { nextRouterType } from '../../core/types';
import { getUser } from '../../apps/session/selectors';
import { logoutUser } from '../../apps/user/actions';
import AccountSummary from '../../apps/user/components/AccountSummary';
import AccountOrdersList from '../../apps/user/components/AccountOrdersList';
import AccountLogout from '../../apps/user/components/AccountLogout';

class MyAccount extends Page {
    static propTypes = {
        user: PropTypes.object,
        logoutUser: PropTypes.func.isRequired,
        router: nextRouterType,
    };

    renderBreadcrumb() {
        return (
            <Container>
                <Breadcrumb>
                    <BreadcrumbItem active>My Account</BreadcrumbItem>
                </Breadcrumb>
            </Container>
        );
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
            <React.Fragment>
                <AccountSummary user={this.props.user} />
                <AccountOrdersList user={this.props.user} />
                <AccountLogout
                    user={this.props.user}
                    logoutUser={this.props.logoutUser}
                />
            </React.Fragment>
        );
    }

    render() {
        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride | My Account</title>
                </Head>
                {this.renderBreadcrumb()}
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
