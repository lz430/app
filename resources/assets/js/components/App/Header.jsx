import React from 'react';
import config from 'config';

import Menu from 'icons/zondicons/Menu';
import Close from 'icons/zondicons/Close';

export default class Header extends React.PureComponent {
    state = {
        mobile: false,
        mobileOpen: false,
    };

    toggleMobileOpen() {
        this.setState({ mobileOpen: !this.state.mobileOpen });
    }

    mobileNavStyle() {
        if (this.state.mobileOpen) {
            return { height: 'auto' };
        }
        return { height: '0px' };
    }

    render() {
        return (
            <nav className="nav">
                <div className="nav__constrained">
                    <a className="nav__logo" href="/">
                        <img src="/images/dmr-logo.svg" />
                    </a>

                    <div className="nav__links">
                        <a href={config.MARKETING_URL + '/about'}>About</a>
                        <a href={config.MARKETING_URL + '/contact'}>Contact</a>
                        <a href={config.MARKETING_URL + '/blog'}>Blog</a>
                        <a href={config.MARKETING_URL + '/#findNewCar'}>
                            Find New Vehicle
                        </a>
                    </div>

                    <button className="nav__icon">
                        <div
                            className="nav__icon-menu"
                            onClick={() => this.toggleMobileOpen()}
                        >
                            <Menu />
                        </div>
                        <div
                            className="nav__icon-close hidden"
                            onClick={() => this.toggleMobileOpen()}
                        >
                            <Close />
                        </div>
                    </button>
                </div>

                <div
                    style={this.mobileNavStyle()}
                    className="nav__links-mobile"
                >
                    <a href={config.MARKETING_URL + '/about'}>About</a>
                    <a href={config.MARKETING_URL + '/contact'}>Contact</a>
                    <a href={config.MARKETING_URL + '/blog'}>Blog</a>
                    <a href={config.MARKETING_URL + '/#findNewCar'}>
                        Find New Vehicle
                    </a>
                </div>
            </nav>
        );
    }
}
