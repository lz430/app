import React from 'react';
import { NavItem, NavLink } from 'reactstrap';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LogoFooter from '../../static/images/dmr-logo-footer.svg';

export default class Header extends React.PureComponent {
    state = {
        collapsed: false,
    };

    render() {
        return (
            <footer className="brochure-footer">
                <div className="container-fluid">
                    <div className="row border-bottom">
                        <div className="col-8 ">
                            <LogoFooter alt="Deliver My Ride" />
                            <ul className="footer-nav">
                                <NavItem>
                                    <Link
                                        href="/how-it-works"
                                        as="/brochure/how-it-works"
                                        passHref
                                    >
                                        <NavLink>How It Works</NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link
                                        href="/about"
                                        as="/brochure/about"
                                        passHref
                                    >
                                        <NavLink>About</NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link
                                        href="/faq"
                                        as="/brochure/faq"
                                        passHref
                                    >
                                        <NavLink>FAQ</NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link
                                        href="/accupricing"
                                        as="/brochure/accupricing"
                                        passHref
                                    >
                                        <NavLink>AccuPricing</NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link
                                        href="/blog"
                                        as="/brochure/blog"
                                        passHref
                                    >
                                        <NavLink>Blog</NavLink>
                                    </Link>
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
                                        href="/terms"
                                        as="/brochure/terms"
                                        passHref
                                    >
                                        <NavLink>Terms of Use</NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link
                                        href="/privacy"
                                        as="/brochure/privacy"
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
                                    <Link
                                        href="https://www.facebook.com/DeliverMyRide/"
                                        passHref
                                        target="blank"
                                    >
                                        <NavLink>
                                            <FontAwesomeIcon
                                                icon={['fab', 'facebook']}
                                            />
                                        </NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link
                                        href="https://twitter.com/Delivermyride1"
                                        passHref
                                        target="blank"
                                    >
                                        <NavLink>
                                            <FontAwesomeIcon
                                                icon={['fab', 'twitter']}
                                            />
                                        </NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link
                                        href="https://www.instagram.com/delivermyride/"
                                        passHref
                                        target="_blank"
                                    >
                                        <NavLink>
                                            <FontAwesomeIcon
                                                icon={['fab', 'instagram']}
                                            />
                                        </NavLink>
                                    </Link>
                                </NavItem>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}
