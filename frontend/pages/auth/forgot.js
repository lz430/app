import '../../styles/app.scss';
import React from 'react';
import Head from 'next/head';
import { Container, Row, Col } from 'reactstrap';

import ForgotForm from '../../modules/forgot/components/ForgotForm';
import Link from 'next/link';

export default class Page extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride | Forgot Password</title>
                </Head>
                <Container>
                    <Row>
                        <Col md={{ size: 4, offset: 4 }} className="mt-5 mb-5">
                            <div className="bg-white border border-light shadow-sm">
                                <h4 className="m-0 p-2 bg-light">
                                    Reset Password
                                </h4>
                                <ForgotForm />
                            </div>

                            <div className="text-center pt-1">
                                <Link href="/auth/login" as="/login" passHref>
                                    <a>Back to Login</a>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}
