import React from 'react';
import config from 'config';
import { Container, Row, Col } from 'reactstrap';
import MusicNotes from 'icons/zondicons/MusicNotes';
import Phone from 'icons/zondicons/Phone';
import Conversation from 'icons/zondicons/Conversation';
import ChatWidget from './ChatWidget';

export default class Footer extends React.PureComponent {
    render() {
        return (
            <Container fluid className="page-footer">
                <Row>
                    <Col xs={12} md={2} xl={1} className="footer-box">
                        <div className="footer-box__title">Deliver My Ride</div>
                        <a href={config.MARKETING_URL + '/terms-of-service'}>
                            About Us
                        </a>
                        <a href={config.MARKETING_URL + '/terms-of-service'}>
                            How It Works
                        </a>
                        <a href={config.MARKETING_URL + '/terms-of-service'}>
                            Blog
                        </a>
                    </Col>
                    <Col xs={12} md={2} xl={2} className="footer-box">
                        <div className="footer-box__title">Contact</div>

                        <a href={config.MARKETING_URL + '/terms-of-service'}>
                            <MusicNotes /> hello@delivermymyride.com
                        </a>
                        <span>
                            <Phone /> (855) - 675 - 7301
                        </span>
                        <ChatWidget style="footer" />
                    </Col>
                    <Col
                        xs={12}
                        md={8}
                        xl={9}
                        className="footer-box text-md-right"
                    >
                        <div className="footer-box__title">Address</div>
                        35 W Huron Street<br />
                        Suite 1000<br />
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
                    <Col xs={12} sm={6} className="text-right">
                        &copy; 2018 Deliver My Ride. All Rights Reserved.
                    </Col>
                </Row>
            </Container>
        );
    }
}
