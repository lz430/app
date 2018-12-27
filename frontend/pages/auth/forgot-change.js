import '../../styles/app.scss';
import React from 'react';
import Head from 'next/head';

import { Container, Row, Col } from 'reactstrap';

import ForgotChangeForm from '../../modules/forgot-change/components/ForgotChangeForm';
import PropTypes from 'prop-types';
import Link from 'next/link';

export default class Page extends React.Component {
    static propTypes = {
        query: PropTypes.object,
        user: PropTypes.object,
    };

    static async getInitialProps({ query }) {
        return {
            query: query,
        };
    }

    state = {
        wasSuccess: false,
    };

    handleOnSuccess() {
        this.setState({ wasSuccess: true });
    }

    renderSuccessMessage() {
        return (
            <Row>
                <Col>
                    <div>
                        Your password has been changed. <br />
                        <Link href="/auth/login" as="/login" passHref>
                            <a>Click here to login</a>
                        </Link>
                    </div>
                </Col>
            </Row>
        );
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
                        <h4 className="m-0 p-3">Reset Password</h4>
                        <ForgotChangeForm
                            email={this.props.query.email}
                            token={this.props.query.token}
                            handleOnSuccess={this.handleOnSuccess.bind(this)}
                        />
                    </div>
                </Col>
            </Row>
        );
    }

    render() {
        let content;
        if (!this.props.query.email || !this.props.query.token) {
            content = this.renderMissingParamsError();
        } else if (this.props.user) {
            content = this.renderAuthError();
        } else if (this.state.wasSuccess) {
            content = this.renderSuccessMessage();
        } else {
            content = this.renderPageContent();
        }

        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride | Change Password</title>
                </Head>

                <Container>{content}</Container>
            </React.Fragment>
        );
    }
}
