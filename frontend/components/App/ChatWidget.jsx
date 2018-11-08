import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { faComments } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
                <a
                    href="#hs-chat-open"
                    className={classNames(
                        'modal-widget',
                        'chat-button',
                        'text-center'
                    )}
                >
                    <FontAwesomeIcon icon={faComments} />
                    <span className="btn btn-primary d-md-inline">
                        Chat With Us
                    </span>
                </a>
            );
        }

        return (
            <span className={classNames('chat-button')}>
                <a href="#hs-chat-open">
                    <FontAwesomeIcon icon={faComments} />
                    <span>Chat With Us</span>
                </a>
            </span>
        );
    }
}

export default ChatWidget;
