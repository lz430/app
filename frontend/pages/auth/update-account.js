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
import UpdateAccountForm from '../../apps/user/components/UpdateAccountForm';
import Link from 'next/link';

class UpdateAccount extends Page {
    static propTypes = {
        user: PropTypes.object,
        logoutUser: PropTypes.func.isRequired,
        router: nextRouterType,
    };

    state = {
        wasSuccess: false,
    };

    handleOnSuccess() {
        this.setState({ wasSuccess: true });
    }

    renderBreadcrumb() {
        return (
            <Container>
                <Breadcrumb>
                    <BreadcrumbItem>
                        <Link href="/auth/my-account" as="/my-account">
                            <a>My Account</a>
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>Update Account</BreadcrumbItem>
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
                <Row>
                    <Col md={{ size: 6, offset: 3 }}>
                        <div className="bg-white pt-3 pb-3 rounded shadow-sm">
                            <UpdateAccountForm
                                user={this.props.user}
                                handleOnSuccess={this.handleOnSuccess.bind(
                                    this
                                )}
                            />
                        </div>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }

    render() {
        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride | My Account</title>
                </Head>
                {this.renderBreadcrumb()};
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

export default compose(
    withRouter,
    withTracker,
    connect(mapStateToProps)
)(UpdateAccount);
