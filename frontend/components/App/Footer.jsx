import React from 'react';
import config from '../../core/config';
import { Container, Row, Col } from 'reactstrap';
import ChatWidget from './ChatWidget';

import { faPhone, faEnvelope } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

export default class Footer extends React.PureComponent {
    render() {
        return (
            <Container fluid className="page-footer">
                <Row>
                    <Col xs={6} md={3} lg={2} xl={2} className="footer-box">
                        <div className="footer-box__title">Deliver My Ride</div>

                        <Link href="/about" as="/about" passHref>
                            <a>About</a>
                        </Link>
                        <Link href="/how-it-works" as="/how-it-works" passHref>
                            <a>How It Works</a>
                        </Link>

                        <a href="https://blog.delivermyride.com/blog">Blog</a>
                    </Col>
                    <Col xs={6} md={3} lg={2} xl={2} className="footer-box">
                        <div className="footer-box__title">Contact</div>
                        <a href={config.MARKETING_URL + '/contact/'}>
                            <FontAwesomeIcon icon={faEnvelope} /> Email Us
                        </a>
                        <a href="tel:855-675-7301">
                            <FontAwesomeIcon icon={faPhone} /> (855) 675-7301
                        </a>
                        <ChatWidget presentation="footer" />
                    </Col>
                    <Col
                        xs={12}
                        md={6}
                        lg={8}
                        xl={8}
                        className="footer-box text-md-right"
                    >
                        <div className="footer-box__title">Address</div>
                        35 W Huron Street
                        <br />
                        Suite 1000
                        <br />
                        Pontiac, MI 48342
                    </Col>
                </Row>
                <Row className="footer-bottom">
                    <Col xs={12} sm={6}>
                        <Link
                            href="/terms-of-service"
                            as="/terms-of-service"
                            passHref
                        >
                            <a>Terms of Use</a>
                        </Link>
                        &nbsp;|&nbsp;
                        <Link
                            href="/privacy-policy"
                            as="/privacy-policy"
                            passHref
                        >
                            <a>Privacy Policy</a>
                        </Link>
                    </Col>
                    <Col xs={12} sm={6} className="text-md-right">
                        &copy; 2018 Deliver My Ride. All Rights Reserved.
                    </Col>
                </Row>
            </Container>
        );
    }
}
