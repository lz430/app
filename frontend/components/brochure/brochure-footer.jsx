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
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <img
                                alt="Deliver My Ride"
                                src="/static/images/dmr-logo.svg"
                            />
                        </div>
                        <div className="col">
                            <FontAwesomeIcon icon={['fab', 'apple']} />
                            <FontAwesomeIcon icon={['fab', 'microsoft']} />
                            <FontAwesomeIcon icon={['fab', 'google']} />
                            <FontAwesomeIcon icon={['fal', 'utensils']} />
                            <FontAwesomeIcon icon={['fas', 'car']} />
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}
