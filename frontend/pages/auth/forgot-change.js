import '../../styles/app.scss';
import React from 'react';
import Head from 'next/head';

import { Container, Row, Col } from 'reactstrap';

import ForgotChangeForm from '../../modules/forgot-change/components/ForgotChangeForm';

export default class Page extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride | Change Password</title>
                </Head>

                <Container>
                    <Row>
                        <Col md={{ size: 4, offset: 4 }} className="mt-5 mb-5">
                            <div className="bg-white border border-light shadow-sm">
                                <h4 className="m-0 p-2 bg-light">
                                    Reset Password
                                </h4>
                                <ForgotChangeForm />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}
