import React from 'react';
import PropTypes from 'prop-types';

import ChatBubbleDots from '../../icons/zondicons/ChatBubbleDots';
import classNames from 'classnames';

import { ChatContext } from '../../contexts';
import config from '../../config';

class ChatWidget extends React.PureComponent {
    static propTypes = {
        presentation: PropTypes.string.isRequired,
    };

    static defaultProps = {
        presentation: 'modal',
    };

    renderChat(chatSettings) {
        let label = 'Contact Us';
        if (chatSettings.chatShow && chatSettings.chatAgents) {
            label = 'Chat With Us';
        } else if (chatSettings.chatShow) {
            label = 'Get Help';
        }

        if (this.props.presentation === 'modal') {
            return (
                <div className={classNames('modal-widget', 'chat-button')}>
                    {!chatSettings.chatShow && (
                        <a
                            className="btn btn-primary"
                            href={config.MARKETING_URL + '/contact/'}
                        >
                            {label}
                        </a>
                    )}

                    {chatSettings.chatShow && (
                        <span
                            className="btn btn-primary"
                            onClick={() => chatSettings.onOpenChat()}
                        >
                            <span className="d-md-inline">{label}</span>
                        </span>
                    )}
                </div>
            );
        }

        if (!chatSettings.chatShow) {
            return false;
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
