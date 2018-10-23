import React from 'react';
import PropTypes from 'prop-types';

import ChatBubbleDots from '../../icons/zondicons/chat-bubble-dots.svg';
import classNames from 'classnames';

class ChatWidget extends React.PureComponent {
    static propTypes = {
        presentation: PropTypes.string.isRequired,
    };

    static defaultProps = {
        presentation: 'modal',
    };

    render() {
        if (this.props.presentation === 'modal') {
            return (
                <div className={classNames('modal-widget', 'chat-button')}>
                    <a href="#hs-chat-open" className="btn btn-primary">
                        <span className="d-md-inline">Chat With Us</span>
                    </a>
                </div>
            );
        }

        return (
            <span className={classNames('chat-button')}>
                <a href="#hs-chat-open">
                    <ChatBubbleDots />
                    <span>Chat With Us</span>
                </a>
            </span>
        );
    }
}

export default ChatWidget;
