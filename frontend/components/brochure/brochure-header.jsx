import React, { Component } from 'react';
import config from '../../src/config';
import { Container, Row, Col } from 'reactstrap';

export default class Header extends React.PureComponent {
    render() {
        return (
            <Container fluid className="brochure-header container">
                <nav className="navbar navbar-expand-md">
                    <a href="/" className="navbar-brand">
                        <img
                            alt="Deliver My Ride"
                            src="/static/images/dmr-logo.svg"
                        />
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>

                    <div
                        className="collapse navbar-collapse"
                        id="navbarSupportedContent"
                    >
                        <ul className="navbar-nav container justify-content-end">
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    href={
                                        config.MARKETING_URL + '/how-it-works/'
                                    }
                                >
                                    How It Works
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    href={config.MARKETING_URL + '/about/'}
                                >
                                    About
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    href={config.MARKETING_URL + '/contact/'}
                                >
                                    Contact
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="btn btn-primary" href="#">
                                    Get Started
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </Container>
        );
    }
}
