import React from 'react';
import { NavLink } from 'reactstrap';

import Link from 'next/link';

export default class Header extends React.PureComponent {
    state = {
        collapsed: false,
    };

    render() {
        return (
            <footer className="brochure-footer">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <img
                                alt="Deliver My Ride"
                                src="/static/images/dmr-logo.svg"
                            />
                        </div>
                        <div className="col" />
                    </div>
                </div>
            </footer>
        );
    }
}
