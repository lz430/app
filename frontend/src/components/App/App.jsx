import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header/Header';
import HeaderToolbar from './Header/HeaderToolbar';
import LiveChat from 'react-livechat';
import config from 'config';

import { ChatContext } from 'contexts';

export default class App extends React.Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
    };

    state = {
        chatShow: false,
        chatAgents: false,
    };

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
                    <div className="app-header-wrapper">
                        <Header />
                        <HeaderToolbar />
                    </div>
                    {this.props.children}
                </ChatContext.Provider>
                {config.LIVECHAT_LICENSE && (
                    <LiveChat
                        onChatLoaded={ref => this.onChatLoaded(ref)}
                        license={parseInt(config.LIVECHAT_LICENSE)}
                    />
                )}
            </div>
        );
    }
}
