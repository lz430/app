import '../../styles/app.scss';
import React from 'react';
import Head from 'next/head';

import { Container, Row, Col } from 'reactstrap';

import ForgotChangeForm from '../../modules/forgot-change/components/ForgotChangeForm';
import PropTypes from 'prop-types';
import LoginForm from '../../modules/login/components/LoginForm';
import Link from 'next/link';

export default class Page extends React.Component {
    static propTypes = {
        query: PropTypes.object,
    };

    static async getInitialProps({ query }) {
        return {
            query: query,
        };
    }

    renderMissingParamsError() {
        return (
            <Row>
                <Col>
                    <h5 className="text-center mb-5 mt-5">
                        This page is invalid, you must visit this page by
                        clicking the link in your email.
                    </h5>
                </Col>
            </Row>
        );
    }

    renderPageContent() {
        return (
            <Row>
                <Col md={{ size: 4, offset: 4 }} className="mt-5 mb-5">
                    <div className="bg-white border border-light shadow-sm">
                        <h4 className="m-0 p-2 bg-light">Reset Password</h4>
                        <ForgotChangeForm
                            email={this.props.query.email}
                            token={this.props.query.token}
                        />
                    </div>
                </Col>
            </Row>
        );
    }

    render() {
        const renderError = !this.props.query.email || !this.props.query.token;
        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride | Change Password</title>
                </Head>

                <Container>
                    {renderError && this.renderMissingParamsError()}
                    {!renderError && this.renderPageContent()}
                </Container>
            </React.Fragment>
        );
    }
}
