import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Navbar, NavbarBrand } from 'reactstrap';

import UserLocationModal from './UserLocationModal';
import { getUserLocation } from 'apps/user/selectors';
import { requestLocation } from 'apps/user/actions';
import Location from 'icons/zondicons/Location';

class Header extends React.PureComponent {
    static propTypes = {
        userLocation: PropTypes.object,
        onSearchForLocation: PropTypes.func.isRequired,
    };

    state = {
        userLocationModalOpen: false,
    };

    toggleUserLocationModal() {
        this.setState({
            userLocationModalOpen: !this.state.userLocationModalOpen,
        });
    }

    handleSetNewLocation(search) {
        const sup = this.props.onSearchForLocation(search);
    }

    render() {
        return (
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/">
                    <img src="/images/dmr-logo.svg" />
                </NavbarBrand>
                <div className="mr-auto" />
                <div className="navbar-text">
                    <div
                        className="header-widget"
                        onClick={() => this.toggleUserLocationModal()}
                    >
                        <div className="header-widget-content hidden d-sm-block">
                            <div className="label">Your Location:</div>
                            <div className="value">
                                {this.props.userLocation.city
                                    ? this.props.userLocation.city +
                                      ', ' +
                                      this.props.userLocation.state
                                    : 'N/A'}
                            </div>
                        </div>
                        <div className="icon">
                            <Location />
                        </div>
                    </div>
                </div>
                <UserLocationModal
                    isOpen={this.state.userLocationModalOpen}
                    toggle={this.toggleUserLocationModal.bind(this)}
                    userLocation={this.props.userLocation}
                    setNewLocation={this.handleSetNewLocation.bind(this)}
                />
            </Navbar>
        );
    }
}

const mapStateToProps = state => {
    return {
        userLocation: getUserLocation(state),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSearchForLocation: search => {
            return dispatch(requestLocation(search));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
