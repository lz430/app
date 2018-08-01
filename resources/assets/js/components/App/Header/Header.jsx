import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Navbar, NavbarBrand } from 'reactstrap';

import UserLocationModal from './UserLocationModal';
import { getUserLocation } from 'apps/user/selectors';
import { requestLocation } from 'apps/user/actions';
import Location from 'icons/zondicons/Location';
import ChatBubbleDots from 'icons/zondicons/ChatBubbleDots';
import config from 'config';
import LiveChat from 'react-livechat';

class Header extends React.PureComponent {
    static propTypes = {
        userLocation: PropTypes.object,
        onSearchForLocation: PropTypes.func.isRequired,
    };

    state = {
        userLocationModalOpen: false,
        chatShow: false,
        chatAgents: false,
    };

    toggleUserLocationModal() {
        this.setState({
            userLocationModalOpen: !this.state.userLocationModalOpen,
        });
    }

    handleSetNewLocation(search) {
        const sup = this.props.onSearchForLocation(search);
    }

    onOpenChat() {
        if (this.livechat) {
            this.livechat.open_chat_window();
        }
    }

    onChatLoaded(ref) {
        this.livechat = ref;
        let _this = this;
        ref.on_after_load = function() {
            _this.setState({
                chatShow: true,
                chatAgents: ref.agents_are_available(),
            });
        };
    }

    renderLocationWidget() {
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
    render() {
        return (
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/">
                    <img src="/images/dmr-logo.svg" />
                </NavbarBrand>
                <div className="mr-auto" />
                <div className="navbar-text">
                    {this.renderChatWidget()}
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
