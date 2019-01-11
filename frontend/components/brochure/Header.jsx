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
                <Link href="/home" as="/" passHref>
                    <NavbarBrand>
                        <Logo />
                    </NavbarBrand>
                </Link>
                <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />

                <Collapse isOpen={!this.state.collapsed} navbar>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <ActiveLink href="/about" as="/about" passHref>
                                <NavLink>About</NavLink>
                            </ActiveLink>
                        </NavItem>
                        <NavItem>
                            <ActiveLink href="/contact" as="/contact" passHref>
                                <NavLink>Contact</NavLink>
                            </ActiveLink>
                        </NavItem>
                        <NavItem>
                            <ActiveLink href="/faq" as="/faq" passHref>
                                <NavLink>FAQ</NavLink>
                            </ActiveLink>
                        </NavItem>
                        <NavItem>
                            <Link
                                href="/deal-list?entity=model&sort=payment&purchaseStrategy=lease"
                                as="/filter?entity=model&sort=payment&purchaseStrategy=lease"
                                passHref
                            >
                                <a className="btn btn-outline-primary">
                                    Get Started
                                </a>
                            </Link>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}
