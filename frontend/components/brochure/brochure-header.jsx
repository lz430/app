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
import LogoHeader from '../../static/images/dmr-logo.svg';

export default class Header extends React.PureComponent {
    state = {
        collapsed: true,
    };

    toggleNavbar = () => {
        this.setState({ collapsed: !this.state.collapsed });
    };

    render() {
        return (
            <header className="brochure-header">
                <Navbar expand="lg">
                    <Link href="/home" as="/brochure" passHref>
                        <NavbarBrand>
                            <LogoHeader alt="Deliver My Ride" />
                        </NavbarBrand>
                    </Link>
                    <NavbarToggler onClick={this.toggleNavbar} className="" />

                    <Collapse isOpen={!this.state.collapsed} navbar>
                        <Nav className="ml-auto" navbar>
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
                                    href="/brochure/contact"
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
