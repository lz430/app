import React from 'react';
import { Container, Col, Row, NavItem, NavLink } from 'reactstrap';
import Link from 'next/link';

import {
    faFacebook,
    faTwitter,
    faInstagram,
} from '@fortawesome/free-brands-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import TopWorkplace from '../../static/brochure/top-workplace/twp2018.svg';
import ChatWidget from '../App/ChatWidget';

export default class Footer extends React.PureComponent {
    render() {
        return (
            <footer className="brochure-footer">
                <Container>
                    <Row>
                        <Col sm={6}>
                            <ul className="footer-nav">
                                <NavItem>
                                    <Link
                                        href="/how-it-works"
                                        as="/how-it-works"
                                        passHref
                                    >
                                        <NavLink>How It Works</NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link href="/about" as="/about" passHref>
                                        <NavLink>About</NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link href="/faq" as="/faq" passHref>
                                        <NavLink>FAQ</NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <NavLink href="https://blog.delivermyride.com">
                                        Blog
                                    </NavLink>
                                </NavItem>
                            </ul>
                        </Col>
                        <Col sm={4} className="contact">
                            <h3>Contact</h3>
                            <ul>
                                <NavItem>
                                    <Link
                                        href="mailto:support@delivermyride.com"
                                        passHref
                                    >
                                        <NavLink>
                                            support@delivermyride.com
                                        </NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link href="tel:855-675-7301" passHref>
                                        <NavLink>855-675-7301</NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <ChatWidget presentation="footer" />
                                </NavItem>
                            </ul>
                        </Col>
                        <Col sm={2} className="top-workplaces">
                            <TopWorkplace />
                        </Col>
                    </Row>
                    <Col className="border-bottom mb-3" />
                    <Row className="row-bottom">
                        <Col lg={6} md={9} sm={12}>
                            <ul>
                                <NavItem>
                                    <Link
                                        href="/terms-of-service"
                                        as="/terms-of-service"
                                        passHref
                                    >
                                        <NavLink>Terms of Use</NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link
                                        href="/privacy-policy"
                                        as="/privacy-policy"
                                        passHref
                                    >
                                        <NavLink>Privacy Policy</NavLink>
                                    </Link>
                                </NavItem>
                                <li>
                                    &copy; 2019 Deliver My Ride. All Rights
                                    Reserved.
                                </li>
                            </ul>
                        </Col>
                        <Col lg={2} md={3} sm={12} className="social">
                            <ul>
                                <NavItem>
                                    <a
                                        href="https://www.facebook.com/DeliverMyRide/"
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        <FontAwesomeIcon icon={faFacebook} />
                                    </a>
                                </NavItem>
                                <NavItem>
                                    <a
                                        href="https://twitter.com/Delivermyride1"
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        <FontAwesomeIcon icon={faTwitter} />
                                    </a>
                                </NavItem>
                                <NavItem>
                                    <a
                                        href="https://www.instagram.com/delivermyride/"
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        <FontAwesomeIcon icon={faInstagram} />
                                    </a>
                                </NavItem>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </footer>
        );
    }
}
