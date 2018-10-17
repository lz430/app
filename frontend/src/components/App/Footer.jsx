import React from 'react';
import config from '../../config';
import { Container, Row, Col } from 'reactstrap';
import Phone from '../../icons/zondicons/Phone';
import ChatWidget from './ChatWidget';
import Keyboard from '../../icons/zondicons/Keyboard';

export default class Footer extends React.PureComponent {
    render() {
        return (
            <Container fluid className="page-footer">
                <Row>
                    <Col xs={12} md={3} lg={2} xl={2} className="footer-box">
                        <div className="footer-box__title">Deliver My Ride</div>
                        <a href={config.MARKETING_URL + '/about/'}>About Us</a>
                        <a href={config.MARKETING_URL + '/how-it-works/'}>
                            How It Works
                        </a>
                        <a href="https://blog.delivermyride.com/blog">Blog</a>
                    </Col>
                    <Col xs={12} md={3} lg={2} xl={2} className="footer-box">
                        <div className="footer-box__title">Contact</div>
                        <a href={config.MARKETING_URL + '/contact/'}>
                            <Keyboard /> Email Us
                        </a>
                        <a href="tel:855-675-7301">
                            <Phone /> (855) 675-7301
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
                        <a href={config.MARKETING_URL + '/terms-of-service'}>
                            Terms Of Service
                        </a>
                        &nbsp;|&nbsp;
                        <a href={config.MARKETING_URL + '/privacy-policy'}>
                            Privacy Policy
                        </a>
                    </Col>
                    <Col xs={12} sm={6} className="text-md-right">
                        &copy; 2018 Deliver My Ride. All Rights Reserved.
                    </Col>
                </Row>
            </Container>
        );
    }
}
