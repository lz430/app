import React from 'react';
import {
    Collapse,
    Container,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';

import Link from 'next/link';
import Logo from '../../static/images/logo.svg';
import ActiveLink from '../../components/ActiveLink';

export default class Header extends React.Component {
    state = {
        collapsed: true,
    };

    toggleNavbar = () => {
        this.setState({ collapsed: !this.state.collapsed });
    };

    render() {
        return (
            <Navbar
                color="white"
                fixed="top"
                expand="md"
                className="navbar--brochure"
                light
            >
                <Container>
                    <Link href="/home" as="/brochure" passHref>
                        <NavbarBrand>
                            <Logo />
                        </NavbarBrand>
                    </Link>
                    <NavbarToggler
                        onClick={this.toggleNavbar}
                        className="mr-2"
                    />

                    <Collapse isOpen={!this.state.collapsed} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <ActiveLink
                                    href="/how-it-works"
                                    as="/how-it-works"
                                    passHref
                                >
                                    <NavLink>How It Works</NavLink>
                                </ActiveLink>
                            </NavItem>
                            <NavItem>
                                <ActiveLink href="/about" as="/about" passHref>
                                    <NavLink>About</NavLink>
                                </ActiveLink>
                            </NavItem>
                            <NavItem>
                                <ActiveLink
                                    href="/contact"
                                    as="/contact"
                                    passHref
                                >
                                    <NavLink>Contact</NavLink>
                                </ActiveLink>
                            </NavItem>
                            <NavItem>
                                <Link href="/deal-list" as="/filter" passHref>
                                    <a className="btn btn-primary">
                                        Get Started
                                    </a>
                                </Link>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
        );
    }
}
