import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Navbar, NavbarBrand } from 'reactstrap';

import UserLocationModal from './UserLocationModal';
import CompareWidget from './CompareWidget';
import { getUserLocation } from 'apps/user/selectors';
import { requestLocation } from 'apps/user/actions';
import { getCurrentPageIsInCheckout } from 'apps/page/selectors';
import { toggleCompare } from 'apps/common/actions';
import ChatWidget from '../ChatWidget';
import Location from 'icons/zondicons/Location';
import Phone from '../../../icons/zondicons/Phone';

class Header extends React.PureComponent {
    static propTypes = {
        userLocation: PropTypes.object,
        currentPageIsInCheckout: PropTypes.bool,
        compareList: PropTypes.array,
        onSearchForLocation: PropTypes.func.isRequired,
        onToggleCompare: PropTypes.func.isRequired,
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
        this.props.onSearchForLocation(search);
        this.toggleUserLocationModal();
    }

    /**
     *
     * @returns {*}
     */
    renderLocationWidget() {
        if (this.props.currentPageIsInCheckout) {
            return false;
        }
        return (
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
        );
    }

    renderPhoneWidget() {
        return (
            <div className="header-widget phone-number hidden d-sm-flex">
                <div className="header-widget-content hidden d-sm-block">
                    <div className="label">Give Us A Call</div>
                    <div className="value">
                        <a href="tel:855-675-7301">(855) 675-7301</a>
                    </div>
                </div>
                <div className="icon">
                    <Phone />
                </div>
            </div>
        );
    }

    /**
     *
     * @returns {*}
     */
    render() {
        return (
            <Navbar expand="md">
                <NavbarBrand href="/">
                    <img src="/images/dmr-logo.svg" />
                </NavbarBrand>
                <div className="mr-auto" />
                <div className="navbar-text">
                    <ChatWidget style="header" />
                    {this.renderPhoneWidget()}
                    <CompareWidget
                        currentPageIsInCheckout={
                            this.props.currentPageIsInCheckout
                        }
                        onToggleCompare={this.props.onToggleCompare}
                        compareList={this.props.compareList}
                    />
                    {this.renderLocationWidget()}
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
        currentPageIsInCheckout: getCurrentPageIsInCheckout(state),
        compareList: state.common.compareList,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSearchForLocation: search => {
            return dispatch(requestLocation(search));
        },
        onToggleCompare: deal => {
            return dispatch(toggleCompare(deal));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
