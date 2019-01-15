import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { faComments } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ChatContext } from '../../core/contexts';
import Link from 'next/link';

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
                        <Link href="/brochure/contact" as="/contact">
                            <a className="btn btn-primary">
                                <FontAwesomeIcon icon={faComments} />
                                {label}
                            </a>
                        </Link>
                    )}

                    {chatSettings.chatShow && (
                        <span
                            className="btn btn-primary"
                            onClick={() => chatSettings.onOpenChat()}
                        >
                            <FontAwesomeIcon icon={faComments} />
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
                    <FontAwesomeIcon icon={faComments} />
                    <span>{label}</span>
                </span>
            </span>
        );
    }
    /*
    renderHubSpotChat() {
        if (this.props.presentation === 'modal') {
            return (
                <a
                    href="#hs-chat-open"
                    className={classNames(
                        'modal-widget',
                        'chat-button',
                        'text-center'
                    )}
                >
                    <FontAwesomeIcon icon={faComments}/>
                    <span className="btn btn-primary d-md-inline">
                        Chat With Us
                    </span>
                </a>
            );
        }

        return (
            <span className={classNames('chat-button')}>
                <a href="#hs-chat-open">
                    <FontAwesomeIcon icon={faComments}/>
                    <span>Chat With Us</span>
                </a>
            </span>
        );
    }
    */

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
