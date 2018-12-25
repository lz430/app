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

class MyAccount extends Page {
    static propTypes = {
        user: PropTypes.object.isRequired,
        router: nextRouterType,
    };

    render() {
        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride | My Account</title>
                </Head>
                <Container className="mt-5 mb-5">
                    <Row>
                        <Col>
                            <h3>My Account</h3>
                        </Col>
                    </Row>
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

export default compose(
    withRouter,
    withTracker,
    connect(mapStateToProps)
)(MyAccount);
