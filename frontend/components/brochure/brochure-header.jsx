import React from 'react';
import config from '../../core/config';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';

import Link from 'next/link';

export default class Header extends React.PureComponent {
    state = {
        isOpen: false,
    };

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    render() {
        return (
            <Navbar expand="md">
                <NavbarBrand href="/">
                    <img
                        alt="Deliver My Ride"
                        src="/static/images/dmr-logo.svg"
                    />
                </NavbarBrand>
                <NavbarToggler onClick={this.toggle} />

                <div className="mr-auto" />

                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <Link
                                href="/how-it-works"
                                as="/brochure/how-it-works"
                                passHref
                            >
                                <NavLink>Contact</NavLink>
                            </Link>
                        </NavItem>
                        <NavItem>
                            <Link href="/about" as="/brochure/about" passHref>
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
        );
    }
}
