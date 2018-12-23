import '../../styles/app.scss';
import React from 'react';
import Head from 'next/head';

import { Container, Row, Col } from 'reactstrap';

import LoginForm from '../../modules/login/components/LoginForm';

import Link from 'next/link';
import { NextAuth } from 'next-auth/client';

import Page from '../../components/Page';

export default class Login extends Page {
    static async getInitialProps({ req, res, query }) {
        let props = await super.getInitialProps({ req });
        props.session = await NextAuth.init({ force: true, req: req });
        return props;
    }

    /*
    async componentDidMount() {
        // Get latest session data after rendering on client then redirect.
        // The ensures client state is always updated after signing in or out.
        const session = await NextAuth.init({ force: true });
        if (!session.views) {
            session.views = 1;
        } else {
            session.views++;
        }
        console.log(session);
    }
    */

    render() {
        console.log(this.props);
        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride | Login</title>
                </Head>
                <Container>
                    <Row>
                        <Col md={{ size: 4, offset: 4 }} className="mt-5 mb-5">
                            <div className="bg-white border border-light shadow-sm">
                                <h4 className="m-0 p-2 bg-light">Login</h4>
                                <LoginForm />
                            </div>
                            <div className="text-center pt-1">
                                <Link href="/auth/signup" as="/signup" passHref>
                                    <a>Create New Account</a>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}
