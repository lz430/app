import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import classNames from 'classnames';

import { LargeAndUp } from '../Responsive';

import Header from './Header/Header';
import Footer from './Footer';

import BrochureHeader from '../brochure/Header.jsx';
import BrochureFooter from '../brochure/Footer.jsx';
import LiveChat from 'react-livechat';
import config from '../../core/config';

import { ChatContext } from '../../core/contexts';

class App extends React.Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        desktopOnlyFooter: PropTypes.bool.isRequired,
        isBrochureSite: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        desktopOnlyFooter: false,
        isBrochureSite: false,
    };

    state = {
        initChat: false,
        chatShow: false,
        chatAgents: false,
    };

    /**
     * This is not called on the SSRs, and there is a reference to window
     * in the react-livechat library, breaking SSR real hard.
     */
    componentDidMount() {
        this.setState({ initChat: true });
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
     * @returns {*}
     */
    renderHeader() {
        if (this.props.isBrochureSite) {
            return <BrochureHeader />;
        }

        return <Header />;
    }

    /**
     * @returns {*}
     */
    renderFooter() {
        if (this.props.isBrochureSite) {
            return <BrochureFooter />;
        }
        if (this.props.desktopOnlyFooter) {
            return (
                <LargeAndUp>
                    <Footer />
                </LargeAndUp>
            );
        }

        return <Footer />;
    }

    render() {
        return (
            <div className="app">
                <ChatContext.Provider
                    value={{
                        chatAgents: this.state.chatAgents,
                        chatShow: this.state.chatShow,
                        onOpenChat: this.onOpenChat.bind(this),
                    }}
                >
                    {this.renderHeader()}
                    <div
                        className={classNames(
                            'app-content-wrapper',
                            {
                                'app-content-wrapper--brochure': this.props
                                    .isBrochureSite,
                            },
                            {
                                'app-content-wrapper--app': !this.props
                                    .isBrochureSite,
                            }
                        )}
                    >
                        <div className="app-content">{this.props.children}</div>
                        {this.renderFooter()}
                    </div>
                </ChatContext.Provider>

                {config.LIVECHAT_LICENSE &&
                    config.REACT_APP_ENVIRONMENT !== 'local' &&
                    this.state.initChat && (
                        <LiveChat
                            onChatLoaded={ref => this.onChatLoaded(ref)}
                            license={parseInt(config.LIVECHAT_LICENSE)}
                        />
                    )}
            </div>
        );
    }
}

export default withRouter(App);
