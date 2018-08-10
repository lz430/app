import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Navbar, NavbarBrand } from 'reactstrap';

import UserLocationModal from './UserLocationModal';
import CompareWidget from './CompareWidget';
import { getUserLocation } from 'apps/user/selectors';
import { requestLocation } from 'apps/user/actions';
import Location from 'icons/zondicons/Location';
import ChatBubbleDots from 'icons/zondicons/ChatBubbleDots';
import config from 'config';
import LiveChat from 'react-livechat';
import { getCurrentPageIsInCheckout } from 'apps/page/selectors';
import { toggleCompare } from 'apps/common/actions';

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
        chatShow: false,
        chatAgents: false,
        compareDropdown: false,
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

    onOpenChat() {
        if (this.livechat) {
            this.livechat.open_chat_window();
        }
    }

    onChatLoaded(ref) {
        this.livechat = ref;
        let _this = this;
        if (typeof ref === 'object') {
            ref.on_after_load = function() {
                _this.setState({
                    chatShow: true,
                    chatAgents: ref.agents_are_available(),
                });
            };
        }
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

    /**
     *
     * @returns {*}
     */
    renderChatWidget() {
        if (!this.state.chatShow) {
            return;
        }

        let label = 'Chat Live Now!';
        if (!this.state.chatAgents) {
            label = 'Get Help';
        }

        return (
            <div className="header-widget chat-button">
                <a
                    className="btn btn-primary"
                    onClick={() => this.onOpenChat()}
                >
                    <span className="hidden d-md-inline">{label}</span>
                    <ChatBubbleDots />
                </a>
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
                    {this.renderChatWidget()}
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

                {config.LIVECHAT_LICENSE && (
                    <LiveChat
                        onChatLoaded={ref => this.onChatLoaded(ref)}
                        license={parseInt(config.LIVECHAT_LICENSE)}
                    />
                )}
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
