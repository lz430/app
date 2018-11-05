import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { withRouter } from 'next/router';
import { Navbar, NavbarBrand } from 'reactstrap';

import UserLocationModal from './UserLocationModal';
import UserContactModal from './UserContactModal';
import CompareWidget from './CompareWidget';
import { getUserLocation } from '../../../apps/user/selectors';
import { requestLocation } from '../../../apps/user/actions';
import { getCurrentPageIsInCheckout } from '../../../apps/page/selectors';
import { toggleCompare } from '../../../apps/common/actions';

import SearchWidget from './SearchWidget';
import {
    headerClearAutocompleteResults,
    headerRequestAutocomplete,
} from '../../../apps/page/actions';
import { getSearchQuery } from '../../../modules/deal-list/selectors';
import { nextRouterType } from '../../../core/types';
import { setSelectedMake } from '../../../modules/deal-list/actions';

import { faLocation, faQuestionCircle } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Header extends React.PureComponent {
    static propTypes = {
        userLocation: PropTypes.object,
        currentPageIsInCheckout: PropTypes.bool,
        compareList: PropTypes.array,
        onSearchForLocation: PropTypes.func.isRequired,
        onToggleCompare: PropTypes.func.isRequired,
        onRequestSearch: PropTypes.func.isRequired,
        onClearSearchResults: PropTypes.func.isRequired,
        onSetSelectedMake: PropTypes.func.isRequired,
        autocompleteResults: PropTypes.object,
        searchQuery: PropTypes.object,
        router: nextRouterType,
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
                    <FontAwesomeIcon icon={faLocation} />
                </div>
            </div>
        );
    }

    renderContactUsWidget() {
        return (
            <div className="header-widget contact-us d-lg-flex">
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
                            <FontAwesomeIcon icon={faQuestionCircle} />
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
                    <img
                        alt="Deliver My Ride"
                        src="/static/images/dmr-logo.svg"
                    />
                </NavbarBrand>
                <div className="mr-auto" />

                <div className="navbar-text">
                    <SearchWidget
                        onClearSearchResults={this.props.onClearSearchResults}
                        onRequestSearch={this.props.onRequestSearch}
                        onSetSelectedMake={this.props.onSetSelectedMake}
                        autocompleteResults={this.props.autocompleteResults}
                        router={this.props.router}
                        searchQuery={this.props.searchQuery}
                    />
                    {this.renderContactUsWidget()}
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
        onSetSelectedMake: make => {
            return dispatch(setSelectedMake(make));
        },
        onSearchForLocation: search => {
            return dispatch(requestLocation(search));
        },
        onToggleCompare: deal => {
            return dispatch(toggleCompare(deal));
        },
        onRequestSearch: query => {
            return dispatch(headerRequestAutocomplete(query));
        },
        onClearSearchResults: () => {
            return dispatch(headerClearAutocompleteResults());
        },
    };
};

export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Header);
