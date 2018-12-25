import '../../styles/app.scss';
import React from 'react';
import Head from 'next/head';
import { Container, Row, Col } from 'reactstrap';

import SignupForm from '../../modules/signup/components/SignupForm';
import Link from 'next/link';

export default class Page extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride | Signup</title>
                </Head>
                <Container>
                    <Row>
                        <Col md={{ size: 4, offset: 4 }} className="mt-5 mb-5">
                            <div className="bg-white border border-light rounded shadow-sm">
                                <h5 className="m-0 p-3 text-center">Signup</h5>
                                <SignupForm />
                            </div>

                            <div className="text-center pt-1">
                                <Link href="/auth/login" as="/login" passHref>
                                    <a>Back to login</a>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}
