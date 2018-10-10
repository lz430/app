import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { connect } from 'react-redux';
import { compose } from 'redux';

import { withRouter } from 'react-router-dom';
import { Navbar, NavbarBrand } from 'reactstrap';

import UserLocationModal from './UserLocationModal';
import UserContactModal from './UserContactModal';
import CompareWidget from './CompareWidget';
import { getUserLocation } from 'apps/user/selectors';
import { requestLocation } from 'apps/user/actions';
import { getCurrentPageIsInCheckout } from 'apps/page/selectors';
import { toggleCompare } from 'apps/common/actions';

import Location from 'icons/zondicons/Location';
import Help from 'icons/zondicons/Question';

import SearchWidget from './SearchWidget';
import { headerRequestAutocomplete } from 'apps/page/actions';
import { getSearchQuery } from 'pages/deal-list/selectors';

class Header extends React.PureComponent {
    static propTypes = {
        userLocation: PropTypes.object,
        currentPageIsInCheckout: PropTypes.bool,
        compareList: PropTypes.array,
        onSearchForLocation: PropTypes.func.isRequired,
        onToggleCompare: PropTypes.func.isRequired,
        onRequestSearch: PropTypes.func.isRequired,
        autocompleteResults: PropTypes.object,
        searchQuery: PropTypes.object,
        history: ReactRouterPropTypes.history.isRequired,
        location: ReactRouterPropTypes.location.isRequired,
        match: ReactRouterPropTypes.match.isRequired,
    };

    state = {
        userLocationModalOpen: false,
        userContactModalOpen: false,
    };

    toggleUserLocationModal() {
        this.setState({
            userLocationModalOpen: !this.state.userLocationModalOpen,
        });
    }

    toggleUserContactModal() {
        this.setState({
            userContactModalOpen: !this.state.userContactModalOpen,
        });
    }

    toggleSearchModal() {
        this.setState({
            SearchModalOpen: !this.state.SearchModalOpen,
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
                <div className="header-widget-content hidden d-lg-block">
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
            <div className="header-widget phone-number d-lg-flex">
                <div className="header-widget-content d-lg-block">
                    <UserContactModal
                        isOpen={this.state.userContactModalOpen}
                        toggle={this.toggleUserContactModal.bind(this)}
                    />
                    <div
                        className="label"
                        onClick={() => this.toggleUserContactModal()}
                    >
                        <span>Need Help?</span>
                        <div className="icon text-center">
                            <Help />
                        </div>
                    </div>
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
                    <img alt="Deliver My Ride" src="/images/dmr-logo.svg" />
                </NavbarBrand>
                {/* <div className="mr-auto" /> */}
                <SearchWidget
                    onRequestSearch={this.props.onRequestSearch}
                    autocompleteResults={this.props.autocompleteResults}
                    history={this.props.history}
                    searchQuery={this.props.searchQuery}
                />
                <div className="navbar-text">
                    {/*<ChatWidget presentation="header" />*/}
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
        autocompleteResults: state.page.headerAutocompleteResults,
        searchQuery: getSearchQuery(state),
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
        onRequestSearch: query => {
            return dispatch(headerRequestAutocomplete(query));
        },
    };
};

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withRouter
)(Header);
