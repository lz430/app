import '../../styles/app.scss';
import React from 'react';
import Head from 'next/head';

import { Container, Row, Col } from 'reactstrap';

import LoginForm from '../../modules/login/components/LoginForm';

import Link from 'next/link';

import Page from '../../components/Page';

export default class Login extends Page {
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
                                <h4 className="m-0 p-3">Login</h4>
                                <LoginForm />
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
