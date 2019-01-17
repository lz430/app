import React from 'react';
import PropTypes from 'prop-types';

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

        if (this.props.presentation === 'modal' && !chatSettings.chatShow) {
            return (
                <Link href="/brochure/contact" as="/contact">
                    <a>
                        <FontAwesomeIcon icon={faComments} />

                        <span className="btn btn-primary">{label}</span>
                    </a>
                </Link>
            );
        }

        if (this.props.presentation === 'modal' && chatSettings.chatShow) {
            return (
                <span onClick={() => chatSettings.onOpenChat()}>
                    <FontAwesomeIcon icon={faComments} />
                    <span className="btn btn-primary d-md-inline">{label}</span>
                </span>
            );
        }

        if (!chatSettings.chatShow) {
            return (
                <Link href="/brochure/contact" as="/contact">
                    <a className="chat-button">
                        <FontAwesomeIcon icon={faComments} /> {label}
                    </a>
                </Link>
            );
        }

        return (
            <span className="chat-button cursor-pointer">
                <span onClick={() => chatSettings.onOpenChat()}>
                    <FontAwesomeIcon icon={faComments} /> {label}
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
