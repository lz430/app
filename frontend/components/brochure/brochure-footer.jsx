import React from 'react';
import { NavLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Link from 'next/link';

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
                            <img
                                alt="Deliver My Ride"
                                src="/static/images/dmr-logo-footer.svg"
                            />
                            <ul className="footer-nav">
                                <li>
                                    <a href="/how-it-works">How It Works</a>
                                </li>
                                <li>
                                    <a href="/about">About</a>
                                </li>
                                <li>
                                    <a href="/faq">FAQ</a>
                                </li>
                                <li>
                                    <a href="/accupricing">AccuPricing</a>
                                </li>
                                <li>
                                    <a href="/blog">Blog</a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-3 contact">
                            <h3>Contact</h3>
                            <a href="mailto:email@delivermyride.com">
                                email@delivermyride.com
                            </a>
                            <a href="tel:855-675-7301">855-675-7301</a>
                            <a href="#">Live Chat</a>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-9">
                            <ul>
                                <li>
                                    <a href="#">Terms of Use</a>
                                </li>
                                <li>
                                    <a href="#">Privacy Policy</a>
                                </li>
                                <li>
                                    &copy; 2018 Deliver My Ride. All Rights
                                    Reserved.
                                </li>
                            </ul>
                        </div>
                        <div className="col-3 social">
                            <FontAwesomeIcon icon={['fab', 'facebook']} />
                            <FontAwesomeIcon icon={['fab', 'twitter']} />
                            <FontAwesomeIcon icon={['fab', 'instagram']} />
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}
