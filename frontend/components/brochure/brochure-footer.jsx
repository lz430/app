import React from 'react';
import { NavItem, NavLink } from 'reactstrap';
import Link from 'next/link';
import LogoFooter from '../../static/images/dmr-logo-footer.svg';

import {
    faFacebook,
    faTwitter,
    faInstagram,
} from '@fortawesome/free-brands-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Header extends React.PureComponent {
    state = {
        collapsed: false,
    };

    render() {
        return (
            <footer className="brochure-footer">
                <div className="container">
                    <div className="row border-bottom">
                        <div className="col-8 ">
                            <LogoFooter alt="Deliver My Ride" />
                            <ul className="footer-nav">
                                <NavItem>
                                    <Link
                                        href="/brochure/how-it-works"
                                        as="/brochure/how-it-works"
                                        passHref
                                    >
                                        <NavLink>How It Works</NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link
                                        href="/brochure/about"
                                        as="/brochure/about"
                                        passHref
                                    >
                                        <NavLink>About</NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link
                                        href="/brochure/faq"
                                        as="/brochure/faq"
                                        passHref
                                    >
                                        <NavLink>FAQ</NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <NavLink href="https://blog.delivermyride.com">
                                        Blog
                                    </NavLink>
                                </NavItem>
                            </ul>
                        </div>
                        <div className="col-3 contact">
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
                                    <Link href="#hs-chat-open" passHref>
                                        <NavLink>Live Chat</NavLink>
                                    </Link>
                                </NavItem>
                            </ul>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-9">
                            <ul>
                                <NavItem>
                                    <Link
                                        href="/brochure/terms-of-service"
                                        as="/brochure/terms-of-service"
                                        passHref
                                    >
                                        <NavLink>Terms of Use</NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link
                                        href="/brochure/privacy-policy"
                                        as="/brochure/privacy-policy"
                                        passHref
                                    >
                                        <NavLink>Privacy Policy</NavLink>
                                    </Link>
                                </NavItem>
                                <li>
                                    &copy; 2018 Deliver My Ride. All Rights
                                    Reserved.
                                </li>
                            </ul>
                        </div>
                        <div className="col-3 social">
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
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}
