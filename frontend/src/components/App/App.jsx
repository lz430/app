import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';

import Header from './Header/Header';
import LiveChat from 'react-livechat';
import config from '../../config';

import { ChatContext } from '../../contexts';

class App extends React.Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
    };

    state = {
        chatShow: false,
        chatAgents: false,
    };

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0);
        }
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
                    <Header />
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

export default withRouter(App);
