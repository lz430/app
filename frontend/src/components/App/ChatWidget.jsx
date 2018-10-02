import React from 'react';
import PropTypes from 'prop-types';

import ChatBubbleDots from 'icons/zondicons/ChatBubbleDots';
import classNames from 'classnames';

import { ChatContext } from 'contexts';

class ChatWidget extends React.PureComponent {
    static propTypes = {
        presentation: PropTypes.string.isRequired,
    };

    static defaultProps = {
        presentation: 'header',
    };

    renderChat(chatSettings) {
        if (!chatSettings.chatShow) {
            return false;
        }

        let label = 'Chat Live Now!';
        if (!chatSettings.chatAgents) {
            label = 'Get Help';
        }

        if (this.props.presentation === 'header') {
            return (
                <div
                    className={classNames('header-widget', 'chat-button', {
                        hidden: !chatSettings.chatShow,
                    })}
                >
                    <span
                        className="btn btn-primary"
                        onClick={() => chatSettings.onOpenChat()}
                    >
                        <span className="hidden d-md-inline">{label}</span>
                        <ChatBubbleDots />
                    </span>
                </div>
            );
        }

        return (
            <span
                className={classNames('chat-button', {
                    hidden: !chatSettings.chatShow,
                })}
            >
                <span onClick={() => chatSettings.onOpenChat()}>
                    <ChatBubbleDots />
                    <span>{label}</span>
                </span>
            </span>
        );
    }

    render() {
        return (
            <ChatContext.Consumer>
                {chatSettings => {
                    return this.renderChat(chatSettings);
                }}
            </ChatContext.Consumer>
        );
    }
}

export default ChatWidget;
