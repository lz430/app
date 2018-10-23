import React from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';

import Link from 'next/link';

export default class Header extends React.PureComponent {
    state = {
        collapsed: false,
    };

    constructor(props) {
        super(props);

        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.state = {
            collapsed: true,
        };
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    render() {
        return (
            <header className="brochure-header">
                <Navbar expand="md">
                    <NavbarBrand href="/">
                        <img
                            alt="Deliver My Ride"
                            src="/static/images/dmr-logo.svg"
                        />
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggleNavbar} className="" />

                    <Collapse isOpen={!this.state.collapsed} navbar>
                        <Nav className="ml-auto" navbar>
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
                                    href="/contact"
                                    as="/brochure/contact"
                                    passHref
                                >
                                    <NavLink>Contact</NavLink>
                                </Link>
                            </NavItem>
                            <NavItem>
                                <Link href="/deal-list" as="/filter" passHref>
                                    <NavLink className="btn btn-primary">
                                        Get Started
                                    </NavLink>
                                </Link>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </header>
        );
    }
}
